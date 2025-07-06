import "./Edit.css";
import { useContext, useEffect, useState } from "react";

import DataBaseFacade, {
  DataBaseFacadeContext,
  type ItemCategoryPackedEnabledType,
  type TripItemType,
} from "./db/db_facade";

async function getItemsByCategory(
  categoryId: number,
  items: ItemCategoryPackedEnabledType[],
  onClickPack: (itemId: number) => void
) {
  const result = [];
  for (const item of items) {
    if (item.category_id === categoryId) {
      result.push(
        <div
          className={item.enabled ? "edit-items" : "edit-items ItemRemove"}
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
  onClickPack: (itemId: number) => void
) {
  const categories = await db.getCategories();
  const result = categories.map(async (category) => {
    const itemByCategory = await getItemsByCategory(
      category.id,
      items,
      onClickPack
    );
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

function Edit() {
  const [itemTable, setItemTable] = useState<ItemCategoryPackedEnabledType[]>(
    []
  );
  const [packingList, setPackingList] = useState(<></>);
  const db = useContext(DataBaseFacadeContext);

  const onClickPack = async (itemId: number) => {
    let tripItem: TripItemType = await db.getTripItem(1, itemId);
    tripItem.enabled = !tripItem.enabled;
    await db.setTripItem(tripItem);

    setItemTable(
      itemTable.map((item) => {
        if (item.id === itemId) item.enabled = !item.enabled;
        return item;
      })
    );
  };

  const updatePackingList = async () => {
    const items = await createPackingList(db, itemTable, onClickPack);
    setPackingList(items);
  };

  useEffect(() => {
    db.selectItemCategoryActiveByTrip(1).then((items) => setItemTable(items));
    return () => {};
  }, []);

  useEffect(() => {
    updatePackingList();
    return () => {};
  }, [itemTable]);

  return (
    <>
      <div className="container">{packingList}</div>
    </>
  );
}

export default Edit;
