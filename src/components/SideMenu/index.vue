<template>
  <div class="sideMenu">
    <a-menu
      v-model:selectedKeys="selectedMenu"
      mode="inline"
    >
      <a-menu-item
        v-for="item in menuList"
        :key="item.name"
        @click="menuSelect(item)"
      >
        <svg class="icon svg-icon menuIcon" aria-hidden="true">
          <use :xlink:href="item.meta.icon"></use>
        </svg>
        <span>{{ item.meta.txt }}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, watch, onBeforeMount, toRefs, computed } from "vue";
let $route = useRoute();
let $router = useRouter();
const routeMenu = computed(() => {
  return global.antRouter;
});
// 菜单相关
let { menuList, selectedMenu, menuSelect } = relate_menu();
function relate_menu() {
  const stateData = reactive({
    menuList: [],
    selectedMenu: ["projectCenter"],
  });
  let menuSelect = (item) => {
    stateData.selectedMenu = [item.name];
    $router.push({
      path: `/${item.faName}/${item.name}`,
    });
  };
  let watchRouteMenu = watch(
    routeMenu,
    (newval, oldval) => {
      newval.forEach((val, idx) => {
        if (val.children) {
          val.children.forEach((item, index) => {
            item.faName = val.name;
            stateData.menuList.push(item);
          });
        }
      });
    },
    { immediate: true, deep: true }
  );
  let $watchCurrentRoute = watch(
    $route,
    (newval, oldval) => {
      stateData.selectedMenu = [newval.name];
    },
    { immediate: true, deep: true }
  );
  return { ...toRefs(stateData), menuSelect };
}
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>