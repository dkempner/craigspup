import { GetServerSideProps } from "next";
import { fuzzySearch } from "../services/craigslist-fuzzy";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const breeds = (context.query.breeds as string | undefined)?.split(",") || [
    "",
  ];
  const cities = ["sandiego", "orangecounty", "losangeles"];
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
    },
  };
};

const Puppies = ({ searchResults }) => (
  <div className="grid grid-cols-4 gap-10">
    {searchResults.map((r) => (
      <div className="w-100 border border-dashed border-gray" key={r.pid}>
        <a href={r.url} className="">
          <h2>{`${r.title} - ${r.price} ${r.location}`}</h2>
          <h3>{new Date(r.postedAt).toLocaleDateString("en-US")}</h3>
          <img
            className="place-self-center"
            src={(r.images || [""])[0]}
            alt=""
          />
        </a>
      </div>
    ))}
  </div>
);

export default Puppies;
