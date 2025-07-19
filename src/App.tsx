import "./App.css";
import Packing from "./Packing";
import Add from "./Add";
import Edit from "./Edit";
import { useState } from "react";
import DataBase from "./db/db";
import imgEdit from "./assets/edit.png";

function App() {
  const [editMode, setEditMode] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [refresh, setRefresh] = useState(1);

  const onCloseAdd = () => {
    setShowAdd(false);
    setRefresh(refresh + 1);
  };

  const onShowAdd = () => {
    setShowAdd(true);
  };

  const onReset = () => {
    DataBase.delete();
    location.reload();
  };

  return (
    <>
      {showAdd && (
        <div className="layer1">
          <Add onClose={onCloseAdd}></Add>
        </div>
      )}
      <div className="layer0">
        <div className="menu-container">
          {editMode && (
            <>
              <div className="menu reset" onClick={onReset}>
                Przywróć stan początkowy
              </div>
              <div className="menu add" onClick={onShowAdd}>
                Dodaj nową rzecz
              </div>
            </>
          )}
          <div
            className="menu"
            onClick={() => {
              setEditMode(!editMode);
            }}
          >
            {!editMode && <img src={imgEdit} width="48px" />}
            {editMode && "Wróć do pakowania"}
          </div>
        </div>
        {editMode && <Edit></Edit>}
        {!editMode && <Packing></Packing>}
      </div>
    </>
  );
}

export default App;
