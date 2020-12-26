import { GetServerSideProps } from "next";
import { fuzzySearch } from "../services/craigslist-fuzzy";

export const getServerSideProps: GetServerSideProps = async () => {
  const searchResults = await fuzzySearch([
    { query: "puppy", hasPic: true },
    { query: "puppies", hasPic: true },
  ]);

  return {
    props: {
      searchResults: JSON.parse(JSON.stringify(searchResults)),
    },
  };
};

const Puppies = ({ searchResults }) => (
  <ul>
    {searchResults.map((r) => (
      <li key={r.pid}>
        <a href={r.url}>
          <h2>
            {`${r.title} - ${r.price} ${r.location}`}
          </h2>
          <img src={(r.images || [""])[0]} alt="" />
        </a>
      </li>
    ))}
  </ul>
);

export default Puppies;
