// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { fuzzySearch } from "../../services/craigslist-fuzzy";

export default async (req, res) => {
  const searchResults = await fuzzySearch([
    { query: "puppy" },
    { query: "puppies" },
  ]);

  console.log(searchResults);

  res.json(searchResults);
};
