import "./CreateItem.css";

import Button from "@mui/joy/Button";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import { ListItemContent } from "@mui/joy";
import { MouseEventHandler } from "react";

type CreateItemProps = {
  key: number;
  onEdit: (id: number) => void;
  onTrash: (id: number) => void;
  category: string;
  name: string;
};

function CreateItem(props: CreateItemProps) {
  const onEdit = () => {
    props.onEdit(props.key);
  };
  const onTrash = () => {
    props.onTrash(props.key);
  };

  return (
    <div className="CreateItem">
      <ListItem>
        <ListItemButton onClick={onEdit}>
          <ListItemDecorator>{props.category}</ListItemDecorator>
          <ListItemContent>{props.name}</ListItemContent>
          <ListItemContent>EDIT</ListItemContent>
          <ListItemContent>TRASH</ListItemContent>
        </ListItemButton>
      </ListItem>
    </div>
  );
}

export default CreateItem;
