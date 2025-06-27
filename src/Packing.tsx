import "./Packing.css";
import { useContext, useEffect, useState } from "react";

import DataBaseFacade, {
  DataBaseFacadeContext,
  type ItemCategoryPackedEnabledType,
} from "./db/db_facade";

function handleClickItem(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  const element = event.currentTarget;
  if (element.classList.contains("ItemOff")) {
    element.classList.remove("ItemOff");
  } else {
    element.classList.add("ItemOff");
  }
}

function handleClickItemEdit(
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
) {
  const element = event.currentTarget;
  if (element.classList.contains("ItemHide")) {
    element.classList.remove("ItemHide");
  } else {
    element.classList.add("ItemHide");
  }
}

function handleRemoveItem(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  const element = event.currentTarget;
  element.classList.add("ItemRemoved");
}

let movingElement = {
  target: null as HTMLDivElement | null,
  x: 0,
  y: 0,
};

function handleMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  movingElement.target = event.currentTarget;
  movingElement.x = event.clientX;
  movingElement.y = event.clientY;
  console.log("down", event);
}
function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  if (movingElement.target === null) return;
  if (movingElement.target.classList.contains("ItemOff")) return;

  const offset = Math.max(0, Math.min(event.clientX - movingElement.x, 100));

  movingElement.target.style.transform = `translate(${offset}px, 0px)`;
  if (Math.abs(offset) > 50) {
    movingElement.target.classList.add("ItemRemove");
  } else {
    movingElement.target.classList.remove("ItemRemove");
  }

  console.log("move", event);
}
function handleMouseUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  if (movingElement.target === null) return;
  const offset = Math.abs(event.clientX - movingElement.x);
  console.log("up", offset);
  if (offset < 10) {
    handleClickItem(event);
  } else if (offset > 50) {
    handleRemoveItem(event);
  }

  movingElement.target.style.transform = "";
  movingElement.target = null;
}

async function getItemsByCategory(
  categoryId: number,
  items: ItemCategoryPackedEnabledType[],
  editMode: boolean,
  onClickPack: (itemId: number) => void
) {
  const result = [];
  for (const item of items) {
    if (item.category_id === categoryId) {
      result.push(
        <div
          className={
            editMode
              ? item.enabled
                ? "edit-items"
                : "edit-items ItemRemove"
              : item.enabled
              ? !item.packed
                ? "PackingItems"
                : "PackingItems ItemOff"
              : "PackingItems ItemRemoved"
          }
          id={"item_" + item.id}
          key={item.id}
          // onMouseDown={handleMouseDown}
          // onMouseMove={handleMouseMove}
          // onMouseUp={handleMouseUp}
          // onClick={editMode ? handleClickItemEdit : onClickPack}
          onClick={() => onClickPack(item.id)}
        >
          {item.name}
        </div>
      );
    }
  }
  return <>{result}</>;
}

async function createPackingList(
  db: DataBaseFacade,
  items: ItemCategoryPackedEnabledType[],
  editMode: boolean,
  onClickPack: (itemId: number) => void
) {
  const categories = await db.getCategories();

  const result = categories.map(async (category) => {
    return (
      <>
        <div className="packing">
          <div className="PackingCategory" key={category.id}>
            {category.name}
          </div>
          <div>
            {await getItemsByCategory(
              category.id,
              items,
              editMode,
              onClickPack
            )}
          </div>
        </div>
      </>
    );
  });

  return <>{result}</>;
}

function Packing() {
  const [itemTable, setItemTable] = useState<ItemCategoryPackedEnabledType[]>(
    []
  );
  const [packingList, setPackingList] = useState(<></>);
  const [editMode, setEditMode] = useState(false);
  const db = useContext(DataBaseFacadeContext);

  const onClickPack = (itemId: number) => {
    console.log(itemId, editMode);
    setItemTable(
      itemTable.map((item) => {
        if (item.id === itemId)
          editMode
            ? (item.enabled = !item.enabled)
            : (item.packed = !item.packed);
        return item;
      })
    );
  };

  const updatePackingList = async () => {
    const items = await createPackingList(db, itemTable, editMode, onClickPack);
    setPackingList(items);
  };

  useEffect(() => {
    db.selectItemCategoryActiveByTrip(1).then((items) => setItemTable(items));
    return () => {};
  }, []);

  useEffect(() => {
    updatePackingList();
    return () => {};
  }, [itemTable, editMode]);

  return (
    <>
      <div className="menu-container">
        <div className="menu">RESET</div>
        <div
          className="menu"
          onClick={() => {
            setEditMode(!editMode);
            updatePackingList();
          }}
        >
          {editMode ? "EDIT" : "Pack"}
        </div>
        <div className="menu">ADD</div>
      </div>
      <div className="container">{packingList}</div>
    </>
  );
}

export default Packing;
