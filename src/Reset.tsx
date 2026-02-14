import style from "./Reset.module.css";
import imgClose from "./assets/close-x.svg";

function Reset(props: { onClose: (reset: boolean) => void }) {
  return (
    <>
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.title}>
            Czy przywrócić ustawienia początkowe?
          </div>
          <img
            src={imgClose}
            className={style.close}
            onClick={() => props.onClose(false)}
          />
        </div>

        <div className={style.buttons}>
          <button className={style.yes} onClick={() => props.onClose(true)}>
            Tak
          </button>
          <button className={style.no} onClick={() => props.onClose(false)}>
            Nie
          </button>
        </div>
      </div>
    </>
  );
}

export default Reset;
