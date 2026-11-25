// 反转十六进制字符串
function reverseHex(hex) {
  var reversedHex = "";
  for (var i = hex.length - 2; i >= 0; i -= 2) {
    reversedHex += hex.substr(i, 2);
  }
  return reversedHex;
}
/// 将十六进制转换为二进制，并确保结果包含 16 位数字
function hexToBinary(hex) {
  var binary = parseInt(hex, 16).toString(2);
  var padding = "0000000000000000"; // 16 个零
  return (padding + binary).slice(-16);
}
// 将十六进制字符串转换为十进制数值
function hexToDecimal(hexString) {
  return parseInt(hexString, 16);
}

// 将字符串按指定长度分组
function splitIntoGroups(str, length) {
  var groups = [];
  for (var i = 0; i < str.length; i += length) {
    groups.push(str.slice(i, i + length));
  }
  return groups;
}

// 将十六进制字符串转换为32bit浮点数
function FHexToDecimal(hex) {
  var arr = new ArrayBuffer(4);
  var view = new DataView(arr);
  view.setUint32(0, parseInt(hex, 16), false);
  return view.getFloat32(0);
}

// 将十六进制字符串转换为64bit浮点数
function FHexToDouble(hex) {
  var arr = new ArrayBuffer(8);
  var view = new DataView(arr);
  view.setBigUint64(0, BigInt(`0x${hex}`), false);
  return view.getFloat64(0);
}

// 将16进制字符串转换为ASCII字符串
function hexToAscii(hexString) {
  var asciiString = "";
  for (var i = 0; i < hexString.length; i += 2) {
    var hex = hexString.substr(i, 2);
    var decimal = parseInt(hex, 16);
    asciiString += String.fromCharCode(decimal);
  }
  return asciiString;
}
//计算CS
function calculateChecksum(data) {
  var sum = 0;
  for (var i = 0; i < data.length; i += 2) {
    var hexByte = data.substr(i, 2);
    sum += parseInt(hexByte, 16);
  }
  var checksum = sum % 256;
  return checksum.toString(16).toUpperCase();
}

//时间处理函数_不返回表格
function timedeal_without_table(dataContent) {
  if (dataContent.length === 14) {
    var startTime = dataContent;
    var century = startTime.slice(0, 2);
    var year = startTime.slice(2, 4);
    var month = startTime.slice(4, 6);
    var day = startTime.slice(6, 8);
    var hour = startTime.slice(8, 10);
    var minute = startTime.slice(10, 12);
    var second = startTime.slice(12, 14);
    if (
      century === "20" &&
      month >= "01" &&
      month <= "12" &&
      day >= "01" &&
      day <= "31" &&
      hour >= "00" &&
      hour <= "24" &&
      minute >= "00" &&
      minute <= "60" &&
      second >= "00" &&
      second <= "60"
    ) {
      return century+year + "年" + month + "月" + day + "日" + hour + "时" + minute + "分" + second + "秒";
    }
    else {
      return "ERROR,时间数据异常";
    }
  }
  if (dataContent.length === 12) {
    var year = dataContent.slice(0, 2);
    var month = dataContent.slice(2, 4);
    var day = dataContent.slice(4, 6);
    var hour = dataContent.slice(6, 8);
    var minute = dataContent.slice(8, 10);
    var second = dataContent.slice(10, 12);
    if (
      month >= "01" &&
      month <= "12" &&
      day >= "01" &&
      day <= "31" &&
      hour >= "00" &&
      hour <= "24" &&
      minute >= "00" &&
      minute <= "60"
    ) {
      return year + "年" + month + "月" + day + "日" + hour + "时" + minute + "分" + second + "秒";
    }
    else {
      return "ERROR,时间数据异常";
    }
  }
  if (dataContent.length === 6) {
    var year = dataContent.slice(0, 2);
    var month = dataContent.slice(2, 4);
    var day = dataContent.slice(4, 6);
    if (
      month >= "01" &&
      month <= "12" &&
      day >= "01" &&
      day <= "31"
    ) {
      return year + "年" + month + "月" + day + "日";
    }
    else {
      return "ERROR,时间数据异常";
    }
  }
}

