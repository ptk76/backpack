import style from "./Popup.module.css";
import imgClose from "./assets/close-x.svg";

function Popup(props: { children: any; title: string; onClose: () => void }) {
  return (
    <>
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.title}>{props.title}</div>
          <img
            src={imgClose}
            className={style.close}
            onClick={() => props.onClose()}
          />
        </div>
        {props.children}
      </div>
    </>
  );
}

export default Popup;
