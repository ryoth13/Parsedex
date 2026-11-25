var lastClickedButtonFunction = FORMATDATA; // 默认为FORMATDATA
function handleKeyDown(event) {
    if (event.keyCode === 13) { // 检查按下的键是否是回车键
        lastClickedButtonFunction();
        document.getElementById("inputData").blur();
    }
}


// 检查设备是否支持prefers-color-scheme
function checkPrefersColorScheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// 根据设备的深色模式设置初始主题
function setInitialTheme() {
    const prefersDarkMode = checkPrefersColorScheme();
    const body = document.querySelector('body');
    const checkbox = document.querySelector('input[type="checkbox"]');

    if (prefersDarkMode) {
        body.classList.add('dark-mode');
        checkbox.checked = true;
        tableRowClass = 'black-row';
    } else {
        tableRowClass = 'white-row';
    }
}

setInitialTheme();

// 监听checkbox的点击事件
const checkbox = document.querySelector('input[type="checkbox"]');
checkbox.addEventListener('click', function () {
    const isChecked = checkbox.checked;
    const body = document.querySelector('body');

    if (isChecked) {
        body.classList.add('dark-mode');
        tableRowClass = 'black-row';
    } else {
        body.classList.remove('dark-mode');
        tableRowClass = 'white-row';
    }

});

// 获取textarea元素
const textarea = document.querySelector('textarea');

// 监听输入事件
textarea.addEventListener('input', () => {
    // 重新计算textarea的高度
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + textarea.offsetHeight - textarea.clientHeight + 'px';
});



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

function doubleToFHex(number) {
    var arr = new ArrayBuffer(8);
    var view = new DataView(arr);
    view.setFloat64(0, number);
    var hex = view.getBigUint64(0, false).toString(16).toUpperCase();
    return hex;
}

function decimalToFHex(number) {
    var arr = new ArrayBuffer(4);
    var view = new DataView(arr);
    view.setFloat32(0, number);
    var hex = view.getUint32(0, false).toString(16).toUpperCase();
    return hex;
}



//计算CS
function calculateChecksum(data) {
    var sum = 0;
    for (var i = 0; i < data.length; i += 2) {
        var hexByte = data.substr(i, 2);
        sum += parseInt(hexByte, 16);
    }
    var checksum = sum % 256;
    var checksumString = checksum.toString(16).toUpperCase();
    if (checksumString.length < 2) {
        checksumString = "0" + checksumString;
    }
    return checksumString;
}

function buttonClicked(button, callback) {
    var buttons = document.querySelectorAll('.parse-button button');

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
        buttons[i].style.filter = 'saturate(30%)';
    }

    button.classList.add('active');
    button.style.filter = 'none';


    // 清空输入输出框的数据
    var inputData = document.getElementById('inputData');
    var outputData = document.getElementById('outputData');
    if (!button.classList.contains('active')) {
        inputData.value = '';
        outputData.value = '';
    }

    // 执行回调函数
    if (typeof callback === 'function') {
        callback();
    }
}

function ASCHEX() {
    lastClickedButtonFunction = ASCHEX;
    var selectTool = document.getElementById('selectTool');
    var keyContainer = document.getElementById('key');
    var inputData = document.getElementById('inputData');
    var outputData = document.getElementById('outputData');
    keyContainer.value = "ASCII/HEX互转";

    // 存储之前的选项
    var previousOption = selectTool.options[selectTool.selectedIndex].text;

    // 清空现有选项
    selectTool.options.length = 0;

    // 添加新选项
    selectTool.options[0] = new Option("HEX TO ASCII");
    selectTool.options[1] = new Option("ASCII TO HEX");

    // 根据之前的选项重新选择
    if (previousOption === "ASCII TO HEX") {
        selectTool.selectedIndex = 1;
        inputData.placeholder = "ASCII";
        outputData.placeholder = "HEX";
        outputData.value = asciiToHex(inputData.value);
    } else {
        selectTool.selectedIndex = 0;
        inputData.placeholder = "HEX";
        outputData.placeholder = "ASCII";
        outputData.value = hexToAscii(inputData.value);
    }
}

// 将ASCII转换为HEX
function asciiToHex(asciiString) {
    // 去除空格和回车符
    asciiString = asciiString.replace(/\s/g, '');

    var hexString = '';
    for (var i = 0; i < asciiString.length; i++) {
        var hex = asciiString.charCodeAt(i).toString(16);
        hexString += hex.padStart(2, '0');
    }
    return hexString;
}

