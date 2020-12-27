/* eslint-disable no-restricted-syntax */
import { Client } from "../node-craigslist";

export interface FuzzySearchItem {
  query: string;
  city: string;
  hasPic: boolean;
}

const cache = {};

export const fuzzySearch = async (queries: FuzzySearchItem[]) => {
  const final = [];
  const greaterThanDate = new Date();
  greaterThanDate.setDate(greaterThanDate.getDate() - 2);

  const distinct = {};

  const promises = queries.map(
    (q) =>
      new Promise((resolve) => {
        const client = new Client({
          city: q.city,
        });
        client.search({ hasPic: q.hasPic }, q.query).then((list) => {
          const filtered = list.filter((x) => {
            if (distinct[x.pid]) return false;

            distinct[x.pid] = true;
            const thisDate = new Date(x.date);
            return thisDate > greaterThanDate;
          });

          const detailPromises = filtered.map((f) => {
            const { location, price, pid } = f;
            if (cache[pid]) {
              final.push(cache[pid]);
              return Promise.resolve();
            }

            return client.details(f).then((detail) => {
              const toAdd = { ...detail, location, price };
              cache[pid] = toAdd;
              final.push(toAdd);
            });
          });

          Promise.all(detailPromises).then(resolve);
        });
      })
  );

  await Promise.all(promises);

  return final.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );
};
