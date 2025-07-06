import "./App.css";
import Packing from "./Packing";
import Edit from "./Edit";
import { useState } from "react";

function App() {
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <div className="menu-container">
        {editMode && (
          <>
            <div className="menu reset disabled">Przywróć stan początkowy</div>
            <div className="menu add disabled">Dodaj nową rzecz</div>
          </>
        )}
        <div
          className="menu"
          onClick={() => {
            setEditMode(!editMode);
          }}
        >
          {!editMode ? "Edytuj listę" : "Wróć do pakowania"}
        </div>
      </div>
      {editMode && <Edit></Edit>}
      {!editMode && <Packing></Packing>}
    </>
  );
}

export default App;
