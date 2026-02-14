import { useContext, useEffect, useRef, useState } from "react";
import style from "./Add.module.css";
import DataBaseFacade, { DataBaseFacadeContext } from "./db/db_facade";
import Popup from "./Popup";

let fakeKey = 0;
function Add(props: { onClose: () => void }) {
  const [categories, setCategories] = useState(<></>);
  const inputRef = useRef<HTMLInputElement>(null);

  const db = useContext(DataBaseFacadeContext);

  const getCategories = async (db: DataBaseFacade) => {
    const categories = await db.getCategories();
    setCategories(
      <>
        {categories.map((cat) => (
          <option key={fakeKey++} value={cat.name} />
        ))}
      </>,
    );
  };

  useEffect(() => {
    getCategories(db);
    return () => {};
  }, [categories]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    db.addItem("Inne", formData.get("item") as string, 1);
    props.onClose();
  };

  return (
    <Popup onClose={props.onClose} title="Nowa rzecz">
      <form className={style.addform} method="post" onSubmit={handleSubmit}>
        <input type="text" name="item" ref={inputRef} />
        <button className={style.addbutton} name="add" type="submit">
          Dodaj
        </button>
      </form>
    </Popup>
  );
}

export default Add;
