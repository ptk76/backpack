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

async function createTripList(db: DataBase) {
  const trips = await db.getTrips();
  const tripList = trips.map((trip) => {
    return <TripItem key={trip.id} name={trip.name}></TripItem>;
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
    await props.database.addTrip("Ala ma kota");
  };
  const [trpiList, setTripList] = useState(<></>);

  const updateTripList = async () => {
    const items = await createTripList(props.database);
    setTripList(items);
  };

  useEffect(() => {
    updateTripList();
    return () => {};
  }, [trpiList]);

  return (
    <div className="Main">
      Main
      <Button onClick={handleClickCreate}>Create</Button>
      {trpiList}
      <Button onClick={onClickNewTrip}>New trip</Button>
      <Button onClick={handleClickTrash}>Trash</Button>
      <Button onClick={handleClickFactory}>Factory reset</Button>
    </div>
  );
}

export default Main;
