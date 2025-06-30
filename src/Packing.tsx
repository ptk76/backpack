import "./Packing.css";
import { useContext, useEffect, useState } from "react";

import DataBaseFacade, {
  DataBaseFacadeContext,
  type ItemCategoryPackedEnabledType,
  type TripItemType,
} from "./db/db_facade";

async function getItemsByCategory(
  categoryId: number,
  items: ItemCategoryPackedEnabledType[],
  editMode: boolean,
  onClickPack: (itemId: number) => void
) {
  const result = [];
  for (const item of items) {
    if (item.category_id === categoryId) {
      if (!editMode && !item.enabled) continue;
      result.push(
        <div
          className={
            editMode
              ? item.enabled
                ? "edit-items"
                : "edit-items ItemRemove"
              : !item.packed
              ? "PackingItems"
              : "PackingItems ItemOff"
          }
          id={"item_" + item.id}
          key={item.id}
          onClick={() => onClickPack(item.id)}
        >
          {item.name}
        </div>
      );
    }
  }
  return result;
}

async function createPackingList(
  db: DataBaseFacade,
  items: ItemCategoryPackedEnabledType[],
  editMode: boolean,
  onClickPack: (itemId: number) => void
) {
  const categories = await db.getCategories();
  const result = categories.map(async (category) => {
    const itemByCategory = await getItemsByCategory(
      category.id,
      items,
      editMode,
      onClickPack
    );
    console.log(category.name);
    console.log(itemByCategory);
    console.log(itemByCategory.length);
    if (itemByCategory.length === 0) return <></>;
    return (
      <>
        <div className="packing">
          <div className="PackingCategory" key={category.id}>
            {category.name}
          </div>
          <div>{itemByCategory}</div>
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

  const onClickPack = async (itemId: number) => {
    let tripItem: TripItemType = await db.getTripItem(1, itemId);
    if (editMode) tripItem.enabled = !tripItem.enabled;
    else tripItem.packed = !tripItem.packed;
    await db.setTripItem(tripItem);

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
        <div className="menu disabled">Przywróć stan początkowy</div>
        <div
          className="menu"
          onClick={() => {
            setEditMode(!editMode);
            updatePackingList();
          }}
        >
          {!editMode ? "Edytuj listę" : "Wróć do pakowania"}
        </div>
        <div className="menu disabled">Dodaj nową rzecz</div>
      </div>
      <div className="container">{packingList}</div>
    </>
  );
}

export default Packing;
