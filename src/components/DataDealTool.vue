<script setup>
import { ref,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';

onMounted(() => {
  // 加载通用JS文件
  const script1 = document.createElement('script');
  script1.src = '/script/onlineparse.js';
  document.body.appendChild(script1);

  const script2 = document.createElement('script');
  script2.src = '/script/AEC_GCM128加解密.js';
  document.body.appendChild(script2);

  const script3 = document.createElement('script');
  script3.src = '/script/AES_pkcs7加解密.js';
  document.body.appendChild(script3);
});
</script>

<template>
    <Sidebar />
    <div class="container">
        <div class="header">
            <br /><br />
            <h1 class="tooltitle">常用工具多合一(Beta)</h1>
        </div>
        <br />
        <div class="content" rows="8">
            <div class="input-container">
                <br />
                <textarea id="inputData" v-model="inputData" rows="8" placeholder="请输入待处理数据" @keydown="handleKeyDown" />
            </div>
            <div class="incontainer">
                <div class="key-container">
                    <input type="text" id="key" v-model="keyText" placeholder="状态：待输入" />
                </div>
                <div class="select-container">
                    <select id="selectTool" v-model="selectedTool">
                        <option>右侧按钮选择功能</option>
                        <option></option>
                    </select>
                </div>
                <div class="parse-button">
                    <button type="button" onclick="buttonClicked(this,ASCHEX)">ASC/HEX</button>
                    <button type="button" onclick="buttonClicked(this,FHEXPAR)">浮点数</button>
                    <button type="button" onclick="buttonClicked(this,CSEND)">CS+帧尾</button>
                    <button type="button" onclick="buttonClicked(this,AESENDE)">数据加解密</button>
                    <button type="button" onclick="buttonClicked(this,FORMATDATA)">数据整理</button>
                </div>
            </div>
            <div class="output-container">
                <textarea id="outputData" v-model="outputData" rows="8" placeholder="" @keydown="handleKeyDown" />
            </div>
        </div>

        <div class="menu-container">
            <div class="menu">
                <span class="menu-title">常用网址</span>
                <ul class="submenu">
                    <li><a href="https://www.23bei.com/tool/59.html" target="_blank">CRC校验</a></li>
                    <li><a href="https://the-x.cn/cryptography/Aes.aspx" target="_blank">AES加解密</a></li>
                    <li><a href="https://baseconvert.com/ieee-754-floating-point" target="_blank">754浮点数</a></li>
                    <li><a href="https://www.rapidtables.org/zh-CN/convert/number/hex-to-ascii.html"
                            target="_blank">HEX格式转换</a></li>
                    <li><a href="https://www.mklab.cn/utils/txt" target="_blank">在线文本处理</a></li>
                    <li><a href="https://obfuscator.io/" target="_blank">JS混淆加密</a></li>
                    <li><a href="https://www.toolfk.com/tools/format-css.html" target="_blank">CSS工具</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style scoped>
.tooltitle {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.877);
  font-size: 28px;
  font-family: sans-serif;
  font-weight: bold;
  /*text-transform: uppercase;*/
  letter-spacing: 5px;
  text-shadow: 0 0 20px rgba(52, 123, 151, 0.6);
}
.container {
  font-family: -apple-system, system-ui, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  padding: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.32);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  border-radius: 20px;
  width: 100%;
  height: inherit;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

.header {
    text-align: center;
    margin-bottom: 20px
}

::selection {
    background-color: rgba(54, 55, 58, .233)
}

.black-row {
    background-color: rgba(29, 32, 34, .24)
}

.white-row {
    background-color: rgba(248, 237, 228, .24)
}

h1,
td,
th {
    color: #fff
}

.content {
    max-width: 800px;
    width: 100%;
    background-color: rgba(255, 255, 255, .3);
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
    padding: 20px;
    box-sizing: border-box;
    position: relative
}

.incontainer,
.input-container,
.output-container {
    display: flex;
    align-items: center
}

.input-container,
.output-container {
    margin-bottom: 20px;
    text-align: left;
    flex-direction: column
}

