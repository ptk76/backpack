import "./CreateItem.css";

import {
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";

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
        <ListItemButton>
          <ListItemDecorator>{props.category}</ListItemDecorator>
          <ListItemContent>{props.name}</ListItemContent>
          <ListItemContent onClick={onEdit}>EDIT</ListItemContent>
          <ListItemContent onClick={onTrash}>TRASH</ListItemContent>
        </ListItemButton>
      </ListItem>
    </div>
  );
}

export default CreateItem;
