import "./TripItem.css";

import Button from "@mui/joy/Button";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import { ListItemContent } from "@mui/joy";

type TripItemProps = {
  name: string;
};

function TripItem(props: TripItemProps) {
  return (
    <div className="TripItem">
      <ListItem>
        <ListItemButton>
          <ListItemContent>{props.name}</ListItemContent>
        </ListItemButton>
      </ListItem>
    </div>
  );
}

export default TripItem;
