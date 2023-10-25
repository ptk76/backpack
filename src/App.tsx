import "./App.css";
import Main from "./pages/Main";
import Trash from "./pages/Trash";
import Create from "./pages/Create";
import Packing from "./pages/Packing";
import { Routes, Route } from "react-router-dom";
import DataBase from "./utils/db";

function App() {
  let db = null;
  console.log("APP1:", db);
  db = DataBase.getInstance();
  console.log("APP2:", db);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main database={db} />} />
        <Route path="create" element={<Create database={db} />} />
        <Route path="packing" element={<Packing database={db} />} />
        <Route path="trash" element={<Trash database={db} />} />
      </Routes>
    </div>
  );
}

export default App;
