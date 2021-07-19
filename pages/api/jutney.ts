import type { NextApiRequest, NextApiResponse } from "next";
import { getAllMusings } from "../../db/queries";
import { twiml } from "twilio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        const { MessagingResponse } = twiml;
        const jutney = new MessagingResponse();

        const allMusings = await getAllMusings();
        const { title, musing } =
          allMusings[Math.floor(Math.random() * allMusings.length)];

        const message = title ? `(${title}) ${musing}` : `${musing}`;
        jutney.message(message);
        res.writeHead(200, { "Content-Type": "text/xml" });
        res.end(jutney.toString());
        return;
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Jutney is tired" });
        return;
      }
    default:
      res.status(405).json({ message: "Invalid request method" });
  }
}
