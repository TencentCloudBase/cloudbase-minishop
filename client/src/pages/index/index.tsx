import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image, Button } from "@tarojs/components";
import "./index.scss";

export interface IGoods {
  _id: string;
  createTime: string;
  desc: string;
  img: string;
  name: string;
  price: number;
}

export default class Index extends Component {
  state = {
    goodsList: []
  };

  config: Config = {
    navigationBarTitleText: "商品"
  };

  componentDidMount() {}

  render() {
    const { goodsList } = this.state;

    return (
      <View className="index">
        {goodsList.map((item: IGoods) => (
          <View className="at-row good-item" key={item._id}>
            <View style="height:100px" className="at-col at-col--auto at-col-1">
              <Image className="good-image" src={item.img} />
            </View>
            <View className="good-detail at-col--auto">
              <View className="title">{item.name}</View>
              <View className="price">
                价格： {Number(item.price) / 100} 元
              </View>
              <Button className="button" type="primary">
                下单
              </Button>
            </View>
          </View>
        ))}
      </View>
    );
  }
}
