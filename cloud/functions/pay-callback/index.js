const cloud = require("wx-server-sdk");

cloud.init({
  env: "minishop",
});

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { resultCode, outTradeNo } = event;
  const db = cloud.database();
  const coll = db.collection("order");

  if (resultCode === "SUCCESS") {
    await coll
      .where({
        tradeNo: outTradeNo,
        _openid: OPENID,
      })
      .update({
        data: {
          status: 1,
          statusText: "支付成功",
        },
      });
    return {
      errcode: 0,
      errmsg: "",
    };
  }
  console.log(event);
};
