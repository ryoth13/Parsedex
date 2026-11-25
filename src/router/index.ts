// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ParseTool from '../components/ParseTool.vue' // 引入你的组件
import DataDealTool from '../components/DataDealTool.vue' // 引入你的组件

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/parse-tool', component: ParseTool }, // 新增路由
    { path: '/data-deal-tool', component: DataDealTool} // 新增路由
  ],
})
