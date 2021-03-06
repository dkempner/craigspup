/* eslint-disable react/jsx-no-target-blank */
import { GetServerSideProps } from "next";
import Head from "next/head";
import { fuzzySearch } from "../services/craigslist-fuzzy";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const breeds = (context.query.breeds as string | undefined)?.split(",") || [
    "puppy",
    "puppies",
  ];

  const cities = (context.query.cities as string | undefined)?.split(",") || [
    "sandiego",
    "orangecounty",
    "losangeles",
  ];

  const queries = [];

  breeds.forEach((breed) => {
    cities.forEach((city) => {
      queries.push({
        city,
        query: breed,
        hasPic: true,
      });
    });
  });

  const searchResults = await fuzzySearch(queries);

  return {
    props: {
      searchResults: JSON.parse(JSON.stringify(searchResults)),
      breeds,
      cities,
    },
  };
};

const Puppies = ({ searchResults, breeds, cities }) => {
  const title = `${breeds.join(", ")} in ${cities.join(", ")}`;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="container mx-auto">
        <div className="grid mb-8">
          <h1 className="place-self-center text-lg font-bold">{title}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {searchResults.map((r) => (
            <div className="w-100 p-2" key={r.pid}>
              <a target="_blank" href={r.url} className="">
                <div className="text-center">
                  <h2>{`${r.title} - ${r.price} ${r.location}`}</h2>
                  <h3>{new Date(r.postedAt).toLocaleDateString("en-US")}</h3>
                </div>
                <img
                  className="max-h-72 mx-auto"
                  src={(r.images || [""])[0]}
                  alt=""
                  loading="lazy"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Puppies;
