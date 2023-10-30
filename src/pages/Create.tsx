import Button from "@mui/joy/Button";
import "./Create.css";
import { useNavigate } from "react-router-dom";

import DataBase from "../utils/db";
import { List } from "@mui/joy";
import CreateItem from "../controls/CreateItem";
import { ReactElement, ReactNode, useEffect, useState } from "react";

async function createItemList(db: DataBase) {
  const createItems = await db.getAllItems();
  const listItems = createItems.map((item) => {
    return (
      <CreateItem
        key={item.id}
        category="A"
        name={item.name}
        onEdit={(id) => {
          console.log("EDIT", id, item.id);
        }}
        onTrash={(id) => {
          console.log("TRASH", id, item.id);
        }}
      ></CreateItem>
    );
  });

  return <List>{listItems}</List>;
}

function Create(props: { database: DataBase }) {
  const navigate = useNavigate();
  const handleClickBack = () => navigate("/");
  const [itemList, setItemList] = useState(<></>);

  const updateItemList = async () => {
    const items = await createItemList(props.database);
    setItemList(items);
  };

  useEffect(() => {
    updateItemList();
    return () => {};
  }, []);

  return (
    <div className="Create">
      Create
      {itemList}
      <Button onClick={handleClickBack}>Back</Button>
    </div>
  );
}

export default Create;
