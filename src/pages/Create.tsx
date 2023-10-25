import Button from "@mui/joy/Button";
import "./Create.css";
import { useNavigate } from "react-router-dom";

import DataBase from "../utils/db";
import { List } from "@mui/joy";
import CreateItem from "../controls/CreateItem";

function createItemList(db: DataBase) {
  const createItems = db.getAllPackingItems();
  const listItems = createItems.map((item) => {
    return (
      <CreateItem
        id={item.id}
        category="A"
        name={item.name}
        onEdit={(id) => {
          console.log(id, item.id);
        }}
        onTrash={(id) => {
          console.log(id, item.id);
        }}
      ></CreateItem>
    );
  });

  return <List>{listItems}</List>;
}

function Create(props: { database: DataBase }) {
  const navigate = useNavigate();
  const handleClickBack = () => navigate("/");
  return (
    <div className="Create">
      Create
      {createItemList(props.database)}
      <Button onClick={handleClickBack}>Back</Button>
    </div>
  );
}

export default Create;
