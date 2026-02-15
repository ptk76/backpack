import { useContext } from "react";
import Popup from "./Popup";
import { ThemeContext } from "./Theme";

function Reset(props: { onClose: (reset: boolean) => void }) {
  const { reset: style } = useContext(ThemeContext);

  return (
    <Popup
      title="Czy przywrócić ustawienia początkowe?"
      onClose={() => props.onClose(false)}
    >
      <div className={style.buttons}>
        <button className={style.yes} onClick={() => props.onClose(true)}>
          Tak
        </button>
        <button className={style.no} onClick={() => props.onClose(false)}>
          Nie
        </button>
      </div>
    </Popup>
  );
}

export default Reset;
