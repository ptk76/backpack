import Popup from "./Popup";
import style from "./Reset.module.css";

function Reset(props: { onClose: (reset: boolean) => void }) {
  return (
    <Popup
      title="Czy przywrócić ustawienia początkowe?"
      onClick={() => props.onClose(false)}
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
