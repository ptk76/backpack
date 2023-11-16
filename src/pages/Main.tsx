import "./Main.css";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import DataBase from "../utils/db";

import Button from "@mui/joy/Button";
import List from "@mui/joy/List";

import TripItem from "../controls/TripItem";

type MainProps = {
  database: DataBase;
};

async function createTripList(db: DataBase, navigate: any) {
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
    DataBase.delete();
  };
  const onClickNewTrip = async () => {
    await props.database.createTrip("Ala ma kota");
  };
  const [tripList, setTripList] = useState(<></>);

  const updateTripList = async () => {
    const items = await createTripList(props.database, navigate);
    setTripList(items);
  };

  useEffect(() => {
    updateTripList();
    return () => {};
  }, [tripList]);

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
