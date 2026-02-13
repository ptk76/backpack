import style from "./App.module.css";
import Packing from "./Packing";
import Add from "./Add";
import { useState } from "react";
import DataBase from "./db/db";
import imgEdit from "./assets/edit.svg";
import imgAdd from "./assets/add.svg";
import imgReset from "./assets/reset.svg";
import imgReturn from "./assets/return.svg";
import Reset from "./Reset";

function App() {
  const [stopScroll, setStopScroll] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [refresh, setRefresh] = useState(1);

  const toggleEdit = () => {
    setEditMode((prev) => !prev);
  };

  const onCloseAdd = () => {
    setStopScroll(false);
    setShowAdd(false);
    setRefresh(refresh + 1);
  };

  const onShowAdd = () => {
    setStopScroll(true);
    setShowAdd(true);
  };

  const onShowReset = () => {
    setStopScroll(true);
    setShowReset(true);
  };

  const onCloseReset = (reset: boolean) => {
    setStopScroll(false);
    setShowReset(false);
    if (reset) {
      DataBase.delete();
      location.reload();
    }
  };

  return (
    <>
      {showAdd && (
        <div className={style.layer1}>
          <Add onClose={onCloseAdd}></Add>
        </div>
      )}
      {showReset && (
        <div className={style.layer1}>
          <Reset onClose={onCloseReset}></Reset>
        </div>
      )}
      <div className={style.layer0}>
        <div className={style.menuContainer}>
          {!editMode && (
            <img className={style.menu} src={imgEdit} onClick={toggleEdit} />
          )}
          {editMode && (
            <>
              <img
                className={style.menu}
                src={imgReturn}
                onClick={toggleEdit}
              />
              {<img src={imgAdd} className={style.menu} onClick={onShowAdd} />}
              {
                <img
                  src={imgReset}
                  className={[style.menu, style.reset].join(" ")}
                  onClick={onShowReset}
                />
              }
            </>
          )}
        </div>
        <div className={stopScroll ? style.stopScrolling : ""}>
          {!editMode && <Packing editMode={false}></Packing>}
          {editMode && <Packing editMode={true}></Packing>}
        </div>
      </div>
    </>
  );
}

export default App;
