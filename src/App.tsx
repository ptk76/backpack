import Packing from "./Packing";
import Add from "./Add";
import { useContext, useEffect, useState } from "react";
import DataBase from "./db/db";
import imgEdit from "./assets/edit.svg";
import imgAdd from "./assets/add.svg";
import imgReset from "./assets/reset.svg";
import imgReturn from "./assets/return.svg";
import imgStars from "./assets/stars.svg";
import Reset from "./Reset";
import { ThemeContext, ThemeProvider, type ThemeType } from "./Theme";
import Button from "./Button";

function App() {
  const { app: style } = useContext(ThemeContext);
  const [stopScroll, setStopScroll] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [refresh, setRefresh] = useState(1);
  const [theme, setTheme] = useState<ThemeType>("def");

  const toggleEdit = () => {
    setEditMode((prev) => !prev);
  };

  const onToggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "def" ? "mila" : "def";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
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

  useEffect(() => {
    const theme = localStorage.getItem("theme") as ThemeType;
    setTheme(theme ? theme : "def");
    return () => {};
  }, []);

  return (
    <ThemeProvider theme={theme}>
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
          {!editMode && <Button img={imgEdit} onClick={toggleEdit} />}
          {editMode && (
            <>
              <Button img={imgReturn} onClick={toggleEdit} />
              <Button img={imgAdd} onClick={onShowAdd} />
              <Button img={imgStars} onClick={onToggleTheme} />
              <div className={style.reset}>
                <Button onClick={onShowReset} img={imgReset} label="RESET" />
              </div>
            </>
          )}
        </div>
        <div className={stopScroll ? style.stopScrolling : ""}>
          {!editMode && <Packing editMode={false}></Packing>}
          {editMode && <Packing editMode={true}></Packing>}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
