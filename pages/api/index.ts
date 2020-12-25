// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import craigslist from "node-craigslist";

export default async (req, res) => {
  const client = new craigslist.Client({
    city: "sandiego",
    nocache: true,
  });
  const puppySearch = await client.search(
    {
      secure: false,
    },
    "puppy"
  );

  res.send(puppySearch);
};
