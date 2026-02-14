import style from "./Category.module.css";
import { type JSX, useContext, useEffect, useState } from "react";
import imgFoldUp from "./assets/fold-up.svg";
import imgFoldDown from "./assets/fold-down.svg";

import { DataBaseFacadeContext } from "./db/db_facade";
import Item from "./Item";

function Category(props: {
  label: string;
  tripId: number;
  categoryId: number;
  editMode: boolean;
}) {
  const db = useContext(DataBaseFacadeContext);
  const [items, setItems] = useState<JSX.Element[]>();
  const [fold, setFold] = useState(false);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(0);

  const onFold = () => {
    setFold((prev) => !prev);
  };

  const onItemClick = (enabled: boolean) => {
    props.editMode
      ? setSelected((prev) => (enabled ? prev + 1 : prev - 1))
      : setSelected((prev) => (enabled ? prev - 1 : prev + 1));
  };

  const updateState = async () => {
    const items = await db.getItemsByCategory(props.categoryId);

    let total = 0;
    let selected = 0;
    for (const item of items) {
      const details = await db.getTripItem(props.tripId, item.id);
      if (!props.editMode) {
        if (details.enabled) {
          total += 1;
          if (details.packed) selected += 1;
        }
      } else {
        total += 1;
        if (details.enabled) selected += 1;
      }
    }
    setTotal(total);
    setSelected(selected);
    if (!props.editMode && total === selected) setFold(true);
    setItems(
      items.map((item) => (
        <Item
          key={item.id}
          label={item.name}
          tripId={props.tripId}
          itemId={item.id}
          onClick={onItemClick}
          editMode={props.editMode}
        />
      )),
    );
  };

  useEffect(() => {
    updateState();
    return () => {};
  }, []);

  return (
    total > 0 && (
      <div className={style.container}>
        <div className={style.topBar} onClick={onFold}>
          <div className={style.title}>{props.label}</div>
          {fold && <img src={imgFoldDown} className={style.fold} />}
          {!fold && <img src={imgFoldUp} className={style.fold} />}
          <div className={style.separator} />
          <div className={style.counter}>
            [
            <span
              className={
                props.editMode
                  ? ""
                  : total === selected
                    ? style.fullPack
                    : style.emptyPack
              }
            >
              {selected}
            </span>
            /{total}]
          </div>
        </div>
        {!fold && <div>{items}</div>}
      </div>
    )
  );
}

export default Category;
