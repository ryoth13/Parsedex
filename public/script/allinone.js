function parsePro(
  protype,
  prolink,
  parsetitle,
  ifkey,
  usejs
) {
  const inputElem = document.getElementById("search-input");
  if (!inputElem) {
    throw new Error('找不到输入框');
  }
  let inputData = inputElem.value;
  inputData = inputData.replace(/\s/g, "").toUpperCase(); // 移除所有空格和回车
  ifkey = false;
  if (inputData.startsWith("67")) {
    if (inputData.endsWith("16")) {
      if (parseInt(inputData.slice(20, 22), 16) * 2 === (inputData.slice(22, -4)).length) {
        if (parseInt(calculateChecksum(inputData.slice(0, -4)), 16) === parseInt(inputData.slice(-4, -2), 16)) {
            protype = "demo协议解析";//对应检索标题
            prolink = "demo协议.pdf";//对应协议名称
            parsetitle = "demo协议解析";//对应解析标题
            usejs = "demo协议解析.js";//对应解析标题
            ifkey = false;//是否需要解密，加密会多出密钥输入框
            return {
              protype: protype,
              prolink: prolink,
              parsetitle: parsetitle,
              ifkey: ifkey,
              usejs: usejs
            };
        }
      }
    }
  }
}