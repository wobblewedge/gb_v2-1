import type { Musing } from "./types";

export const fetchMusings = () =>
  fetch("/api/musings")
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.error(err));

export const updateMusing = (musing: Musing) =>
  fetch("/api/musings", {
    method: "PUT",
    body: JSON.stringify(musing),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data.musing)
    .catch((err) => console.error(err));

export const newMusing = (musing: Partial<Musing>) =>
  fetch("/api/musings", {
    method: "POST",
    body: JSON.stringify(musing),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data.musing)
    .catch((err) => console.error(err));
