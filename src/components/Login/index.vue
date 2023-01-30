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
          <p>看看我是特点一</p>
          <p>看看我是特点二</p>
          <p>看看我是特点三</p>
        </div>
        <div class="login_right">
          <div class="login_right_box">
            <a-tabs v-model:activeKey="activeTabKey" @tabClick="tabClick">
              <a-tab-pane
                v-for="item in tabList"
                :key="item.key"
                :tab="item.tabName"
                force-render
              ></a-tab-pane>
            </a-tabs>
            <a-form
              ref="formref"
              :model="formState"
              name="normal_login"
              :rules="rules"
            >
              <div v-if="activeTabKey === 1 || activeTabKey === 2">
                <a-form-item label="" name="account">
                  <a-input
                    v-model:value.trim="formState.account"
                    placeholder="手机号"
                    :maxlength="11"
                    allow-clear
                  >
                    <template #prefix>
                      <mobile-outlined />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item
                  v-if="activeTabKey === 1"
                  label=""
                  name="password_code"
                >
                  <a-input
                    v-model:value.trim="formState.password_code"
                    placeholder="短信验证码"
                    allow-clear
                    :maxlength="4"
                    size="default"
                  >
                    <template #addonAfter>
                      <span v-if="showCount">{{ count }}S 后重新获取</span>
                      <span v-else @click="sendCode">发送验证码</span>
                    </template>
                    <template #prefix> <message-outlined /></template
                  ></a-input>
                </a-form-item>
                <a-form-item v-else label="" name="password_code">
                  <a-input-password
                    v-model:value.trim="formState.password_code"
                    placeholder="密码"
                    :maxlength="20"
                    allow-clear
                  >
                    <template #prefix>
                      <LockOutlined class="site-form-item-icon" />
                    </template>
                  </a-input-password>
                </a-form-item>
              </div>
              <div v-if="activeTabKey === 3 || activeTabKey === 4">
                <a-form-item v-if="activeTabKey === 3" label="" name="nickname">
                  <a-input
                    v-model:value.trim="formState.nickname"
                    placeholder="昵称"
                    :maxlength="10"
                    allow-clear
                  >
                    <template #prefix>
                      <UserOutlined class="site-form-item-icon" />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item label="" name="mobile">
                  <a-input
                    v-model:value.trim="formState.mobile"
                    placeholder="手机号"
                    :maxlength="11"
                    allow-clear
                  >
                    <template #prefix>
                      <mobile-outlined />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item label="" name="code">
                  <a-input
                    v-model:value.trim="formState.code"
                    placeholder="短信验证码"
                    :maxlength="4"
                    allow-clear
                    size="default"
                  >
                    <template #addonAfter>
                      <span v-if="showCount">{{ count }}S 后重新获取</span>
                      <span v-else @click="sendCode">发送验证码</span>
                    </template>
                    <template #prefix><message-outlined /></template
                  ></a-input>
                </a-form-item>
                <a-form-item label="" name="password">
                  <a-input-password
                    v-model:value.trim="formState.password"
                    placeholder="密码"
                    :maxlength="20"
                    allow-clear
                  >
                    <template #prefix>
                      <LockOutlined class="site-form-item-icon" />
                    </template>
                  </a-input-password>
                </a-form-item>
              </div>
              <a-form-item>
                <a-button
                  type="primary"
                  html-type="submit"
                  @click="submitEvent"
                >
                  {{ submitTxt }}
                </a-button>
              </a-form-item>
            </a-form>
            <p
              v-if="activeTabKey === 1 || activeTabKey === 2"
              class="ant-form-p"
            >
              <span @click="changeTab(3)">注册</span
              ><span @click="changeTab(4)">忘记密码</span>
            </p>
            <p v-else class="ant-form-p">
              <span @click="submitEvent(0)">取消</span>
            </p>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MessageOutlined,
} from "@ant-design/icons-vue";
import { ref, watch, toRefs, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import {
  userLogin,
  userRegist,
  getPhoneCode,
  getPhoneCodeLog,
  getPhoneCodePwd,
  userEditPwd,
} from "@/api/api";
import { message } from "ant-design-vue";
import { checkMobile, checkMobileCode, checklgPwd, checkUsername } from "@/validator";
const formref = ref("");
const store = useStore();
let $props = defineProps({
  showLogin: {
    type: Boolean,
  },
});
let { showLogin } = toRefs($props);
let $emit = defineEmits(["changeLogTag"]);
// tab切换相关
let {
  diaVisible,
  activeTabKey,
  submitTxt,
  tabList,
  handlecancel,
  tabClick,
  changeTab,
} = relate_tab();
function relate_tab() {
  let stateData2 = reactive({
    diaVisible: false,
    activeTabKey: 1,
    submitTxt: "登录",
    tabList: [
      {
        key: 1,
        tabName: "验证码登录",
      },
      {
        key: 2,
        tabName: "密码登录",
      },
    ],
  });
  let watchLogTag = watch(
    showLogin,
    (newval, oldval) => {
      stateData2.diaVisible = newval;
    },
    { immediate: true }
  );
  let handlecancel = () => {
    $emit("changeLogTag", false);
  };
  let changeTab = (val) => {
    if (val === 3) {
      stateData2.tabList = [
        {
          key: 3,
          tabName: "注册",
        },
      ];
      stateData2.submitTxt = "注册";
    } else {
      stateData2.tabList = [
        {
          key: 4,
          tabName: "找回密码",
        },
      ];
      stateData2.submitTxt = "修改";
    }
    stateData2.activeTabKey = val;
  };
  let tabClick = (val) => {
    stateData2.activeTabKey = val;
    formref.value.resetFields();
  };
  return { ...toRefs(stateData2), handlecancel, changeTab, tabClick };
}
// 登录相关
let {
  formState,
  errorInfo,
  rules,
  timer,
  count,
  showCount,
  sendCode,
  submitEvent,
} = relate_login();
function relate_login() {
  // ---
  let stateData = reactive({
    // 登录
    formState: {
      way: 0,
      // 登录
      account: "",
      password_code: "",
      // 注册
      nickname: "",
      mobile: "",
      password: "",
      code: "",
    },
    errorInfo: "",
    rules: {
      account: [
        {
          required: true,
          validator: checkMobile,
          trigger: ["blur", "change"],
        },
      ],
      password_code: [
        {
          required: true,
          validator: checklgPwd,
          trigger: ["blur", "change"],
        },
      ],
      nickname: [
        {
          required: true,
          validator: checkUsername,
          trigger: ["blur", "change"],
        },
      ],
      mobile: [
        {
          required: true,
          validator: checkMobile,
          trigger: ["blur", "change"],
        },
      ],
      code: [
        {
          required: true,
          validator: checkMobileCode,
          trigger: ["blur", "change"],
        },
      ],
      password: [
        {
          required: true,
          validator: checklgPwd,
          trigger: ["blur", "change"],
        },
      ],
    },
    timer: null,
    TIME_COUNT: 60,
    count: null,
    showCount: false,
  });
  let watchActive = watch(
    activeTabKey,
    (newval, oldval) => {
      stateData.showCount = false;
      clearInterval(stateData.timer);
      stateData.timer = null;
      stateData.rules.password_code[0].validator =
        newval === 1 ? checkMobileCode : checklgPwd;
    },
    { immediate: true, deep: true }
  );
  /* 倒计时 */
  let countDown = () => {
    if (!stateData.timer) {
      stateData.count = stateData.TIME_COUNT;
      stateData.showCount = true;
      stateData.timer = setInterval(() => {
        if (stateData.count > 1 && stateData.count <= stateData.TIME_COUNT) {
          stateData.count--;
        } else {
          stateData.showCount = false;
          clearInterval(stateData.timer);
          stateData.timer = null;
        }
      }, 1000);
    }
  };
  // 登录接口
  let apiPort_login = (val) => {
    userLogin(val).then((res) => {
      if (res.data.code === 200) {
        formref.value.resetFields();
        message.success("登陆成功");
        store.commit("pageData/SET_SSO", res.data.data.token);
        store.commit("pageData/SET_USERNAME", res.data.data.username);
        store.commit("pageData/SET_ACCOUNT", res.data.data.account);
        store.commit("pageData/SET_ACCOUNTID", res.data.data.id);
        store.commit("pageData/SET_USERIMG", res.data.data.thumb_avatar);
        $emit("changeLogTag", true);
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 注册接口
  let apiPort_regist = (val) => {
    userRegist(val).then((res) => {
      if (res.data.code === 200) {
        message.success(`注册成功`);
        tabList.value = [
          {
            key: 1,
            tabName: "验证码登录",
          },
          {
            key: 2,
            tabName: "密码登录",
          },
        ];
        activeTabKey.value = 1;
        submitTxt.value = "登录";
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 验证码接口 -- 注册
  let apiPort_send = (mobile) => {
    getPhoneCode({
      mobile,
      way: 0
    }).then((res) => {
      if (res.data.code == 200) {
        message.success(`验证码已发送`);
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 验证码接口 -- 登录
  let apiPort_send_log = (mobile) => {
    getPhoneCodeLog({
      mobile,
      way: 0
    }).then((res) => {
      if (res.data.code == 200) {
        message.success(`验证码已发送`);
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 验证码接口 -- 修改密码
  let apiPort_send_pwd = (mobile) => {
    getPhoneCodePwd({
      mobile,
      way: 0
    }).then((res) => {
      if (res.data.code == 200) {
        message.success(`验证码已发送`);
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 找回密码
  let apiPort_edit = (val) => {
    userEditPwd(val).then((res) => {
      if (res.data.code == 200) {
        message.success(`密码修改成功`);
        tabList.value = [
          {
            key: 1,
            tabName: "验证码登录",
          },
          {
            key: 2,
            tabName: "密码登录",
          },
        ];
        activeTabKey.value = 1;
        submitTxt.value = "登录";
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 发送验证
  let sendCode = () => {
    let mobile;
    switch (activeTabKey.value) {
      case 1:
        mobile = stateData.formState.account;
        formref.value.validate("account").then((valid) => {
          countDown();
          apiPort_send_log(mobile);
        });
        break;
      case 3:
        mobile = stateData.formState.mobile;
        formref.value.validate("mobile").then((valid) => {
          countDown();
          apiPort_send(mobile);
        });
        break;
      case 4:
        mobile = stateData.formState.mobile;
        countDown();
        formref.value.validate("mobile").then((valid) => {
          apiPort_send_pwd(mobile);
        });
        break;
    }
  };
  // 提交事件
  let submitEvent = (val) => {
    if (val == 0) {
      formref.value.resetFields();
      // 取消
      tabList.value = [
        {
          key: 1,
          tabName: "验证码登录",
        },
        {
          key: 2,
          tabName: "密码登录",
        },
      ];
      activeTabKey.value = 1;
      submitTxt.value = "登录";
    } else {
      formref.value.validate().then((valid) => {
        let csData = {
          ...stateData.formState,
        };
        if (activeTabKey.value === 1) {
          // 验证码登录
          csData = {
            ...csData,
            type: "code",
          };
          apiPort_login(csData);
        } else if (activeTabKey.value === 2) {
          // 密码登录
          csData = {
            ...csData,
            type: "password",
          };
          apiPort_login(csData);
        } else if (activeTabKey.value === 3) {
          // 注册
          apiPort_regist(csData);
        } else if (activeTabKey.value === 4) {
          // 修改密码
          apiPort_edit(csData);
        }
      });
    }
  };
  return { ...toRefs(stateData), sendCode, submitEvent };
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>