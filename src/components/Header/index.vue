<template>
  <div class="header ts">
    <div class="headerBox ts">
      <div class="headerBox_img">
        <img src="../../assets/logo.png" alt="" />
      </div>
      <div class="headerBox_menu">
        <a-menu
          v-model:selectedKeys="currentMenu"
          mode="horizontal"
          @select="menuClick"
        >
          <div v-for="(item, idx) in routeMenu" :key="idx">
            <a-sub-menu
              v-if="item.children"
              :key="item.name"
              popupClassName="headerMenu"
            >
              <template #title>{{ item.meta.txt }}</template>
              <a-menu-item v-for="item1 in item.children" :key="item1.name">{{
                item1.meta.txt
              }}</a-menu-item>
            </a-sub-menu>
            <a-menu-item v-else :key="item.name">{{
              item.meta.txt
            }}</a-menu-item>
          </div>
        </a-menu>
      </div>
      <div class="headerBox_user">
        <div class="headerBox_search_txt" @click="openMsgDialog">
          <a-badge count="new">
            <sound-outlined />
          </a-badge>
          <p>消息</p>
        </div>        
        <div v-if="store.getters.account">
          <a-popover placement="bottom" overlayClassName="userPopver">
            <template #content>
              <p class="t3" @click="openDialog"><user-outlined />个人信息</p>
              <p class="t4" @click="logoutEvent"><poweroff-outlined />退出登录</p>
            </template>
            <template #title>
              <p class="t1"><smile-outlined />{{ store.getters.account }}</p>
              <p class="t2"><span>账号</span>{{ store.getters.account }}</p>
            </template>
            <img :src="store.getters.userImg" alt="" @click="openDialog" />
          </a-popover>
        </div>
        <div v-else @click="openLoginDialog">登录</div>
      </div>
    </div>
  </div>
  <MsgDialog :showMsg="showMsg" @changeMsgTag="changeMsgTag"></MsgDialog>
  <UserDialog
    :showDialog="showDialog"
    @changeDialogTag="changeDialogTag"
    @closeMstDialog="closeMstDialog"
    :userInfo="userInfo"
    :zizhiList="zizhiList"
    :mstList="mstList"
  ></UserDialog>
  <LoginDialog
    :showLogin="showLogin"
    @changeLogTag="changeLogTag"
  ></LoginDialog>
</template>
<script setup>
import {
  UserOutlined,
  FrownOutlined,
  SoundOutlined,
  PoweroffOutlined,
  SmileOutlined
} from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import { ref, reactive, watch, toRefs, computed, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import UserDialog from "./user/index.vue";
import LoginDialog from "../Login/index.vue";
import MsgDialog from "../MsgDialog/index.vue";
import { userDetail, getZizhi, stationMailList } from "@/api/api";

const store = useStore();
let $route = useRoute();
let $router = useRouter();
const routeMenu = computed(() => {
  return global.antRouter;
});
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
let { currentMenu, menuClick } = relate_menu();
function relate_menu() {
  const stateData = reactive({
    currentMenu: [],
  });
  let menuClick = (item) => {
    stateData.currentMenu = [item.key];
    $router.push({
      path:
        item.keyPath.length > 1
          ? `/${item.keyPath[0]}/${item.keyPath[1]}`
          : `/${item.keyPath[0]}`,
    });
  };
  let $watch = watch(
    $route,
    (newval, oldval) => {
      stateData.currentMenu = [newval.name];
    },
    { immediate: true, deep: true }
  );
  return { ...toRefs(stateData), menuClick };
}
// 消息弹层
let { showMsg, mailList, openMsgDialog, changeMsgTag } = relate_msg();
function relate_msg() {
  let stateData = reactive({
    showMsg: false,
    mailList: [],
  });
  let apiPort_list = () => {
    stationMailList({
      no: "",
    }).then((res) => {});
  };
  let openMsgDialog = () => {
    stateData.showMsg = true;
  };
  let changeMsgTag = () => {
    stateData.showMsg = false;
  };
  onBeforeMount(() => {
    apiPort_list();
  });
  return { ...toRefs(stateData), openMsgDialog, changeMsgTag };
}
// 用户弹层相关
let {
  showDialog,
  userInfo,
  zizhiList,
  mstList,
  openDialog,
  changeDialogTag,
  closeMstDialog,
} = relate_user();
function relate_user() {
  let stateData = reactive({
    showDialog: false,
    userInfo: {},
    zizhiList: [], // 资质列表
    mstList: [], // 美事通列表
  });
  // 用户信息
  let apiPort_user = () => {
    Promise.all([
      userDetail({ no: "" }),
      getZizhi({
        no: "",
        page: 1,
        page_size: 100,
      }),
    ]).then((res) => {
      // 用户
      if (res[0].data.code === 200) {
        let result = res[0].data.data;
        stateData.userInfo = result;
        stateData.userInfo.imageUrl = store.getters.userImg;
        stateData.mstList = result.mst_account
          ? result.mst_account.split(",")
          : [];
      } else {
        message.error("用户信息查询失败");
      }
      // 资质
      if (res[0].data.code === 200) {
        stateData.zizhiList = [];
        let result = res[1].data.data;
        result.forEach((val, idx) => {
          switch (val.platform) {
            case 1:
              val.platformCn = "京东";
              val.color = "#e1251b";

              break;
            case 2:
              val.platformCn = "抖音";
              val.color = "#333";

              break;
          }
          switch (val.cert_level) {
            case 1:
              val.cert_levelCn = "初级投手";
              break;
            case 2:
              val.cert_levelCn = "中级投手";
              break;
            case 3:
              val.cert_levelCn = "高级投手";
              break;
          }
          stateData.zizhiList.push({
            platform: val.platform,
            color: val.color,
            txt: val.platformCn + val.cert_levelCn,
          });
        });
      } else {
        message.error("资质信息查询失败");
      }
    });
  };
  let openDialog = () => {
    apiPort_user();
    stateData.showDialog = true;
  };
  let changeDialogTag = () => {
    stateData.showDialog = false;
  };
  let watch_acountId = watch(
    store,
    (newval, oldval) => {
      if (store.getters.accountId) {
        apiPort_user();
      }
    },
    { immediate: true, deep: true }
  );
  let closeMstDialog = () => {
    apiPort_user();
  };
  return { ...toRefs(stateData), openDialog, changeDialogTag, closeMstDialog };
}
// 登录
let { showLogin, logoutEvent, openLoginDialog, changeLogTag } = relate_login();
function relate_login() {
  let stateData = reactive({
    showLogin: false,
  });

  let openLoginDialog = () => {
    stateData.showLogin = true;
  };
  // 退出登录
  let logoutEvent = () => {
    Modal.confirm({
      title: "是否确认退出当前账号?",
      centered: true,
      okText: "退出",
      cancelText: "取消",
      onOk() {
        localStorage.removeItem("token");
        store.commit("pageData/SET_ACCOUNT", "");
        store.commit("pageData/SET_ACCOUNTID", null);
        store.commit("pageData/SET_USERIMG", "");
        $router.replace({
          path: "/home",
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  let changeLogTag = () => {
    stateData.showLogin = false;
  };
  return { ...toRefs(stateData), logoutEvent, openLoginDialog, changeLogTag };
}
</script>
<style lang="scss" scoped>
@import "index";
</style>