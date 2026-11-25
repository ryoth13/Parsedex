var fuccode = '';
var inputData = '';
var meter14;
var metercode;

function parseData() {
  var inputdex = document.getElementById("inputData").value;
  inputdex = inputdex.replace(/\s/g, "").toUpperCase(); // 移除所有空格和回车
  inputData = inputdex;
  // 解析数据的函数
  var result = "<table>";
  result += "<tr class=\"" + tableRowClass + "\"><th>类型</th><th>数据</th><th>解析</th></tr>";

  //从这里修改基础数据部分

  // 第一行：起始符
  var start = inputData.slice(0, 2);
  result += "<tr><td>帧头</td><td>" + start + "</td><td>";
  if (start === "67") {
    result += "帧头(67H)";
  } else {
    result += "ERROR";
  }
  result += "</td></tr>";

  //
  var metertype = inputData.slice(2, 4)
  result += "<tr><td>指令设置</td><td>" + metertype + "</td><td>";
 if (metertype === '20') {
    result += "指令设置";
  }
  else {
    result += "ERROR";
  }
  result += "</td></tr>";

  //
  if (inputData.slice(18, 22) === '0011') {
    meter14 = 6;
  }
  else {
    meter14 = 0;
  }
  //
  metercode = inputData.slice(4, 12 + meter14)
  result += "<tr><td>UUID</td><td>" + metercode + "</td><td>" + "UUID：" + metercode + "</td></tr>";
  //
  var cpycode = inputData.slice(12 + meter14, 18 + meter14)
  result += "<tr><td>厂商代码</td><td>" + cpycode + "</td><td>" + "厂商代码：" + cpycode + "</td></tr>";

  //
  fuccode = inputData.slice(18 + meter14, 20 + meter14)
  result += "<tr><td>功能码</td><td>" + fuccode + "</td><td>" + "功能码：" + fuccode + "</td></tr>";

  var locallen = inputData.slice(20 + meter14, 22 + meter14)
  var locallened = parseInt(locallen, 16);
  result += "<tr><td>数据域长度</td><td>" + locallen + "</td><td>" + "长度：" + locallened + "</td></tr>";

  var data = inputData.slice(22 + meter14, -4);
  result += parseDataContent(data);


  var cs = inputData.slice(-4, -2);
  var dataForChecksum = inputData.slice(0, -4); // 去除最后六位数
  var checksum = calculateChecksum(dataForChecksum); // 调用计算累加和的函数，传入去除最后六位数的数据
  result += "<tr><td>CS</td><td>" +
    cs +
    "</td><td>";

  if (parseInt(cs, 16) === parseInt(checksum, 16)) {
    result += cs;
  } else {
    result += "ERROR, CS应为：" + checksum;
  }

  result += "</td></tr>";

  var end = inputData.slice(-2);
  result += "<tr><td>帧尾</td><td>" + end + "</td><td>";
  if (end === "16") {
    result += "帧尾(16H)";
  } else {
    result += "ERROR";
  }
  result += "</td></tr>";

  result += "</table>";


  document.getElementById("outputData").innerHTML = result;
  // 扫描表格内的内容
  var table = outputData.getElementsByTagName("table")[0];
  var rows = table.getElementsByTagName("tr");
  var hasError = false;
  var hasWarning = false;

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var cells = row.getElementsByTagName("td");

    for (var j = 0; j < cells.length; j++) {
      var cell = cells[j];

      if (cell.innerHTML.includes("ERROR")) {
        hasError = true;
        break;
      } else if (cell.innerHTML.includes("WARNING")) {
        hasWarning = true;
        break;
      }
    }

    if (hasError) {
      break;
    }
  }

  // 更改按钮的样式和文字
  var parseButton = document.querySelector(".parse-button button");

  if (inputData === "" || (!hasError && !hasWarning)) {
    // 没有数据或者没有出现 ERROR 和 WARNING
    parseButton.className = "success";
    parseButton.textContent = "SUCCESS";
  } else if (hasError) {
    // 出现 ERROR
    parseButton.className = "error";
    parseButton.textContent = "ERROR";
  } else if (hasWarning) {
    // 出现 WARNING
    parseButton.className = "warning";
    parseButton.textContent = "WARNING";
  }
}
function parseGroupData(group) {
  var reversedGroup = reverseGroup(group);
  var decValue = hexToDecimal(reversedGroup);
  return decValue;
}

// 反转分组的数据
function reverseGroup(group) {
  var reversedGroup = "";
  for (var i = group.length - 2; i >= 0; i -= 2) {
    reversedGroup += group.slice(i, i + 2);
  }
  return reversedGroup;
}
// 解析数据内容
function parseDataContent(data) {
  var result = "";
  var fuctioned = "暂无解析,规则添加";
  var code101112 = inputData.slice(20 + meter14, 26 + meter14);

  switch (fuccode) {
    case 'C1':
      if (code101112 === '056767') {
        fuctioned = '修改波特率';
      }
      break;
    default:
      fuctioned = "暂无解析,规则添加";
      break;
  }
  result +=
    "<tr class=\"" + tableRowClass + "\"><td>" + "数据域功能" + "</td><td>" + data + "</td><td>" + fuctioned + "</td></tr>";


  return result;
}