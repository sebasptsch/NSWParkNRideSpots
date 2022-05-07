import axios from "axios";
import moment from "moment";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { Locations, ParkingData } from "../types";

const BooleanTag = (props: {
  label: { trueLabel: string; falseLabel: string };
  boolean: boolean;
}) => (
  <span className={`tag ${props.boolean ? "is-success" : "is-danger"}`}>
    {props.boolean ? props.label.trueLabel : props.label.falseLabel}
  </span>
);

const ParkingInfo = ({
  parkingData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (!parkingData) return <>No</>;
  return (
    <>
      <h1 className="title has-text-centered">{parkingData.facility_name}</h1>
      <h2 className="subtitle">
        Here are the details from <b>{parkingData.facility_name}</b> last
        updated <b>{moment(parkingData.MessageDate).fromNow()}</b>.
      </h2>

      {parkingData.zones.map((zone) => (
        <div className="box" key={zone.zone_id}>
          <b>{zone.zone_name}</b>
          <p>{zone.spots} spots available.</p>
          <p>
            Gate{" "}
            <BooleanTag
              boolean={!!zone.occupancy.open_gate}
              label={{ trueLabel: "Open", falseLabel: "Closed" }}
            />
          </p>
        </div>
      ))}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const url = `https://api.transport.nsw.gov.au/v1/carpark`;
  const result = await axios.get<Locations>(url, {
    headers: {
      Authorization: `apikey ${process.env.TFNSW_KEY}`,
    },
  });
  const parking = Object.keys(result.data);
  return {
    paths: parking.map((parkingPlace) => ({ params: { id: parkingPlace } })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const url = `https://api.transport.nsw.gov.au/v1/carpark`;
  const id = params?.id;
  const result = await axios.get<ParkingData>(url, {
    headers: {
      Authorization: `apikey ${process.env.TFNSW_KEY}`,
    },
    params: {
      facility: id,
    },
  });
  const parkingData = result.data;
  return {
    props: {
      parkingData,
    },
    revalidate: 60,
  };
};

export default ParkingInfo;
