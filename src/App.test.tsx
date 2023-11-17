import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import DataBase from "./utils/db";
import DataBaseFacade from "./utils/db_facade";

const db = new DataBase();
const dbFacade = new DataBaseFacade(db);
test("renders learn react link", () => {
  render(<App db={dbFacade} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
