import { render } from "@testing-library/react-native";
import * as React from "react";
import * as RN from "react-native";
import type { TextStyle, ViewStyle, ImageStyle } from "react-native";
import "@testing-library/jest-native/extend-expect";
import { createStyles } from "./index";

describe("styles()", () => {
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
    const style = styles({
      default: `
        color: red;
      `,
    });

    expect(style()).toEqual({ color: "red" });
  });

  it("should do nothing with object styles", () => {
    const style = styles({
      default: { color: "red" },
    });

    expect(style()).toEqual({ color: "red" });
  });

  it("should convert string styles to object styles returned by functions", () => {
    const style = styles({
      default: (t) => `color: ${t.colors.primary}`,
    });

    expect(style()).toEqual({ color: "red" });
  });

  it("should do nothing with object styles returned by functions", () => {
    const style = styles({
      default: (t) => ({ color: t.colors.primary }),
    });

    expect(style()).toEqual({ color: "red" });
  });

  it("should avoid loop with single string argument", () => {
    const style = styles({
      default: (t) => ({ color: t.colors.primary }),
      blue: "color: blue",
    });

    expect(style("blue")).toEqual({ color: "blue" });
  });

  it("should freeze object when not in production", () => {
    const style = styles({
      default: (t) => ({ color: t.colors.primary }),
    });
    const output = style();
    // @ts-expect-error
    expect(() => (output.color = "blue")).toThrow();
  });

  it("should not freeze object in production", () => {
    process.env.NODE_ENV = "production";
    const style = styles({
      default: (t) => ({ color: t.colors.primary }),
    });
    const output = style();
    // @ts-expect-error
    output.color = "blue";
    expect(output).toEqual({ color: "blue" });
    process.env.NODE_ENV = "test";
  });

  it("should flatten styles in order called", () => {
    const style = styles({
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
    const style = styles({
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
    const style = styles({
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
    const style = styles({
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
    const style = styles({
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
});

describe("styles() themes", () => {
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

  it("should be the light theme by default", () => {
    const { styles } = createStyles(stylesConfig);
    const style = styles({
      default: (t) => ({ color: t.colors.primary }),
    });

    expect(style()).toEqual({ color: "white" });
  });

  it("should be the dark theme", () => {
    colorScheme = "dark";
    const { styles } = createStyles(stylesConfig);
    const style = styles({
      default: (t) => ({ color: t.colors.primary }),
    });

    expect(style()).toEqual({ color: "black" });
  });

  it("should be the light theme w/ no-preference", () => {
    colorScheme = "no-preference";
    const { styles } = createStyles(stylesConfig);
    const style = styles({
      default: (t) => ({ color: t.colors.primary }),
    });

    expect(style()).toEqual({ color: "white" });
  });

  it("should be the dark theme w/ no-preference", () => {
    colorScheme = "no-preference";
    const { styles } = createStyles({
      ...stylesConfig,
      themes: {
        dark: stylesConfig.themes.dark,
        light: {},
      },
    });
    const style = styles({
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
    colorScheme = "no-preference";
    const { styles } = createStyles(stylesConfig);
    const style = styles.one((t) => ({ color: t.colors.primary }));
    expect(style()).toEqual({ color: "white" });
  });

  it("should be the dark theme w/ no-preference", () => {
    colorScheme = "no-preference";
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
    colorScheme = "no-preference";
    const { styles } = createStyles(stylesConfig);
    const style = styles.cls((t) => ({ color: t.colors.primary }));
    expect(style).toEqual({ color: "white" });
  });

  it("should be the dark theme w/ no-preference", () => {
    colorScheme = "no-preference";
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
    // @ts-expect-error
    expect(() => (output.color = "blue")).toThrow();
  });

  it("should not freeze object in production", () => {
    process.env.NODE_ENV = "production";
    const style = styles.lazy((color: "red" | "blue") => ({ color }));
    const output = style("red");
    // @ts-expect-error
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
    colorScheme = "no-preference";
    const { styles } = createStyles(stylesConfig);
    const style = styles.lazy(
      (color: keyof typeof styles.tokens.light.colors) => (t) => ({
        color: t.colors[color],
      })
    );
    expect(style("primary")).toEqual({ color: "white" });
  });

  it("should be the dark theme w/ no-preference", () => {
    colorScheme = "no-preference";
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
});

describe("styled.View()", () => {
  const { styled } = createStyles({
    tokens: {
      colors: {
        primary: "white",
        secondary: "black",
      },
    },
  });

  it("should add default styles w/ template syntax", () => {
    const StyledView = styled.View`
      background-color: white;
    `;
    const view = render(<StyledView testID="test" />);
    expect(view.getByTestId("test")).toHaveStyle({
      backgroundColor: "white",
    });
  });

  it("should add default styles w/ string syntax", () => {
    const StyledView = styled.View(`
      background-color: white;
    `);
    const view = render(<StyledView testID="test" />);
    expect(view.getByTestId("test")).toHaveStyle({
      backgroundColor: "white",
    });
  });

  it("should add default styles w/ object syntax", () => {
    const StyledView = styled.View({
      backgroundColor: "white",
    });
    const view = render(<StyledView testID="test" />);
    expect(view.getByTestId("test")).toHaveStyle({
      backgroundColor: "white",
    });
  });

  it("should add default styles w/ function syntax", () => {
    const StyledView = styled.View(
      ({ colors }) => `
      background-color: ${colors.primary};
    `
    );
    const view = render(<StyledView testID="test" />);
    expect(view.getByTestId("test")).toHaveStyle({
      backgroundColor: "white",
    });
  });
});

describe("<DashProvider>", () => {
  it("should pass", () => {
    expect(true).toBeTruthy();
  });
});

describe("useDash()", () => {
  it("should pass", () => {
    expect(true).toBeTruthy();
  });
});

let colorScheme: "light" | "dark" | "no-preference" | null | undefined =
  "light";

beforeEach(() => {
  jest.spyOn(RN.Appearance, "getColorScheme");
  jest.spyOn(RN, "useColorScheme");
  // @ts-expect-error
  RN.Appearance.getColorScheme.mockImplementation(() => colorScheme);
  // @ts-expect-error
  RN.useColorScheme.mockImplementation(() => colorScheme);
});

afterEach(() => {
  colorScheme = "light";
});