// 将HEX转换为ASCII
function hexToAscii(hexString) {
    // 去除空格和回车符
    hexString = hexString.replace(/\s/g, '');

    var asciiString = '';
    for (var i = 0; i < hexString.length; i += 2) {
        var hex = hexString.substr(i, 2);
        var ascii = parseInt(hex, 16);
        asciiString += String.fromCharCode(ascii);
    }
    return asciiString;
}

function FHEXPAR() {
    lastClickedButtonFunction = FHEXPAR;
    var selectTool = document.getElementById('selectTool');
    var keyContainer = document.getElementById('key');
    var inputData = document.getElementById('inputData');
    var outputData = document.getElementById('outputData');
    keyContainer.value = "浮点数/HEX互转";

    // 存储之前的选项
    var previousOption = selectTool.options[selectTool.selectedIndex].text;

    // 清空现有选项
    selectTool.options.length = 0;

    // 添加新选项
    selectTool.options[0] = new Option("HEX转单精度");
    selectTool.options[1] = new Option("HEX转双精度");
    selectTool.options[2] = new Option("单精度转HEX");
    selectTool.options[3] = new Option("双精度转HEX");

    // 根据之前的选项重新选择
    if (previousOption === "HEX转双精度") {
        selectTool.selectedIndex = 1;
        inputData.placeholder = "HEX";
        outputData.placeholder = "IEEE 754 64bit浮点数";
        outputData.value = inputData.value ? FHexToDouble(inputData.value) : '';
    } else if (previousOption === "单精度转HEX") {
        selectTool.selectedIndex = 2;
        inputData.placeholder = "IEEE 754 32bit浮点数";
        outputData.placeholder = "HEX";
        outputData.value = inputData.value ? decimalToFHex(inputData.value) : '';
    } else if (previousOption === "双精度转HEX") {
        selectTool.selectedIndex = 3;
        inputData.placeholder = "IEEE 754 64bit浮点数";
        outputData.placeholder = "HEX";
        outputData.value = inputData.value ? doubleToFHex(inputData.value) : '';
    } else {
        selectTool.selectedIndex = 0;
        inputData.placeholder = "HEX";
        outputData.placeholder = "IEEE 754 32bit浮点数";
        outputData.value = inputData.value ? FHexToDecimal(inputData.value) : '';
    }
}

function CSEND() {
    lastClickedButtonFunction = CSEND;
    var selectTool = document.getElementById('selectTool');
    var keyContainer = document.getElementById('key');
    var inputData = document.getElementById('inputData');
    var outputData = document.getElementById('outputData');
    inputData.placeholder = "选择需要的帧尾，左下输入框可自定义";
    outputData.placeholder = "";

    // 存储之前的选项
    var previousOption = selectTool.options[selectTool.selectedIndex].text;

    // 保存key框中的值
    var key = keyContainer.value;

    // 清空现有选项
    selectTool.options.length = 0;
    selectTool.options[0] = new Option("+16");
    selectTool.options[1] = new Option("+17");
    selectTool.options[2] = new Option("修改+16");
    selectTool.options[3] = new Option("修改+17");
    selectTool.options[4] = new Option("左边自定义");
    selectTool.options[5] = new Option("修改+自定义");

    // 恢复key框的值和占位符
    keyContainer.value = "";
    keyContainer.placeholder = "其他帧尾";

    var result = ''; // 修改此处，将result声明在函数作用域内

    if (previousOption === "+17") {
        selectTool.selectedIndex = 1;
        result = inputData.value ? inputData.value : '';
        if (result) {
            var checksum = calculateChecksum(result);
            result = result + checksum + "17";
        }
        outputData.value = result.toUpperCase();
    } else if (previousOption === "修改+17") {
        selectTool.selectedIndex = 3;
        var input = inputData.value ? inputData.value : '';
        if (input) {
            var checksumInput = input.slice(0, -4); // 获取输入的数字除去最后四位的部分
            var checksum = calculateChecksum(checksumInput); // 计算校验和
            result = checksumInput + checksum + "17";
        }
        outputData.value = result.toUpperCase();
    } else if (previousOption === "修改+16") {
        selectTool.selectedIndex = 2;
        var input = inputData.value ? inputData.value : '';
        if (input) {
            var checksumInput = input.slice(0, -4); // 获取输入的数字除去最后四位的部分
            var checksum = calculateChecksum(checksumInput); // 计算校验和
            result = checksumInput + checksum + "16";
        }
        outputData.value = result.toUpperCase();
    } else if (previousOption === "修改+自定义") {
        selectTool.selectedIndex = 5;
        var input = inputData.value ? inputData.value : '';
        var modifiedResult = '';
        if (input) {
            modifiedResult = input.slice(0, -4); // 获取输入的数字除去最后四位的部分
            var checksum = calculateChecksum(modifiedResult); // 计算校验和
            keyContainer.value = key;
            result = modifiedResult + checksum + key;
        }
        outputData.value = result.toUpperCase();
    } else if (previousOption === "左边自定义") {
        selectTool.selectedIndex = 4;
        result = inputData.value ? inputData.value : '';
        if (result) {
            var checksum = calculateChecksum(result);
            keyContainer.value = key;
            result = result + checksum + key;
        }
        outputData.value = result.toUpperCase();
    } else {
        selectTool.selectedIndex = 0;
        result = inputData.value ? inputData.value : '';
        if (result) {
            var checksum = calculateChecksum(result);
            result = result + checksum + "16";
        }
        outputData.value = result.toUpperCase();
    }
}

