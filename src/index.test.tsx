import { render } from "@testing-library/react-native";
import * as React from "react";
import * as RN from "react-native";
import "@testing-library/jest-native/extend-expect";
import { createStyles } from "./index";

describe("styles()", () => {
  const { styles, styled } = createStyles({
    tokens: {
      spacing: [1, 2, 3, 4],
    } as const,
  });

  it("should pass", () => {
    const style = styles({
      default: `
        color: red;
      `,
      foo: {
        color: "blue",
      },
    });

    expect(style("default", "foo")).toMatchSnapshot();
  });

  it("should too pass", () => {
    const style = styles({
      default: ({ spacing }) => `
        margin: ${spacing[0]}px;
      `,
    });

    expect(style("default")).toMatchSnapshot();
  });

  it("should too pass 2", () => {
    const style = styles({
      default: ({ spacing }) => ({
        margin: spacing[0],
      }),
    });

    expect(style("default")).toMatchSnapshot();
  });

  it("should too pass 3", () => {
    const style = styles({
      default: ({ spacing }) => ({
        margin: spacing[0] + "px",
      }),
      other: {
        color: "blue",
      },
    });

    expect(style("default", "other")).toMatchSnapshot();
  });

  it("should also pass", () => {
    const StyledView = styled.View(({ spacing }) => ({
      margin: spacing[0],
    }));

    const view = render(
      <StyledView style="background-color: blue;" testID="foo" />
    );

    expect(view.getByTestId("foo")).toHaveStyle({
      backgroundColor: "blue",
      margin: 1,
    });
  });

  it("should also pass 3", () => {
    const StyledView = styled(RN.View, { backgroundColor: "blue" });
    const view = render(<StyledView testID="foo" />);

    expect(view.getByTestId("foo")).toHaveStyle({ backgroundColor: "blue" });
  });
});

describe("styles.one()", () => {
  const { styles } = createStyles({
    tokens: {
      spacing: [1, 2, 3, 4],
    },
  });

  it("should pass", () => {
    const style = styles.one`
      color: red;
    `;
    expect(style()).toMatchSnapshot();
  });

  it("should also pass", () => {
    const style = styles.one<RN.TextStyle>(() => ({
      color: "blue",
    }));

    expect(style()).toMatchSnapshot();
  });
});

describe("styles.cls()", () => {
  const { styles } = createStyles({
    tokens: {
      spacing: [1, 2, 3, 4],
    },
  });

  it("should pass", () => {
    const style = styles.cls`
      color: red;
    `;

    expect(style).toMatchSnapshot();
  });
});
