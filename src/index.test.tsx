import { act, render } from "@testing-library/react-native";
import * as React from "react";
import * as RN from "react-native";
import type { ViewStyle } from "react-native";
import "@testing-library/jest-native/extend-expect";
import { compileStyles, createStyles } from "./index";

describe("styles.variants()", () => {
  const { styles } = createStyles({
    tokens: {
      colors: {
        primary: "red",
        secondary: "blue",
      },
      spacing: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
    } as const,
  });

  it("should convert string styles to objects", () => {
    const style = styles.variants({
      red: `
        color: red;
      `,
    });

    expect(style("red")).toEqual({ color: "red" });
  });

  it("should do nothing with object styles", () => {
    const style = styles.variants({
      default: { color: "red" },
    });

    expect(style()).toEqual({ color: "red" });
  });

  it("should convert string styles to object styles returned by functions", () => {
    const style = styles.variants({
      default: (t) => `color: ${t.colors.primary}`,
    });

    expect(style()).toEqual({ color: "red" });
  });

  it("should do nothing with object styles returned by functions", () => {
    const style = styles.variants({
      default: (t) => ({ color: t.colors.primary }),
    });

    expect(style()).toEqual({ color: "red" });
  });

  it("should avoid loop with single string argument", () => {
    const style = styles.variants({
      default: (t) => ({ color: t.colors.primary }),
      blue: "color: blue",
    });

    expect(style("blue")).toEqual({ color: "blue" });
  });

  it("should freeze object when not in production", () => {
    const style = styles.variants({
      default: (t) => ({ color: t.colors.primary }),
    });
    const output = style();
    // @ts-expect-error
    expect(() => (output.color = "blue")).toThrow();
  });

  it("should not freeze object in production", () => {
    process.env.NODE_ENV = "production";
    const style = styles.variants({
      default: (t) => ({ color: t.colors.primary }),
    });
    const output = style();
    // @ts-expect-error
    output.color = "blue";
    expect(output).toEqual({ color: "blue" });
    process.env.NODE_ENV = "test";
  });

  it("should flatten styles in order called", () => {
    const style = styles.variants({
      default: (t) => ({ color: t.colors.primary }),
      bgRed: { backgroundColor: "red" },
      borderBlue: `border-color: blue;`,
    });

    expect(Object.keys(style("borderBlue", "bgRed"))).toEqual([
      "color",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
      "backgroundColor",
    ]);
    expect(style("borderBlue", "bgRed")).toEqual({
      color: "red",
      borderTopColor: "blue",
      borderRightColor: "blue",
      borderBottomColor: "blue",
      borderLeftColor: "blue",
      backgroundColor: "red",
    });
  });

  it("should flatten styles in order called w/ object syntax", () => {
    const style = styles.variants({
      default: (t) => ({ color: t.colors.primary }),
      bgRed: { backgroundColor: "red" },
      borderBlue: `border-color: blue;`,
    });

    expect(Object.keys(style({ borderBlue: true, bgRed: true }))).toEqual([
      "color",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
      "backgroundColor",
    ]);
    expect(style({ borderBlue: true, bgRed: true })).toEqual({
      color: "red",
      borderTopColor: "blue",
      borderRightColor: "blue",
      borderBottomColor: "blue",
      borderLeftColor: "blue",
      backgroundColor: "red",
    });
  });

  it("should flatten styles in order called w/ mixed syntax", () => {
    const style = styles.variants({
      default: (t) => ({ color: t.colors.primary }),
      bgRed: { backgroundColor: "red" },
      borderBlue: `border-color: blue;`,
    });

    expect(Object.keys(style({ borderBlue: true }, "bgRed"))).toEqual([
      "color",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
      "backgroundColor",
    ]);
    expect(style({ borderBlue: true }, "bgRed")).toEqual({
      color: "red",
      borderTopColor: "blue",
      borderRightColor: "blue",
      borderBottomColor: "blue",
      borderLeftColor: "blue",
      backgroundColor: "red",
    });
  });

  it("should not apply falsy styles w/ object syntax", () => {
    const style = styles.variants({
      default: (t) => ({ color: t.colors.primary }),
      bgRed: { backgroundColor: "red" },
      borderBlue: `border-color: blue;`,
    });

    expect(style({ borderBlue: false, bgRed: true })).toEqual({
      color: "red",
      backgroundColor: "red",
    });

    expect(style({ borderBlue: 0, bgRed: true })).toEqual({
      color: "red",
      backgroundColor: "red",
    });

    expect(style({ borderBlue: "", bgRed: true })).toEqual({
      color: "red",
      backgroundColor: "red",
    });

    expect(style({ borderBlue: null, bgRed: true })).toEqual({
      color: "red",
      backgroundColor: "red",
    });

    expect(style({ borderBlue: undefined, bgRed: true })).toEqual({
      color: "red",
      backgroundColor: "red",
    });
  });

  it("should not apply falsy styles w/ string syntax", () => {
    const style = styles.variants({
      default: (t) => ({ color: t.colors.primary }),
      bgRed: { backgroundColor: "red" },
      borderBlue: `border-color: blue;`,
    });

    expect(style(false, "bgRed")).toEqual({
      color: "red",
      backgroundColor: "red",
    });

    expect(style(0, "bgRed")).toEqual({
      color: "red",
      backgroundColor: "red",
    });

    expect(style(null, "bgRed")).toEqual({
      color: "red",
      backgroundColor: "red",
    });

    expect(style(undefined, "bgRed")).toEqual({
      color: "red",
      backgroundColor: "red",
    });
  });

  it("should fail to parse declaration", () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const style = styles.variants({
      default: `
        border-width: 1;
      `,
    });

    expect(style()).toEqual({});
    expect(console.error).toBeCalledWith(
      "'borderWidth' shorthand property requires units for example - borderWidth: 20px or borderWidth: 10px 20px 40px 50px"
    );
    console.error = originalConsoleError;
  });
});

