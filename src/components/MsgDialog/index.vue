<template>
  <div ref="aff1">
    <a-modal
      v-model:visible="diaVisible"
      :destroyOnClose="true"
      title="消息中心"
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
        @tabClick="tabClick"
      >
        <a-tab-pane :key="1">
          <template #tab>
            <span>
              <!-- <book-two-tone /> -->
              <file-text-two-tone :two-tone-color="iconColor.proj" />
              <!-- 项目消息 -->
              <a-badge color="#ff5c5c" :count="conuntProj"
                ><span class="badge">项目消息</span></a-badge
              >
            </span>
          </template></a-tab-pane
        >
        <a-tab-pane :key="2">
          <template #tab>
            <span>
              <mail-two-tone :two-tone-color="iconColor.account" />
              <a-badge color="#ff5c5c" :count="conuntUser"
                ><span class="badge">账户消息</span></a-badge
              >
            </span>
          </template></a-tab-pane
        >
        <a-tab-pane :key="3">
          <template #tab>
            <span>
              <flag-two-tone :two-tone-color="iconColor.other" />
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
                <template #header
                  ><span :class="item.currentStatus ? 'yidu' : 'weidu'">{{
                    item.title
                  }}</span></template
                >
                <p>{{ item.mail_content }}</p>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
        <div class="msgBox_btn">
          <a-button type="primary" @click="handlecancel">关闭</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import {
  FileTextTwoTone,
  MailTwoTone,
  FlagTwoTone,
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
  handlecancel,
  cancelEvent,
  collapseChangeEvent,
  tabClick,
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
    currentInfo: {
      menu: "",
      count: 0,
      mailList: [],
    },
    iconColor: {
      proj: "",
      account: "#909399",
      other: "#909399",
    },
  });
  let tabClick = (val) => {
    switch (val) {
      case 1:
        stateData.currentInfo = {
          menu: "项目信息",
          type: val,
          count: stateData.conuntProj,
          mailList: stateData.mailList_proj,
        };
        stateData.iconColor = {
          proj: "",
          account: "#909399",
          other: "#909399",
        };
        break;
      case 2:
        stateData.currentInfo = {
          menu: "项目信息",
          type: val,
          count: stateData.conuntUser,
          mailList: stateData.mailList_user,
        };
        stateData.iconColor = {
          proj: "#909399",
          account: "",
          other: "#909399",
        };        
        break;
      case 3:
        stateData.currentInfo = {
          menu: "项目信息",
          type: val,
          count: stateData.countOther,
          mailList: stateData.mailList_other,
        };
        stateData.iconColor = {
          proj: "#909399",
          account: "#909399",
          other: "",
        };        
        break;
    }
  };
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
        tabClick(1);
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
        stateData.currentInfo.count = stateData.conuntProj;
      }
    });
  };
  let watchShow = watch(
    showMsg,
    (newval, oldval) => {
      stateData.diaVisible = newval;
      if (newval) {
        apiPort_mail();
        apiPort_mail_no();
      }
    },
    { immediate: true }
  );
  let handlecancel = () => {
    $emit("changeMsgTag");
  };
  // 一键已读
  let cancelEvent = () => {
    mailSeeAll({
      no: "",
      mail_type: stateData.currentInfo.type,
    }).then((res) => {
      apiPort_mail_no();
      // 当前列表样式改变
      stateData.currentInfo.mailList.forEach((val, idx) => {
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
    handlecancel,
    cancelEvent,
    collapseChangeEvent,
    tabClick,
  };
}
</script>

<style lang="scss" scoped>
@import "index.scss";
</style>