//时间处理函数
function timedeal(title, Endian, data)//表格时间名称，大小端，数据
{
  var result = '';
  if (Endian === true) {
    var datadex = reverseHex(data);
  } else {
    var datadex = data;
  }
  if (data.length === 14) {
    var startTime = datadex;
    var century = startTime.slice(0, 2);
    var year = startTime.slice(2, 4);
    var month = startTime.slice(4, 6);
    var day = startTime.slice(6, 8);
    var hour = startTime.slice(8, 10);
    var minute = startTime.slice(10, 12);
    var second = startTime.slice(12, 14);
    if (
      century === "20" &&
      month >= "01" &&
      month <= "12" &&
      day >= "01" &&
      day <= "31" &&
      hour >= "00" &&
      hour <= "24" &&
      minute >= "00" &&
      minute <= "60" &&
      second >= "00" &&
      second <= "60"
    ) {
      result +=
        "<tr><td>" + title + "</td><td>" +
        data +
        "</td><td>" +
        century +
        year +
        "." +
        month +
        "." +
        day +
        "." +
        hour +
        ":" +
        minute +
        ":" +
        second +
        " " +
        " </td ></tr > ";
    } else {
      result += "<tr><td>" + title + "</td><td>" +
        data +
        "</td><td>ERROR,时间错误</td></tr>";
    }
  }
  if (data.length === 12) {
    var startTime = datadex;
    var year = startTime.slice(0, 2);
    var month = startTime.slice(2, 4);
    var day = startTime.slice(4, 6);
    var hour = startTime.slice(6, 8);
    var minute = startTime.slice(8, 10);
    var second = startTime.slice(10, 12);
    if (
      month >= "01" &&
      month <= "12" &&
      day >= "01" &&
      day <= "31" &&
      hour >= "00" &&
      hour <= "24" &&
      minute >= "00" &&
      minute <= "60" &&
      second >= "00" &&
      second <= "60"
    ) {
      result +=
        "<tr><td>" + title + "</td><td>" +
        data +
        "</td><td>" +
        year +
        "年" +
        month +
        "月" +
        day +
        "日" +
        hour +
        ":" +
        minute +
        ":" +
        second +
        " " +
        " </td ></tr > ";
    } else {
      result += "<tr><td>" + title + "</td><td>" +
        data +
        "</td><td>ERROR,时间错误</td></tr>";
    }
  }
  if (data.length === 10) {
    var startTime = datadex;
    var year = startTime.slice(0, 2);
    var month = startTime.slice(2, 4);
    var day = startTime.slice(4, 6);
    var hour = startTime.slice(6, 8);
    var minute = startTime.slice(8, 10);
    if (
      month >= "01" &&
      month <= "12" &&
      day >= "01" &&
      day <= "31" &&
      hour >= "00" &&
      hour <= "24" &&
      minute >= "00" &&
      minute <= "60"
    ) {
      result +=
        "<tr><td>" + title + "</td><td>" +
        data +
        "</td><td>" +
        year +
        "年" +
        month +
        "月" +
        day +
        "日" +
        hour +
        ":" +
        minute +
        " " +
        " </td ></tr > ";
    } else {
      result += "<tr><td>" + title + "</td><td>" +
        data +
        "</td><td>ERROR,时间错误</td></tr>";
    }
  }
  if (data.length === 8) {
    var startTime = datadex;
    var day = startTime.slice(0, 2);
    var hour = startTime.slice(2, 4);
    var minute = startTime.slice(4, 6);
    var second = startTime.slice(6, 8);
    if (
      day >= "01" &&
      day <= "31" &&
      hour >= "00" &&
      hour <= "24" &&
      minute >= "00" &&
      minute <= "60" &&
      second >= "00" &&
      second <= "60"
    ) {
      result +=
        "<tr><td>" + title + "</td><td>" +
        data +
        "</td><td>" +
        day +
        "日" +
        hour +
        "时" +
        minute +
        "分" +
        second +
        "秒" +
        " </td ></tr > ";
    } else {
      result += "<tr><td>" + title + "</td><td>" +
        data +
        "</td><td>ERROR,时间错误</td></tr>";
    }
  }
  if (data.length === 6) {
    var startTime = datadex;
    var year = startTime.slice(0, 2);
    var month = startTime.slice(2, 4);
    var day = startTime.slice(4, 6);
    if (
      day >= "01" &&
      day <= "31"
    ) {
      result +=
        "<tr><td>" + title + "</td><td>" +
        data +
        "</td><td>" +
        year +
        "年" +
        month +
        "月" +
        day +
        "日" +
        " </td ></tr > ";
    } else {
      result += "<tr><td>" + title + "</td><td>" +
        data +
        "</td><td>ERROR,时间错误</td></tr>";
    }
  }
  return result;
}

function csqdeal(data) {
  if (data >= 0 && csq <= 32) {
    result += csq + "</td></tr>";
  } else if ((csqHEX === 99) || (csqHEX === 153)) {
    result += "WARNING!-- 信号无效" + "</td></tr>";
  } else {
    result += "ERROR" + "</td></tr>";
  }
  return result;
}


