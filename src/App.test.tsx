import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import DataBase from "./utils/db";

const db = new DataBase();
test("renders learn react link", () => {
  render(<App db={db} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
