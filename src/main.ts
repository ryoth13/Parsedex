// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import "./styles.css"
import router from './router'
import { invoke } from '@tauri-apps/api/core'

const app = createApp(App)
app.use(router)
app.mount('#app')

if ('__TAURI__' in window) {
    const hookClick = (e) => {
        const origin = e.target.closest('a')
        const isBaseTargetBlank = document.querySelector(
            'head base[target="_blank"]'
        )
        console.log('origin', origin, isBaseTargetBlank)
        invoke('open_url', { url: origin.href })
    }
    document.addEventListener('click', hookClick, { capture: true })
}
