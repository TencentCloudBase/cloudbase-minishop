import Taro, { Component, Config } from "@tarojs/taro";
import Index from "./pages/index";

import "./app.scss";

class App extends Component {
  config: Config = {
    pages: ["pages/index/index", "pages/order-list/index"],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
    },
    cloud: true,
    tabBar: {
      color: "#000",
      selectedColor: "#e93b3d",
      borderStyle: "white",
      list: [
        {
          text: "商品",
          pagePath: "pages/index/index",
          iconPath: "assets/goods.png",
          selectedIconPath: "assets/goods-select.png"
        },
        {
          text: "订单",
          pagePath: "pages/order-list/index",
          iconPath: "assets/order.png",
          selectedIconPath: "assets/order-select.png"
        }
      ]
    }
  };

  componentDidMount() {
    if (process.env.TARO_ENV === "weapp") {
      Taro.cloud.init();
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />;
  }
}

Taro.render(<App />, document.getElementById("app"));
