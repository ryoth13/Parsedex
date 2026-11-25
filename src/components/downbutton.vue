<template>
    <div class="fab-wrapper" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <!-- 子按钮 -->
        <button v-for="(item, i) in items" :key="item.label" class="fab-item" :style="itemStyle(i)"
            @click="item.onClick?.()" @mouseenter="keepOpen">
            <slot :name="`icon-${i}`">
                <svg viewBox="0 0 24 24" class="icon">
                    <path :d="defaultIcons[i] ?? defaultIcons[0]" />
                </svg>
            </slot>
        </button>

        <!-- 主按钮 -->
        <button class="fab-main" @click="toggle" @mouseenter="keepOpen">
            <svg viewBox="0 0 24 24" class="icon plus" :class="{ open }">
                <path d="M12 5v14M5 12h14" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { invoke } from '@tauri-apps/api/core';

type FabItem = {
    label: string;
    onClick?: () => void
}

declare global {
    interface Window {
        downloadTable?: () => void;
        Screenshot?: () => void;
        openLink?: () => void;
    }
}
const props = defineProps<{
    items?: FabItem[]
}>()

const open = ref(false)
let leaveTimer: number | null = null

// 默认子按钮
const items = computed<FabItem[]>(() =>
    props.items?.length ? props.items : [
        {
            label: "查看协议",
            onClick: () => window.openLink?.()
        },
        {
            label: "下载表格",
            onClick: () => window.downloadTable?.()
        },
        {
                label: "一键截图",
                onClick: () => { ScreenshotDeal(); }
            },
    ]
)

// 默认图标路径
const defaultIcons = [
    // 文档图标 (doc)
    "M4,4 h15 l3,3 v13 h-18 v-16 m0,16 h18 m-15-4 h12 m-12-4 h12 m-12-4 h6",
    // 下载图标
    "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
    // 截屏图标
    "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-4-4h-4v-2h2c1.1 0 2-.89 2-2V9c0-1.11-.9-2-2-2H9v2h4v2h-2c-1.1 0-2 .89-2 2v4h6v-2z"
]

const radius = 100 // 子按钮展开半径
const size = 56 // 按钮大小
const startDeg = -90
const endDeg = 0

// 平均分布角度
const angles = computed(() => {
    const n = items.value.length
    if (n === 1) return [0]
    const step = (endDeg - startDeg) / (n - 1)
    return Array.from({ length: n }, (_, i) => startDeg + i * step)
})

    
    function sendNotification(title, body, icon = '') {
        try {
            // Rust 命令签名为 send_system_notification(app: AppHandle, params: NotificationParams)
            // 所以这里传入一个名为 params 的对象
            invoke('send_system_notification', { params: { title: title, body: body, icon: icon } }).catch((e) => {
                console.error('invoke send_system_notification failed:', e);
            });
        } catch (e) {
            console.error('sendNotification error:', e);
        }
    }

async function ScreenshotDeal() {
    try {
        const fn = (window && (window as any).Screenshot);
        console.debug('ScreenshotDeal: window.Screenshot =', fn);
        if (typeof fn !== 'function') {
            // 未定义或非函数
            const msg = '截图功能未就绪';
            console.warn(msg);
            if ('__TAURI__' in window) sendNotification('截图失败', msg, '');
            else alert(msg);
            return;
        }

        // 执行截图函数并等待结果
        console.debug('Tauri environment check:', '__TAURI__' in window);
        const result = await fn();
        
        // 根据结果发送对应的通知
        if (result) {
            if ('__TAURI__' in window) {
                console.debug('Sending success notification via Tauri');
                sendNotification('Screenshot', '截图成功', '');
            } else {
                console.debug('Showing success alert');
                alert('截图成功');
            }
        } else {
            if ('__TAURI__' in window) {
                console.debug('Sending failure notification via Tauri');
                sendNotification('Screenshot', '截图失败', '');
            } else {
                console.debug('Showing failure alert');
                alert('截图失败');
            }
        }
    } catch (e) {
        console.error('ScreenshotDeal error:', e);
        const msg = String(e ?? '未知错误');
        if ('__TAURI__' in window) sendNotification('Screenshot', msg, '');
        else alert('截图失败: ' + msg);
    }
}

function polarToTranslate(deg: number, r: number) {
    const rad = (deg * Math.PI) / 180
    const x = Math.cos(rad) * r
    const y = Math.sin(rad) * r
    return { x, y }
}

function itemStyle(i: number) {
    const angle = angles.value[i]
    const { x, y } = polarToTranslate(angle, radius)
    const tx = open.value ? `${-x}px` : "0px" // 朝左
    const ty = open.value ? `${y}px` : "0px"
    const delay = i * 60

    return {
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(${tx}, ${ty}) scale(${open.value ? 1 : 0.6})`,
        opacity: open.value ? 1 : 0,
        transition: `all 0.3s cubic-bezier(.2,.8,.2,1) ${delay}ms`,
    }
}

function toggle() {
    open.value = !open.value
}

// 处理鼠标进入
function handleMouseEnter() {
    if (leaveTimer) {
        clearTimeout(leaveTimer)
        leaveTimer = null
    }
    open.value = true
}

// 处理鼠标离开
function handleMouseLeave() {
    leaveTimer = window.setTimeout(() => {
        open.value = false
        leaveTimer = null
    }, 200) // 短暂延迟，防止快速移动导致的闪烁
}

// 保持打开状态
function keepOpen() {
    if (leaveTimer) {
        clearTimeout(leaveTimer)
        leaveTimer = null
    }
    open.value = true
}

// 清理定时器
onUnmounted(() => {
    if (leaveTimer) {
        clearTimeout(leaveTimer)
    }
})
</script>

<style scoped>
.fab-wrapper {
    position: absolute;
    bottom: 20px;
    right: 20px;
    /* 增加容器尺寸，防止鼠标快速移动时离开容器 */
    padding: 10px;
    /* 确保容器能捕获所有子元素的鼠标事件 */
    pointer-events: auto;
}

/* 液态玻璃效果 */
.fab-main,
.fab-item {
    border: none;
    border-radius: 50%;
    backdrop-filter: blur(12px) saturate(1.5);
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2),
        inset 0 1px 1px rgba(255, 255, 255, 0.6),
        inset 0 -2px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    /* 防止按钮本身的事件冒泡问题 */
    pointer-events: auto;
    transition: transform 0.2s ease;
}

/* 主按钮大一号 */
.fab-main {
    width: 64px;
    height: 64px;
    z-index: 10;
    /* 确保主按钮在最上层 */
}

.fab-main:hover {
    transform: scale(1.05);
}

/* 子按钮初始位置叠在主按钮 */
.fab-item {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 5;
    /* 子按钮在主按钮下方 */
}

/* 子按钮hover效果 */
.fab-item:hover {
    transform: scale(1.05);
}

/* 图标样式 */
.icon {
    width: 24px;
    height: 24px;
    stroke: #ffffff;
    stroke-width: 2;
    fill: none;
}

/* 主按钮加号动画 */
.plus {
    transition: transform 0.25s ease;
}

.plus.open {
    transform: rotate(45deg);
}
</style>
