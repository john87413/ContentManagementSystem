// 引入需要的組件
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElSelect,
  ElOption,
  ElMenu,
  ElMenuItem,
  ElMenuItemGroup,
  ElSubMenu,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElTabs,
  ElTabPane,
  ElUpload,
  ElIcon,
  ElDialog,
  ElInputNumber,
  ElSwitch,
  ElRadio,
  ElRadioGroup,
  ElRate,
  ElLoading,
  ElRow,
  ElCol,
  ElEmpty
} from 'element-plus'

// 引入樣式
import './assets/main.css'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 註冊組件
const components = [
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElSelect,
  ElOption,
  ElMenu,
  ElMenuItem,
  ElMenuItemGroup,
  ElSubMenu,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElTabs,
  ElTabPane,
  ElUpload,
  ElIcon,
  ElDialog,
  ElInputNumber,
  ElSwitch,
  ElRadio,
  ElRadioGroup,
  ElRate,
  ElRow,
  ElCol,
  ElEmpty
]

// 批量註冊組件
components.forEach(component => {
  app.component(component.name, component)
})


app.use(ElLoading)
app.use(createPinia())
app.use(router)

app.mount('#app')