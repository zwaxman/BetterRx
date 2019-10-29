import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import '../public/index.css'
import Main from "./react/Main"

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById("app")
);
