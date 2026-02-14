import { useContext } from "react";
import imgClose from "./assets/close-x.svg";
import { ThemeContext } from "./Theme";

function Popup(props: { children: any; title: string; onClose: () => void }) {
  const { popup: style } = useContext(ThemeContext);

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
