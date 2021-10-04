import type { Falsy, StyleArguments } from "@dash-ui/styles";
import cloneDeep from "clone-deep";
import cssToRN from "css-to-react-native";
import * as React from "react";
import * as RN from "react-native";
import type { O } from "ts-toolbelt";
import type { JsonValue, ValueOf } from "type-fest";

const emptyObj = {};

export function createStyles<
  V extends Record<string, unknown> = DashTokens,
  T extends Record<string, Record<string, unknown>> = DashThemes,
  VT extends {
    [K in keyof T]: O.Merge<V, T[K], "deep">;
  } & {
    default: V;
  } = {
    [K in keyof T]: O.Merge<V, T[K], "deep">;
  } & {
    default: V;
  }
>(options: CreateStylesOptions<V, T> = emptyObj) {
  const themes = options.themes ?? (emptyObj as T);
  let currentTheme: keyof T | "default" = "default";
  const tokens = {
    default: options.tokens ?? emptyObj,
  } as VT;

  if (options.themes) {
    const themeNames = Object.keys(options.themes) as (keyof T)[];
    currentTheme = themeNames[0];

    for (const themeName of themeNames) {
      tokens[themeName] = mergeTokens(
        cloneDeep(tokens.default),
        themes[themeName]
      ) as VT[typeof themeName];
    }

    const colorScheme = RN.Appearance.getColorScheme();

    if (
      themeNames.length === 2 &&
      "light" in tokens &&
      "dark" in tokens &&
      colorScheme &&
      colorScheme in themes
    ) {
      currentTheme = colorScheme as keyof T;
    }
  }

  const isAutoThemeable =
    Object.values(tokens).length === 3 && "light" in tokens && "dark" in tokens;

  function cls<S extends RNStyles>(
    literals:
      | TemplateStringsArray
      | string
      | StyleObject<S>
      | StyleCallback<S, ValueOf<Omit<VT, "default">>>,
    ...placeholders: string[]
  ) {
    const styles = compileStyles(
      compileLiterals(literals, ...placeholders),
      tokens[currentTheme]
    );

    if (process.env.NODE_ENV !== "production") {
      return Object.freeze(styles);
    }

    return styles;
  }

  const styles = Object.assign(
    function styles<T extends StyleMap<RNStyles, V>>(styleMap: T) {
      // style('text', {})
      function style(...args: StyleArguments<Extract<keyof T, string>>) {
        const numArgs = args.length;
        const sheet = styleMap.default
          ? compileStyles(styleMap.default, tokens[currentTheme] as V)
          : {};

        if (numArgs === 1 && typeof args[0] === "string") {
          Object.assign(
            sheet,
            compileStyles(styleMap[args[0]], tokens[currentTheme] as V)
          );
        } else if (numArgs > 0) {
          let i = 0;
          let arg;

          for (; i < numArgs; i++) {
            arg = args[i];

            if (typeof arg === "string") {
              Object.assign(
                sheet,
                compileStyles(styleMap[arg], tokens[currentTheme] as V)
              );
            } else if (typeof arg === "object") {
              for (const key in arg)
                if (arg[key])
                  Object.assign(
                    sheet,
                    compileStyles(styleMap[key], tokens[currentTheme] as V)
                  );
            }
          }
        }

        return process.env.NODE_ENV !== "production"
          ? Object.freeze(sheet)
          : sheet;
      }

      style.styles = styleMap;
      return style;
    },
    {
      one<S extends RNStyles>(
        literals:
          | TemplateStringsArray
          | string
          | StyleObject<S>
          | StyleCallback<S, ValueOf<Omit<VT, "default">>>,
        ...placeholders: string[]
      ) {
        let styles = compileStyles(
          compileLiterals(literals, ...placeholders),
          tokens[currentTheme]
        );

        if (process.env.NODE_ENV !== "production") {
          styles = Object.freeze(styles);
        }

        return Object.assign(
          function oneStyle(createStyle?: unknown) {
            if (!createStyle && createStyle !== void 0) return emptyObj;
            return styles;
          },
          { styles }
        );
      },
      cls,
      lazy<Value extends JsonValue, S extends RNStyles = RNStyles>(
        lazyFn: (value: Value) => StyleValue<S, ValueOf<Omit<VT, "default">>>
      ) {
        return function (value?: Value) {
          if (value === undefined) return emptyObj;
          let styles = compileStyles(
            lazyFn(value),
            tokens[currentTheme] as any
          );

          if (process.env.NODE_ENV !== "production") {
            styles = Object.freeze(styles);
          }

          return styles;
        };
      },
      join(...css: string[]) {
        return cls("".concat(...css));
      },
      tokens,
      themes,
    } as const
  );

  const DashContext = React.createContext({
    styles,
    theme: currentTheme,
    setTheme(theme: keyof T) {
      /* istanbul ignore next */
      console.error("DashContext was consumed outside of a Provider");
    },
  });

  /**
   * A hook for consuming dash context from the provider
   */
  function useDash() {
    return React.useContext(DashContext);
  }

  function styled<
    Style extends RN.ViewStyle | RN.TextStyle | RN.ImageStyle,
    Props extends {
      style?: RN.StyleProp<Style>;
    }
  >(
    Component: React.ComponentType<Props>,
    styles?: StyleValue<
      Extract<Props["style"], Style>,
      ValueOf<Omit<VT, "default">>
    >
  ) {
    function compileRecursiveStyles(
      style:
        | RN.RecursiveArray<
            | StyleValue<
                Extract<Props["style"], Style>,
                ValueOf<Omit<VT, "default">>
              >
            | Falsy
          >
        | StyleValue<
            Extract<Props["style"], Style>,
            ValueOf<Omit<VT, "default">>
          >
        | Falsy,
      tokens: ValueOf<Omit<VT, "default">>
    ): StyleObject {
      if (typeof style === "function" || typeof style === "string") {
        return compileStyles(style, tokens);
      } else if (Array.isArray(style)) {
        return Object.assign(
          {},
          ...style.map((s) => compileRecursiveStyles(s as any, tokens))
        );
      }

      return style || {};
    }

    const RefForwardingComponent = React.forwardRef(function StyledComponent(
      {
        style,
        ...props
      }: O.Overwrite<
        { children?: React.ReactNode } & Props,
        {
          style?:
            | RN.RecursiveArray<
                | StyleValue<
                    Extract<Props["style"], Style>,
                    ValueOf<Omit<VT, "default">>
                  >
                | Falsy
              >
            | StyleValue<
                Extract<Props["style"], Style>,
                ValueOf<Omit<VT, "default">>
              >
            | Falsy;
        }
      >,
      ref
    ) {
      const { theme } = useDash();
      const baseStyle = styles
        ? compileStyles(styles, tokens[theme] as any)
        : void 0;
      const outerStyle =
        typeof style === "function" || typeof style === "string"
          ? compileStyles(style, tokens[theme] as any)
          : Array.isArray(style)
          ? compileRecursiveStyles(style, tokens[theme] as any)
          : style;

      return (
        <Component
          {...(props as unknown as Props)}
          style={
            outerStyle && baseStyle
              ? { ...baseStyle, ...(outerStyle as Record<string, unknown>) }
              : outerStyle
              ? outerStyle
              : baseStyle
          }
          ref={ref}
        />
      );
    });

    // if (process.env.NODE_ENV !== "production") {
    //   RefForwardingComponent.displayName = `styled(${
    //     Component.displayName ?? (Component.name || "Component")
    //   })`;
    // }

    return RefForwardingComponent;
  }

  function wrapStyled<
    Style extends RN.ViewStyle | RN.TextStyle | RN.ImageStyle,
    Props extends {
      style?: RN.StyleProp<Style>;
    }
  >(Component: React.ComponentType<Props>) {
    return function styledWrapper(
      literals:
        | TemplateStringsArray
        | string
        | StyleObject<Extract<Props["style"], Style>>
        | StyleCallback<
            Extract<Props["style"], Style>,
            ValueOf<Omit<VT, "default">>
          >,
      ...placeholders: string[]
    ) {
      return styled(
        Component,
        Array.isArray(literals)
          ? compileLiterals(literals, ...placeholders)
          : literals
      );
    };
  }

  styled.ActivityIndicator = wrapStyled(RN.ActivityIndicator);
  styled.DrawerLayoutAndroid = wrapStyled(RN.DrawerLayoutAndroid);
  styled.FlatList = wrapStyled(RN.FlatList);
  styled.Image = wrapStyled(RN.Image);
  styled.ImageBackground = wrapStyled(RN.ImageBackground);
  styled.KeyboardAvoidingView = wrapStyled(RN.KeyboardAvoidingView);
  styled.Modal = wrapStyled(RN.Modal);
  styled.NavigatorIOS = wrapStyled(RN.NavigatorIOS);
  styled.RecyclerViewBackedScrollView = wrapStyled(
    RN.RecyclerViewBackedScrollView
  );
  styled.RefreshControl = wrapStyled(RN.RefreshControl);
  styled.SafeAreaView = wrapStyled(RN.SafeAreaView);
  styled.ScrollView = wrapStyled(RN.ScrollView);
  styled.SectionList = wrapStyled(RN.SectionList);
  styled.SnapshotViewIOS = wrapStyled(RN.SnapshotViewIOS);
  styled.Switch = wrapStyled(RN.Switch);
  styled.Text = wrapStyled(RN.Text);
  styled.TextInput = wrapStyled(RN.TextInput);
  styled.TouchableHighlight = wrapStyled(RN.TouchableHighlight);
  styled.TouchableNativeFeedback = wrapStyled(RN.TouchableNativeFeedback);
  styled.TouchableOpacity = wrapStyled(RN.TouchableOpacity);
  styled.TouchableWithoutFeedback = wrapStyled(RN.TouchableWithoutFeedback);
  styled.View = wrapStyled(RN.View);

  return {
    styles,
    styled,
    useDash,
    DashProvider({
      theme: controlledTheme,
      defaultTheme,
      onThemeChange,
      children,
    }: {
      defaultTheme?: keyof T;
      theme?: keyof T;
      onThemeChange?: (theme: keyof T) => void;
      children?: React.ReactNode;
    }) {
      const colorScheme = RN.useColorScheme();
      const didMount = React.useRef(false);
      const [userTheme, setTheme] = React.useState<keyof T>(() => {
        if (controlledTheme) {
          currentTheme = controlledTheme;
          return controlledTheme;
        }

        if (defaultTheme) {
          currentTheme = defaultTheme;
          return defaultTheme;
        }

        if (colorScheme && colorScheme in tokens && isAutoThemeable) {
          currentTheme = colorScheme as keyof T;
          return colorScheme as keyof T;
        }

        return currentTheme;
      });
      const theme = controlledTheme ?? userTheme;
      currentTheme = theme;
      const storedOnChange = React.useRef(onThemeChange);

      React.useLayoutEffect(() => {
        storedOnChange.current = onThemeChange;
      });

      React.useLayoutEffect(() => {
        if (controlledTheme && controlledTheme !== userTheme) {
          setTheme(controlledTheme);
        }
      }, [controlledTheme, userTheme]);

      React.useLayoutEffect(() => {
        if (
          didMount.current &&
          !controlledTheme &&
          colorScheme &&
          colorScheme !== theme &&
          isAutoThemeable
        ) {
          currentTheme = colorScheme as keyof T;
          setTheme(currentTheme);
          storedOnChange.current?.(currentTheme);
        }

        didMount.current = true;
      }, [colorScheme, controlledTheme]);

      return (
        <DashContext.Provider
          value={React.useMemo(
            () => ({
              styles,
              theme,
              setTheme(nextTheme) {
                if (nextTheme !== theme) storedOnChange.current?.(nextTheme);
                setTheme(nextTheme);
              },
            }),
            [theme]
          )}
          children={children}
        />
      );
    },
  } as const;
}