label {
    font-weight: 700;
    margin-bottom: 10px
}

.key-container input[type=text],
input[type=text],
textarea {
    background-color: rgba(255, 255, 255, .445);
    color: gray;
    border: 0
}

.output-container textarea,
input[type=text],
textarea {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
    overflow: hidden;
    height: auto;
    width: 96%;
    padding: 18px
}

.output-container textarea {
    margin-top: 30px;
    background-color: rgba(255, 255, 255, .445);
    color: gray;
    border: 0
}

.incontainer {
    justify-content: space-between;
    margin-left: 10px;
    margin-right: 10px;
}

.key-container,
.parse-button {
    justify-content: flex-start;
    display: flex;
    font-size: 13px
}

.parse-button {
    margin-left: 2px;
    justify-content: flex-end
}

.key-container input[type=text] {
    text-align: center;
    padding: 8px;
    width: 100%;
    cursor: pointer
}

.select-container {
    display: flex;
    align-items: center;
    text-align: center;
    cursor: pointer
}

.select-container label {
    font-weight: 700;
}

.output-container textarea,
.select-container select,
.submenu li a,
body.dark-mode textarea,
input[type=text],
textarea {
    border-radius: 8px;
    font-family: -apple-system, system-ui, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    outline: 0;
    resize: none
}

.select-container select {
    text-align: left;
    background-color: rgba(255, 255, 255, .445);
    border: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
    overflow: hidden;
    color: gray;
    width: 150px;
    padding: 8px
}

select option {
    background: #fff;
    color: gray
}

.parse-button button {
    margin-left: 3px;
    padding: 8px 8px;
    color: #fff;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 700;
    transition: background-color .3s;
    background-color: #4caf50
}

.parse-button button.active {
    background-color: #45a049
}

table {
    table-layout: fixed;
    border-collapse: separate;
    width: 100%;
    margin-top: 20px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, .1)
}

td,
th {
    word-wrap: break-word;
    max-width: 200px;
    background-color: rgba(255, 255, 255, .2);
    padding: 8px;
    text-align: center;
    vertical-align: middle
}

th {
    font-weight: 700
}

thead th {
    background-color: #55608f
}

tbody tr:hover {
    background-color: rgba(255, 255, 255, .45)
}

tbody td {
    position: relative
}

tbody td:hover:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: -9999px;
    bottom: -9999px;
    background-color: rgba(255, 255, 255, .2);
    z-index: -1
}

.menu-container {
    position: fixed;
    bottom: 50px;
    right: 20px
}

.menu {
    position: relative;
    display: inline-block;
    background-color: #333;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer
}

.menu-title,
.menu:hover .submenu {
    display: block
}

.submenu {
    position: absolute;
    top: -172px;
    right: 0;
    width: 150px;
    background-color: #333;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    display: none
}

.submenu li {
    list-style-type: none;
    padding: 5px
}

.submenu ul {
    padding: 0
}

.submenu li a,
body.dark-mode textarea {
    color: #fff;
    width: 96%;
    padding: 18px
}

.submenu li a {
    text-decoration: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
    overflow: hidden;
    height: auto
}

.submenu li:hover {
    border-radius: 5px;
    background-color: #555
}

@media (max-width:600px) {
    .content {
        padding: 10px
    }
}

body.dark-mode {
    background-image: linear-gradient(-20deg, #2b5876 0%, #403a55 100%, #609de4 5%);
    color: #f5f5f5
}

body.dark-mode textarea {
    background-color: rgba(68, 65, 65, .26);
    border: 0
}

body.dark-mode input::placeholder,
body.dark-mode textarea::placeholder {
    color: #fff
}

body.dark-mode .key-container input[type=text] {
    background-color: rgba(68, 65, 65, .26);
    color: #fff;
    padding: 8px 10px;
    border: 0;
    width: 100%;
    cursor: pointer
}

body.dark-mode select,
body.dark-mode select option {
    background-color: rgba(68, 65, 65, .26);
    color: #fff
}

body.dark-mode select:focus {
    outline-color: #fff
}
</style>

