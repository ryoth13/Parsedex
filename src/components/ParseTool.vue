<script setup>
import domtoimage from 'dom-to-image';
import Sidebar from '../components/Sidebar.vue';
import downbutton from './downbutton.vue';
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const inputData = ref('');
const inputKey = ref('');
const inputType = ref('解析工具'); // 默认标题
const showKeyInput = ref(false);

const triggerParseData = () => {
   window.tableRowClass = 'black-row';
  if (typeof window.parseData === 'function') {
    window.parseData();
    document.getElementById('outputData').classList.remove('hide');
  } else {
    console.error("parseData function is not loaded yet.");
  }
};

// 自动填充和解析
const autoFillAndParse = () => {
  const { inputData: qInputData, inputkey, inputtype, inputlink } = route.query;
  if (qInputData) {
    inputData.value = decodeURIComponent(qInputData);
    nextTick(() => {
      document.getElementById('inputData').value = inputData.value;
    });
  }
  if (inputkey === 'true') {
    showKeyInput.value = true;
    // nextTick(() => {
    //   document.getElementById('key').value = inputKey.value;
    // });
  }
  if (inputlink !== undefined && inputlink !== '') {
    window.prolink = inputlink; // 存储到window对象
  }
  if (inputtype) {
    inputType.value = decodeURIComponent(inputtype);
  }
  // 自动触发解析
  nextTick(() => {
    if (qInputData) triggerParseData();
  });
};

// 动态加载协议解析JS
const loadProtocolScript = (callback) => {
  // 先移除之前动态加载的协议解析js（如果有）
  const oldScript = document.getElementById('dynamic-protocol-script');
  if (oldScript) oldScript.remove();

  const { inputpro } = route.query;
  let scriptName;
  if (inputpro) {
    scriptName = decodeURIComponent(inputpro);
  }
  // 如果没有指定协议脚本，直接回调并返回，避免加载 '/js/undefined' 导致 404
  if (!scriptName) {
    if (typeof callback === 'function') callback();
    return;
  }
  const script = document.createElement('script');
  script.src = '/js/' + scriptName;
  script.id = 'dynamic-protocol-script';
  script.onload = () => {
    if (typeof callback === 'function') callback();
  };
  document.body.appendChild(script);
};

onMounted(() => {
  document.title = "数据解析工具";
  // 加载通用JS文件
  const script1 = document.createElement('script');
  script1.src = '/script/fuctionDuel.js';
  document.body.appendChild(script1);

  const script2 = document.createElement('script');
  script2.src = '/script/AEC_GCM128加解密.js';
  document.body.appendChild(script2);

  const script3 = document.createElement('script');
  script3.src = '/script/AES_pkcs7加解密.js';
  document.body.appendChild(script3);

  const script5 = document.createElement('script');
  script5.src = '/libs/dom-to-image-2.6.0/dom-to-image.min.js';
  document.body.appendChild(script5);


  // 动态加载协议解析JS，并在加载完成后自动解析
  loadProtocolScript(() => {
    // parsetool.js 已移动到 src 下，使用 Vite 动态 import 来加载它，
    // 这样 Vite 会在开发/构建时解析并提供该模块。
    (async () => {
      try {
        await import('/src/assets/script/parsetool.js');
      } catch (e) {
        console.error('加载 parsetool 失败:', e);
      } finally {
        autoFillAndParse();
      }
    })();
  });
});

// 监听路由变化，支持页面内跳转和协议js切换
watch(() => route.query, () => {
  loadProtocolScript(() => {
    autoFillAndParse();
  });
});
</script>

<template>
  <Sidebar />
  <div class="container">
    <div class="header">
      <br><br>
      <h1 class="tooltitle">{{ inputType }}</h1>
    </div>
    <br>
    <div class="content">
      <div class="input-container">
        <textarea id="inputData" rows="4" placeholder="请输入数据" resize="none" @keydown="handleKeyDown"></textarea>
      </div>
      <div class="incontainer">
        <div class="key-container">
          <input v-show="showKeyInput" type="text" id="key" :value="inputKey" placeholder="请输入密钥" />
        </div>
        <div class="parse-button">
          <button @click="triggerParseData">解&nbsp;&nbsp;析</button>
        </div>
      </div>
      <div id="outputData" class="hide"></div>
    </div>
  </div>
  <downbutton />
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
  margin-bottom: 20px;
}