function doublebytedeal(data) {
  var result = parseInt(data, 16);
  if (result > 32767) {
    result = result - 65536; // 转换为负数
  }
  return result;
}

function ecldeal(data) {
  var result = '';
  var eclHEX = data;
  if (eclHEX === "00" || eclHEX === "01" || eclHEX === "02") {
    result = parseInt(eclHEX, 16) + "级";
  } else {
    result = "WARNING!--ECL=" + parseInt(eclHEX, 16) + "异常";
  }
  return result;
}


function ALLASC(str) {
  if (str.length % 2 !== 0) {
    return false;
  }
  for (let i = 0; i < str.length; i += 2) {
    let byteStr = str.slice(i, i + 2);
    let byteValue = parseInt(byteStr, 16);
    // 检查是否为数字或字母
    if (
      !(
        (byteValue >= 0x30 && byteValue <= 0x39) || // 数字 0-9
        (byteValue >= 0x41 && byteValue <= 0x5a) || // 大写字母 A-Z
        (byteValue >= 0x61 && byteValue <= 0x7a)    // 小写字母 a-z
      )
    ) {
      return false;
    }
  }
  return true;
}

function ALLASCNUM(str) {
  if (str.length % 2 !== 0) {
    return false;
  }
  for (let i = 0; i < str.length; i += 2) {
    let byteStr = str.slice(i, i + 2);
    let byteValue = parseInt(byteStr, 16);
    if (byteValue < 0x30 || byteValue > 0x39) {
      return false;
    }
  }
  return true;
}
/*-----------------------CRC校验------------------------------*/
function reverseBits(num, bitSize) {
  let reversed = 0;
  for (let i = 0; i < bitSize; i++) {
    reversed = (reversed << 1) | (num & 1);
    num >>= 1;
  }
  return reversed;
}

function stringToBytes(str) {
  let bytes = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}

function calculateCRC(buf, width, polynomial, init, xorOut, refIn, refOut) {
  let crc = init;

  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    if (refIn) {
      byte = reverseBits(byte, 8);
    }
    crc ^= (byte << (width - 8));
    for (let j = 0; j < 8; j++) {
      if (crc & (1 << (width - 1))) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
    }
  }

  if (refOut) {
    crc = reverseBits(crc, width);
  }
  return (crc ^ xorOut) & ((1 << width) - 1);
}

