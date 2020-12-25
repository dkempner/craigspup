// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from "../../services/node-craigslist";

export default async (req, res) => {
  const client = new Client({
    city: "sandiego",
  });
  const puppySearch = await client.search({}, "puppy");

  const result = [];

  for (let i = 0; i < 5; i++) {
    // eslint-disable-next-line no-await-in-loop
    const detail = await client.details(puppySearch[i]);
    result.push(detail);
  }

  res.json(result);
};
