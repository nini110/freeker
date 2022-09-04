<template>
  <div class="header ts">
    <div class="headerBox ts">
      <div class="headerBox_img">
        <img src="../../assets/logo.png" alt="" />
        <a-menu
          v-model:selectedKeys="currentMenu"
          mode="horizontal"
          @select="menuClick"
        >
          <!-- <div v-for="(item, idx) in routeMenu" :key="idx">
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
          </div> -->
          <a-menu-item :key="routeMenu[0].name">{{ routeMenu[0].meta.txt }}</a-menu-item>
          <a-sub-menu :key="routeMenu[1].name" popupClassName="headerMenu">
            <template #title>{{ routeMenu[1].meta.txt }}</template>
            <a-menu-item v-for="item1 in routeMenu[1].children" :key="item1.name">{{
              item1.meta.txt
            }}</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>
      <div class="headerBox_user">
        <div
          v-if="store.getters.account"
          class="headerBox_search_txt"
          @click="openMsgDialog"
        >
          <a-badge color="#f50" :count="countNum">
            <sound-outlined />消息
          </a-badge>
        </div>
        <div v-if="store.getters.account">
          <a-popover
            placement="rightBottom"
            overlayClassName="userPopver"
            arrow-point-at-center
          >
            <template #content>
              <p class="t3" @click="openDialog"><user-outlined />个人信息</p>
              <p class="t4" @click="logoutEvent">
                <poweroff-outlined />退出登录
              </p>
            </template>
            <template #title>
              <p class="t1">
                <heart-two-tone two-tone-color="#eb2f96" />{{
                  store.getters.username
                }}
              </p>
              <p class="t2"><span>账号</span>{{ store.getters.account }}</p>
            </template>
            <img :src="store.getters.userImg" alt="" />
          </a-popover>
        </div>
        <div v-else class="loin" @click="openLoginDialog">登录</div>
      </div>
    </div>
  </div>
  <MsgDialog :showMsg="showMsg" @changeMsgTag="changeMsgTag"></MsgDialog>
  <UserDialog
    :showDialog="showDialog"
    @changeDialogTag="changeDialogTag"
    @reGetUser="reGetUser"
    @reGetZiZhi="reGetZiZhi"
    @reGetMst="reGetMst"
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
  PoweroffOutlined,
  UserOutlined,
  HeartTwoTone,
  SoundOutlined,
} from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import {
  ref,
  reactive,
  watch,
  toRefs,
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import UserDialog from "./user/index.vue";
import LoginDialog from "../Login/index.vue";
import MsgDialog from "../MsgDialog/index.vue";
import { userDetail, searchMst, getZizhi, stationMailList } from "@/api/api";
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
let {
  showMsg,
  mailList,
  countNum,
  apiPort_mail_no,
  openMsgDialog,
  changeMsgTag,
} = relate_msg();
function relate_msg() {
  let stateData = reactive({
    showMsg: false,
    mailList: [],
    countNum: 0,
  });
  // 获取未读条数
  let apiPort_mail_no = () => {
    stationMailList({
      ordering: "",
      mail_status: 0,
      page: 1,
      page_size: 100,
    }).then((res) => {
      if (res.data.code === 200) {
        stateData.countNum = res.data.data.length;
      }
    });
  };
  let openMsgDialog = () => {
    stateData.showMsg = true;
  };
  let changeMsgTag = () => {
    stateData.showMsg = false;
    apiPort_mail_no();
  };
  return { ...toRefs(stateData), apiPort_mail_no, openMsgDialog, changeMsgTag };
}
// 用户弹层相关
let {
  showDialog,
  userInfo,
  zizhiList,
  mstList,
  reGetUser,
  reGetZiZhi,
  reGetMst,
  openDialog,
  changeDialogTag,
} = relate_user();
function relate_user() {
  let stateData = reactive({
    showDialog: false,
    userInfo: {},
    zizhiList: [], // 资质列表
    mstList: [], // 美事通列表
  });
  // 获取用户信息
  let reGetUser = async () => {
    await userDetail({ no: "" }).then((res) => {
      // 用户
      if (res.data.code === 200) {
        let result = res.data.data;
        stateData.userInfo = result;
        stateData.userInfo.imageUrl = store.getters.userImg;
      } else {
        message.error("用户信息查询失败");
      }
    });
  };
  // 获取美事通
  let reGetMst = async () => {
    await searchMst({ no: "" }).then((res) => {
      // 美事通
      if (res.data.code === 200) {
        stateData.mstList = res.data.data;
      } else {
        message.error("美事通信息查询失败");
      }
    });
  };
  // 获取资质
  let reGetZiZhi = async () => {
    await getZizhi({
      no: "",
    }).then((res) => {
      // 资质
      if (res.data.code === 200) {
        stateData.zizhiList = [];
        let result = res.data.data;
        result.forEach((val, idx) => {
          switch (val.platform) {
            case 1:
              val.platformCn = "京东";
              val.color = "#f24239ed";
              break;
            case 2:
              val.platformCn = "抖音";
              val.color = "#544b4b";
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
            ...val,
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
  let openDialog = async () => {
    await reGetMst();
    await reGetUser();
    await reGetZiZhi();
    stateData.showDialog = true;
  };
  let changeDialogTag = () => {
    stateData.showDialog = false;
  };
  let watch_acountId = watch(
    store.state.pageData,
    (newval, oldval) => {
      if (newval.accountId) {
        reGetUser();
      }
    },
    { immediate: true }
  );
  return {
    ...toRefs(stateData),
    reGetUser,
    reGetZiZhi,
    reGetMst,
    openDialog,
    changeDialogTag,
  };
}
// 登录
let { showLogin, interval, logoutEvent, openLoginDialog, changeLogTag } =
  relate_login();
function relate_login() {
  let stateData = reactive({
    showLogin: false,
    interval: null,
  });
  let openLoginDialog = () => {
    stateData.showLogin = true;
  };
  // 定时器
  let intervalSet = () => {
    apiPort_mail_no();
    stateData.interval = setInterval(() => {
      apiPort_mail_no();
    }, 30000);
  };
  let intervalMove = () => {
    clearInterval(stateData.interval);
    stateData.interval = null;
  };
  let watchStore = watch(
    store.state.interval,
    (newval, oldval) => {
      intervalMove();
      if (newval.intervalTag) {
        intervalSet();
      } else {
        intervalMove();
      }
    },
    { immediate: true }
  );
  // 退出登录
  let logoutEvent = () => {
    Modal.confirm({
      title: "是否确认退出当前账号?",
      centered: true,
      okText: "退出",
      cancelText: "取消",
      onOk() {
        store.commit("pageData/SET_SSO", "");
        store.commit("pageData/SET_USERNAME", "");
        store.commit("pageData/SET_ACCOUNT", "");
        store.commit("pageData/SET_ACCOUNTID", null);
        store.commit("pageData/SET_USERIMG", "");
        store.commit("interval/SET_INTERVALTAG", false);
        $router.replace({
          path: "/home",
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  // 登录
  let changeLogTag = (val) => {
    stateData.showLogin = false;
    store.commit("interval/SET_INTERVALTAG", val);
  };
  onMounted(() => {
    store.commit(
      "interval/SET_INTERVALTAG",
      store.getters.account ? true : false
    );
  });
  onUnmounted(() => {
    store.commit("interval/SET_INTERVALTAG", false);
  });
  return { ...toRefs(stateData), logoutEvent, openLoginDialog, changeLogTag };
}
</script>
<style lang="scss" scoped>
@import "index";
</style>