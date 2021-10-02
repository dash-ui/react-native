import { createStyles } from "./index";

describe("styles()", () => {
  const { styles } = createStyles({
    tokens: {
      spacing: [1, 2, 3, 4],
    },
  });

  it("should pass", () => {
    const style = styles({
      default: `
        color: red;
      `,
    });

    expect(style("default")).toMatchSnapshot();
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
