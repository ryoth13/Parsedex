<script setup>
import Sidebar from '../components/Sidebar.vue'
import ParseTool from '../components/ParseTool.vue'
import { ref, onMounted, nextTick } from 'vue'
// import { openUrl, openPath, revealItemInDir } from '@tauri-apps/plugin-opener'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { useRouter } from 'vue-router';
//import { reverseHex, calculateChecksum, CRCdeal } from '@/assets/script/fuctionDuel.js';


const router = useRouter(); // 创建路由实例

const protype = ref(0);
const parsetitle = ref(0);
const prolink = ref(0);
const usejs = ref(0);
const ifkey = ref(false);
const showSettings = ref(false);
const showSearchResults = ref(false);
const protocolType = ref('');
const knownProtocol = ref(false); // 控制已知/未知图片显示

const coverDiv = ref(null);
const informDiv = ref(null);
const searchResultsDiv = ref(null);
const searchInput = ref(null);
const xieyilink = ref(null);
const gongjulink = ref(null);

function toggleSearch(e) {
  e.preventDefault();

  const searchButton = document.querySelector('#s-cover button');
  const searchButtonspan = document.querySelector('#s-cover button span');

  if (searchButton.classList.contains('close')) {
    // 重置状态
    searchButton.parentNode.classList.remove('close');
    searchButtonspan.parentNode.classList.remove('close');
    showSearchResults.value = false;
    coverDiv.value.style.top = '50%';
    coverDiv.value.style.width = '800px';
    informDiv.value.style.display = 'block';
    searchInput.value.value = '';
    protype.value = 0;
    parsetitle.value = 0;
    prolink.value = 0;
    usejs.value = 0;
    ifkey.value = false;
    knownProtocol.value = false;
    protocolType.value = '';
    // 清空DOM元素内容
    if (xieyilink.value) xieyilink.value.innerHTML = '';
    if (gongjulink.value) gongjulink.value.innerHTML = '';

    searchResultsDiv.value.style.display = 'none';
  } else {
    informDiv.value.style.display = 'none';
    searchButton.parentNode.classList.add('close');
    searchButtonspan.parentNode.classList.add('close');
    coverDiv.value.style.top = '20%';
    coverDiv.value.style.width = '1300px';
    searchResultsDiv.value.style.display = 'block';
  }
  if (searchInput.value.value.length !== 0) {
    const { protype: newProtype, prolink: newProlink, parsetitle: newparsetitle, ifkey: newifkey, usejs: newusejs } = parsePro(protype.value, prolink.value, parsetitle.value, ifkey.value, usejs.value);

    protype.value = newProtype;
    prolink.value = newProlink;
    parsetitle.value = newparsetitle;
    ifkey.value = newifkey;
    usejs.value = newusejs;
  }
  if (protype.value !== 0) {
    knownProtocol.value = true;
    protocolType.value = protype.value;
    if (prolink.value !== 0) {
      const relativePath = '/pdf/' + prolink.value;
      xieyilink.value.innerHTML = `<a style="font-size: 26px;" href="${relativePath}" target="_blank">点击查看协议</a>`;

      if (parsetitle.value !== 0) {
        // const toolPath = './src/html/' + parsetitle.value + '#inputData=' + encodeURIComponent(searchInput.value.value);
        gongjulink.value.innerHTML = `<a style="font-size: 26px";>点击解析数据</a>`;
        gongjulink.value.onclick = function (event) {
          event.preventDefault();

          const inputData = encodeURIComponent(searchInput.value.value);
          const inputtype = parsetitle.value;
          const inputkey = ifkey.value;
          const inputpro = usejs.value;
          const inputlink = prolink.value;
          router.push({ path: '/parse-tool', query: { inputData, inputtype, inputkey, inputpro, inputlink } }); // data,工具标题，是否加密，调用js
        };
      } else {
        gongjulink.value.innerHTML = '工具解析待开发';
      }
    } else {
      xieyilink.value.innerHTML = '无相关协议';
      gongjulink.value.innerHTML = '工具解析待开发';
    }

  } else {
    protype.value = 0;
    parsetitle.value = 0;
    prolink.value = 0;
    usejs.value = 0;
    ifkey.value = false;
    knownProtocol.value = false;
    protocolType.value = '未知协议|暂未解析';
  }
}

onMounted(async () => {
  await new Promise((resolve) => {
    const script2 = document.createElement('script');
    script2.src = 'script/fuctionDuel.js';
    script2.onload = resolve;
    document.body.appendChild(script2);
  });

  await new Promise((resolve) => {
    const script3 = document.createElement('script');
    script3.src = 'script/allinone.js';
    script3.onload = resolve;
    document.body.appendChild(script3);
  });
  
  console.log('所有脚本加载完成');
});
</script>

<template>
  <Sidebar />
  <div class="inform" ref="informDiv">
    All-in-One
  </div>

  <div id="cover" ref="coverDiv">
    <form method="get" action="">
      <div class="tb">
        <div class="td"><input type="text" id="search-input" placeholder="请输入任意协议数据" ref="searchInput"></div>
        <div class="td" id="s-cover">
          <button type="submit" @click.prevent="toggleSearch" aria-label="执行搜索">
            <div id="s-circle"></div>
            <span></span>
          </button>
        </div>
      </div>
    </form>
  </div>

  <div id="search-results" ref="searchResultsDiv" v-show="showSearchResults">
    <div id="logo" class="logo">
      <!-- 根据knownProtocol.value 来显示  /img/已知协议.png 或者  /img/未知协议.png -->
      <img :src="knownProtocol ? '/img/file.png' : '/img/danger.png'" alt="协议状态图标" width="215" height="250">
    </div>
    <div class="protype">{{ protocolType }}</div>
    <div ref="xieyilink" class="prolink"></div>
    <div ref="gongjulink" class="parsetitle"></div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  outline: none;
}

