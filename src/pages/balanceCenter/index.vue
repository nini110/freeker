<template>
  <div>
    <div v-if="showList" class="planBox banlanceBox" ref="bale">
      <a-tabs v-model:activeKey="activeKey" type="card" @change="tabEvent">
        <a-tab-pane key="" tab="全部"></a-tab-pane>
        <a-tab-pane key="9" tab="未结算"></a-tab-pane>
        <a-tab-pane key="10,11" tab="结算中"></a-tab-pane>
        <a-tab-pane key="12" tab="已结算"></a-tab-pane>
      </a-tabs>
      <div class="banlanceBox_list">
        <div
          class="banlanceBox_item"
          v-for="(item, idx) in projList"
          :key="idx"
        >
          <a-badge-ribbon
            :text="item.statusTxt"
            :color="item.statusClass"
          >
            <h2  @click="openPage(item)">
              <span>{{ item.project_name }}</span>
            </h2>
          </a-badge-ribbon>

          <div class="banlanceBox_item_info" @click="openPage(item)">
            <p>
              <account-book-outlined /><span>佣金</span
              ><span>￥{{ item.brokerage }}</span>
            </p>
            <p>
              <user-outlined /><span>提现账号</span
              ><span v-if="item.mst_account">{{ item.mst_account }}</span
              ><span v-else class="cur">未绑定</span>
            </p>
          </div>
          <div class="banlanceBox_item_opt">
            <span
              v-if="item.project_status === 9"
              class="pointer"
              @click="bindEvent(item)"
              >申请结算</span
            >
            <span v-if="item.project_status === 10">等待商家汇款</span>
            <span v-if="item.project_status === 11">等待美事通打款</span>
            <span v-if="item.project_status === 12">投手已到账</span>
          </div>
        </div>
      </div>
      <div class="pagination fixed">
        <a-pagination
          v-model:current="pageNation.currentPage"
          v-model:pageSize="pageNation.pageSize"
          :pageSizeOptions="['6', '12']"
          show-size-changer
          :total="pageNation.totalNum"
          @change="sizeChange"
        />
      </div>
      <a-modal
        v-model:visible="modalvisible"
        :width="500"
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
          <div
            v-if="showRegister"
            class="bind_right bind_right_bind"
            :class="{ ts: mstList.length === 0 }"
          >
            <div>
              <img src="../../assets/images/weweima.webp" alt="" />
            </div>
            <a-button v-if="mstList.length > 0" @click="cncelEvent"
              >取消</a-button
            >
          </div>
          <div v-else class="bind_right">
            <a-radio-group v-model:value="radioMst">
              <a-radio
                v-for="(tagItem, tagIdx) in mstList"
                :key="tagIdx"
                :value="tagItem.id"
              >
                <span>{{ tagItem.account }}</span>
              </a-radio>
            </a-radio-group>
            <div class="bind_right_btn">
              <a-button @click="registerEvent">注册</a-button>
              <a-button type="primary" @click="submitEvent">确认</a-button>
            </div>
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
    <DetailPage
      v-else
      :stusCode="stusCode"
      :resData="resData"
      @back="detailClose"
    ></DetailPage>
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
  CheckSquareOutlined,
} from "@ant-design/icons-vue";
import {
  payCenterList,
  searchMst,
  projBindMst,
  applyPay,
  getProjDetail,
} from "@/api/api";

