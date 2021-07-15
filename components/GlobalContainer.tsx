import { Flex } from "@modulz/design-system";

export const GlobalContainer = (props: React.ComponentProps<typeof Flex>) => {
  return (
    <Flex
      {...props}
      css={{
        position: "relative",
        minWidth: 320,
        minHeight: "100vh",
        flexDirection: "column",
        backgroundColor: "$gray4",

        color: "hiContrast",
        cursor: "default",
        fontFamily: "$untitled",
        overflowWrap: "break-word",
        WebkitFontSmoothing: "antialiased" as any,
        MozOsxFontSmoothing: "grayscale" as any,
        "::selection": {
          backgroundColor: "$blue5",
        },
        ...(props.css as any),
      }}
    />
  );
};
