<template>
  <div ref="aff1">
    <a-modal
      v-model:visible="diaVisible"
      :destroyOnClose="true"
      title="消息中心"
      cancelText="一键已读"
      okText="关闭"
      @cancel="handlecancel"
      centered
      :maskClosable="false"
      :keyboard="false"
      :getContainer="$refs.aff1"
      :footer="null"
    >
      <a-tabs
        v-model:activeKey="activeKey"
        tab-position="left"
        :style="{ height: '200px' }"
      >
        <a-tab-pane :key="1">
          <template #tab>
            <span>
              <!-- 项目消息 -->
              <folder-open-outlined />
              <a-badge color="#ff5c5c" :count="conuntProj"
                ><span class="badge">项目消息</span></a-badge
              >
            </span>
          </template></a-tab-pane
        >
        <a-tab-pane :key="2">
          <template #tab>
            <span>
              <robot-outlined />
              <a-badge color="#ff5c5c" :count="conuntUser"
                ><span class="badge">账户消息</span></a-badge
              >
            </span>
          </template></a-tab-pane
        >
        <a-tab-pane :key="3">
          <template #tab>
            <span>
              <ellipsis-outlined />
              <a-badge color="#ff5c5c" :count="countOther"
                ><span class="badge">其他消息</span></a-badge
              >
            </span>
          </template></a-tab-pane
        >
      </a-tabs>
      <div class="msgBox">
        <a-alert
          v-if="currentInfo.count > 0"
          :message="
            '当前未读' + currentInfo.menu + '条数:' + currentInfo.count + '条'
          "
          close-text="一键已读"
          type="info"
          banner
          :afterClose="cancelEvent"
        >
          <template #icon><mail-filled /></template>
        </a-alert>
        <div class="msgBox_info">
          <div
            v-if="currentInfo.mailList.length === 0"
            class="msgBox_right msgBox_right_empty"
          >
            <a-empty description="空空如也" />
          </div>
          <div
            v-else
            class="msgBox_right"
            v-for="(item, idx) in currentInfo.mailList"
            :key="idx"
          >
            <p class="ct_time">{{ item.create_time }}</p>
            <a-collapse
              v-model:activeKey="item.activeKey"
              :bordered="false"
              @change="(val) => collapseChangeEvent(val, item)"
            >
              <a-collapse-panel
                key="1"
                style="
                  background: #f7f7f763;
                  border-radius: 4px;
                  margin-bottom: 24px;
                  border: 0;
                  overflow: hidden;
                "
              >
                <template #header>
                  <div class="header">
                    <img
                      class="header_img"
                      src="../../assets/user.png"
                      alt=""
                    />
                    <p>
                      <span
                        class="header_txt"
                        :class="item.currentStatus ? 'yidu' : 'weidu'"
                        >{{ item.title }}</span
                      >
                      <span class="header_content">{{
                        item.mail_content
                      }}</span>
                    </p>
                  </div>
                </template>
                <p>{{ item.mail_content }}</p>
              </a-collapse-panel>
            </a-collapse>
          </div>
          <div class="msgBox_btn">
            <a-popconfirm
              title="确认一键已读所有未读消息?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="readConfirm"
            >
              <a-button>一键已读</a-button>
            </a-popconfirm>

            <a-button type="primary" @click="handlecancel">关闭</a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import {
  FolderOpenOutlined,
  EllipsisOutlined,
  RobotOutlined,
  MailFilled,
} from "@ant-design/icons-vue";
import { ref, watch, toRefs, onMounted, reactive, onBeforeMount } from "vue";
import { stationMailList, mailSee, mailSeeAll } from "@/api/api";

