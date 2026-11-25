<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue"
import { getOsType } from "./tauri-controls/utils/os"
import { WindowTitlebar } from "./tauri-controls"
import tauriConf from "../src-tauri/tauri.conf.json" // 直接引入
import { getCurrentWindow } from '@tauri-apps/api/window';

const appTitle = `${tauriConf.productName}_${tauriConf.version}`
import LogoSvg from "./components/LogoSvg.vue"
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  ScanText,
  Home,
  Pin,
ClipboardList
} from "lucide-vue-next"
//import Windows from "./tauri-controls/controls/Windows.vue"

// 平台状态：用于窗口控制样式判断
const os = ref<"windows" | "macos" | "gnome">("windows")

// 窗口置顶状态，用于控制图标旋转
const isPinned = ref(false)

onMounted(async () => {
  const type = await getOsType()
  if (type === "macos") os.value = "macos"
  else if (type === "linux") os.value = "gnome"
  else os.value = "windows"

  // 读取当前窗口的置顶状态（容错）
  try {
    const w = getCurrentWindow()
    const state = await w.isAlwaysOnTop()
    isPinned.value = !!state
  } catch (e) {
    // ignore when not running inside Tauri or permission denied
    // console.debug('unable to read alwaysOnTop state', e)
  }
})

import SettingsMenu from "./components/SettingsMenu.vue"
import { Settings } from "lucide-vue-next"
import router from "./router";
const showSettings = ref(false)
const settingsBtnRef = ref<HTMLElement | null>(null)
const menuRef = ref<{ root: HTMLElement | null } | null>(null)
const menuPosition = ref({ left: 0, top: 0 })

function toggleSettings() {
  showSettings.value = !showSettings.value
  if (showSettings.value) {
    nextTick(() => {
      const rect = settingsBtnRef.value?.getBoundingClientRect()
      if (rect) {
        menuPosition.value = {
          left: rect.left,
          top: rect.bottom + 4
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
    })
  } else {
    document.removeEventListener("mousedown", handleClickOutside)
  }
}

function handleClickOutside(e: MouseEvent) {
  const menu = menuRef.value?.root
  const btn = settingsBtnRef.value
  if (
    menu &&
    !menu.contains(e.target as Node) &&
    btn &&
    !btn.contains(e.target as Node)
  ) {
    showSettings.value = false
    document.removeEventListener("mousedown", handleClickOutside)
  }
}

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside)
})

// 窗口操作函数
function goBack() {
  window.history.back()
}
function goForward() {
  window.history.forward()
}
function reload() {
  location.reload()
}
function goHome() {
  window.location.href = "/"
}
function scantext() {

}
function goDataTool() {
  router.push("/data-deal-tool");
}

async function togglePin() {
try {
const w = getCurrentWindow();
const alwaysOnTop = await w.isAlwaysOnTop();
console.log('isAlwaysOnTop before:', alwaysOnTop);
await w.setAlwaysOnTop(!alwaysOnTop);
console.log('setAlwaysOnTop called, new state should be:', !alwaysOnTop);
const newState = await w.isAlwaysOnTop();
console.log('isAlwaysOnTop after:', newState);
    // 更新 UI 状态
    isPinned.value = !!newState
  } catch (err) {
    console.error('togglePin error:', err);
  }
}
</script>

<template>
  <div class="w-full h-full bg-custom-gradient text-foreground min-h-screen flex flex-col overflow-hidden relative">
    <!-- 自定义标题栏 -->
    <WindowTitlebar controlsOrder="platform" :windowControlsProps="{ platform: os }" :key="os"
      class="select-none bg-transparent text-foreground text-sm fixed top-0 left-0 right-0 z-50">
      <template #default>
        <div class="flex flex-row items-center justify-between ">
          <!-- 左侧：Logo + 菜单按钮 -->
          <div class="flex items-center gap-2" data-tauri-drag-region>
            <button class="p-1 ml-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" @click="goBack" title="后退">
              <ArrowLeft class="w-4 h-4" />
            </button>
            <button class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" @click="goForward" title="前进">
              <ArrowRight class="w-4 h-4" />
            </button>
            <button class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" @click="reload" title="刷新">
              <RefreshCw class="w-4 h-4" />
            </button>
            <button class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" @click="goHome" title="主页">
              <Home class="w-4 h-4" />
            </button>
            <button class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" @click="scantext" title="扫描">
              <ScanText class="w-4 h-4" />
            </button>
            <button class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" @click="goDataTool" title="数据工具">
              <ClipboardList class="w-4 h-4" />
            </button>
            <div class="relative">
              <button ref="settingsBtnRef" class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                @click="toggleSettings" title="设置">
                <Settings class="w-4 h-4" />
              </button>
              <SettingsMenu v-model:visible="showSettings" :position="menuPosition" ref="menuRef" />
            </div>
          </div>

          <!-- 右侧：主题切换 + 窗口控制 -->
          <!-- <div class="flex items-center gap-2">
            <WindowControls :platform="os" />
          </div> -->
        </div>
        <!-- 中间：标题 -->
        <div class="text-center flex-1 font-semibold items-center justify-center w-full h-full" data-tauri-drag-region>
          <LogoSvg class="mr-2 w-4 h-4" />
          {{ appTitle }}
        </div>
        <div class="flex flex-row items-center justify-between ">
          <!-- 左侧：Logo + 菜单按钮 -->
          <div class="flex items-center gap-2" data-tauri-drag-region>
            <button class="p-1 ml-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" @click="togglePin" title="固定">
              <Pin class="w-4 h-4" :style="{ transform: isPinned ? 'rotate(90deg)' : 'none', transition: 'transform 120ms' }" />
            </button>
          </div>
        </div>
      </template>
    </WindowTitlebar>

    <!-- 主体内容 -->
    <main class="bg-custom-gradient text-foreground flex-1 mt-10 "
      style="margin-top: 2.5rem; height: calc(100vh - 2.5rem)">
      <router-view />
    </main>
  </div>
</template>


<style scoped>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

/* 确保标题栏所有内容垂直居中 */
[data-tauri-drag-region] {
  display: flex;
  align-items: center;
}

/* 修复WindowTitlebar可能存在的内边距问题 */
.tauri-controls-window-titlebar {
  padding: 0 !important;
  min-height: 2.5rem;
  position: fixed !important;
  top: 0;
  width: 100%;
  /* 设置最小高度 */
}
</style>