.tb {
  display: table;
  width: 100%;
}

.td {
  display: table-cell;
  vertical-align: middle;
}

input,
button {
  color: #fff;
  font-family: Nunito;
  padding: 0;
  margin: 0;
  border: 0;
  background-color: transparent;
}

#cover {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  padding: 10px;
  margin: 0px auto 0 auto;
  background-color: #74a2af63;
  border-radius: 32px;
  box-shadow: 0 10px 40px #ffffffd3, 0 0 0 10px #5bc9d1eb;
  transform: scale(0.6);
  transform-origin: -75% -75%;
}

#search-results {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 320px;
  padding: 0px;
  margin: 0px auto 0 auto;
  background-color: #74a2af63;
  border-radius: 28px;
  box-shadow: 0 1px 1px #524c4cd2;
}

input[type="text"] {
  width: calc(100% - 84px);
  width: 100%;
  height: 96px;
  font-size: 42px;
  line-height: 1;
  background-clip: text;
}

input[type="text"]::placeholder {
  font-size: 30px;
  color: #bbe9dbe1;
}

input:-webkit-autofill {
  -webkit-text-fill-color: #fff;
  background-color: transparent;
}

#s-cover {
  width: 1px;
  padding-left: 35px;
}

button {
  position: relative;
  display: block;
  width: 84px;
  height: 96px;
  cursor: pointer;
}

#s-circle {
  position: relative;
  top: -8px;
  left: 0;
  width: 68px;
  height: 68px;
  margin-top: 0;
  border-width: 15px;
  border: 15px solid #fff;
  background-color: transparent;
  border-radius: 50%;
  transition: 0.5s ease all;
}

button span {
  position: absolute;
  top: 68px;
  left: 43px;
  display: block;
  width: 45px;
  height: 15px;
  background-color: transparent;
  border-radius: 10px;
  transform: rotateZ(0deg);
  transition: 0.5s ease all;
}

button span:before,
button span:after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 45px;
  height: 15px;
  background-color: #fff;
  border-radius: 10px;
  transform: rotateZ(52deg);
  transition: 0.5s ease all;
}

#s-cover:hover #s-circle {
  top: -1px;
  width: 67px;
  height: 15px;
  border-width: 0;
  background-color: #fff;
  border-radius: 20px;
}

#s-cover:hover span {
  top: 50%;
  left: 56px;
  width: 25px;
  margin-top: -9px;
  transform: rotateZ(0);
}

#s-cover:hover button span:before {
  bottom: 11px;
  transform: rotateZ(52deg);
}

#s-cover:hover button span:after {
  bottom: -11px;
  transform: rotateZ(-52deg);
}

#s-cover:hover button span:before,
#s-cover:hover button span:after {
  right: -6px;
  width: 40px;
  background-color: #fff;
}

button span.close {
  position: absolute;
  top: 20px;
  left: 5px;
  display: block;
  width: 45px;
  height: 90px;
  background-color: transparent;
  border-radius: 10px;
  transform: rotateZ(0deg);
  transition: 0.5s ease all;
}


#s-cover.close #s-circle {
  display: none;
}


#s-cover.close button span:before,
#s-cover.close button span:after {
  content: "";
  position: absolute;
  width: 60%;
  height: 90px;
  background-color: #fff;
  top: 50%;
  left: 50%;
}

#s-cover.close:hover button span::before {
  transform: translate(-50%, -50%) rotate(-45deg);
}

#s-cover.close:hover button span::after {
  transform: translate(-50%, -50%) rotate(45deg);
}

#s-cover.close button span:before {
  transform: translate(-75%, -75%) rotate(45deg);
}

#s-cover.close button span:after {
  transform: translate(-75%, -75%) rotate(-45deg);
}

.logo {
  border-radius: 28px;
  position: absolute;
  width: 250px;
  height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: space-around;
  align-items: stretch;
  flex-wrap: wrap;
}

.parsetitle,
.prolink,
.protype {
  position: absolute;
  display: flex;
  width: 380px;
  top: 15%;
  left: 52%;
  align-content: center;
  align-items: flex-end;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
  color: rgba(255, 255, 255, 0.877);
  text-align: center;
  font-size: 26px;
  font-family: sans-serif;
  font-weight: bold;
}

.prolink {
  top: 45%;
}

.parsetitle {
  top: 75%;
}

.parsetitle:hover,
.prolink:hover {
  color: skyblue;
}


.inform {
  position: absolute;
  top: 36%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.877);
  font-size: 38px;
  font-family: sans-serif;
  font-weight: bold;
  /*text-transform: uppercase;*/
  letter-spacing: 5px;
  text-shadow: 0 0 20px rgba(52, 123, 151, 0.6);
}

a {
  margin: 0 20px;
  color: #fff;
  font-size: 2rem;
  transition: all 400ms ease;
}

a:hover {
  color: #08a5e4;
}
</style>