function CRCdeal(type, data) {
  const buf = new Uint8Array(data.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  let crcParameters = {
    'CRC8': { width: 8, polynomial: 0x07, init: 0x00, xorOut: 0x00, refIn: false, refOut: false },
    'CRC8_ITU': { width: 8, polynomial: 0x07, init: 0x00, xorOut: 0x55, refIn: false, refOut: false },
    'CRC8_ROHC': { width: 8, polynomial: 0x07, init: 0xFF, xorOut: 0x00, refIn: true, refOut: true },
    'CRC8_MAXIM': { width: 8, polynomial: 0x31, init: 0x00, xorOut: 0x00, refIn: true, refOut: true },
    'CRC16_IBM': { width: 16, polynomial: 0x8005, init: 0x0000, xorOut: 0x0000, refIn: true, refOut: true },
    'CRC16_MAXIM': { width: 16, polynomial: 0x8005, init: 0x0000, xorOut: 0xFFFF, refIn: true, refOut: true },
    'CRC16_USB': { width: 16, polynomial: 0x8005, init: 0xFFFF, xorOut: 0xFFFF, refIn: true, refOut: true },
    'CRC16_MODBUS': { width: 16, polynomial: 0x8005, init: 0xFFFF, xorOut: 0x0000, refIn: true, refOut: true },
    'CRC16_CCITT': { width: 16, polynomial: 0x1021, init: 0x0000, xorOut: 0x0000, refIn: true, refOut: true },
    'CRC16_CCITT-FALSE': { width: 16, polynomial: 0x1021, init: 0xFFFF, xorOut: 0x0000, refIn: false, refOut: false },
    'CRC16_X25': { width: 16, polynomial: 0x1021, init: 0xFFFF, xorOut: 0xFFFF, refIn: true, refOut: true },
    'CRC16_XMODEM': { width: 16, polynomial: 0x1021, init: 0x0000, xorOut: 0x0000, refIn: false, refOut: false },
    'CRC16_XMODEM2': { width: 16, polynomial: 0x8408, init: 0x0000, xorOut: 0x0000, refIn: true, refOut: true },
    'CRC16_DNP': { width: 16, polynomial: 0x3D65, init: 0x0000, xorOut: 0xFFFF, refIn: true, refOut: true },
    'CRC32': { width: 32, polynomial: 0x04C11DB7, init: 0xFFFFFFFF, xorOut: 0xFFFFFFFF, refIn: true, refOut: true },
    'CRC32_C': { width: 32, polynomial: 0x1EDC6F41, init: 0xFFFFFFFF, xorOut: 0xFFFFFFFF, refIn: true, refOut: true },
    'CRC32_KOOPMAN': { width: 32, polynomial: 0x741B8CD7, init: 0xFFFFFFFF, xorOut: 0xFFFFFFFF, refIn: true, refOut: true },
    'CRC32_MPEG-2': { width: 32, polynomial: 0x04C11DB7, init: 0xFFFFFFFF, xorOut: 0x00000000, refIn: false, refOut: false },
    'CRC64_ISO': { width: 64, polynomial: 0x000000000000001B, init: 0xFFFFFFFFFFFFFFFF, xorOut: 0xFFFFFFFFFFFFFFFF, refIn: true, refOut: true },
    'CRC64_ECMA': { width: 64, polynomial: 0x42F0E1EBA9EA3693, init: 0xFFFFFFFFFFFFFFFF, xorOut: 0xFFFFFFFFFFFFFFFF, refIn: true, refOut: true }
  };

  const params = crcParameters[type.toUpperCase()];
  if (!params) {
    throw new Error(`Unsupported CRC type: ${type}`);
  }

  return calculateCRC(buf, params.width, params.polynomial, params.init, params.xorOut, params.refIn, params.refOut).toString(16);
}
/*----------------------------------------------------------------------------------------------*/
function GB26831_GType(data) {
  var result = "";
  let day = (parseInt(data, 16) & 0x001F).toString().padStart(2, '0');
  let mon = ((parseInt(data, 16) & 0x0F00) >> 8).toString().padStart(2, '0');
  let year = (((parseInt(data, 16) & 0x00E0) >> 5) + ((parseInt(data, 16) & 0xF000) >> 9)).toString().padStart(2, '0');
  if (parseInt(year, 10) >= 100 || parseInt(year, 10) < 0)
    yaer = "ERROR";
  if (parseInt(mon, 10) > 12 || parseInt(mon, 10) <= 0)
    day = "ERROR";
  if (parseInt(day, 10) > 31 || parseInt(day, 10) <= 0)
    mon = "ERROR";
  result = year + "年" + mon + "月" + day + "日";
  return result;
}
function GB26831_FType(data) {
  var result = "";
  let min = (parseInt(data, 16) & 0x0000003F).toString().padStart(2, '0');
  let hour = ((parseInt(data, 16) & 0x00001F00) >> 8).toString().padStart(2, '0');
  let day = ((parseInt(data, 16) & 0x001F0000) >> 16).toString().padStart(2, '0');
  let mon = ((parseInt(data, 16) & 0x0F000000) >> 24).toString().padStart(2, '0');
  let year = (((parseInt(data, 16) & 0x00E00000) >> 21) + ((parseInt(data, 16) & 0xF0000000) >> 25)).toString().padStart(2, '0');
  const century = 20;
  if (parseInt(year, 10) >= 100 || parseInt(year, 10) < 0)
    yaer = "ERROR";
  if (parseInt(mon, 10) > 12 || parseInt(mon, 10) <= 0)
    mon = "ERROR";
  if (parseInt(day, 10) > 31 || parseInt(day, 10) <= 0)
    day = "ERROR";
  if (parseInt(hour, 10) >= 24 || parseInt(hour, 10) < 0)
    hour = "ERROR";
  if (parseInt(min, 10) >= 60 || parseInt(min, 10) < 0)
    min = "ERROR";
  result = century + year + "-" + mon + "-" + day + "T" + hour + ":" + min;
  return result;
}

function timestampToBCD(timestamp) {
  const date = new Date(timestamp);

  // 获取UTC时间各组件（避免时区影响）[1,4,8](@ref)
  const year = date.getUTCFullYear().toString();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  // 组合成14位数字字符串（CCYYMMDDHHMMSS）[1,5](@ref)
  return year + month + day + hours + minutes + seconds;
}

// 转为 Uint8Array
function hexToBytes(hex) {
  if (hex.length % 2 !== 0) throw new Error("Hex string must have even length");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// 计算SHA-256
async function sha256(data) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}

// 转为 2字节 有符号整型
function toInt16(data)
{
  if(data > 32767)
    data -= 65536;
  return data;
}