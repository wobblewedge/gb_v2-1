import React from "react";
import { Box, Text, Flex } from "@modulz/design-system";

const LoadingScreen = () => (
  <GlobalContainer
    css={{
      alignItems: "center",
      backgroundColor: "$loContrast",
      justifyContent: "center",
    }}
  >
    <Box css={{ mb: "10vh", userSelect: "none" }}>
      <Text size="2" css={{ color: "$slate9" }}>
        Loading…
      </Text>
    </Box>
  </GlobalContainer>
);

const GlobalContainer = (props: React.ComponentProps<typeof Flex>) => {
  return (
    <Flex
      {...props}
      css={{
        position: "relative",
        minWidth: 320,
        minHeight: "100vh",
        flexDirection: "column",
        backgroundColor: "$gray1",

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

export default LoadingScreen;
