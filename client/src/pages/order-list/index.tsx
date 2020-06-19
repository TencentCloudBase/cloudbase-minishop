import Taro, { Component, Config } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { app } from "../../common";
import "./index.scss";

export interface IOrder {
  _id: string;
  totalFee: number;
  status: number;
  tradeNo: string;
  statusText: string;
  createTime: string;
}

export default class Order extends Component {
  state = {
    orderList: []
  };

  config: Config = {
    navigationBarTitleText: "订单"
  };

  componentDidShow() {
    this.loadData();
  }

  async loadData() {
    const coll = app.db.collection("order");
    coll.get().then(res => {
      this.setState({
        orderList: res.data
      });
    });
  }

  async closeOrder() {}

  render() {
    const { orderList } = this.state;

    if (!orderList.length) {
      return <View className="order-list">无订单</View>;
    }

    return (
      <View className="order-list">
        {orderList.map((order: IOrder) => (
          <View className="order-item" key={order.tradeNo}>
            <View className="title">订单</View>
            <View>商品价值：{Number(order.totalFee) / 100} 元</View>
            <View>订单号：{order.tradeNo}</View>
            <View>订单状态：{order.statusText}</View>
            {order.status === 0 && <Button type="primary">关闭订单</Button>}
          </View>
        ))}
      </View>
    );
  }
}
