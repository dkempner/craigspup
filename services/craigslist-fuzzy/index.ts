/* eslint-disable no-restricted-syntax */
import { Client } from "../node-craigslist";

export interface FuzzySearchItem {
  query: string;
}

export const fuzzySearch = async (queries: FuzzySearchItem[]) => {
  const final = [];
  const greaterThanDate = new Date();
  greaterThanDate.setDate(greaterThanDate.getDate() - 1);

  const client = new Client({
    city: "sandiego",
  });

  const distinct = {};

  for await (const q of queries) {
    const list = await client.search({}, q.query);
    const filtered = list.filter((x) => {
      if (distinct[x.pid]) return false;

      distinct[x.pid] = true;
      const thisDate = new Date(x.date);
      return thisDate > greaterThanDate;
    });

    for await (const f of filtered) {
      const detail = await client.details(f);
      final.push(detail);
    }
  }

  return final.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );
};
