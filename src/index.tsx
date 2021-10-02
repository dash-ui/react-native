import type { Falsy, StyleArguments } from "@dash-ui/styles";
import cssToRN from "css-to-react-native";
import * as React from "react";
import * as RN from "react-native";
import type { O } from "ts-toolbelt";
import type { JsonObject, JsonValue, LiteralUnion } from "type-fest";

const emptyObj = {};

export function createStyles<
  V extends DashTokens = DashTokens,
  T extends DashThemes = DashThemes
>(options: CreateStylesOptions<V, T> = emptyObj) {
  const themes = options.themes ?? (emptyObj as T);
  const initialTokens = options.tokens ?? ({} as V);
  let tokens = initialTokens;
  if (options.themes) mergeTokens(tokens, Object.values(themes)[0] ?? {});
  const generated = new Map<string, StyleObject>();

  if (process.env.NODE_ENV !== "production") {
    const set_ = generated.set.bind(generated);
    generated.set = (key: string, styles: StyleObject) =>
      set_(key, Object.freeze(styles));
  }

  function cls<S extends AllStyles>(
    literals:
      | TemplateStringsArray
      | string
      | StyleObject<S>
      | StyleCallback<S, V>,
    ...placeholders: string[]
  ) {
    const styles = compileStyles(
      compileLiterals(literals, ...placeholders),
      tokens
    );

    if (process.env.NODE_ENV !== "production") {
      return Object.freeze(styles);
    }

    return styles;
  }

  const styles = Object.assign(
    function styles<T extends StyleMap<AllStyles, V>>(styleMap: T) {
      const compiledStyleMap: StyleMapMemo<string> = new Map();
      let styleKey: keyof typeof styleMap;
      /* istanbul ignore next */
      for (styleKey in styleMap)
        compiledStyleMap.set(
          styleKey,
          compileStyles(styleMap[styleKey] ?? emptyObj, tokens)
        );

      // style('text', {})
      function style(...args: StyleArguments<Extract<keyof T, string>>) {
        const key = JSON.stringify(args);
        const rules = generated.get(key);
        if (rules) return rules;
        const numArgs = args.length;
        const sheet = compiledStyleMap.get("default") ?? {};

        if (numArgs === 1 && typeof args[0] === "string") {
          Object.assign(sheet, compiledStyleMap.get(args[0]));
        } else if (numArgs > 0) {
          let i = 0;
          let arg;

          for (; i < numArgs; i++) {
            arg = args[i];

            if (typeof arg === "string") {
              Object.assign(sheet, compiledStyleMap.get(arg));
            } else if (typeof arg === "object") {
              for (const key in arg)
                if (arg[key]) Object.assign(sheet, compiledStyleMap.get(key));
            }
          }
        }

        generated.set(key, sheet);
        return sheet;
      }

      style.styles = styleMap;
      return style;
    },
    {
      one<S extends AllStyles>(
        literals:
          | TemplateStringsArray
          | string
          | StyleObject<S>
          | StyleCallback<S, V>,
        ...placeholders: string[]
      ) {
        const styles = compileStyles(
          compileLiterals(literals, ...placeholders),
          tokens
        );

        return Object.assign(
          function oneStyle(createStyle?: boolean) {
            if (!createStyle && createStyle !== void 0) return emptyObj;
            return styles;
          },
          { styles }
        );
      },
      cls,
      lazy<Value extends JsonValue>(
        lazyFn: <S extends AllStyles>(
          value: Value
        ) => string | StyleCallback<S, V> | StyleObject<S>
      ) {
        const cache = new Map<string | Value, StyleObject>();

        return function (value?: Value) {
          if (!value) return emptyObj;
          const key = typeof value === "object" ? JSON.stringify(value) : value;
          const cached = cache.get(key);
          if (cached) return cached;

          let styles = compileStyles(lazyFn(value), tokens);

          if (process.env.NODE_ENV !== "production") {
            styles = Object.freeze(styles);
          }

          cache.set(key, styles);
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
    setTheme(theme: keyof T) {
      console.error("DashContext was consumed outside of a Provider");
    },
  });

  /**
   * A hook for consuming dash context from the provider
   */
  function useDash() {
    return React.useContext(DashContext);
  }

  const styled = function styled<
    Style extends RN.ViewStyle | RN.TextStyle | RN.ImageStyle,
    Props extends {
      style?: RN.StyleProp<Style>;
    }
  >(
    Component: React.ComponentType<Props>,
    styles?: Extract<Props["style"], Style>
  ) {
    const RefForwardingComponent = React.forwardRef(function StyledComponent(
      {
        style,
        ...props
      }: O.Overwrite<
        Props,
        { style?: StyleValue<Extract<Props["style"], Style>, V> }
      >,
      ref
    ) {
      useDash();
      const baseStyle = compileStyles(styles, tokens);
      const outerStyle =
        typeof style === "function" || typeof style === "string"
          ? compileStyles(style, tokens)
          : style;

      return (
        <Component
          {...(props as unknown as Props)}
          style={
            outerStyle && baseStyle
              ? RN.StyleSheet.flatten([baseStyle, outerStyle])
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
  };

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
        | StyleCallback<Extract<Props["style"], Style>, V>,
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
    component: {
      ActivityIndicator: styled(RN.ActivityIndicator),
      DrawerLayoutAndroid: styled(RN.DrawerLayoutAndroid),
      FlatList: styled(RN.FlatList),
      Image: styled(RN.Image),
      ImageBackground: styled(RN.ImageBackground),
      KeyboardAvoidingView: styled(RN.KeyboardAvoidingView),
      Modal: styled(RN.Modal),
      NavigatorIOS: styled(RN.NavigatorIOS),
      RecyclerViewBackedScrollView: styled(RN.RecyclerViewBackedScrollView),
      RefreshControl: styled(RN.RefreshControl),
      SafeAreaView: styled(RN.SafeAreaView),
      ScrollView: styled(RN.ScrollView),
      SectionList: styled(RN.SectionList),
      SnapshotViewIOS: styled(RN.SnapshotViewIOS),
      Switch: styled(RN.Switch),
      Text: styled(RN.Text),
      TextInput: styled(RN.TextInput),
      TouchableHighlight: styled(RN.TouchableHighlight),
      TouchableNativeFeedback: styled(RN.TouchableNativeFeedback),
      TouchableOpacity: styled(RN.TouchableOpacity),
      TouchableWithoutFeedback: styled(RN.TouchableWithoutFeedback),
      View: styled(RN.View),
    },
    useDash,
    Provider({
      defaultTheme,
      children,
    }: {
      defaultTheme?: keyof T;
      children?: React.ReactNode;
    }) {
      const colorScheme = RN.useColorScheme();
      const [theme, setTheme] = React.useState<keyof T>(() => {
        if (defaultTheme) return defaultTheme;
        if (colorScheme && colorScheme in themes) return colorScheme as keyof T;
        return Object.keys(themes)[0] as keyof T;
      });

      React.useLayoutEffect(() => {
        if (theme)
          tokens = mergeTokens({ ...initialTokens }, themes[theme]) as V;
      }, [theme]);

      React.useLayoutEffect(() => {
        if (
          colorScheme &&
          Object.values(themes).length === 2 &&
          "light" in themes &&
          "dark" in themes
        ) {
          tokens = mergeTokens({ ...initialTokens }, themes[colorScheme]);
        }
      }, [colorScheme]);

      return (
        <DashContext.Provider
          value={React.useMemo(() => ({ styles, theme, setTheme }), [theme])}
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
export function compileStyles<V extends DashTokens = DashTokens>(
  styles: StyleValue<AllStyles, V> | Falsy,
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

const compileCache = new Map<DashTokens, Map<string, StyleObject>>();

function mergeTokens<T extends JsonObject, U extends JsonObject>(
  target: T,
  source: U
) {
  for (const key in source) {
    const value = source[key];
    (target as any)[key] =
      typeof value === "object" && value !== null && !Array.isArray(value)
        ? mergeTokens(target[key] ?? {}, value)
        : value;
  }

  return target as O.Merge<T, U, "deep">;
}

const propertyValuePattern = /\s*([^\s]+)\s*:\s*(.+?)\s*$/;

function compileLiterals<
  S extends AllStyles,
  V extends DashTokens = DashTokens
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
  T extends DashThemes = DashThemes
> {
  readonly tokens?: V;
  readonly themes?: {
    [Name in keyof T]: V;
  };
}

export type StyleMap<S extends AllStyles, V extends DashTokens = DashTokens> = {
  [name: string]: string | StyleCallback<S, V> | StyleObject<S>;
};

type StyleMapMemo<N extends string> = Map<N | "default", StyleObject>;

export type StyleValue<
  S extends AllStyles = AllStyles,
  V extends DashTokens = DashTokens
> = string | StyleCallback<S, V> | StyleObject<S>;

export type StyleObject<S extends AllStyles = AllStyles> = S;

export type StyleCallback<
  S extends AllStyles = AllStyles,
  V extends DashTokens = DashTokens
> = (tokens: V) => StyleObject<S> | string;

export type AllStyles = RN.ViewStyle | RN.TextStyle | RN.ImageStyle;
export interface DashTokens {}
export interface DashThemes {}

/**
 * The names of the themes defined in the `DashThemes` type
 */
export type DashThemeNames = Extract<keyof DashThemes, string>;