function AESENDE() {
    lastClickedButtonFunction = AESENDE;
    var selectTool = document.getElementById('selectTool');
    var keyContainer = document.getElementById('key');
    var inputData = document.getElementById('inputData');
    var outputData = document.getElementById('outputData');
    inputData.placeholder = "";
    outputData.placeholder = "";

    // 存储之前的选项
    var previousOption = selectTool.options[selectTool.selectedIndex].text;
    // 保存key框中的值
    var key = keyContainer.value;

    selectTool.options.length = 0; // 清空现有选项
    selectTool.options[0] = new Option("ECB PKCS7解密");
    selectTool.options[1] = new Option("ECB PKCS7加密");
    selectTool.options[3] = new Option("HMAC-SHA256");
    selectTool.options[4] = new Option("HMAC-SHA256(HEX)");

    //keyContainer.value = "";
    keyContainer.placeholder = "请输入密钥";
    var result = "";

    if (previousOption === "ECB PKCS7加密") {
        selectTool.selectedIndex = 1;
        inputData.placeholder = "请输入明文";
        outputData.placeholder = "已加密密文";
        result = inputData.value ? inputData.value : '';
        if (result) {
            var plaintext = inputData.value.replace(/[\s\n\r\W]/g, ""); // 去除空格、回车和符号
            result = encrypt(plaintext, key);
        }
        outputData.value = result.toUpperCase();
    }else if (previousOption === "ECB PKCS7解密") {
        selectTool.selectedIndex = 0;
        inputData.placeholder = "请输入密文";
        outputData.placeholder = "已解密明文";
        result = inputData.value ? inputData.value : '';
        if (result) {
            var ciphertext = inputData.value.replace(/[\s\n\r\W]/g, ""); // 去除空格、回车和符号
            result = decrypt(ciphertext, key);
        }
        outputData.value = result;
    }
    else if (previousOption === "HMAC-SHA256(HEX)") {
        selectTool.selectedIndex = 3;
        inputData.placeholder = "请输入密文";
        outputData.placeholder = "已解密明文";
        result = inputData.value ? inputData.value : '';
        if (result) {
            var ciphertext = inputData.value.replace(/[\s\n\r\W]/g, ""); // 去除空格、回车和符号
            ciphertext = hexToAscii(ciphertext);
            result = hmacSha256(ciphertext, key);
        }
        outputData.value = result;
    }
    else if (previousOption === "HMAC-SHA256") {
        selectTool.selectedIndex = 2;
        inputData.placeholder = "请输入密文";
        outputData.placeholder = "已解密明文";
        result = inputData.value ? inputData.value : '';
        if (result) {
            var ciphertext = inputData.value.replace(/[\s\n\r\W]/g, ""); // 去除空格、回车和符号
            result = hmacSha256(ciphertext, key);
        }
        outputData.value = result;
    }
    else {
        inputData.placeholder = "请输入明文";
        outputData.placeholder = "已加密密文";
    }
}
function FORMATDATA() {
    lastClickedButtonFunction = FORMATDATA;
    var selectTool = document.getElementById('selectTool');
    var keyContainer = document.getElementById('key');
    var inputData = document.getElementById('inputData');
    var outputData = document.getElementById('outputData');
    // 存储之前的选项
    var previousOption = selectTool.options[selectTool.selectedIndex].text;

    selectTool.options.length = 0;
    selectTool.options[0] = new Option("去符号和中文");
    selectTool.options[1] = new Option("去符号");
    selectTool.options[2] = new Option("去中文");
    selectTool.options[3] = new Option("仅去符号和中文");

    inputData.placeholder = '请输入要整理的数据';
    outputData.placeholder = '';
    var result = "";

    if (previousOption === "去符号") {
        selectTool.selectedIndex = 1;
        result = inputData.value.replace(/[\s\n\r\W]/g, ""); // 去除空格、回车和符号
        var lengthInBytes = result.length;
        var lengthInHex = (lengthInBytes % 2 === 0) ? (lengthInBytes / 2).toString(16) : "NaN";
        var lengthInDec = (lengthInBytes % 2 === 0) ? (lengthInBytes / 2).toString() : "NaN";
        keyContainer.value = lengthInBytes + "；" + lengthInDec + "；" + lengthInHex.toUpperCase();
    } else if (previousOption === "去中文") {
        selectTool.selectedIndex = 2;
        result = inputData.value.replace(/[\u4e00-\u9fa5\s\n\r]/g, ""); // 去除空格、回车和中文字符
        result = result.replace(/[\s\n\r]/g, ""); // 去除空格和回车
        var lengthInBytes = result.length;
        var lengthInHex = (lengthInBytes % 2 === 0) ? (lengthInBytes / 2).toString(16) : "NaN";
        var lengthInDec = (lengthInBytes % 2 === 0) ? (lengthInBytes / 2).toString() : "NaN";
        keyContainer.value = lengthInBytes + "；" + lengthInDec + "；" + lengthInHex.toUpperCase();
    } else if (previousOption === "仅去符号和中文") {
        selectTool.selectedIndex = 3;
        result = inputData.value.replace(/[\u4e00-\u9fa5\W]/g, ""); // 仅去符号和中文
        var lengthInBytes = result.length;
        var lengthInHex = (lengthInBytes % 2 === 0) ? (lengthInBytes / 2).toString(16) : "NaN";
        var lengthInDec = (lengthInBytes % 2 === 0) ? (lengthInBytes / 2).toString() : "NaN";
        keyContainer.value = lengthInBytes + "；" + lengthInDec + "；" + lengthInHex.toUpperCase();
    } else {
        selectTool.selectedIndex = 0;
        result = inputData.value.replace(/\/\/.*[\r\n]/g, ""); // 去除 // 后面到回车之间的内容
        result = result.replace(/[\s\n\r\W\u4e00-\u9fa5]/g, ""); // 去除空格、回车、符号和中文字符
        var lengthInBytes = result.length;
        var lengthInHex = (lengthInBytes % 2 === 0) ? (lengthInBytes / 2).toString(16) : "NaN";
        var lengthInDec = (lengthInBytes % 2 === 0) ? (lengthInBytes / 2).toString() : "NaN";
        keyContainer.value = lengthInBytes + "；" + lengthInDec + "；" + lengthInHex.toUpperCase();
    }
    outputData.value = result;
}


