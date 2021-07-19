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
        const musings = await getAllMusings();

        const { MessagingResponse } = twiml;
        const jutney = new MessagingResponse();
        jutney.message("The Robots are coming! Head for the hills!");
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