describe("styles.variants() themes", () => {
  const stylesConfig = {
    tokens: {
      spacing: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
      colors: {
        primary: "white",
        secondary: "black",
      },
    },
    themes: {
      light: {},
      dark: {
        colors: {
          primary: "black",
          secondary: "white",
        },
        other: {},
      },
    },
  };

  it("should be the light theme by default", () => {
    const { styles } = createStyles(stylesConfig);
    const style = styles.variants({
      default: (t) => ({ color: t.colors.primary }),
    });

    expect(style()).toEqual({ color: "white" });
  });

  it("should be the dark theme", () => {
    colorScheme = "dark";
    const { styles } = createStyles(stylesConfig);
    const style = styles.variants({
      default: (t) => ({ color: t.colors.primary }),
    });

    expect(style()).toEqual({ color: "black" });
  });

  it("should be the light theme w/ no-preference", () => {
    colorScheme = null;
    const { styles } = createStyles(stylesConfig);
    const style = styles.variants({
      default: (t) => ({ color: t.colors.primary }),
    });

    expect(style()).toEqual({ color: "white" });
  });

  it("should be the dark theme w/ no-preference", () => {
    colorScheme = null;
    const { styles } = createStyles({
      ...stylesConfig,
      themes: {
        dark: stylesConfig.themes.dark,
        light: {},
      },
    });
    const style = styles.variants({
      default: (t) => ({ color: t.colors.primary }),
    });

    expect(style()).toEqual({ color: "black" });
  });
});

