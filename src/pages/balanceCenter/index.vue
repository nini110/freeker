<template>
  <div>
    <div v-if="showList" class="planBox banlanceBox" ref="bale">
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="1" tab="全部"></a-tab-pane>
        <a-tab-pane key="2" tab="未结算"></a-tab-pane>
        <a-tab-pane key="3" tab="已结算"></a-tab-pane>
      </a-tabs>
      <div class="banlanceBox_list">
        <div
          class="banlanceBox_item"
          v-for="(item, idx) in balanceData"
          :key="idx"
        >
          <a-badge-ribbon
            :text="item.status === 7 ? '未结算' : '已结算'"
            :color="item.color"
          >
            <h2>
              <span @click="openPage(item)">{{ item.name }}</span>
            </h2>
          </a-badge-ribbon>

          <div class="banlanceBox_item_info">
            <p>
              <account-book-outlined /><span>佣金</span
              ><span>{{ item.money }}</span>
            </p>
            <p>
              <user-outlined /><span>提现账号</span
              ><span v-if="item.account">{{ item.account }}</span
              ><span v-else class="cur" @click="bindEvent(item)">未绑定</span>
            </p>
          </div>
          <div v-if="item.status === 7" class="banlanceBox_item_opt">
            <span @click="bindEvent(item)">申请结算</span>
          </div>
          <div v-else class="banlanceBox_item_opt">
            <span @click="openPage(item)">查看</span>
          </div>
        </div>
      </div>
      <div class="pagination fixed">
        <a-pagination
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          show-size-changer
          :total="totalNum"
          @showSizeChange="sizeChange"
        />
      </div>
      <a-modal
        v-model:visible="modalvisible"
        :width="460"
        title="美事通绑定"
        @ok="handleOk"
        :getContainer="$refs.bale"
        :maskClosable="false"
        :footer="null"
        centered
      >
        <div class="bind_info">
          <div class="bind_left">
            <img src="../../assets/images/nobind.png" alt="" />
          </div>
          <div class="bind_right">
            <img src="../../assets/images/weweima.webp" alt="" />
          </div>
        </div>
        <div class="bind_tip"><expand-outlined />扫码进行美事通账号的绑定</div>
      </a-modal>
    </div>
    <DetailPage v-else :stusCode="stusCode" @back="detailClose"></DetailPage>
  </div>
</template>
<script setup>
import { ref, computed, reactive } from "vue";
import {
  AccountBookOutlined,
  UserOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  ExpandOutlined,
} from "@ant-design/icons-vue";
import DetailPage from "../detailPage/index.vue";
import { message } from "ant-design-vue";
let { balanceData, showList, stusCode, openPage, detailClose } =
  relate_balance();
function relate_balance() {
  let showList = ref(true);
  let stusCode = ref(0);
  // 5 已完成未结算   8 已结算
  let balanceData = reactive([
    {
      name: "这是项目一",
      money: 600,
      account: "",
      color: "red",
      status: 7,
    },
    {
      name: "这是项目二",
      money: 1300,
      account: "552154646",
      color: "red",
      status: 7,
    },
    {
      name: "这是项目一",
      money: 900,
      account: "1854523335",
      color: "",
      status: 8,
    },
    {
      name: "这是项目二",
      money: 600,
      account: "",
      color: "red",
      status: 7,
    },
    {
      name: "这是项目一",
      money: 460,
      account: "1854523335",
      color: "",
      status: 8,
    },
  ]);
  let openPage = (item) => {
    showList.value = false;
    stusCode.value = item.status;
  };
  let detailClose = () => {
    showList.value = true;
  };
  return { balanceData, showList, stusCode, openPage, detailClose };
}
// 绑定相关
let { modalvisible, bindEvent, handleOk } = relate_modal();
function relate_modal() {
  let modalvisible = ref(false);
  let bindEvent = (item) => {
    if (!item.account) {
      modalvisible.value = true;
    } else {
      message.success("申请成功");
    }
  };
  let handleOk = () => {
    modalvisible.value = false;
  };
  return { modalvisible, bindEvent, handleOk };
}
// 页码相关
let { currentPage, pageSize, totalNum, sizeChange } = relate_page();
function relate_page() {
  let currentPage = ref(3);
  let pageSize = ref(10);
  let totalNum = ref(100);
  let sizeChange = (current, size) => {
    console.log(current, size);
  };
  return { currentPage, pageSize, totalNum, sizeChange };
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>