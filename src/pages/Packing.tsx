import Button from "@mui/joy/Button";
import "./Packing.css";
import { useEffect, useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import DataBase from "../utils/db";
import Item from "../controls/Item";
import List from "@mui/joy/List";

async function createPackingList(db: DataBase, tripId: number) {
  const packingItems = await db.getPackingList(tripId);
  const categories = await db.getCategoryMap();
  const items = await db.getItems();
  const itemListPromise = packingItems.map(async (item) => {
    const itemDetails = await db.getItem(item.item_id);
    return {
      id: item.item_id,
      category: categories.get(itemDetails.category_id) ?? "?",
      name: itemDetails.name,
    };
  });

  const itemList = await Promise.all(itemListPromise);

  const itemNodes = itemList.map((item) => {
    return (
      <Item
        key={item.id}
        category={item.category}
        name={item.name}
        onEdit={() => {
          console.log("EDIT", item.id);
        }}
        onTrash={() => {
          console.log("TRASH", item.id);
        }}
      ></Item>
    );
  });

  return <List>{itemNodes}</List>;
}

function Packing(props: { database: DataBase }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { tripId } = state;
  const handleClickBack = () => navigate("/");

  const [packingList, setPackingList] = useState(<></>);

  const updatePackingList = async () => {
    const items = await createPackingList(props.database, tripId);
    setPackingList(items);
  };

  useEffect(() => {
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
