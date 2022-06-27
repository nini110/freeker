<template>
  <div ref="aff">
    <a-modal
      v-model:visible="diaVisible"
      @cancel="handlecancel"
      :footer="null"
      centered
      :maskClosable="false"
      :keyboard="false"
      :width="660"
      forceRender
      :getContainer="$refs.aff"
    >
      <div class="login">
        <div class="login_left">
          <h2>灵狐用工</h2>
          <p><check-outlined />看看我是特点一</p>
          <p><check-outlined />看看我是特点二</p>
          <p><check-outlined />看看我是特点三</p>
        </div>
        <div class="login_right">
          <div class="login_right_box" v-if="tabTag === 1">
            <a-tabs v-model:activeKey="activeTabKey" @tabClick="tabClick">
              <a-tab-pane :key="1" tab="密码登录" force-render></a-tab-pane>
              <a-tab-pane :key="2" tab="免密登录"></a-tab-pane>
            </a-tabs>
            <a-form :model="formState" name="normal_login">
              <a-form-item label="" name="account" placeholder="账户">
                <a-input
                  v-model:value="formState.account"
                  placeholder="账户"
                  allow-clear
                >
                  <template #prefix>
                    <UserOutlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item v-if="activeTabKey === 1" label="" name="密码">
                <a-input-password
                  v-model:value="formState.password"
                  placeholder="密码"
                  allow-clear
                >
                  <template #prefix>
                    <LockOutlined class="site-form-item-icon" />
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item v-else label="" name="phoneCode">
                <a-input-search
                  v-model:value="formState.phoneCode"
                  placeholder="6位短信验证码"
                  @search="onSearch"
                  allow-clear
                >
                  <template #enterButton>
                    <a-button>发送验证码</a-button>
                  </template>
                  <template #prefix>
                    <LockOutlined class="site-form-item-icon" /> </template
                ></a-input-search>
              </a-form-item>
              <a-form-item class="zhuceItem">
                <a-button
                  type="primary"
                  html-type="submit"
                  class="login-form-button"
                  @click="loginEvent"
                >
                  登录
                </a-button>
                <span class="zhuce" @click="wayClick(3)">注册</span>
              </a-form-item>
            </a-form>
          </div>
          <div class="login_right_box" v-else-if="tabTag === 3">
            <a-form :model="formRegister" name="normal_login">
              <a-form-item label="" name="account" placeholder="账号">
                <a-input
                  v-model:value="formRegister.account"
                  placeholder="账号"
                  allow-clear
                >
                  <template #prefix>
                    <UserOutlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="" name="username" placeholder="昵称">
                <a-input
                  v-model:value="formRegister.username"
                  placeholder="昵称"
                  allow-clear
                >
                  <template #prefix>
                    <smile-outlined class="site-form-item-icon"/>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="" name="密码">
                <a-input-password
                  v-model:value="formRegister.password"
                  placeholder="密码"
                  allow-clear
                >
                  <template #prefix>
                    <LockOutlined class="site-form-item-icon" />
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item label="" name="手机号">
                <a-input
                  v-model:value="formRegister.mobile"
                  placeholder="手机号"
                  allow-clear
                >
                  <template #prefix>
                    <phone-outlined class="site-form-item-icon"/>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item class="zhuceItem">
                <a-button
                  type="primary"
                  html-type="submit"
                  class="login-form-button"
                  @click="registerEvent"
                >
                  注册
                </a-button>
              </a-form-item>
            </a-form>
          </div>
          <div class="login_right_box" v-else>
            <div class="login_right_txt">
              <svg class="icon svg-icon titleicon" aria-hidden="true">
                <use xlink:href="#icon-qiyeweixin1"></use>
              </svg>
              <span>企业微信扫码登陆</span>
            </div>
            <div class="login_right_wx">
              <div id="weChat"></div>
            </div>
          </div>
          <div class="login_right_fs">
            <span
              @click="wayClick(1)"
              :class="{ active: tabTag === 1 }"
              class="iconfont icon-yonghu"
              >用户登录</span
            >
            <span
              @click="wayClick(2)"
              :class="{ active: tabTag === 2 }"
              class="iconfont icon-qiyeweixin"
              >企业微信登录</span
            >
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import {
  UserOutlined,
  MobileOutlined,
  CheckOutlined,
  LockOutlined,
  PhoneOutlined,
  SmileOutlined
} from "@ant-design/icons-vue";
import { ref, watch, toRefs, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { userLogin, registerUser } from "@/api/api";
import { message } from "ant-design-vue";
const store = useStore();
let $props = defineProps({
  showLogin: {
    type: Boolean,
  },
});
let { showLogin } = toRefs($props);
let $emit = defineEmits(["changeLogTag"]);
// 登录相关
let {
  formState,
  formRegister,
  activeTabKey,
  tabTag,
  diaVisible,
  handlecancel,
  loginEvent,
  registerEvent,
  tabClick,
  wayClick,
} = relate_login();
function relate_login() {
  // ---
  let stateData = reactive({
    formState: {
      account: "",
      password: "",
      phoneCode: "",
    },
    formRegister: {
      account: "",
      username: "",
      account: "",
      mobile: ''
    },
    activeTabKey: 1,
    tabTag: 1,
    diaVisible: false,
  });
  let watchLogTag = watch(
    showLogin,
    (newval, oldval) => {
      stateData.diaVisible = newval;
    },
    { immediate: true }
  );
  let handlecancel = () => {
    $emit("changeLogTag");
  };
  let tabClick = (val) => {
    stateData.activeTabKey = val;
  };
  let wayClick = (val) => {
    stateData.tabTag = val;
    if (val === 1) {
      stateData.activeTabKey = 1;
    } else if (val === 2) {
      relate_wx();
    }
  };
  // 登录接口
  let apiPort_login = () => {
    userLogin({ ...stateData.formState }).then((res) => {
      if (res.data.code === 200) {
        localStorage.setItem("token", res.data.data.token);
        store.commit("pageData/SET_ACCOUNT", res.data.data.username);
        store.commit("pageData/SET_ACCOUNTID", res.data.data.user);
        store.commit("pageData/SET_USERIMG", res.data.data.thumb_avatar);
        message.success("登陆成功");
        $emit("changeLogTag");
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  let apiPort_register = () => {
    registerUser({
      ...stateData.formRegister,
    }).then((res) => {
      if (res.data.code === 200) {
        message.success("注册成功，请登录");
        stateData.tabTag = 1;
        stateData.activeTabKey = 1;
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  let registerEvent = () => {
    apiPort_register();
  };
  let loginEvent = () => {
    apiPort_login();
  };
  // ----
  return {
    ...toRefs(stateData),
    handlecancel,
    loginEvent,
    registerEvent,
    tabClick,
    wayClick,
  };
}
// 微信相关
onMounted(() => {
  relate_wx();
});

function relate_wx() {
  // 动态引入企业微信js文件
  const s = document.createElement("script");
  s.type = "text/javascript";
  s.src = "http://wwcdn.weixin.qq.com/node/wework/wwopen/js/wwLogin-1.2.5.js";
  const wxElement = document.body.appendChild(s);
  // 调用企业微信二维码方法
  wxElement.onload = function () {
    let a = new WwLogin({
      id: "weChat",
      appid: "wwa11b1586b6b9c8a8",
      agentid: "1000041",
      scope: "snsapi_login",
      redirect_uri: encodeURIComponent(
        `http://tool.afocus.com.cn/platform/authority`
      ),
      state: Math.ceil(Math.random() * 1000),
      style: "black",
      href: "data:text/css;base64,LmltcG93ZXJCb3ggewogICAgaGVpZ2h0OiAxMDAlOwp9Cmh0bWwgewogICAgaGVpZ2h0OiAxMDAlOwogICAgdXNlci1zZWxlY3Q6IG5vbmU7Cn0KYm9keSB7CiAgICBoZWlnaHQ6IDEwMCU7Cn0KLmNhcmQgewogICAgd2lkdGg6IDQwJTsKICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICAgIHRvcDogNTAlOwogICAgbGVmdDogNTAlOwogICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7Cn0KLndycF9jb2RlIHsKICAgIHdpZHRoOiAxMDAlOwogICAgbWFyZ2luLXRvcDogMCFpbXBvcnRhbnQ7Cn0KLmZyYW1lX3dyYXAgewogICAgaGVpZ2h0OiAxMDAlOwp9Ci5pbXBvd2VyQm94IC5xcmNvZGUge3dpZHRoOiAxMDAlO2hlaWdodDogYXV0bzt9Ci5pbXBvd2VyQm94IC50aXRsZSB7ZGlzcGxheTogbm9uZTt9Ci5pbXBvd2VyQm94IC5pbmZvIHtkaXNwbGF5OiBub25lO30KLnN0YXR1c19pY29uIHtkaXNwbGF5OiBub25lICAhaW1wb3J0YW50fQouaW1wb3dlckJveCAuc3RhdHVzIHt0ZXh0LWFsaWduOiBjZW50ZXI7fQ==",
    });
    let target = document.getElementsByTagName("iframe");
    target[0].style.width = "100%";
    target[0].style.height = "100%";
    target[0].style.padding = "20px 0";
  };
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>