import DetailPage from "../detailPage/index.vue";
import { message } from "ant-design-vue";
let {
  activeKey,
  showList,
  stusCode,
  resData,
  projList,
  pageNation,
  apiPort_list,
  tabEvent,
  openPage,
  detailClose,
} = relate_balance();
function relate_balance() {
  let stateData = reactive({
    activeKey: "",
    showList: true,
    stusCode: 0,
    resData: {},
    projList: [],
    pageNation: {
      currentPage: 1,
      pageSize: 6,
      totalNum: null,
    },
  });
  // 获取列表
  let apiPort_list = (status, pageNation) => {
    payCenterList({
      no: "",
      project_status: status,
      ordering: "-create_time",
      page: pageNation.currentPage,
      page_size: pageNation.pageSize,
    }).then((res) => {
      if (res.data.code === 200) {
        stateData.projList = [];
        stateData.pageNation.totalNum = res.data.total;
        let result = res.data.data;
        result.forEach((val, idx) => {
          switch (val.project_status) {
            case 9:
              val.statusTxt = '未结算'
              val.statusClass = "red";
              break;
            case 10:
              val.statusTxt = '待汇款'
              val.statusClass = "cyan";
              break              
            case 11:
              val.statusTxt = '待打款'
              val.statusClass = "green";
              break
            case 12:
              val.statusTxt = '已结算'
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
  // 获取详情
  const apiPort_detail = (id) => {
    getProjDetail(
      {
        haha: "",
      },
      id
    ).then((res) => {
      if (res.data.code === 200) {
        stateData.showList = false;
        stateData.resData = res.data.data;
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  let tabEvent = (val) => {
    apiPort_list(val, stateData.pageNation);
  };
  let openPage = (item) => {
    stateData.stusCode = item.project_status;
    apiPort_detail(item.ad_project);
  };
  let detailClose = () => {
    stateData.showList = true;
  };
  onBeforeMount(() => {
    tabEvent("9,10,11,12", stateData.pageNation);
  });
  return {
    ...toRefs(stateData),
    apiPort_list,
    tabEvent,
    openPage,
    detailClose,
  };
}
// 绑定相关
let {
  modalvisible,
  mstList,
  showRegister,
  radioMst,
  bindEvent,
  currentId,
  handleOk,
  registerEvent,
  cncelEvent,
  submitEvent,
} = relate_modal();
function relate_modal() {
  let stateData = reactive({
    modalvisible: false,
    mstList: [],
    showRegister: false,
    projId: "", // 项目id
    radioMst: "", // 美事通的id
    currentId: "", // 项目人员关系id
  });
  // 接口————查询美式通账户
  let apiPort_mst = () => {
    searchMst({
      no: "",
    }).then((res) => {
      if (res.data.code === 200) {
        let result = res.data.data;
        if (result.length > 0) {
          stateData.radioMst = result[0].id;
        }
        stateData.mstList = result;
        stateData.modalvisible = true;
        stateData.showRegister = res.data.data.length === 0;
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 接口————申请结算
  let apiPort_apply = () => {
    applyPay({
      ad_project: stateData.projId,
    }).then((res) => {
      if (res.data.code === 200) {
        message.success("申请结算成功");
        pageNation.value.currentPage = 1;
        pageNation.value.pageSize = 5;
        apiPort_list(activeKey.value, pageNation.value);
        stateData.modalvisible = false;
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 打开绑定弹层
  let bindEvent = (item) => {
    stateData.currentId = item.id;
    stateData.projId = item.ad_project;
    if (item.project_status === 9) {
      // 已完成 可去申请结算
      apiPort_mst();
    }
  };
  // 确认
  let submitEvent = () => {
    projBindMst(
      {
        mst: stateData.radioMst,
      },
      stateData.currentId
    ).then((res) => {
      if (res.data.code === 200) {
        // 绑定美事通成功 去申请结算
        apiPort_apply();
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
  };
  let handleOk = () => {
    stateData.modalvisible = false;
  };
  return {
    ...toRefs(stateData),
    bindEvent,
    handleOk,
    registerEvent,
    cncelEvent,
    submitEvent,
  };
}
// 页码相关
let { sizeChange } = relate_page();
function relate_page() {
  let sizeChange = (current, size) => {
    pageNation.currentPage = current;
    pageNation.pageSize = size;
    apiPort_list(activeKey.value, pageNation.value);
  };
  return { sizeChange };
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>