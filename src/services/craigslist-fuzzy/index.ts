/* eslint-disable no-restricted-syntax */
import { Client } from "../node-craigslist";

export interface FuzzySearchItem {
  query: string;
  city: string;
  hasPic: boolean;
}

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
            const { location, price } = f;
            return client.details(f).then((detail) => {
              final.push({ ...detail, location, price });
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
