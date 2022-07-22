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
            <a-form
              ref="refLogin"
              :model="formState"
              name="normal_login"
              :rules="rulesLogin"
            >
              <a-form-item label="" name="account" placeholder="账户">
                <a-input
                  v-model:value.trim="formState.account"
                  placeholder="账户"
                  allow-clear
                >
                  <template #prefix>
                    <UserOutlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item v-if="activeTabKey === 1" label="" name="password">
                <a-input-password
                  v-model:value.trim="formState.password"
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
                  v-model:value.trim="formState.phoneCode"
                  placeholder="6位短信验证码"
                  allow-clear
                  size="middle"
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
            <a-form
              ref="refRegist"
              :model="formRegister"
              name="normal_login"
              :rules="rulesRegist"
            >
              <a-form-item label="" name="account">
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
              <a-form-item label="" name="username">
                <a-input
                  v-model:value="formRegister.username"
                  placeholder="昵称"
                  allow-clear
                >
                  <template #prefix>
                    <smile-outlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="" name="password">
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
              <a-form-item label="" name="mobile">
                <a-input
                  v-model:value="formRegister.mobile"
                  placeholder="手机号"
                  allow-clear
                >
                  <template #prefix>
                    <phone-outlined class="site-form-item-icon" />
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
          <div class="login_right_fs">
            <span
              @click="wayClick(1)"
              :class="{ active: tabTag === 1 }"
              class="iconfont icon-yonghu"
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
  PhoneOutlined,
  SmileOutlined,
} from "@ant-design/icons-vue";
import { ref, watch, toRefs, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { userLogin, registerUser } from "@/api/api";
import { message } from "ant-design-vue";
import {
  checkLogAccount,
  checkLogPwd,
  checkLogPhone,
  checkUsername,
  checkPhone,
} from "@/validator";

const store = useStore();
const refLogin = ref();
const refRegist = ref();
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
  rulesLogin,
  rulesRegist,
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
      mobile: "",
    },
    activeTabKey: 1,
    tabTag: 1,
    diaVisible: false,
    rulesLogin: {
      account: [
        { required: true, validator: checkLogAccount, trigger: "change" },
      ],
      password: [{ required: true, validator: checkLogPwd, trigger: "change" }],
      phoneCode: [
        { required: true, validator: checkLogPhone, trigger: "change" },
      ],
    },
    rulesRegist: {
      account: [
        { required: true, validator: checkLogAccount, trigger: "change" },
      ],
      username: [
        { required: true, validator: checkUsername, trigger: "change" },
      ],
      password: [{ required: true, validator: checkLogPwd, trigger: "change" }],
      mobile: [{ required: true, validator: checkPhone, trigger: "change" }],
    },
  });
  let watchLogTag = watch(
    showLogin,
    (newval, oldval) => {
      stateData.diaVisible = newval;
    },
    { immediate: true }
  );
  let handlecancel = () => {
    $emit("changeLogTag", false);
  };
  let tabClick = (val) => {
    refLogin.value.clearValidate();
    stateData.activeTabKey = val;
  };
  let wayClick = (val) => {
    if (stateData.tabTag === 3) {
      // 注册
      refRegist.value.resetFields();
    } else {
      refLogin.value.resetFields();
    }
    stateData.tabTag = val;
    stateData.activeTabKey = 1;
  };
  // 登录接口
  let apiPort_login = () => {
    refLogin.value.validate().then((res) => {
      userLogin({ ...stateData.formState }).then((res) => {
        if (res.data.code === 200) {
          refLogin.value.resetFields();
          message.success("登陆成功");
          store.commit("pageData/SET_SSO", res.data.data.token);
          store.commit("pageData/SET_USERNAME", res.data.data.username);
          store.commit("pageData/SET_ACCOUNT", res.data.data.account);
          store.commit("pageData/SET_ACCOUNTID", res.data.data.user);
          store.commit("pageData/SET_USERIMG", res.data.data.thumb_avatar);
          $emit("changeLogTag", true);
        } else {
          message.error(`${res.data.msg}`);
        }
      });
    });
  };
  let apiPort_register = () => {
    refRegist.value.validate().then((res) => {
      registerUser({
        ...stateData.formRegister,
      }).then((res) => {
        if (res.data.code === 200) {
          refRegist.value.resetFields();
          message.success("注册成功，请登录");
          stateData.tabTag = 1;
          stateData.activeTabKey = 1;
        } else {
          message.error(`${res.data.msg}`);
        }
      });
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
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>