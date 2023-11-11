import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import "./Create.css";
import { useNavigate } from "react-router-dom";

import DataBase, { CategoryType, ItemType } from "../utils/db";
import { List } from "@mui/joy";
import CreateItem from "../controls/CreateItem";
import { useEffect, useState } from "react";

async function createItemList(db: DataBase) {
  const categories = await db.getCategoryMap();
  const items = await db.getItems();
  const listItems = items.map((item) => {
    return (
      <CreateItem
        key={item.id}
        category={categories.get(item.category_id) ?? "?"}
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
  const [newItem, setNewItem] = useState(<></>);

  const [addNewItem, setAddNewItem] = useState(false);

  const createCatogoryLilst = (cat: Array<CategoryType>) => {
    const list = cat.map((cat) => {
      return (
        <Option key={cat.id} value={cat.id.toString()}>
          {cat.name}
        </Option>
      );
    });
    return <Select defaultValue="1">{list}</Select>;
  };

  const selectCategoryMenu = async () => {
    const categories = await props.database.getCategories();
    setAddNewItem(!addNewItem);
    setNewItem(
      <div className="new-item">
        {createCatogoryLilst(categories)}
        <Input></Input>
        <Button onClick={handleClickBack}>+</Button>
        <Button onClick={handleClickBack}>-</Button>
      </div>
    );
  };

  const handleClickAdd = () => {
    selectCategoryMenu();
  };

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
      {addNewItem && newItem}
      <Button onClick={handleClickAdd}>Add new item</Button>
      <Button onClick={handleClickBack}>Back</Button>
    </div>
  );
}

export default Create;