describe("styles.one()", () => {
  const { styles } = createStyles({
    tokens: {
      colors: {
        primary: "red",
        secondary: "blue",
      },
      spacing: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
    } as const,
  });

  it("should convert template string styles to objects", () => {
    const style = styles.one`
      color: red;
    `;

    expect(style()).toEqual({ color: "red" });
  });

  it("should convert string styles to objects", () => {
    const style = styles.one(`
      color: red;
    `);

    expect(style()).toEqual({ color: "red" });
  });

  it("should do nothing with object styles", () => {
    const style = styles.one({ color: "red" });

    expect(style()).toEqual({ color: "red" });
  });

  it("should convert string styles to object styles returned by functions", () => {
    const style = styles.one((t) => `color: ${t.colors.primary}`);

    expect(style()).toEqual({ color: "red" });
  });

  it("should do nothing with object styles returned by functions", () => {
    const style = styles.one((t) => ({ color: t.colors.primary }));

    expect(style()).toEqual({ color: "red" });
  });

  it("should freeze object when not in production", () => {
    const style = styles.one((t) => ({ color: t.colors.primary }));
    const output = style();
    // @ts-expect-error
    expect(() => (output.color = "blue")).toThrow();
  });

  it("should not freeze object in production", () => {
    process.env.NODE_ENV = "production";
    const style = styles.one((t) => ({ color: t.colors.primary }));
    const output = style();
    // @ts-expect-error
    output.color = "blue";
    expect(output).toEqual({ color: "blue" });
    process.env.NODE_ENV = "test";
  });

  it("should not apply falsy styles", () => {
    const style = styles.one((t) => ({ color: t.colors.primary }));

    expect(style(false)).toEqual({});
    expect(style(0)).toEqual({});
    expect(style(null)).toEqual({});
    expect(style("")).toEqual({});
  });
});

describe("styles.one() themes", () => {
  const stylesConfig = {
    tokens: {
      colors: {
        primary: "white",
        secondary: "black",
      },
    },
    themes: {
      light: {},
      dark: {
        colors: {
          primary: "black",
          secondary: "white",
        },
      },
    },
  };

  it("should be the light theme by default", () => {
    const { styles } = createStyles(stylesConfig);
    const style = styles.one((t) => ({ color: t.colors.primary }));
    expect(style()).toEqual({ color: "white" });
  });

  it("should be the dark theme", () => {
    colorScheme = "dark";
    const { styles } = createStyles(stylesConfig);
    const style = styles.one((t) => ({ color: t.colors.primary }));
    expect(style()).toEqual({ color: "black" });
  });

  it("should be the light theme w/ no-preference", () => {
    colorScheme = null;
    const { styles } = createStyles(stylesConfig);
    const style = styles.one((t) => ({ color: t.colors.primary }));
    expect(style()).toEqual({ color: "white" });
  });

  it("should be the dark theme w/ no-preference", () => {
    colorScheme = null;
    const { styles } = createStyles({
      ...stylesConfig,
      themes: {
        dark: stylesConfig.themes.dark,
        light: {},
      },
    });
    const style = styles.one((t) => ({ color: t.colors.primary }));
    expect(style()).toEqual({ color: "black" });
  });
});

describe("styles.cls()", () => {
  const { styles } = createStyles({
    tokens: {
      colors: {
        primary: "red",
        secondary: "blue",
      },
      spacing: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
    } as const,
  });

  it("should convert template string styles to objects", () => {
    const style = styles.cls`
      color: red;
    `;

    expect(style).toEqual({ color: "red" });
  });

  it("should convert string styles to objects", () => {
    const style = styles.cls(`
      color: red;
    `);

    expect(style).toEqual({ color: "red" });
  });

  it("should do nothing with object styles", () => {
    const style = styles.cls({ color: "red" });

    expect(style).toEqual({ color: "red" });
  });

  it("should convert string styles to object styles returned by functions", () => {
    const style = styles.cls((t) => `color: ${t.colors.primary}`);

    expect(style).toEqual({ color: "red" });
  });

  it("should do nothing with object styles returned by functions", () => {
    const style = styles.cls((t) => ({ color: t.colors.primary }));

    expect(style).toEqual({ color: "red" });
  });

  it("should freeze object when not in production", () => {
    const output = styles.cls((t) => ({ color: t.colors.primary }));
    // @ts-expect-error
    expect(() => (output.color = "blue")).toThrow();
  });

  it("should not freeze object in production", () => {
    process.env.NODE_ENV = "production";
    const output = styles.cls((t) => ({ color: t.colors.primary }));
    // @ts-expect-error
    output.color = "blue";
    expect(output).toEqual({ color: "blue" });
    process.env.NODE_ENV = "test";
  });
});

