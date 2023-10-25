import "./Main.css";

import { useNavigate } from "react-router-dom";
import DataBase from "../utils/db";

import Button from "@mui/joy/Button";
import List from "@mui/joy/List";

import TripItem from "../controls/TripItem";

type MainProps = {
  database: DataBase;
};

function createTripList(db: DataBase) {
  return (
    <List>
      <TripItem name="Ala"></TripItem>
      <TripItem name="Ola"></TripItem>
      <TripItem name="Ula"></TripItem>
      <TripItem name="Ela"></TripItem>
    </List>
  );
}

function Main(props: MainProps) {
  const navigate = useNavigate();
  const handleClickCreate = () => navigate("/create");
  const handleClickTrash = () => navigate("/trash");
  return (
    <div className="Main">
      Main
      <Button onClick={handleClickCreate}>Create</Button>
      {createTripList(props.database)}
      <Button onClick={handleClickTrash}>Trash</Button>
    </div>
  );
}

export default Main;
