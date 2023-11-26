import { Fragment } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";

import "@/assets/css/index.css";

export const App = () => {
  return (
    <Fragment>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Fragment>
  );
};

export default App;
