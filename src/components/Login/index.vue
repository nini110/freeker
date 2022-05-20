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
          <div class="login_right_box" v-else>
            <a-tabs v-model:activeKey="activeTabKey" @tabClick="tabClick">
              <a-tab-pane key="1" tab="密码登录" force-render></a-tab-pane>
              <a-tab-pane key="2" tab="免密登录"></a-tab-pane>
            </a-tabs>
            <a-form :model="formState" name="normal_login">
              <a-form-item label="" name="username" placeholder="用户名">
                <a-input
                  v-model:value="formState.username"
                  placeholder="用户名"
                  allow-clear
                >
                  <template #prefix>
                    <UserOutlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item v-if="activeTabKey === '1'" label="" name="密码">
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
              <a-form-item>
                <a-button
                  type="primary"
                  html-type="submit"
                  class="login-form-button"
                >
                  登录
                </a-button>
              </a-form-item>
            </a-form>
          </div>
          <div class="login_right_fs">
            <span @click="wayClick(1)" class="iconfont icon-qiyeweixin"
              >企业微信登录</span
            >
            <span @click="wayClick(2)" class="iconfont icon-yonghu"
              >用户登录</span
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
} from "@ant-design/icons-vue";
import { ref, watch, toRefs, onMounted, reactive } from "vue";
let $props = defineProps({
  showLogin: {
    type: Boolean,
  },
});
let $emit = defineEmits(["changeLogTag"]);
// tab切换相关
let { activeTabKey, tabClick, tabTag, wayClick } = relate_tab();
function relate_tab() {
  let activeTabKey = ref("1");
  let tabClick = (val) => {
    activeTabKey.value = val;
  };

  let tabTag = ref(1);
  let wayClick = (val) => {
    tabTag.value = val;
    if (val === 1) {
      relate_wx();
    }
  };
  return { activeTabKey, tabClick, tabTag, wayClick };
}
// 登录相关
let { diaVisible, watchLogTag, handlecancel, formState } = relate_login();
function relate_login() {
  // ---
  let formState = reactive({
    username: "",
    password: "",
    phoneCode: "",
  });
  let propsData = toRefs($props);
  let diaVisible = ref(false);
  let watchLogTag = watch(
    propsData.showLogin,
    (newval, oldval) => {
      diaVisible.value = newval;
    },
    { immediate: true }
  );
  let handlecancel = () => {
    $emit("changeLogTag");
  };
  // ----

  return { diaVisible, watchLogTag, handlecancel, formState };
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