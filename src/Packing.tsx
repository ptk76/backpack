import style from "./Packing.module.css";
import { useContext, useEffect, useState } from "react";

import DataBaseFacade, { DataBaseFacadeContext } from "./db/db_facade";
import Category from "./Category";

async function createPackingList(db: DataBaseFacade, editMode: boolean) {
  const categories = await db.getCategories();
  const result = categories.map(async (category) => {
    return (
      <Category
        key={category.id}
        label={category.name}
        tripId={1}
        categoryId={category.id}
        editMode={editMode}
      />
    );
  });

  return <>{result}</>;
}

function Packing(props: { editMode: boolean }) {
  const [packingList, setPackingList] = useState(<></>);
  const db = useContext(DataBaseFacadeContext);

  const updatePackingList = async () => {
    const items = await createPackingList(db, props.editMode);
    setPackingList(items);
  };

  useEffect(() => {
    updatePackingList();
    return () => {};
  }, []);

  return <div className={style.container}>{packingList}</div>;
}

export default Packing;
