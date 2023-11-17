import "./Main.css";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Button from "@mui/joy/Button";
import List from "@mui/joy/List";

import TripItem from "../controls/TripItem";
import DataBaseFacade from "../utils/db_facade";

type MainProps = {
  db: DataBaseFacade;
};

async function createTripList(db: DataBaseFacade, navigate: any) {
  const trips = await db.getTrips();
  const tripList = trips.map((trip) => {
    return (
      <TripItem
        key={trip.id}
        name={trip.name}
        onClick={() => {
          navigate("packing", { state: { tripId: trip.id } });
        }}
      ></TripItem>
    );
  });

  return <List>{tripList}</List>;
}

function Main(props: MainProps) {
  const navigate = useNavigate();
  const handleClickCreate = () => navigate("/create");
  const handleClickTrash = () => navigate("/trash");
  const handleClickFactory = () => {
    props.db.delete();
  };
  const onClickNewTrip = async () => {
    await props.db.createTrip("Ala ma kota");
    updateTripList();
  };
  const [tripList, setTripList] = useState(<></>);

  const updateTripList = async () => {
    const items = await createTripList(props.db, navigate);
    setTripList(items);
  };

  useEffect(() => {
    updateTripList();
    return () => {};
  }, []);

  return (
    <div className="Main">
      Main
      <Button onClick={handleClickCreate}>Create</Button>
      {tripList}
      <Button onClick={onClickNewTrip}>New trip</Button>
      <Button onClick={handleClickTrash}>Trash</Button>
      <Button onClick={handleClickFactory}>Factory reset</Button>
    </div>
  );
}

export default Main;
