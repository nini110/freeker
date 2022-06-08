<template>
  <a-config-provider
    component-size="large"
    :locale="locale === 'en' ? enUS : zhCN"
  >
    <router-view></router-view>
  </a-config-provider>
</template>
<script setup>
import { ref } from "vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("en");
let locale = ref("cn");
</script>

<style>
@import "./assets/font/index.css";
#app {
  /* font-family: yahei; */
  font-family: -apple-system, SF UI Text, Arial, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #303133;
  height: 100%;
}
</style>
