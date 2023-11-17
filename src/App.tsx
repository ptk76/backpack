import "./App.css";
import Main from "./pages/Main";
import Trash from "./pages/Trash";
import Create from "./pages/Create";
import Packing from "./pages/Packing";
import { Routes, Route } from "react-router-dom";
import DataBaseFacade from "./utils/db_facade";

function App(props: { db: DataBaseFacade }) {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main db={props.db} />} />
        <Route path="create" element={<Create db={props.db} />} />
        <Route path="packing" element={<Packing db={props.db} />} />
        <Route path="trash" element={<Trash db={props.db} />} />
      </Routes>
    </div>
  );
}

export default App;
