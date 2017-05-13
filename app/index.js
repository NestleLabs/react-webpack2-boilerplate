import React from "react";
import ReactDOM from "react-dom";

import "@/base";

const render = Component => {
  ReactDOM.render(
    <Component />,
    document.getElementById("root")
  );
}

import Main from "#/main";

render(Main);
