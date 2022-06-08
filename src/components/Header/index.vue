<template>
<div class="header ts">
  <div class="headerBox ts">
    <div class="headerBox_img">
      <img src="../../assets/logo.png" alt="" />
    </div>
    <div class="headerBox_search">
      <div class="headerBox_search_txt" @click="openMsgDialog">
        <a-badge count="new">
          <sound-outlined />
        </a-badge>
        <p>消息</p>
      </div>
      <a-input
        size="large"
        v-model:value="searchVal"
        placeholder="搜索"
        @pressEnter="onEnterSearch"
      />
    </div>
    <div class="headerBox_menu">
      <a-menu
        v-model:selectedKeys="currentMenu"
        mode="horizontal"
        @select="menuClick"
      >
        <a-menu-item key="home">首页</a-menu-item>
        <a-sub-menu key="option" popupClassName="submenu">
          <template #title>菜单</template>
          <a-menu-item key="projectCenter">项目中心</a-menu-item>
          <a-menu-item key="planCenter">任务中心</a-menu-item>
          <a-menu-item key="balanceCenter">结算中心</a-menu-item>
        </a-sub-menu>
      </a-menu>
      <p class="user" @click="openDialog">
        <img src="../../assets/user.png" alt="" />
        <span> 小明</span>
      </p>
      <p class="user" @click="openLoginDialog">
        <frown-outlined /><span>未登录</span>
      </p>
    </div>
  </div>
  </div>
  <MsgDialog :showMsg="showMsg" @changeMsgTag="changeMsgTag"></MsgDialog>
  <UserDialog
    :showDialog="showDialog"
    @changeDialogTag="changeDialogTag"
  ></UserDialog>
  <LoginDialog
    :showLogin="showLogin"
    @changeLogTag="changeLogTag"
  ></LoginDialog>
</template>
<script setup>
import { FrownOutlined, SoundOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserDialog from "./user/index.vue";
import LoginDialog from "../Login/index.vue";
import MsgDialog from "../MsgDialog/index.vue";
let $route = useRoute();
let $router = useRouter();
// 搜索相关
let { searchVal, onEnterSearch } = relate_search();
function relate_search() {
  let searchVal = ref("");
  let onEnterSearch = () => {
    searchVal.value = "";
    message.success({
      content: "开始搜索了",
      duration: 1,
    });
  };
  return { searchVal, onEnterSearch };
}
// 菜单相关
let { currentMenu, menuClick, $watch } = relate_menu();
function relate_menu() {
  const currentMenu = reactive([$route.name]);
  let menuClick = (item) => {
    currentMenu.length = 0;
    currentMenu.push(item.key);
    $router.push({
      path: `/${item.key}`,
    });
  };
  let $watch = watch(
    () => $route.name,
    (newval, oldval) => {
      currentMenu.length = 0;
      currentMenu.push(newval);
    },
    { immediate: false }
  );
  return { currentMenu, menuClick, $watch };
}
// 消息弹层
let {showMsg, openMsgDialog, changeMsgTag} = relate_msg()
function relate_msg () {
  let showMsg = ref(false)
  let openMsgDialog = () => {
    showMsg.value = true
  }
  let changeMsgTag = () => {
    showMsg.value = false
  }
  return {showMsg, openMsgDialog, changeMsgTag}
}
// 用户弹层相关
let { showDialog, openDialog, changeDialogTag } = relate_user();
function relate_user() {
  let showDialog = ref(false);
  let openDialog = () => {
    showDialog.value = true;
  };
  let changeDialogTag = () => {
    showDialog.value = false;
  };
  return { showDialog, openDialog, changeDialogTag };
}
// 登录
let { showLogin, openLoginDialog, changeLogTag } = relate_login();
function relate_login() {
  let showLogin = ref(false);
  let openLoginDialog = () => {
    showLogin.value = true;
  };
  let changeLogTag = () => {
    showLogin.value = false;
  };
  return { showLogin, openLoginDialog, changeLogTag };
}
</script>
<style lang="scss" scoped>
@import "index";
</style>