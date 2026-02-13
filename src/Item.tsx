import style from "./Item.module.css";
import { useContext, useEffect, useRef, useState } from "react";

import { DataBaseFacadeContext, type TripItemType } from "./db/db_facade";

function Item(props: {
  label: string;
  tripId: number;
  itemId: number;
  onClick: (enabled: boolean) => void;
  editMode: boolean;
}) {
  const itemRef = useRef<TripItemType | null>(null);
  const db = useContext(DataBaseFacadeContext);
  const [show, setShow] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const init = async () => {
    itemRef.current = await db.getTripItem(props.tripId, props.itemId);
    if (props.editMode || itemRef.current.enabled) setShow(true);
    setEnabled(isEnabled());
  };

  const toggle = async () => {
    if (itemRef.current === null) return;
    if (props.editMode) itemRef.current.enabled = !itemRef.current.enabled;
    else itemRef.current.packed = !itemRef.current.packed;

    db.setTripItem(itemRef.current);
    props.onClick(isEnabled());
    setEnabled(isEnabled());
  };

  const isEnabled = () => {
    if (!itemRef.current) return true;
    if (props.editMode) return itemRef.current.enabled;
    else return !itemRef.current.packed;
  };

  useEffect(() => {
    init();
    return () => {};
  }, []);

  return (
    show && (
      <div
        className={[
          style.container,
          props.editMode
            ? enabled
              ? style.enabledEdit
              : style.disabledEdit
            : enabled
              ? style.enabled
              : style.disabled,
        ].join(" ")}
        onClick={toggle}
      >
        {props.label}
      </div>
    )
  );
}

export default Item;
