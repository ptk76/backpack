import "./Main.css";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Button, Input, List } from "@mui/joy";

import TripItem from "../controls/TripItem";
import DataBaseFacade from "../utils/db_facade";

type MainProps = {
  db: DataBaseFacade;
};

type NewTripNameProps = {
  add: (name: string) => void;
  cancel: () => void;
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

function NewTripName(props: NewTripNameProps) {
  const [newTripName, setNewTripName] = useState("");
  const newTripNameChanged: ChangeEventHandler<HTMLInputElement> = (event) => {
    console.log(event.target.value);
    setNewTripName(event.target.value);
  };

  return (
    <Input
      onChange={newTripNameChanged}
      placeholder="Type a trip's name"
      endDecorator={
        <div>
          <Button
            onClick={() => {
              props.add(newTripName);
            }}
          >
            Add
          </Button>
          <Button onClick={props.cancel}>Cancel</Button>
        </div>
      }
    />
  );
}

function Main(props: MainProps) {
  console.log("Main");

  const navigate = useNavigate();
  const handleClickCreate = () => navigate("/create");
  const handleClickTrash = () => navigate("/trash");
  const handleClickFactory = () => {
    props.db.delete();
  };

  const [showNewTripName, setShowNewTripName] = useState(false);

  const addNewTrip = async (name: string) => {
    setShowNewTripName(false);
    await props.db.createTrip(name);
    updateTripList();
  };

  const cancelNewTrip = () => {
    setShowNewTripName(false);
  };

  const onClickNewTrip = async () => {
    setShowNewTripName(true);
  };

  const [tripList, setTripList] = useState(<></>);

  const updateTripList = useCallback(async () => {
    console.log("callback");
    const items = await createTripList(props.db, navigate);
    setTripList(items);
  }, [props.db, navigate]);

  useEffect(() => {
    console.log("render");
    updateTripList();
    return () => {};
  }, [updateTripList]);

  return (
    <div className="Main">
      Main
      <Button onClick={handleClickCreate}>Create</Button>
      {tripList}
      {showNewTripName && (
        <NewTripName add={addNewTrip} cancel={cancelNewTrip} />
      )}
      <Button onClick={onClickNewTrip}>New trip</Button>
      <Button onClick={handleClickTrash}>Trash</Button>
      <Button onClick={handleClickFactory}>Factory reset</Button>
    </div>
  );
}

export default Main;
