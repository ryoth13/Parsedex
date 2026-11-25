<template>
  <div
    ref="root"
    v-if="visible"
    class="fixed z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-lg shadow-lg p-4 min-w-[180px]"
    :style="{ left: `${props.position.left}px`, top: `${props.position.top}px` }"
    @mousedown.stop
  >
    <ul>
      <li @click="checkUpdate" class="menu-item">
        <RefreshCw class="w-4 h-4 mr-2" /> 检查更新
      </li>
      <li @mouseenter="showTheme = true" @mouseleave="showTheme = false" class="menu-item relative">
        <SunMoon class="w-4 h-4 mr-2" /> 切换主题
        <ul v-if="showTheme" class="absolute left-full top-0 ml-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded shadow p-2 min-w-[120px]">
          <li @click="setTheme('light')" class="submenu-item"><Sun class="w-4 h-4 mr-2" /> 明亮</li>
          <li @click="setTheme('dark')" class="submenu-item"><Moon class="w-4 h-4 mr-2" /> 黑夜</li>
          <li @click="setTheme('classic')" class="submenu-item"><Palette class="w-4 h-4 mr-2" /> 经典</li>
        </ul>
      </li>
      <li @click="showLog" class="menu-item">
        <List class="w-4 h-4 mr-2" /> 更新日志
      </li>
      <li @mouseenter="moretool = true" @mouseleave="moretool = false" class="menu-item relative">
        <ToolCase class="w-4 h-4 mr-2" /> 更多工具
        <ul v-if="moretool" class="absolute left-full top-0 ml-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded shadow p-2 min-w-[120px]">
          <a  href="https://ryoth13.github.io/parsedatatool/tool.html" target="_blank" class="submenu-item"><Earth class="w-4 h-4 mr-2" /> 数据处理工具</a>
         </ul>
      </li>
      <li @click="showAbout" class="menu-item">
        <Info class="w-4 h-4 mr-2" /> 关于
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue"
import { RefreshCw, SunMoon, Sun, Moon, Palette, List, Info, ToolCase, Earth } from "lucide-vue-next"

const visible = defineModel<boolean>("visible")
const showTheme = ref(false)
const props = defineProps<{ position: { left: number, top: number } }>()
const moretool = ref(false);

const root = ref<HTMLElement | null>(null)
defineExpose({ root })

function checkUpdate() {
  // 检查更新逻辑
}
function setTheme(_theme: string) {
  // 切换主题逻辑
}
function showLog() {
  // 显示更新日志
}
function showAbout() {
  // 显示关于信息
}
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}
.menu-item:hover, .submenu-item:hover {
  background: rgba(120,120,120,0.12);
  backdrop-filter: blur(8px);
}
.submenu-item {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}
</style>