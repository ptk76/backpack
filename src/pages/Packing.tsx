import Button from "@mui/joy/Button";
import "./Packing.css";
import { useEffect, useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import DataBase from "../utils/db";
import Item from "../controls/Item";
import List from "@mui/joy/List";

async function createPackingList(db: DataBase, tripId: number) {
  const packignItems = await db.getPackingList(tripId);
  const categories = await db.getCategoryMap();
  const items = await db.getItems();
  console.log("P:", packignItems);
  console.log("C:", categories);
  console.log("I:", items);
  console.log("1:", await db.getItem(1));
  const itemList = <></>;
  packignItems.forEach(async (item) => {
    console.log("-:", await db.getItem(item.item_id));
    // return (
    //   <Item
    //     key={1}
    //     category={categories.get(item.category_id) ?? "?"}
    //     name={item.name}
    //     onEdit={() => {
    //       console.log("EDIT", item.id);
    //     }}
    //     onTrash={() => {
    //       console.log("TRASH", item.id);
    //     }}
    //   ></Item>
    // );
  });

  return <List>{itemList}</List>;
}

function Packing(props: { database: DataBase }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { tripId } = state;
  const handleClickBack = () => navigate("/");
  console.log("ROUTE:", tripId);

  const [packingList, setPackingList] = useState(<></>);

  const updatePackingList = async () => {
    const items = await createPackingList(props.database, tripId);
    console.log("ITEMS:", items);
    setPackingList(items);
  };

  useEffect(() => {
    console.log("call me twice");
    updatePackingList();
    return () => {};
  }, []);

  return (
    <div className="Packing">
      Packing
      {packingList}
      <Button onClick={handleClickBack}>Back</Button>
    </div>
  );
}

export default Packing;
