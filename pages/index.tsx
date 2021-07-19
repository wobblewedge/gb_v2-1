import type { Musing } from "../db/types";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Container,
  Text,
  Heading,
  TextField,
  theme,
  Dialog,
  DialogContent,
  TextArea,
  Button,
} from "@modulz/design-system";
import { GlobalContainer } from "../components/GlobalContainer";
import { LoadingScreen } from "../components/LoadingScreen";
import { fetchMusings, updateMusing, newMusing } from "../db/client";

interface IFormInputs extends HTMLFormControlsCollection {
  title?: HTMLInputElement;
  musing?: HTMLInputElement;
}

export default function Musings() {
  const [allMusings, setAllMusings] = useState<Array<Musing> | undefined>(
    undefined
  );
  const [filteredMusings, setFilteredMusings] = useState<
    Array<Musing> | undefined
  >(undefined);
  const [selectedMusing, setSelectedMusing] = useState<Musing | undefined>(
    undefined
  );
  const [editSelectedMusing, setEditselectedMusing] = useState(false);
  const [search, setSearch] = useState("");
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    fetchMusings().then(({ musings }) => {
      setAllMusings(musings);
      setFilteredMusings(musings);
    });
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

  const put = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWaiting(true);
    const formInputs: IFormInputs = event.currentTarget.elements;
    const { title, musing } = formInputs;
    const id = selectedMusing?.id;

    if (id && title?.value && musing?.value) {
      updateMusing({ id, title: title.value, musing: musing.value }).then((m) =>
        mutateState(m)
      );
    }
  };

  const post = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formInputs: IFormInputs = event.currentTarget.elements;
    const { title, musing } = formInputs;

    if (title?.value && musing?.value) {
      newMusing({ title: title.value, musing: musing.value })
        .then((m) => mutateState(m))
        .then();
    }
  };

  const mutateState = (musingToUpdate: Musing) => {
    const newState = JSON.parse(JSON.stringify(allMusings));
    const index = newState.findIndex((x: Musing) => x.id === musingToUpdate.id);
    newState[index].title = musingToUpdate.title;
    newState[index].musing = musingToUpdate.musing;
    resetState(newState);
  };

  const resetState = (newState: Musing[]) => {
    setAllMusings(newState);
    setFilteredMusings(newState);
    setWaiting(false);
    setSelectedMusing(undefined);
    setEditselectedMusing(false);
    setSearch("");
  };

  if (filteredMusings === undefined) {
    return <LoadingScreen />;
  } else {
    return (
      <>
        <GlobalContainer>
          <Container size="2" css={{ py: "$6" }}>
            <Box
              css={{
                p: "$2",
              }}
            >
              <TextField
                size="2"
                value={search}
                placeholder="Find something tasty"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>

            {filteredMusings.length === 0 && (
              <Box css={{ width: "100vw", mt: "$5" }}>
                <Text size="3" css={{ color: "$slate9", pl: "$4" }}>
                  Nothing here, friend
                </Text>
              </Box>
            )}
            {filteredMusings.map((m) => (
              <Card
                onClick={() => setSelectedMusing(m)}
                onKeyPress={() => setSelectedMusing(m)}
                key={m.id}
                tabIndex={0}
                css={{
                  my: "$3",
                  "&:hover, &:focus": {
                    outline: `1px solid ${theme.colors.blue9}`,
                  },
                }}
              >
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
          </Container>
        </GlobalContainer>
        {selectedMusing && (
          <Dialog
            open={selectedMusing !== undefined}
            onOpenChange={() => {
              setEditselectedMusing(false);
              setSelectedMusing(undefined);
            }}
          >
            <DialogContent css={{ minWidth: 400 }}>
              {editSelectedMusing !== true ? (
                <Box css={{ p: "$4" }}>
                  <Box>
                    <Heading>{selectedMusing?.title}</Heading>
                  </Box>
                  <Box css={{ mt: "$2", my: "$1" }}>
                    <Text>{selectedMusing?.musing}</Text>
                  </Box>
                  <Box css={{ mt: "$2" }}>
                    <Button onClick={() => setEditselectedMusing(true)}>
                      Edit
                    </Button>
                  </Box>
                </Box>
              ) : (
                <form onSubmit={put}>
                  <Box css={{ p: "$4" }}>
                    <Box>
                      <TextField
                        autoFocus
                        name="title"
                        size="2"
                        defaultValue={
                          selectedMusing?.title !== null
                            ? selectedMusing.title
                            : ""
                        }
                        placeholder="Title"
                      />
                    </Box>
                    <Box css={{ mt: "$2", my: "$1" }}>
                      <TextArea
                        name="musing"
                        defaultValue={selectedMusing?.musing}
                        placeholder="Musing"
                      />
                    </Box>
                    <Box css={{ mt: "$2" }}>
                      <Button type="submit" disabled={waiting}>
                        Save
                      </Button>
                    </Box>
                  </Box>
                </form>
              )}
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }
}