describe("styles.cls() themes", () => {
  const stylesConfig = {
    tokens: {
      colors: {
        primary: "white",
        secondary: "black",
      },
    },
    themes: {
      light: {},
      dark: {
        colors: {
          primary: "black",
          secondary: "white",
        },
      },
    },
  };

  it("should be the light theme by default", () => {
    const { styles } = createStyles(stylesConfig);
    const style = styles.cls((t) => ({ color: t.colors.primary }));
    expect(style).toEqual({ color: "white" });
  });

  it("should be the dark theme", () => {
    colorScheme = "dark";
    const { styles } = createStyles(stylesConfig);
    const style = styles.cls((t) => ({ color: t.colors.primary }));
    expect(style).toEqual({ color: "black" });
  });

  it("should be the light theme w/ no-preference", () => {
    colorScheme = null;
    const { styles } = createStyles(stylesConfig);
    const style = styles.cls((t) => ({ color: t.colors.primary }));
    expect(style).toEqual({ color: "white" });
  });

  it("should be the dark theme w/ no-preference", () => {
    colorScheme = null;
    const { styles } = createStyles({
      ...stylesConfig,
      themes: {
        dark: stylesConfig.themes.dark,
        light: {},
      },
    });
    const style = styles.cls((t) => ({ color: t.colors.primary }));
    expect(style).toEqual({ color: "black" });
  });
});

describe("styles.lazy()", () => {
  const { styles } = createStyles({
    tokens: {
      colors: {
        primary: "red",
        secondary: "blue",
      },
      spacing: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
    } as const,
  });

  it("should return empoty object with undefined argument", () => {
    const style = styles.lazy(
      (color: "red" | "blue") => `
      color: ${color};
    `
    );

    expect(style()).toEqual({});
  });

  it("should convert string styles to objects", () => {
    const style = styles.lazy(
      (color: "red" | "blue") => `
      color: ${color};
    `
    );

    expect(style("red")).toEqual({ color: "red" });
  });

  it("should do nothing with object styles", () => {
    const styleA = styles.lazy<"red" | "blue", ViewStyle>((color) => ({
      backgroundColor: color,
    }));
    expect(styleA("red")).toEqual({ backgroundColor: "red" });
  });

  it("should convert string styles to object styles returned by functions", () => {
    const style = styles.lazy(
      (color: "primary" | "secondary") => (t) => `color: ${t.colors[color]};`
    );

    expect(style("primary")).toEqual({ color: "red" });
  });

  it("should do nothing with object styles returned by functions", () => {
    const style = styles.lazy((color: "primary" | "secondary") => (t) => ({
      color: t.colors[color],
    }));

    expect(style("primary")).toEqual({ color: "red" });
  });

  it("should freeze object when not in production", () => {
    const style = styles.lazy((color: "red" | "blue") => ({ color }));
    const output = style("red");
    expect(() => (output.color = "blue")).toThrow();
  });

  it("should not freeze object in production", () => {
    process.env.NODE_ENV = "production";
    const style = styles.lazy((color: "red" | "blue") => ({ color }));
    const output = style("red");
    output.color = "blue";
    expect(output).toEqual({ color: "blue" });
    process.env.NODE_ENV = "test";
  });
});

describe("styles.lazy() themes", () => {
  const stylesConfig = {
    tokens: {
      colors: {
        primary: "white",
        secondary: "black",
      },
    },
    themes: {
      light: {},
      dark: {
        colors: {
          primary: "black",
          secondary: "white",
        },
      },
    },
  };

  it("should be the light theme by default", () => {
    const { styles } = createStyles(stylesConfig);
    const style = styles.lazy(
      (color: keyof typeof styles.tokens.light.colors) => (t) => ({
        color: t.colors[color],
      })
    );
    expect(style("primary")).toEqual({ color: "white" });
  });

  it("should be the dark theme", () => {
    colorScheme = "dark";
    const { styles } = createStyles(stylesConfig);
    const style = styles.lazy(
      (color: keyof typeof styles.tokens.light.colors) => (t) => ({
        color: t.colors[color],
      })
    );
    expect(style("primary")).toEqual({ color: "black" });
  });

  it("should be the light theme w/ no-preference", () => {
    colorScheme = null;
    const { styles } = createStyles(stylesConfig);
    const style = styles.lazy(
      (color: keyof typeof styles.tokens.light.colors) => (t) => ({
        color: t.colors[color],
      })
    );
    expect(style("primary")).toEqual({ color: "white" });
  });

  it("should be the dark theme w/ no-preference", () => {
    colorScheme = null;
    const { styles } = createStyles({
      ...stylesConfig,
      themes: {
        dark: stylesConfig.themes.dark,
        light: {},
      },
    });
    const style = styles.lazy(
      (color: keyof typeof styles.tokens.light.colors) => (t) => ({
        color: t.colors[color],
      })
    );
    expect(style("primary")).toEqual({ color: "black" });
  });
});

