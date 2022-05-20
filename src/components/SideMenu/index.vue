<template>
  <div class="sideMenu">
    <a-menu
      v-model:selectedKeys="selectedMenu"
      mode="inline"
      :open-keys="openKeys"
      @select="menuSelect"
    >
      <a-menu-item key="projectCenter">
        <span class="iconfont icon-xiangmu">项目中心</span>
      </a-menu-item>
      <a-menu-item key="planCenter">
        <span class="iconfont icon-renwubanli1">任务中心</span>
      </a-menu-item>
      <a-menu-item key="balanceCenter">
        <span class="iconfont icon-jiesuan">结算中心</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, watch, onBeforeMount } from "vue";
let $route = useRoute();
let $router = useRouter();
// 菜单相关
let { selectedMenu, openKeys, menuSelect, $watch } = relate_menu();
function relate_menu() {
  const selectedMenu = reactive(["projectCenter"]);
  const openKeys = reactive(["planCenter"]);
  let menuSelect = ({ item, key, keypath }) => {
    selectedMenu.length = 0;
    selectedMenu.push(key);
    // openKeys.length = 0;
    // openKeys.push(key);
    $router.push({
      path: `/${key}`,
    });
  };
  let $watch = watch(
    () => $route.name,
    (newval, oldval) => {
      selectedMenu.length = 0;
      selectedMenu.push(newval);
    },
    { immediate: true }
  );

  return { selectedMenu, openKeys, menuSelect, $watch };
}
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>