import dayjs from "dayjs";
let $props = defineProps({
  showMsg: {
    type: Boolean,
  },
});
let { showMsg } = toRefs($props);
let $emit = defineEmits(["changeMsgTag"]);
// 消息相关
let {
  diaVisible,
  conuntProj,
  conuntUser,
  countOther,
  activeKey,
  alertMsg,
  currentInfo,
  iconColor,
  readConfirm,
  handlecancel,
  cancelEvent,
  collapseChangeEvent,
} = relate_msg();
function relate_msg() {
  let stateData = reactive({
    diaVisible: false,
    mailList_proj: [],
    mailList_user: [],
    mailList_other: [],
    conuntProj: 0,
    conuntUser: 0,
    countOther: 0,
    activeKey: 1,
    alertMsg: "",
  });
  let curData = reactive({
    currentInfo: {
      menu: "",
      count: 0,
      mailList: [],
    },
    iconColor: {
      proj: "#909399",
      account: "#909399",
      other: "#909399",
    },
  });
  // 获取信息列表
  let apiPort_mail = () => {
    stationMailList({
      ordering: "-create_time",
      mail_status: "",
      page: 1,
      page_size: 100,
    }).then((res) => {
      if (res.data.code === 200) {
        stateData.mailList_proj = [];
        stateData.mailList_user = [];
        stateData.mailList_other = [];
        let result = res.data.data;
        result.forEach((val, idx) => {
          val.currentStatus = val.mail_status;
          if (val.mail_type === 1) {
            stateData.mailList_proj.push(val);
          } else if (val.mail_type === 2) {
            stateData.mailList_user.push(val);
          } else {
            stateData.mailList_other.push(val);
          }
        });
      }
    });
  };
  // 获取未读条数
  let apiPort_mail_no = () => {
    stationMailList({
      ordering: "",
      mail_status: 0,
      page: 1,
      page_size: 100,
    }).then((res) => {
      if (res.data.code === 200) {
        let arr_proj = [];
        let arr_user = [];
        let arr_other = [];
        let result = res.data.data;
        result.forEach((val, idx) => {
          val.currentStatus = val.mail_status;
          if (val.mail_type === 1) {
            arr_proj.push(val);
          } else if (val.mail_type === 2) {
            arr_user.push(val);
          } else {
            arr_other.push(val);
          }
        });
        stateData.conuntProj = arr_proj.length;
        stateData.conuntUser = arr_user.length;
        stateData.countOther = arr_other.length;
      }
    });
  };
  let watchShow = watch(
    $props,
    (newval, oldval) => {
      stateData.diaVisible = newval.showMsg;
      if (newval.showMsg) {
        apiPort_mail();
        apiPort_mail_no();
      }
    },
    { immediate: true }
  );
  let watActive = watch(
    stateData,
    (newval, oldval) => {
      switch (newval.activeKey) {
        case 1:
          curData.currentInfo = {
            menu: "【项目信息】",
            type: newval.activeKey,
            count: stateData.conuntProj,
            mailList: stateData.mailList_proj,
          };
          curData.iconColor = {
            proj: "",
            account: "#909399",
            other: "#909399",
          };
          break;
        case 2:
          curData.currentInfo = {
            menu: "【账户信息】",
            type: newval.activeKey,
            count: stateData.conuntUser,
            mailList: stateData.mailList_user,
          };
          curData.iconColor = {
            proj: "#909399",
            account: "",
            other: "#909399",
          };
          break;
        case 3:
          curData.currentInfo = {
            menu: "【其他信息】",
            type: newval.activeKey,
            count: stateData.countOther,
            mailList: stateData.mailList_other,
          };
          curData.iconColor = {
            proj: "#909399",
            account: "#909399",
            other: "",
          };
          break;
      }
    },
    { immediate: true, deep: true }
  );
  // 一键  所有类型
  let readConfirm = () => {
    mailSeeAll({
      no: "",
      mail_type: "",
    }).then((res) => {
      $emit("changeMsgTag");
    });
  };
  let handlecancel = () => {
    $emit("changeMsgTag");
  };
  // 一键已读
  let cancelEvent = () => {
    mailSeeAll({
      no: "",
      mail_type: curData.currentInfo.type,
    }).then((res) => {
      apiPort_mail_no();
      // 当前列表样式改变
      curData.currentInfo.mailList.forEach((val, idx) => {
        val.currentStatus = 1;
      });
    });
  };
  // 折叠面板事件
  let collapseChangeEvent = (val, item) => {
    item.currentStatus = 1;
    if (item.mail_status === 0) {
      // 未读  点击变为已读
      mailSee(
        {
          no: "",
        },
        item.id
      ).then((res) => {
        if (res.data.code === 200) {
          apiPort_mail_no();
        }
      });
    }
  };

  return {
    ...toRefs(stateData),
    ...toRefs(curData),
    readConfirm,
    handlecancel,
    cancelEvent,
    collapseChangeEvent,
  };
}
</script>

<style lang="scss" scoped>
@import "index.scss";
</style>