::selection {
  background-color: rgba(54, 55, 58, 0.233);
}

.black-row {
  background-color: rgba(29, 32, 34, 0.24);
}

.white-row {
  background-color: rgba(248, 237, 228, 0.24);
}

h1 {
  color: #fff;
  font-size: 28px;
  margin: 0;
}

.content {
  max-width: 800px;
  max-height: 80vh;
  /* 使用视口高度作为参考 */
  width: calc(100% - 40px);
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  /* 启用flex布局 */
  flex-direction: column;
  /* 垂直排列子元素 */
  margin-bottom: 20px;
}

.incontainer,
.input-container {
  display: flex;
  align-items: center;
}

.input-container {
  margin-bottom: 15px;
  width: 100%;
  /* 确保输入框容器占满宽度 */
}

textarea {
  background-color: rgba(68, 65, 65, 0.26);
  color: rgb(255, 255, 255);
  width: 100%;
  /* 改为100%宽度以匹配外层容器 */
  padding: 18px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: inherit;
  outline: none;
  resize: none;
  overflow: hidden;
  height: auto;
  box-sizing: border-box;
  /* 关键：让padding包含在宽度内 */
}

textarea::placeholder {
  color: rgb(255, 255, 255);
}

.key-container {
  flex: 1;
  /* 密钥框占满剩余空间 */
  padding-right: 10px;
  /* 与按钮保持间距 */
  box-sizing: border-box;
  /* 限制最大宽度，防止过宽 */
  max-width: 40%;
}

.key-container input[type=text] {
  background-color: rgba(68, 65, 65, .26);
  color: #fff;
  padding: 4px 8px;
  /* 缩小内边距 */
  border: 0;
  width: 100%;
  outline: none;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  font-size: 16px;
  /* 缩小字体 */
  height: 30px;
  /* 明确高度 */
}

.incontainer {
  justify-content: space-between;
  width: 100%;
  /* 确保容器占满宽度 */
  box-sizing: border-box;
}

.key-container,
.parse-button {
  font-family: -apple-system, system-ui, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  display: flex;
  margin-top: 0;
  /* 移除顶部间距，保持紧凑 */
}

.parse-button {
  font-family: -apple-system, system-ui, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  justify-content: flex-end;
  white-space: nowrap;
  /* 防止按钮换行 */
}

.success,
.error,
.warning,
button {
  font-size: 15px;
  padding: 8px 16px;
  background-color: #4caf4fd9;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-family: sans-serif;
  transition: background-color 0.3s;
}

.success:hover {
  background-color: #45a0496e;
}

.error {
  background-color: #ff022cb7;
}

.error:hover {
  background-color: #ff0000;
}

.warning {
  background-color: #ffee00c7;
}

.warning:hover {
  background-color: #ffee00;
}

button:hover {
  background-color: #45a049;
}

#outputData {
  /* 基于父容器剩余空间计算最大高度 */
  max-height: calc(100% - 180px);
  /* 180px是输入区域和按钮的大致高度 */
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  border-radius: 8px;
  /*background-color: rgba(255, 255, 255, 0.1);*/
  width: 100%;
  /* 确保宽度不超出父容器 */
  box-sizing: border-box;
  /* 包含内边距在宽度计算内 */
}

/* 可选：美化滚动条样式 */
#outputData::-webkit-scrollbar {
  width: 4px;
}

#outputData::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

#outputData::-webkit-scrollbar-thumb {
  background: rgba(85, 96, 143, 0.5);
  border-radius: 4px;
}

#outputData::-webkit-scrollbar-thumb:hover {
  background: rgba(85, 96, 143, 0.8);
}

.hide {
  display: none;
}

@media (max-width: 600px) {
  .content {
    padding: 10px;
  }
}

input:-webkit-autofill {
  box-shadow:0 0 0 1000px transparent inset !important; 
}
input:-internal-autofill-previewed,
input:-internal-autofill-selected {
-webkit-text-fill-color: #ffffff !important;
  transition: background-color 5000s ease-in-out 0s !important;
}
</style>