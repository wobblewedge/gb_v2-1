import { Box, Text } from "@modulz/design-system";
import { GlobalContainer } from "./GlobalContainer";

export const LoadingScreen = () => (
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
