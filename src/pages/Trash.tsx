import Button from "@mui/joy/Button";
import "./Trash.css";
import { useNavigate } from "react-router-dom";
import DataBaseFacade from "../utils/db_facade";

type TrashProps = {
  db: DataBaseFacade;
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
