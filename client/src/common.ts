import tcb from "tcb-js-sdk";

let web;
let weapp;

if (process.env.TARO_ENV === "h5") {
  tcb.init({
    env: "minishop"
  });

  tcb
    .auth({
      persistence: "local"
    })
    .signInAnonymously();

  web = {
    db: tcb.database(),
    callFunction: tcb.callFunction
  };
}

if (process.env.TARO_ENV === "weapp") {
  weapp = {
    db: wx.cloud.database(),
    callFunction: wx.cloud.callFunction
  };
}

export const app = process.env.TARO_ENV === "h5" ? web : weapp;
