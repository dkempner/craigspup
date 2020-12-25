// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from "../../services/node-craigslist";

export default async (req, res) => {
  const client = new Client({
    city: "sandiego",
  });
  const puppySearch = await client.search({}, "puppy");

  res.json(puppySearch);
};
