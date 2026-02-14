import { createContext } from "react";

import genericApp from "./themes/generic/App.module.css";
import milaApp from "./themes/mila/App.module.css";

import genericButton from "./themes/generic/Button.module.css";
import milaButton from "./themes/mila/Button.module.css";

import genericCategory from "./themes/generic/Category.module.css";
import milaCategory from "./themes/mila/Category.module.css";

import genericItem from "./themes/generic/Item.module.css";
import milaItem from "./themes/mila/Item.module.css";

import genericPopup from "./themes/generic/Popup.module.css";
import milaPopup from "./themes/mila/Popup.module.css";

const themes = {
  generic: {
    app: genericApp,
    category: genericCategory,
    item: genericItem,
    button: genericButton,
    popup: genericPopup,
  },
  mila: {
    app: milaApp,
    category: milaCategory,
    item: milaItem,
    button: milaButton,
    popup: milaPopup,
  },
};

export type ThemeType = "def" | "mila";
export const ThemeContext = createContext(themes.generic);

type ThemeProviderType = {
  children: any;
  theme: ThemeType;
};

export function ThemeProvider(props: ThemeProviderType) {
  return (
    <ThemeContext.Provider
      value={props.theme === "def" ? themes.generic : themes.mila}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}
