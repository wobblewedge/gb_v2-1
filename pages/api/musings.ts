import type { NextApiRequest, NextApiResponse } from "next";
import {
  getAllMusings,
  createNewMusing,
  updateMusing,
  deleteMusing,
} from "../../db/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        const musings = await getAllMusings();
        res.status(200).json({ musings });
        return;
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Unable to fetch musings" });
        return;
      }
    case "POST":
      try {
        const { title, musing } = req.body;
        if (!title || !musing) {
          throw new Error("Missing required props in body of request");
        }
        res.status(200).json({ musing: await createNewMusing(title, musing) });
        return;
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Unable to create new musing" });
        return;
      }
    case "PUT":
      try {
        const { id, title, musing } = req.body;
        if (!id || !title || !musing) {
          throw new Error("Missing required props in body of request");
        }
        res.status(200).json({ musing: await updateMusing(id, title, musing) });
        return;
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Unable to update musing" });
        return;
      }
    case "DELETE":
      try {
        const { id } = req.body;
        if (!id) {
          throw new Error("Missing required props in body of request");
        }

        await deleteMusing(id);
        res.status(200).end();
        return;
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Unable to delete musing" });
        return;
      }
    default:
      res.status(405).json({ message: "Invalid request method" });
  }
}
