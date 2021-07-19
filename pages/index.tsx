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
  Flex,
} from "@modulz/design-system";
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
  const [createNewMusing, setCreateNewMusing] = useState(false);
  const [search, setSearch] = useState("");
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    fetchMusings().then(({ musings }) => {
      const shuffled = shuffle(musings);
      setAllMusings(shuffled);
      setFilteredMusings(shuffled);
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
        mutateMusing(m)
      );
    }
  };

  const post = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWaiting(true);
    const formInputs: IFormInputs = event.currentTarget.elements;
    const { title, musing } = formInputs;

    if (title?.value && musing?.value) {
      newMusing({ title: title.value, musing: musing.value }).then((m) =>
        addNewMusing(m)
      );
    }
  };

  const mutateMusing = (musingToUpdate: Musing) => {
    const newState = JSON.parse(JSON.stringify(allMusings));
    const index = newState.findIndex((x: Musing) => x.id === musingToUpdate.id);
    newState[index].title = musingToUpdate.title;
    newState[index].musing = musingToUpdate.musing;
    resetState(newState);
  };

  const addNewMusing = (newMusing: Musing) => {
    const newState: Musing[] = JSON.parse(JSON.stringify(allMusings));
    newState.unshift(newMusing);
    resetState(newState);
  };

  const resetState = (newState: Musing[]) => {
    setAllMusings(newState);
    setFilteredMusings(newState);
    setWaiting(false);
    setSelectedMusing(undefined);
    setEditselectedMusing(false);
    setCreateNewMusing(false);
    setSearch("");
  };

  if (filteredMusings === undefined) {
    return <LoadingScreen />;
  } else {
    return (
      <>
        <GlobalContainer>
          <Container size="2" css={{ py: "$6" }}>
            <Box>
              <TextField
                type="search"
                size="2"
                value={search}
                placeholder="Find something tasty"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Flex css={{ mt: "$2", justifyContent: "space-between" }}>
                <Button
                  size="2"
                  css={{ mr: " $7" }}
                  onClick={() => {
                    if (allMusings) {
                      const shuffled = shuffle(
                        JSON.parse(JSON.stringify(allMusings))
                      );
                      setAllMusings(shuffled);
                      setFilteredMusings(shuffled);
                    }
                  }}
                >
                  Shuffle
                </Button>
                <Button
                  css={{ ml: " $7" }}
                  size="2"
                  variant="blue"
                  onClick={() => setCreateNewMusing(true)}
                >
                  New musing
                </Button>
              </Flex>
            </Box>

            {filteredMusings.length === 0 && (
              <Box css={{ mt: "$4" }}>
                <Text size="3" css={{ color: "$slate9", pl: "$1" }}>
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
                  mt: "$2",
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
            <DialogContent css={{ width: 400, maxWidth: "90vw" }}>
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
                  <Box css={{ mt: "$2" }}>
                    <Text css={{ color: theme.colors.gray9 }} size="1">
                      {selectedMusing?.id}
                    </Text>
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
                        size="2"
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
        {createNewMusing && (
          <Dialog
            open={createNewMusing}
            onOpenChange={() => {
              setCreateNewMusing(false);
            }}
          >
            <DialogContent css={{ width: 400, maxWidth: "90vw" }}>
              <form onSubmit={post}>
                <Box css={{ p: "$4" }}>
                  <Box>
                    <TextField
                      autoFocus
                      name="title"
                      size="2"
                      placeholder="Title"
                    />
                  </Box>
                  <Box css={{ mt: "$2", my: "$1" }}>
                    <TextArea size="2" name="musing" placeholder="Musing" />
                  </Box>
                  <Box css={{ mt: "$2" }}>
                    <Button type="submit" disabled={waiting}>
                      Save
                    </Button>
                  </Box>
                </Box>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }
}

function shuffle(array: Musing[]) {
  let currentIndex = array.length,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const GlobalContainer = (props: React.ComponentProps<typeof Flex>) => {
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
