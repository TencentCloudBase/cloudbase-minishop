import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image, Button } from "@tarojs/components";
import { app } from "../../common";
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

  componentDidMount() {
    const coll = app.db.collection("goods");
    coll.get().then(res => {
      console.log(res.data);
      this.setState({
        goodsList: res.data
      });
    });
  }

  async makeOrder(goodsId) {
    Taro.showLoading({
      title: "正在下单中"
    });

    const { result } = await app.callFunction({
      name: "pay",
      data: {
        type: "unifiedOrder",
        params: {
          goodsId
        }
      }
    });
    console.log(result);
    Taro.hideLoading();
    if (result.payment) {
      Taro.showLoading({
        title: "正在支付中"
      });

      wx.requestPayment({
        ...result.payment,
        success() {
          Taro.showToast({
            title: "支付成功",
            icon: "success",
            success: () => {
              Taro.hideLoading();
            }
          });
        },
        fail() {
          Taro.showToast({
            title: "支付失败",
            icon: "none",
            success: () => {
              Taro.hideLoading();
            }
          });
        }
      });
    } else {
      Taro.hideLoading();
      Taro.showToast({
        title: "创建订单失败",
        icon: "none"
      });
    }
  }

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
              <Button
                className="button"
                type="primary"
                onClick={() => this.makeOrder(item._id)}
              >
                下单
              </Button>
            </View>
          </View>
        ))}
      </View>
    );
  }
}
