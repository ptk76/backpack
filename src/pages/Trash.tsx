import Button from "@mui/joy/Button";
import "./Trash.css";
import { useNavigate } from "react-router-dom";
import DataBase from "../utils/db";

type TrashProps = {
  database: DataBase;
};

function Trash(props: TrashProps) {
  const navigate = useNavigate();
  const handleClickBack = () => navigate("/");
  return (
    <div className="Trash">
      Trash
      <Button onClick={handleClickBack}>Back</Button>
    </div>
  );
}

export default Trash;