/**
 * A utility function that will compile style objects and callbacks into CSS strings.
 *
 * @param styles - A style callback, object, or string
 * @param tokens - A map of CSS tokens for style callbacks
 */
export function compileStyles<V extends Record<string, unknown> = DashTokens>(
  styles: StyleValue<RNStyles, V> | Falsy,
  tokens: V
): StyleObject {
  const value = typeof styles === "function" ? styles(tokens) : styles;
  if (typeof value !== "string") {
    return value || {};
  }

  let cache = compileCache.get(tokens);

  if (!cache) {
    cache = new Map<string, StyleObject>();
    compileCache.set(tokens, cache);
  }

  const cachedStyle = cache.get(value);
  if (cachedStyle) return cachedStyle;

  const stylePairs: [string, string][] = [];
  const splitValue = value.split(";");
  for (let i = 0; i < splitValue.length; i++) {
    // Get prop name and prop value
    const match = propertyValuePattern.exec(splitValue[i]);
    if (match !== null) stylePairs.push([match[1], match[2]]);
  }

  try {
    const style = cssToRN(stylePairs);
    cache.set(value, style);
    return style;
  } catch (error: any) {
    const msg = error.message;

    if (msg.includes("Failed to parse declaration")) {
      const values = msg
        .replace("Failed to parse declaration ", "")
        .replace(/"/g, "")
        .trim()
        .split(":");

      console.error(
        `'${values[0]}' shorthand property requires units for example - ${values[0]}: 20px or ${values[0]}: 10px 20px 40px 50px`
      );
    }

    const style = {};
    cache.set(value, style);
    return style;
  }
}

const compileCache = new WeakMap<DashTokens, Map<string, StyleObject>>();

function mergeTokens<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>
>(target: T, source: U) {
  for (const key in source) {
    const value = source[key];
    (target as any)[key] =
      typeof value === "object" && value !== null && !Array.isArray(value)
        ? mergeTokens((target[key] ?? {}) as any, value as any)
        : value;
  }

  return target as O.Merge<T, U, "deep">;
}

const propertyValuePattern = /\s*([^\s]+)\s*:\s*(.+?)\s*$/;

function compileLiterals<
  S extends RNStyles,
  V extends Record<string, unknown> = DashTokens
>(
  literals:
    | TemplateStringsArray
    | string
    | StyleObject<S>
    | StyleCallback<S, V>,
  ...replacements: string[]
) {
  return Array.isArray(literals)
    ? literals.reduce(
        (curr, next, i) => curr + next + (replacements[i] || ""),
        ""
      )
    : literals;
}

export type Styles = ReturnType<typeof createStyles>;

export interface CreateStylesOptions<
  V extends DashTokens = DashTokens,
  T extends Record<string, unknown> = DashThemes
> {
  readonly tokens?: V;
  readonly themes?: {
    [Name in keyof T]: T[Name];
  };
}

export type StyleMap<
  S extends RNStyles,
  V extends Record<string, unknown> = DashTokens
> = {
  [name: string]: string | StyleCallback<S, V> | StyleObject<S>;
};

export type StyleValue<
  S extends RNStyles = RNStyles,
  V extends Record<string, unknown> = DashTokens
> = string | StyleCallback<S, V> | StyleObject<S>;

export type StyleObject<S extends RNStyles = RNStyles> = S;

export type StyleCallback<
  S extends RNStyles = RNStyles,
  V extends Record<string, unknown> = DashTokens
> = (tokens: V) => StyleObject<S> | string;

export type RNStyles = RN.ViewStyle | RN.TextStyle | RN.ImageStyle;
export interface DashTokens extends Record<string, unknown> {}
export interface DashThemes extends Record<string, Record<string, unknown>> {}

/**
 * The names of the themes defined in the `DashThemes` type
 */
export type DashThemeNames = Extract<keyof DashThemes, string>;
