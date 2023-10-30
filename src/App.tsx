import "./App.css";
import Main from "./pages/Main";
import Trash from "./pages/Trash";
import Create from "./pages/Create";
import Packing from "./pages/Packing";
import { Routes, Route } from "react-router-dom";
import DataBase from "./utils/db";

function App(props: { db: DataBase }) {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main database={props.db} />} />
        <Route path="create" element={<Create database={props.db} />} />
        <Route path="packing" element={<Packing database={props.db} />} />
        <Route path="trash" element={<Trash database={props.db} />} />
      </Routes>
    </div>
  );
}

export default App;
