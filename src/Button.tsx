import { useContext } from "react";
import { ThemeContext } from "./Theme";

function Button(props: { onClick: () => void; img: string; label?: string }) {
  const { button: style } = useContext(ThemeContext);
  return (
    <div className={style.container} onClick={props.onClick}>
      <img src={props.img} className={[style.icon].join(" ")} />
      {!!props.label && <div className={style.label}>{props.label}</div>}
    </div>
  );
}

export default Button;
