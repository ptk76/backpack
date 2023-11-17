import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import DataBase from "./utils/db";
import DataBaseFacade from "./utils/db_facade";

DataBase.getInstance().then((db: DataBase) => {
  const dbFacade = new DataBaseFacade(db);
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App db={dbFacade} />
      </BrowserRouter>
    </React.StrictMode>
  );
});
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
