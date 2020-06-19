const crypto = require("crypto");
const cloud = require("wx-server-sdk");

const { envId, subMchId } = require("./config");

cloud.init({
  env: envId,
});

// 订单状态
const statusText = {
  0: "未支付",
  1: "已支付",
  2: "已关闭",
  3: "正在退款",
  4: "已退款",
};

/**
 * 创建订单
 * @param {*} goodsId 商品 Id
 * @param {*} openid 用户 openid
 */
const unifiedOrder = async (goodsId, openid) => {
  const db = cloud.database();
  const goodsColl = db.collection("goods");
  const orderColl = db.collection("order");

  // 查询商品信息
  const { data: goodsInfo } = await goodsColl.doc(goodsId).get()

  // 生成订单号
  const tradeNo = crypto.randomBytes(16).toString('hex')
  // 总价
  const totalFee = goodsInfo.price

  // 创建订单
  const orderRes = await orderColl.add({
    data: {
      goodsId,
      tradeNo,
      totalFee,
      // 未支付订单
      status: 0,
      createTime: new Date(),
      statusText: statusText[0],
      _openid: openid,
    },
  })

  // 下单
  const res = await cloud.cloudPay.unifiedOrder({
    envId,
    subMchId,
    body: '腾讯云-云开发 套餐',
    totalFee,
    outTradeNo: tradeNo,
    spbillCreateIp: '127.0.0.1',
    functionName: 'pay-callback',
  })

  // 更新订单记录
  if (res.resultCode === 'SUCCESS') {
    await orderColl.doc(orderRes._id).update({
      data: {
        payment: res.payment,
      },
    })

    return {
      tradeNo,
      payment: res.payment,
    }
  }

  // 下单失败，返回失败信息
  return {
    code: res.resultCode,
  };
};

/**
 * 关闭订单
 * @param {*} tradeNo 订单号
 * @param {*} openid 用户 id
 */
const closeOrder = async (tradeNo, openid) => {
  const coll = cloud.database().collection("order");
  const { data } = await coll
    .where({
      tradeNo,
      _openid: openid,
    })
    .get();

  const order = data[0];

  if (!order || !order.tradeNo) {
    throw new Error("订单不存在");
  }

  const res = await cloud.cloudPay.closeOrder({
    sub_mch_id: subMchId,
    out_trade_no: tradeNo,
    nonce_str: crypto.randomBytes(16).toString("hex"),
  });

  // 更新订单状态
  if (res.resultCode === "SUCCESS") {
    await coll.doc(order._id).update({
      data: {
        status: 2,
        statusText: statusText[2],
      },
    });
  }

  return res;
};

// 云函数入口
exports.main = async (event) => {
  // 读取参数
  const { type, params = {} } = event;
  // 商品 Id，订单号
  const { goodsId, tradeNo } = params;
  // 用户 openid
  const { OPENID } = cloud.getWXContext();

  // 下单
  if (type === "unifiedOrder") {
    return unifiedOrder(goodsId, OPENID);
  }

  // 关闭未支付订单
  if (type === "closeOrder") {
    return closeOrder(tradeNo, OPENID);
  }
};
