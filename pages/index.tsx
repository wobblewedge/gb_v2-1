import type { Musing } from "../db/types";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Container,
  Text,
  Heading,
  Grid,
  TextField,
} from "@modulz/design-system";
import { GlobalContainer } from "../components/GlobalContainer";
import { LoadingScreen } from "../components/LoadingScreen";

export default function Musings() {
  const [allMusings, setAllMusings] = useState<Array<Musing> | undefined>(
    undefined
  );
  const [filteredMusings, setFilteredMusings] = useState<
    Array<Musing> | undefined
  >(undefined);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/musings")
      .then((res) => res.json())
      .then((data) => {
        setAllMusings(data.musings);
        setFilteredMusings(data.musings);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (search === "") {
      setFilteredMusings(allMusings);
    } else {
      setFilteredMusings(
        allMusings?.filter(
          (m) =>
            m.title?.toLowerCase().includes(search?.toLowerCase()) ||
            m.musing?.toLowerCase().includes(search?.toLowerCase())
        )
      );
    }
  }, [search]);

  if (filteredMusings === undefined) {
    return <LoadingScreen />;
  } else {
    return (
      <GlobalContainer>
        <Container size="2" css={{ py: "$6" }}>
          <Box
            css={{
              p: "$4",
            }}
          >
            <TextField
              size="2"
              value={search}
              placeholder="Find something tasty"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          <Grid
            css={{
              columnGap: "$5",
              rowGap: "$5",
              gridTemplateColumns: "repeat(3, 1fr)",
            }}
          >
            {filteredMusings.length === 0 && <Box>Oops!</Box>}
            {filteredMusings.map((m) => (
              <Card key={m.id}>
                <Box css={{ p: "$4" }}>
                  <Box>
                    <Heading>{m.title}</Heading>
                  </Box>
                  <Box css={{ mt: "$2", my: "$1" }}>
                    <Text>{m.musing}</Text>
                  </Box>
                </Box>
              </Card>
            ))}
          </Grid>
        </Container>
      </GlobalContainer>
    );
  }
}
