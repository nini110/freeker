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
          v-for="(item, idx) in projList"
          :key="idx"
        >
          <a-badge-ribbon
            :text="item.status === 'no' ? '未结算' : '已结算'"
            :color="item.statusClass"
          >
            <h2>
              <span @click="openPage(item)">{{ item.project_name }}</span>
            </h2>
          </a-badge-ribbon>

          <div class="banlanceBox_item_info">
            <p>
              <account-book-outlined /><span>佣金</span
              ><span>{{ item.brokerage }}</span>
            </p>
            <p>
              <user-outlined /><span>提现账号</span
              ><span v-if="item.account">{{ item.account }}</span
              ><span v-else class="cur" @click="bindEvent(item)">未绑定</span>
            </p>
          </div>
          <div class="banlanceBox_item_opt">
            <span v-if="item.project_status === 9" @click="bindEvent(item)"
              >申请结算</span
            >
            <span v-if="item.project_status === 10">待汇款</span>
            <span v-if="item.project_status === 11">待打款</span>
            <span v-if="item.project_status === 12" @click="openPage(item)"
              >查看</span
            >
          </div>
        </div>
      </div>
      <div class="pagination fixed">
        <a-pagination
          v-model:current="pageNation.currentPage"
          v-model:pageSize="pageNation.pageSize"
          show-size-changer
          :total="pageNation.totalNum"
          @showSizeChange="sizeChange"
        />
      </div>
      <a-modal
        v-model:visible="modalvisible"
        :width="460"
        title="提现绑定"
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
          <div v-if="showRegister" class="bind_right">
            <img src="../../assets/images/weweima.webp" alt="" />
            <div class="rigist" @click="cncelEvent">取消</div>
          </div>
          <div v-else class="bind_right">
            <a-radio-group v-model:value="value1">
              <a-radio
                v-for="(tagItem, tagIdx) in mstList"
                :key="tagIdx"
                :value="tagItem.account"
              >
                <a-tag color="#55acee">
                  <template #icon>
                    <twitter-outlined />
                  </template>
                  {{ tagItem.username }}
                </a-tag>
              </a-radio>
            </a-radio-group>
            <div class="rigist" @click="registerEvent">注册美事通</div>
          </div>
        </div>
        <div class="bind_tip">
          <div v-if="showRegister">
            <expand-outlined />扫码进行美事通账号的绑定
          </div>
          <div v-else><check-square-outlined />选择美事通账户</div>
        </div>
      </a-modal>
    </div>
    <DetailPage v-else :stusCode="stusCode" @back="detailClose"></DetailPage>
  </div>
</template>
<script setup>
import { ref, computed, reactive, toRef, toRefs, onBeforeMount } from "vue";
import {
  AccountBookOutlined,
  UserOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  ExpandOutlined,
  CheckSquareOutlined
} from "@ant-design/icons-vue";
import { payCenterList, searchMst } from "@/api/api";

import DetailPage from "../detailPage/index.vue";
import { message } from "ant-design-vue";
let value1 = ref();
let { showList, stusCode, projList, pageNation, openPage, detailClose } =
  relate_balance();
function relate_balance() {
  let stateData = reactive({
    showList: true,
    stusCode: 0,
    projList: [],
    pageNation: {
      currentPage: 1,
      pageSize: 5,
      totalNum: null,
    },
  });
  // 获取列表
  let apiPort_list = (status, page, page_size) => {
    payCenterList({
      no: "",
      project_status: status,
      ordering: "-create_time",
      page,
      page_size,
    }).then((res) => {
      if (res.data.code === 200) {
        stateData.projList = [];
        pageNation.totalNum = res.data.total;
        let result = res.data.data;
        result.forEach((val, idx) => {
          switch (val.project_status) {
            case 9:
            case 10:
            case 11:
              val.status = "no";
              val.statusClass = "red";
              break;
            case 12:
              val.status = "yes";
              val.statusClass = "";
              break;
          }
          stateData.projList.push(val);
        });
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 5 已完成未结算   8 已结算
  let openPage = (item) => {
    stateData.showList = false;
    stateData.stusCode = item.status;
  };
  let detailClose = () => {
    stateData.showList = true;
  };
  onBeforeMount(() => {
    apiPort_list("9, 10, 11, 12", pageNation.currentPage, pageNation.pageSize);
  });
  return { ...toRefs(stateData), openPage, detailClose };
}
// 绑定相关
let {
  modalvisible,
  mstList,
  showRegister,
  bindEvent,
  handleOk,
  registerEvent,
  cncelEvent
} = relate_modal();
function relate_modal() {
  let stateData = reactive({
    modalvisible: false,
    mstList: [],
    showRegister: false,
  });
  // 查询美式通账户
  let apiPort_mst = () => {
    searchMst({
      no: "",
    }).then((res) => {
      if (res.data.code === 200) {
        stateData.mstList = res.data.data;
        stateData.modalvisible = true;
        stateData.showRegister = res.data.data.length === 0;
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 注册
  let registerEvent = () => {
    stateData.showRegister = true;
  };
  // 取消注册
  let cncelEvent = () => {
    stateData.showRegister = false;
  }
  let bindEvent = (item) => {
    if (item.project_status === 9) {
      // 已完成 可去申请结算
      apiPort_mst();
    } else {
      message.success("申请成功");
    }
  };
  let handleOk = () => {
    stateData.modalvisible = false;
  };
  return { ...toRefs(stateData), bindEvent, handleOk, registerEvent, cncelEvent };
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