window.onload = function () {
  // 获取网页URL中的参数
  function getURLParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\#&]" + name + "=([^&#]*)");
    var results = regex.exec(window.location.hash);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // 检查URL中是否存在#inputData参数
  if (window.location.hash.includes("#inputData")) {
    // 获取参数值
    var inputData = getURLParameter("inputData");

    // 将参数值赋给指定元素
    document.getElementById("inputData").value = inputData;

    // 执行parseData()函数
    parseData();
  }
};

function handleKeyDown(event) {
  if (event.keyCode === 13) {
    // 检查按下的键是否是回车键
    if (event.shiftKey || event.altKey || event.ctrlKey) {
      // 在输入框中按下 Shift+Enter、Alt+Enter 或 Ctrl+Enter 时进行换行
      var inputData = document.getElementById("inputData");
      var cursorPosition = inputData.selectionStart;
      var currentText = inputData.value;
      var newText =
        currentText.substring(0, cursorPosition) +
        "\n" +
        currentText.substring(cursorPosition);
      inputData.value = newText;
      inputData.selectionStart = cursorPosition + 1;
      inputData.selectionEnd = cursorPosition + 1;
    } else {
      parseData();
      document.getElementById("inputData").blur();
    }
  }
}

// 封装自适应高度函数
function autoResizeTextarea() {
  var textarea = document.getElementById("inputData");
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height =
      textarea.scrollHeight +
      textarea.offsetHeight -
      textarea.clientHeight +
      "px";
  }
}

// 监听输入事件
const textarea = document.getElementById("inputData") || document.querySelector("textarea");
if (textarea) {
  textarea.addEventListener("input", autoResizeTextarea);
}

// 在parseData后也调用自适应高度
// 假设parseData是全局函数，可以这样处理：
var originalParseData = window.parseData;
window.parseData = function () {
  if (typeof originalParseData === "function") {
    originalParseData();
  }
  autoResizeTextarea();
};

// 如果parseData不是全局函数，而是直接定义的函数，也可以在parseData最后加上
// autoResizeTextarea();


/*******************下载表格函数******************/
function downloadTable() {
  // 获取outputData元素
  var outputData = document.getElementById("outputData");

  // 创建一个新的Blob对象
  var blob = new Blob([outputData.innerHTML], {
    type: "application/vnd.ms-excel",
  });

  // 创建下载链接
  var downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "table.xls";

  // 模拟点击下载链接
  downloadLink.click();
}

/*****************一键截图*****************/
async function Screenshot() {
  var node = document.querySelector('.content');
  var contentStyle = window.getComputedStyle(node);
  var bodyStyle = window.getComputedStyle(document.body);
  var outputData = document.getElementById('outputData');
  var originalMaxHeight = outputData.style.maxHeight;
  var originalOverflowY = outputData.style.overflowY;
  var originalOverflowX = outputData.style.overflowX;
  var contentmaxHeight = node.style.maxHeight;
  var contentMargin = node.style.margin;
  var result = '';

  // 获取 content 和 body 的背景颜色和背景图片
  var contentBackgroundColor = contentStyle.backgroundColor;
  var bodyBackgroundColor = bodyStyle.backgroundColor;
  var bodyBackgroundImage = bodyStyle.backgroundImage;

  // 展开outputData，显示全部内容
  outputData.style.maxHeight = 'none';
  outputData.style.overflowY = 'visible';
  outputData.style.overflowX = 'visible';
  node.style.maxHeight = 'none';
  node.style.margin = '0';


  // 创建一个离屏 canvas 用于合成背景
  var canvas = document.createElement('canvas');
  canvas.width = node.offsetWidth;
  canvas.height = node.offsetHeight;
  var ctx = canvas.getContext('2d');
  // 使用 async/await 确保在异步完成后再返回结果，并在结束时恢复样式
  function _restoreStyles() {
    node.style.backgroundImage = '';
    node.style.backgroundColor = contentBackgroundColor;
    outputData.style.maxHeight = originalMaxHeight;
    outputData.style.overflowY = originalOverflowY;
    outputData.style.overflowX = originalOverflowX;
    node.style.maxHeight = contentmaxHeight;
    node.style.margin = contentMargin;
  }

  async function drawContentBackground() {
    // 绘制 content 背景
    ctx.fillStyle = contentBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 将 canvas 转为 data URL 并设置为 content 的背景图片
    node.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
    node.style.backgroundColor = 'transparent'; // 确保 content 的背景颜色是透明的

    try {
      var blob = await domtoimage.toBlob(node);
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        result = true;
      } catch (err) {
        result = false;
      }
    } catch (err) {
      result = false;
    }

    _restoreStyles();
    return result;
  }

  try {
    // 绘制 body 背景
    if (typeof bodyBackgroundImage === 'string' && bodyBackgroundImage.startsWith('linear-gradient')) {
      var gradient = bodyBackgroundImage;
      var angleMatch = gradient.match(/-?\d+\.?\d*/);
      var angle = angleMatch ? parseFloat(angleMatch[0]) : 0;
      var radians = (angle * Math.PI) / 180;
      var x = Math.cos(radians);
      var y = Math.sin(radians);

      var linearGradient = ctx.createLinearGradient(
        x < 0 ? canvas.width : 0,
        y < 0 ? canvas.height : 0,
        x > 0 ? canvas.width : 0,
        y > 0 ? canvas.height : 0
      );

      var colorStops = gradient.match(/rgba?([^)]*)\)\s*\d*%?|#[0-9a-fA-F]{3,6}\s*\d*%?|rgb\([^)]*\)\s*\d*%?/g) || [];
      colorStops.forEach(function (colorStop) {
        var parts = colorStop.match(/(rgba?([^)]*)\)|#[0-9a-fA-F]{3,6}|rgb\([^)]*\))\s*(\d*%?)/);
        linearGradient.addColorStop(parseFloat(parts[2]) / 100 || 0, parts[1]);
      });

      ctx.fillStyle = linearGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return await drawContentBackground();
    } else if (bodyBackgroundImage && bodyBackgroundImage !== 'none') {
      var img = new Image();
      var src = bodyBackgroundImage.slice(5, -2); // 移除 url(" 和 ") 部分

      // 等待图片加载
      await new Promise(function (resolve, reject) {
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return await drawContentBackground();
    } else {
      ctx.fillStyle = bodyBackgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return await drawContentBackground();
    }
  } catch (e) {
    _restoreStyles();
    return false;
  }
};
/****************跳转协议*****************/
function openLink() {
  // 使用全局的prolink变量
  const link = window.prolink || '';
  if (link) {
    window.open('/pdf/' + link, '_blank');
  } else {
    console.warn("协议链接未设置");
    alert("未找到协议链接");
  }
}

window.downloadTable = downloadTable;
window.Screenshot = Screenshot;
window.openLink = openLink;

