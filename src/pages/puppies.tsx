/* eslint-disable react/jsx-no-target-blank, jsx-a11y/label-has-associated-control */
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
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
  const router = useRouter();
  const [breedsInput, setBreedsInput] = useState(breeds.join(", "));
  const [citiesInput, setCitiesInput] = useState(cities.join(", "));
  const title = `${breeds.join(", ")} in ${cities.join(", ")}`;

  const handleSearch = (e) => {
    e.preventDefault();
    const b = breedsInput.split(",").map((s) => s.trim()).filter(Boolean).join(",");
    const c = citiesInput.split(",").map((s) => s.trim()).filter(Boolean).join(",");
    router.push(`/puppies?breeds=${b}&cities=${c}`);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="container mx-auto px-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-2 my-6 items-end">
          <label className="flex flex-col text-sm font-medium gap-1">
            Search terms
            <input
              className="border rounded px-3 py-2 font-normal"
              value={breedsInput}
              onChange={(e) => setBreedsInput(e.target.value)}
              placeholder="puppy, golden retriever, ..."
            />
          </label>
          <label className="flex flex-col text-sm font-medium gap-1">
            Cities
            <input
              className="border rounded px-3 py-2 font-normal"
              value={citiesInput}
              onChange={(e) => setCitiesInput(e.target.value)}
              placeholder="sandiego, losangeles, ..."
            />
          </label>
          <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium">
            Search
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {searchResults.map((r) => (
            <div className="w-100 p-2" key={r.pid}>
              <a target="_blank" href={r.url} className="">
                <div className="text-center">
                  <h2>{`${r.title} - ${r.price} ${r.location}`}</h2>
                  <h3>{r.postedAt ? new Date(r.postedAt).toLocaleDateString("en-US") : ""}</h3>
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