function decrypt(text, key) {
    const _key = CryptoJS.enc.Utf8.parse(key);
    const ciphertext = CryptoJS.enc.Hex.parse(text);
    const srcs = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext,
    });
    const decrypted = CryptoJS.AES.decrypt(srcs, _key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Hex).toUpperCase();
}

function encrypt(text, key) {
    const _key = CryptoJS.enc.Utf8.parse(key);
    const srcs = CryptoJS.enc.Hex.parse(text);
    const encrypted = CryptoJS.AES.encrypt(srcs, _key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
}

function hmacSha256(message, key) {
    const _key = CryptoJS.enc.Utf8.parse(key);
    const _msg = CryptoJS.enc.Utf8.parse(message);
    const mac = CryptoJS.HmacSHA256(_msg, _key);
    return mac.toString(CryptoJS.enc.Hex).toUpperCase();
}

var selectTool = document.getElementById('selectTool');
selectTool.addEventListener('change', function () {
    var selectedOption = selectTool.options[selectTool.selectedIndex].text;
    if (selectedOption === "HEX TO ASCII" || selectedOption === "ASCII TO HEX") {
        ASCHEX();
    } else if (selectedOption === "+16" || selectedOption === "+17" || selectedOption === "左边自定义" || selectedOption === "修改+16" || selectedOption === "修改+17" || selectedOption === "修改+自定义") {
        CSEND();
    } else if (selectedOption === "ECB PKCS7解密" || selectedOption === "HMAC-SHA256(HEX)" || selectedOption === "ECB PKCS7加密" || selectedOption === "HMAC-SHA256" ) {
        AESENDE();
    } else if (selectedOption === "去符号和中文" || selectedOption === "去符号" || selectedOption === "去中文" || selectedOption === "仅去符号和中文") {
        FORMATDATA();
    }
    else {
        FHEXPAR();
    }
});