import Button from "@mui/joy/Button";
import "./Packing.css";
import { useNavigate } from "react-router-dom";
import DataBase from "../utils/db";

function Packing(props: { database: DataBase }) {
  const navigate = useNavigate();
  const handleClickBack = () => navigate("/");
  return (
    <div className="Packing">
      Packing
      <Button onClick={handleClickBack}>Back</Button>
    </div>
  );
}

export default Packing;
