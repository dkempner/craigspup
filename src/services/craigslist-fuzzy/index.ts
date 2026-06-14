import { Client } from "../node-craigslist";

export interface FuzzySearchItem {
  query: string;
  city: string;
  hasPic: boolean;
}

export const fuzzySearch = async (queries: FuzzySearchItem[]) => {
  const final = [];
  const distinct = {};

  await Promise.all(
    queries.map(
      (q) =>
        new Promise((resolve) => {
          const client = new Client({ city: q.city });
          client.search({ hasPic: q.hasPic }, q.query).then((list) => {
            list.forEach((x) => {
              if (distinct[x.pid]) return;
              distinct[x.pid] = true;
              final.push(x);
            });
            resolve(null);
          }).catch(() => resolve(null));
        })
    )
  );

  return final;
};
