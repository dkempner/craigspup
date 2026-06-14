import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/puppies",
    permanent: false,
  },
});

export default function Index() {
  return null;
}
