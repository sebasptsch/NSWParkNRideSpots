import axios from "axios";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useState } from "react";

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const url = `https://api.transport.nsw.gov.au/v1/carpark`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `apikey ${process.env.TFNSW_KEY}`,
    },
  });
  const parkingData = res.data;
  const formatted = Object.keys(parkingData).map((key) => ({
    id: key,
    name: parkingData[key],
  }));
  return {
    props: { parkingData: formatted },
    revalidate: 60,
  };
};

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [results, setResults] = useState<{ id: string; name: any }[]>();
  return (
    <div>
      <h1 className="title has-text-centered">Park'n Ride Info</h1>
      <h2 className="subtitle">
        See how many spots are left at different park and ride locations.
      </h2>

      <input
        type="text"
        className="input"
        placeholder="Search"
        onChange={async (e) => {
          const { value } = e.currentTarget;
          const Fuse = (await import("fuse.js")).default;
          const fuse = new Fuse(props.parkingData, { keys: ["name"] });
          setResults(fuse.search(value).map((result) => result.item));
        }}
      />
      <br />
      <br />
      {results?.length
        ? results.map((parkingLocation) => (
            <Link href={`/${parkingLocation.id}`} key={parkingLocation.id}>
              <a className="box">{parkingLocation.name}</a>
            </Link>
          ))
        : props.parkingData.map((parkingLocation) => (
            <Link href={`/${parkingLocation.id}`} key={parkingLocation.id}>
              <a className="box">{parkingLocation.name}</a>
            </Link>
          ))}
    </div>
  );
};

export default Home;
