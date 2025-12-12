import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Импорт глобальных стилей
import './assets/style.css'

const app = createApp(App)

app.use(router)
app.use(store)

// Обработка глобальных ошибок
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
}

app.mount('#app')

// Загружаем сохраненные результаты при запуске
store.dispatch('loadFromStorage')