describe("styles.join()", () => {
  const { styles } = createStyles();

  it("should join strings into an object style", () => {
    expect(styles.join("color: red;", "background-color: blue;")).toEqual({
      color: "red",
      backgroundColor: "blue",
    });
  });
});

describe("styled()", () => {
  const { styled } = createStyles({
    tokens: {
      colors: {
        primary: "white",
        secondary: "black",
      },
    },
    themes: {
      light: {
        colors: {
          primaryText: "black",
        },
      },
      dark: {
        colors: {
          primaryText: "white",
        },
      },
    },
  });
  const StyledView = styled(RN.View);

  it("should add style from style prop string", () => {
    const view = render(
      <StyledView style="background-color: white;" testID="test" />
    );
    expect(view.getByTestId("test")).toHaveStyle({ backgroundColor: "white" });
  });

  it("should add style from style prop object", () => {
    const view = render(
      <StyledView style={{ backgroundColor: "white" }} testID="test" />
    );
    expect(view.getByTestId("test")).toHaveStyle({ backgroundColor: "white" });
  });

  it("should add style from style prop callback", () => {
    const view = render(
      <StyledView
        style={({ colors }) => ({ backgroundColor: colors.primary })}
        testID="test"
      />
    );
    expect(view.getByTestId("test")).toHaveStyle({ backgroundColor: "white" });
  });

  it("should add style from style prop array", () => {
    const view = render(
      <StyledView
        style={[
          [({ colors }) => ({ backgroundColor: colors.primary })],
          { borderWidth: 1 },
          [[["border-color: white;"]]],
          null,
          undefined,
          false,
          "",
          [{ borderBottomColor: "blue" }],
        ]}
        testID="test"
      />
    );

    expect(view.getByTestId("test")).toHaveStyle({
      backgroundColor: "white",
      borderWidth: 1,
      borderTopColor: "white",
      borderRightColor: "white",
      borderBottomColor: "blue",
      borderLeftColor: "white",
    });
  });

  it("should add default styles", () => {
    const StyledView = styled(RN.View, {
      backgroundColor: "white",
    });
    const view = render(
      <StyledView
        style={({ colors }) => ({ borderColor: colors.primary })}
        testID="test"
      />
    );
    expect(view.getByTestId("test")).toHaveStyle({
      backgroundColor: "white",
      borderColor: "white",
    });
  });

  it("should override default styles", () => {
    const StyledView = styled(RN.View, {
      backgroundColor: "white",
    });
    const view = render(
      <StyledView
        style={({ colors }) => ({ backgroundColor: colors.secondary })}
        testID="test"
      />
    );
    expect(view.getByTestId("test")).toHaveStyle({
      backgroundColor: "black",
    });
  });

  it("should add default styles w/ string syntax", () => {
    const StyledView = styled(RN.View, "background-color: white;");
    const view = render(<StyledView testID="test" />);
    expect(view.getByTestId("test")).toHaveStyle({
      backgroundColor: "white",
    });
  });

  it("should add default styles w/ function syntax", () => {
    const StyledView = styled(
      RN.View,
      ({ colors }) => `background-color: ${colors.primary};`
    );
    const view = render(<StyledView testID="test" />);
    expect(view.getByTestId("test")).toHaveStyle({
      backgroundColor: "white",
    });
  });

  it("should lazily evaluate styles", () => {
    const fontSizes = { xs: 12, sm: 14 };
    const StyledText = styled(
      RN.Text,
      (t, p: { size: keyof typeof fontSizes }) => ({
        color: t.colors.primaryText,
        fontSize: fontSizes[p.size],
      })
    );
    const view = render(<StyledText size="sm" testID="test" />);

    expect(view.getByTestId("test")).toHaveStyle({
      color: "black",
    });

    const viewB = render(<StyledText size="sm" testID="test" />);

    expect(viewB.getByTestId("test")).toHaveStyle({
      color: "black",
      fontSize: 14,
    });
  });

  it("should memoize lazily evaluate styles w/ callback", () => {
    const fontSizes = { xs: 12, sm: 14 };
    const StyledText = styled(
      RN.Text,
      (t, p: { size: keyof typeof fontSizes }) => ({
        color: t.colors.primaryText,
        fontSize: fontSizes[p.size],
      }),
      ([t, p], [nt, np]) => t === nt && p.size === np.size
    );
    const view = render(<StyledText size="sm" testID="test" />);

    expect(view.getByTestId("test")).toHaveStyle({
      color: "black",
      fontSize: 14,
    });

    const viewB = render(<StyledText size="sm" testID="test" />);

    expect(viewB.getByTestId("test")).toHaveStyle({
      color: "black",
      fontSize: 14,
    });
  });

  it("should memoize lazily evaluate styles w/ array", () => {
    const fontSizes = { xs: 12, sm: 14 };
    const StyledText = styled(
      RN.Text,
      (t, p: { size: keyof typeof fontSizes }) => ({
        color: t.colors.primaryText,
        fontSize: fontSizes[p.size],
      }),
      ["size"]
    );
    const view = render(<StyledText size="sm" testID="test" />);

    expect(view.getByTestId("test")).toHaveStyle({
      color: "black",
      fontSize: 14,
    });

    const viewB = render(<StyledText size="sm" testID="test" />);

    expect(viewB.getByTestId("test")).toHaveStyle({
      color: "black",
      fontSize: 14,
    });
  });

  it("should lazily evaluate composed styles", () => {
    const fontSizes = { xs: 12, sm: 14 };
    const StyledText_ = styled<{ size?: keyof typeof fontSizes }, RN.TextProps>(
      RN.Text,
      (t, p) => ({
        color: t.colors.primaryText,
        fontSize: p.size && fontSizes[p.size],
      })
    );
    const StyledText = styled(
      StyledText_,
      (t, p: { weight?: "normal" | "bold" }) => ({
        color: t.colors.primaryText,
        fontWeight: p.weight,
      })
    );
    const view = render(<StyledText testID="test" />);

    expect(view.getByTestId("test")).toHaveStyle({
      color: "black",
    });

    const viewB = render(<StyledText size="sm" testID="test" />);

    expect(viewB.getByTestId("test")).toHaveStyle({
      color: "black",
      fontSize: 14,
    });

    const viewC = render(<StyledText size="sm" weight="bold" testID="test" />);

    expect(viewC.getByTestId("test")).toHaveStyle({
      color: "black",
      fontSize: 14,
      fontWeight: "bold",
    });
  });

  it("should create from custom component", () => {
    const MyComponent = (props: {
      style: RN.TextStyle;
      children: string;
      testID?: RN.ViewProps["testID"];
    }) => {
      return <RN.Text style={props.style}>{props.children}</RN.Text>;
    };

    const StyledText = styled(
      MyComponent,
      (t, p: { weight: "normal" | "bold" }) => ({
        color: t.colors.primaryText,
        fontWeight: p.weight,
      })
    );
    const view = render(
      <StyledText weight="bold" testID="test">
        Hello
      </StyledText>
    );
    expect(view.getByText("Hello")).toHaveStyle({
      fontWeight: "bold",
    });
  });
});

