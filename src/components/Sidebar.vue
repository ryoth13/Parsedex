<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const isOpen = ref(false)
        const router = useRouter();

        const toggleMenu = () => {
            isOpen.value = !isOpen.value
        }

        function handleToolClick(toolName) {
            let inputData = '';
            let inputtype = toolName + '工具';
            let inputkey = false;
            let inputpro = toolName + '.js';
            let inputlink = '';
            let result = null;
            router.push({
                path: '/parse-tool',
                query: {
                    inputData,
                    inputtype,
                    inputkey,
                    inputpro,
                    inputlink
                }
            }).then(() => {
                window.location.reload();
            });
        }

        return { isOpen, toggleMenu, handleToolClick }
    }
}
</script>
<template>
    <nav :class="{ 'nav-open': isOpen }">
        <div class="menu-btn" @click="toggleMenu">
            <div :class="['line', 'line--1', { 'line-cross': isOpen }]"></div>
            <div :class="['line', 'line--2', { 'line-fade-out': isOpen }]"></div>
            <div :class="['line', 'line--3', { 'line-cross': isOpen }]"></div>
        </div>
        <div class="nav-links" :class="{ 'fade-in': isOpen }">
            <a target="_blank" class="link" @click="handleToolClick('demo协议解析')">demo协议解析工具</a>
        </div>
    </nav>
</template>

<style scoped>
nav {
    overflow: hidden;
    position: absolute;
    z-index: 2;
    transform: translateX(-300px);
    height: 100%;
    width: 380px;
    transition: all 800ms cubic-bezier(.8, 0, .33, 1);
    border-radius: 0% 0% 100% 50%;
}

nav.nav-open {
    transform: translateX(0px);
    /* 液态玻璃效果 */
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.1),
        inset 0 1px 1px rgba(255, 255, 255, 0.3);
    border-radius: 0px 20px 20px 0px;

}

nav .menu-btn {
    position: absolute;
    top: 20px;
    right: 5%;
    padding: 0;
    width: 30px;
    cursor: pointer;
    z-index: 2;
}

nav .menu-btn .line {
    padding: 0;
    width: 30px;
    background: #fff;
    height: 2px;
    margin: 5px 0;
    transition: all 700ms cubic-bezier(.9, 0, .33, 1);
}

nav .menu-btn .line.line--1 {
    width: 30px;
    transform: rotate(0) translateY(0);
}

nav .menu-btn .line.line--1.line-cross {
    width: 30px;
    transform: rotate(45deg) translateY(10px);
    background: rgba(255, 255, 255, 0.6);
    box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.1),
        inset 0 1px 1px rgba(255, 255, 255, 0.4);
}

nav .menu-btn .line.line--2 {
    width: 28px;
    transform: translateX(0);
}

nav .menu-btn .line.line--2.line-fade-out {
    width: 28px;
    transform: translate(30px);
    opacity: 0;
}

nav .menu-btn .line.line--3 {
    width: 20px;
    transform: rotate(0) translateY(0);
}

nav .menu-btn .line.line--3.line-cross {
    width: 30px;
    transform: rotate(-45deg) translateY(-10px);
    background: rgba(255, 255, 255, 0.6);
    box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.1),
        inset 0 1px 1px rgba(255, 255, 255, 0.4);
}

nav .nav-links {
    position: absolute;
    top: 6%;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    transform: translateX(-100px);
    opacity: 0;
    transition: all 900ms cubic-bezier(.9, 0, .33, 1);
    overflow-y: scroll;
    flex-direction: column;
    align-content: center;
    flex-wrap: nowrap;
}

nav .nav-links.fade-in {
    opacity: 1;
    transform: translateX(0px);
}

nav .nav-links .link {
    margin: 20px 0;
    text-decoration: none;
    font-family: sans-serif;
    font-weight: 700;
    font-size: 1.2rem;
    transition: all 300ms cubic-bezier(.9, 0, .33, 1);
    /* 液态玻璃字体效果 */
    /* background: linear-gradient(90deg, #ffffff 0%, #aee9f7 50%, #67d491 100%); */
    /* -webkit-background-clip: text; */
    /* -webkit-text-fill-color: transparent; */
    /* color: transparent; */
    /* text-shadow:
        0 2px 8px rgba(255,255,255,0.6),
        0 1px 2px rgba(103,212,145,0.3); */
    filter: drop-shadow(0 0 6px rgba(255,255,255,0.3));
}

nav .nav-links .link:hover {
    /* 液态玻璃悬停效果 */
    background: linear-gradient(90deg, #67d491 0%, #aee9f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    text-shadow:
        0 4px 16px rgba(103,212,145,0.7),
        0 1px 2px rgba(255,255,255,0.5);
    filter: drop-shadow(0 0 12px rgba(103,212,145,0.5));
}

/* 隐藏浏览器默认滚动条 */
nav .nav-links::-webkit-scrollbar {
    display: none;
}

/* 自定义滚动条的样式 */
nav .nav-links {
    scrollbar-width: thin;
    /* 在支持的浏览器上设置滚动条的宽度 */
    scrollbar-color: transparent transparent;
    /* 设置滚动条的颜色 */
}

/* 滚动条滑块 */
nav .nav-links::-webkit-scrollbar-thumb {
    background-color: transparent;
    /* 滑块颜色 */
    border-left: 2px solid rgba(255, 255, 255, 0.6);
    /* 左边框样式 */
}

/* 滚动条滑块悬停时的样式 */
nav .nav-links::-webkit-scrollbar-thumb:hover {
    background-color: transparent;
    /* 悬停时的颜色 */
    border-left: 2px solid rgba(255, 255, 255, 0.8);
    /* 左边框悬停时的样式 */
}
</style>