describe("<DashProvider>", () => {
  const stylesConfig = {
    tokens: {
      spacing: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
      colors: {
        primary: "white",
        secondary: "black",
      },
    },
    themes: {
      light: {},
      dark: {
        colors: {
          primary: "black",
          secondary: "white",
        },
      },
    },
  };

  it("should provide light theme", () => {
    const { DashProvider, useDash } = createStyles(stylesConfig);
    let theme;

    function Component() {
      theme = useDash().theme;
      return null;
    }

    render(<Component />, {
      wrapper: (props) => <DashProvider {...props} />,
    });

    expect(theme).toBe("light");
  });

  it("should provide dark theme", () => {
    const { DashProvider, useDash } = createStyles(stylesConfig);
    let theme;
    colorScheme = "dark";

    function Component() {
      theme = useDash().theme;
      return null;
    }

    render(<Component />, {
      wrapper: (props) => <DashProvider {...props} />,
    });

    expect(theme).toBe("dark");
  });

  it("should set new theme", () => {
    const { DashProvider, useDash } = createStyles(stylesConfig);
    let theme;

    function Component() {
      const dash = useDash();
      theme = dash.theme;
      React.useEffect(() => {
        dash.setTheme("dark");
      }, []);
      return null;
    }

    render(<Component />, {
      wrapper: (props) => <DashProvider {...props} />,
    });

    expect(theme).toBe("dark");
  });

  it("should set new tokens", () => {
    const { DashProvider, useDash, styles } = createStyles(stylesConfig);

    function Component() {
      const dash = useDash();
      React.useEffect(() => {
        dash.insertTokens({
          spacing: [1, 2, 4],
          colors: {
            primary: "red",
          },
        });
      }, []);
      return null;
    }

    render(<Component />, {
      wrapper: (props) => <DashProvider {...props} />,
    });

    expect(styles.tokens.default.spacing).toEqual([1, 2, 4]);
    expect(styles.tokens.default.colors.primary).toBe("red");
    expect(styles.tokens.light.colors.primary).toBe("red");
    expect((styles.themes.light as any).colors).toBeUndefined();
    expect(styles.tokens.dark.colors.primary).toBe("black");
  });

  it("should set new theme tokens", () => {
    const { DashProvider, useDash, styles } = createStyles(stylesConfig);

    function Component() {
      const dash = useDash();
      React.useEffect(() => {
        dash.insertThemes({
          dark: {
            colors: {
              primary: "red",
            },
          },
        });
      }, []);
      return null;
    }

    render(<Component />, {
      wrapper: (props) => <DashProvider {...props} />,
    });

    expect(styles.tokens.dark.colors.primary).toBe("red");
    expect((styles.themes.light as any).colors).toBeUndefined();
    expect(styles.themes.dark.colors.primary).toBe("red");
  });

  it("should set new light theme tokens", () => {
    const { DashProvider, useDash, styles } = createStyles(stylesConfig);

    function Component() {
      const dash = useDash();
      React.useEffect(() => {
        dash.insertThemes({
          light: {
            colors: {
              primary: "red",
            },
          },
        });
      }, []);
      return null;
    }

    render(<Component />, {
      wrapper: (props) => <DashProvider {...props} />,
    });

    expect(styles.tokens.light.colors.primary).toBe("red");
    expect((styles.themes.light as any).colors.primary).toBe("red");
  });

  it("should set a default theme", () => {
    const { DashProvider, useDash } = createStyles(stylesConfig);
    let theme;

    function Component() {
      const dash = useDash();
      theme = dash.theme;
      return null;
    }

    render(<Component />, {
      wrapper: (props) => <DashProvider {...props} defaultTheme="dark" />,
    });

    expect(theme).toBe("dark");
  });

  it("should use the first theme in the theme keys", () => {
    const { DashProvider, useDash } = createStyles({
      ...stylesConfig,
      themes: {
        lightDark: {
          colors: {
            primary: "#333",
          },
        },
        ...stylesConfig.themes,
      },
    });
    let theme;

    function Component() {
      const dash = useDash();
      theme = dash.theme;
      return null;
    }

    render(<Component />, {
      wrapper: (props) => <DashProvider {...props} />,
    });

    expect(theme).toBe("lightDark");
  });

  it("should be controlled by theme prop", () => {
    const { DashProvider, useDash } = createStyles(stylesConfig);
    let theme;
    const onThemeChange = jest.fn();

    function Component() {
      const dash = useDash();
      theme = dash.theme;
      return null;
    }

    const view = render(
      <DashProvider theme="light" onThemeChange={onThemeChange}>
        <Component />
      </DashProvider>
    );
    expect(theme).toBe("light");

    view.rerender(
      <DashProvider theme="dark" onThemeChange={onThemeChange}>
        <Component />
      </DashProvider>
    );
    expect(theme).toBe("dark");
    expect(onThemeChange).not.toBeCalled();
  });

  it("should call onThemeChange when setTheme is invoked", () => {
    const { DashProvider, useDash } = createStyles(stylesConfig);
    let theme;
    const onThemeChange = jest.fn();

    function Component() {
      const dash = useDash();
      theme = dash.theme;
      React.useLayoutEffect(() => {
        dash.setTheme("dark");
      }, []);
      return null;
    }

    render(
      <DashProvider theme="light" onThemeChange={onThemeChange}>
        <Component />
      </DashProvider>
    );
    expect(theme).toBe("light");
    expect(onThemeChange).toBeCalledWith("dark");
  });

  it("should react to useColorScheme changes", () => {
    const { DashProvider } = createStyles(stylesConfig);
    const onThemeChange = jest.fn();
    jest.spyOn(RN.Appearance, "addChangeListener");
    const listeners: any[] = [];
    // @ts-expect-error
    RN.Appearance.addChangeListener.mockImplementation((listener) => {
      listeners.push(listener);
      return {
        remove() {
          listeners.splice(listeners.indexOf(listener), 1);
        },
      };
    });

    render(<DashProvider onThemeChange={onThemeChange} />);
    expect(onThemeChange).not.toBeCalled();

    colorScheme = "dark";
    act(() => {
      listeners.forEach((listener) => listener(colorScheme));
    });

    expect(onThemeChange).toBeCalledWith("dark");
  });

  it("should not react to useColorScheme changes if theme is controlled", () => {
    const { DashProvider } = createStyles(stylesConfig);
    const onThemeChange = jest.fn();
    jest.spyOn(RN.Appearance, "addChangeListener");
    const listeners: any[] = [];
    // @ts-expect-error
    RN.Appearance.addChangeListener.mockImplementation((listener) => {
      listeners.push(listener);
    });

    render(<DashProvider theme="light" onThemeChange={onThemeChange} />);

    colorScheme = "dark";
    act(() => {
      listeners.forEach((listener) => listener(colorScheme));
    });

    expect(onThemeChange).not.toBeCalled();
  });

  it("should not react to useColorScheme changes if disableAutoThemeChange", () => {
    const { DashProvider } = createStyles(stylesConfig);
    const onThemeChange = jest.fn();
    jest.spyOn(RN.Appearance, "addChangeListener");
    const listeners: any[] = [];
    // @ts-expect-error
    RN.Appearance.addChangeListener.mockImplementation((listener) => {
      listeners.push(listener);
    });

    render(
      <DashProvider
        defaultTheme="light"
        disableAutoThemeChange
        onThemeChange={onThemeChange}
      />
    );

    colorScheme = "dark";
    act(() => {
      listeners.forEach((listener) => listener(colorScheme));
    });

    expect(onThemeChange).not.toBeCalled();
  });

  it("should not react to useColorScheme changes if themes are non-standard", () => {
    const { DashProvider } = createStyles({
      ...stylesConfig,
      themes: { lightDark: {}, ...stylesConfig.themes },
    });
    const onThemeChange = jest.fn();
    jest.spyOn(RN.Appearance, "addChangeListener");
    const listeners: any[] = [];
    // @ts-expect-error
    RN.Appearance.addChangeListener.mockImplementation((listener) => {
      listeners.push(listener);
    });

    render(<DashProvider onThemeChange={onThemeChange} />);

    colorScheme = "dark";
    act(() => {
      listeners.forEach((listener) => listener(colorScheme));
    });

    expect(onThemeChange).not.toBeCalled();
  });
});

describe("compileStyles()", () => {
  it("should return empty object for null values", () => {
    expect(compileStyles(null, {})).toEqual({});
  });
});

let colorScheme: "light" | "dark" | null | undefined = "light";

beforeEach(() => {
  jest.spyOn(RN.Appearance, "getColorScheme");
  jest.spyOn(RN, "useColorScheme");
  // @ts-expect-error
  RN.Appearance.getColorScheme.mockImplementation(() => colorScheme);
});

afterEach(() => {
  colorScheme = "light";
});
