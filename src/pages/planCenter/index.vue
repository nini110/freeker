<template>
  <div v-if="showList">
    <a-tabs class="planTabs" v-model:activeKey="activeKey" @change="tabEvent">
      <a-tab-pane
        v-for="item in menuList"
        :key="item.code"
        :tab="item.label"
      ></a-tab-pane>
    </a-tabs>
    <div v-if="projList.length === 0" class="planBox proj_box_empty">
      <a-empty />
    </div>
    <div v-else>
      <div v-for="(item, idx) in projList" :key="idx" class="planBox iconfont">
        <div v-if="item.project_status !== 0" class="planBox_title">
          <p v-if="item.project_status === 1 || item.project_status === 2">
            <span>申请时间：</span><span>{{ item.sqTime }}</span>
          </p>
          <p v-else>
            <span>接单时间：</span><span>{{ item.jdTime }}</span>
          </p>
        </div>
        <div class="planBox_info" :class="item.statusClass">
          <div>{{ item.project_name }}</div>
          <div>
            <span :class="item.statusClass" class="sts">{{
              item.statusCn
            }}</span>
          </div>
          <div>
            <span class="label">投放平台</span>
            <span>{{ item.platCn }}</span>
          </div>
          <div>
            <span class="label">服务费</span>
            <span class="mny">{{ item.brokerage }}</span>
          </div>
          <div class="planBox_info_btn">
            <span @click="toDetail(item)">查看详情</span>
            <!-- 待审核 -->
            <span v-if="item.project_status === 0" @click="cancelEvent(item)"
              >取消申请</span
            >
            <!-- 待确认 -->
            <span v-if="item.project_status === 6" @click="confirmEvent(item)"
              >确认完成</span
            >
            <!-- 已完成 -->
            <!-- <span v-if="item.project_status === 9" @click="payEvent(item)">申请结算</span> -->
          </div>
        </div>
      </div>
      <div class="pagination fixed">
        <a-pagination
          v-model:current="pageNation.currentPage"
          v-model:pageSize="pageNation.pageSize"
          show-size-changer
          :pageSizeOptions="['5', '10', '30']"
          :total="pageNation.totalNum"
          @change="sizeChange"
        />
      </div>
    </div>
    <a-modal
      v-model:visible="evalueVisible"
      title="评价"
      ok-text="确认"
      cancel-text="取消"
      centered
      :maskClosable="false"
      :keyboard="false"
      @ok="evalueEvent"
    >
      <a-rate v-model:value="rateValue" />
      <a-textarea
        v-model:value="areaValue"
        placeholder="请输入评价内容"
        :auto-size="{ minRows: 2, maxRows: 5 }"
        allow-clear
      />
    </a-modal>
  </div>
  <DetailPage
    v-else
    :stusCode="stusCode"
    :userID="userID"
    :resData="resData"
    @back="detailClose"
  ></DetailPage>
</template>
<script setup>
import { ref, reactive, createVNode, onBeforeMount, toRefs } from "vue";
import { Modal } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import DetailPage from "../detailPage/index.vue";
import { planProj, getProjDetail, okFinish, calcelApply } from "@/api/api";
import { message } from "ant-design-vue";
import dayjs from "dayjs";

let $router = useRouter();
const menuList = reactive([
  {
    label: "全部",
    code: "0,1,2,3,4,5,6,7,8,9",
  },
  {
    label: "待审核",
    code: "0, 1, 2",
  },
  // {
  //   label: "申请中",
  //   code: "0",
  // },
  // {
  //   label: "待审核",
  //   code: "1",
  // },
  // {
  //   label: "系统审核中",
  //   code: "2",
  // },
  {
    label: "已驳回",
    code: "3",
  },
  {
    label: "待启动",
    code: "4",
  },
  {
    label: "进行中",
    code: "5",
  },
  {
    label: "待确认",
    code: "6",
  },
  {
    label: "待通过",
    code: "7",
  },
  {
    label: "未通过",
    code: "8",
  },
  {
    label: "已完成",
    code: "9",
  },
]);
let pageNation = reactive({
  currentPage: 1,
  pageSize: 5,
  totalNum: null,
});
// 公共的东西
let { projList, activeKey, apiPort_list, tabEvent } = relate_plan();
function relate_plan() {
  const stateDate = reactive({
    projList: [],
    activeKey: "",
  });
  // 获取列表
  let apiPort_list = (status, page, page_size) => {
    planProj({
      no: "",
      project_status: status,
      ordering: "-create_time",
      page,
      page_size,
    }).then((res) => {
      if (res.data.code === 200) {
        stateDate.projList = [];
        pageNation.totalNum = res.data.total;
        let result = res.data.data;
        result.forEach((val, idx) => {
          switch (val.project_status) {
            // 申请中-系统审核中-待审核
            case 0:
              val.statusCn = "申请中";
              val.statusClass = "sqz";
              break;
            case 1:
              val.statusCn = "系统审核中";
              val.statusClass = "xtshz";
              break;
            case 2:
              val.statusCn = "待审核";
              val.statusClass = "dsh";
              break;
            case 3:
              val.statusCn = "已驳回";
              val.statusClass = "ybh";
              break;
            case 4:
              val.statusCn = "待启动";
              val.statusClass = "dqd";
              break;
            case 5:
              val.statusCn = "进行中";
              val.statusClass = "jxz";
              break;
            case 6:
              val.statusCn = "待确认";
              val.statusClass = "dqr";
              break;
            case 7:
              val.statusCn = "待通过";
              val.statusClass = "dtg";
              break;
            case 8:
              val.statusCn = "未通过";
              val.statusClass = "wtg";
              break;
            case 9:
              val.statusCn = "已完成";
              val.statusClass = "ywc";
              break;
            // case 10:
            //   val.statusCn = "待汇款";
            //   val.statusClass = "dhk";
            //   break;
            // case 11:
            //   val.statusCn = "待打款";
            //   val.statusClass = "ddk";
            //   break;
            // case 12:
            //   val.statusCn = "已结算";
            //   val.statusClass = "yjs";
            //   break;
          }
          switch (val.delivery_platform) {
            case 1:
              val.platCn = "京准通";
              break;
            case 2:
              val.platCn = "抖音";
              break;
          }
          let obj = {
            ...val,
            jdTime: dayjs(val.allot_time).format("YYYY-MM-DD HH:mm:ss"),
            sqTime: dayjs(val.create_time).format("YYYY-MM-DD HH:mm:ss"),
          };
          stateDate.projList.push(obj);
        });
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // tab切换
  let tabEvent = (val) => {
    stateDate.activeKey = val;
    apiPort_list(val, 1, pageNation.pageSize);
  };
  onBeforeMount(() => {
    tabEvent("0,1,2,3,4,5,6,7,8,9");
    // apiPort_list('0,1,2,3,4,5,6,7,8,9', pageNation.currentPage, pageNation.pageSize);
  });
  return { ...toRefs(stateDate), apiPort_list, tabEvent };
}

// 详情相关
let {
  showList,
  resData,
  stusCode,
  userID,
  apiPort_detail,
  toDetail,
  detailClose,
  cancelEvent,
  payEvent,
} = relate_detail();
function relate_detail() {
  const stateDate2 = reactive({
    showList: true,
    resData: {},
    stusCode: 0,
    userID: null,
  });
  // 获取详情
  const apiPort_detail = (id) => {
    getProjDetail(
      {
        haha: "",
      },
      id
    ).then((res) => {
      if (res.data.code === 200) {
        stateDate2.showList = false;
        stateDate2.resData = res.data.data;
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 查看详情
  let toDetail = (item) => {
    stateDate2.stusCode = item.project_status;
    stateDate2.userID = item.id; // 人员关系id
    apiPort_detail(item.ad_project);
  };
  // 关闭详情
  let detailClose = () => {
    stateDate2.showList = true;
    apiPort_list(activeKey.value, 1, 10);
  };
  // 取消申请
  let apiPort_calcel = (id) => {
    calcelApply(
      {
        no: "",
      },
      id
    ).then((res) => {
      if (res.data.code === 200) {
        message.success("取消申请成功");
        pageNation.currentPage = 1;
        pageNation.pageSize = 5;
        apiPort_list(activeKey.value, 1, 5);
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  let cancelEvent = (item) => {
    Modal.confirm({
      title: `是否确认取消项目【${item.project_name}】的申请?`,
      icon: createVNode(ExclamationCircleOutlined),
      content: ``,
      cancelText: "取消",
      okText: "确认",
      closable: true,
      centered: true,
      onOk() {
        apiPort_calcel(item.id);
      },
      onCancel() {},
    });
  };
  return {
    ...toRefs(stateDate2),
    apiPort_detail,
    toDetail,
    detailClose,
    cancelEvent,
    payEvent,
  };
}
// 确认完成相关
let { evalueVisible, rateValue, areaValue, rowID, evalueEvent, confirmEvent } =
  realte_confirm();
function realte_confirm() {
  let stateData = reactive({
    evalueVisible: false,
    rateValue: 0,
    areaValue: "",
    rowID: "",
  });
  let confirmEvent = (item) => {
    if (item.delivery_result) {
      stateData.evalueVisible = true;
      stateData.rowID = item.ad_project;
    } else {
      Modal.confirm({
        title: "请先完成数据上传再进行确认",
        icon: createVNode(ExclamationCircleOutlined),
        cancelText: "取消",
        okText: "确认",
        closable: true,
        centered: true,
        onOk() {
          stusCode.value = item.project_status;
          userID.value = item.id; // 人员关系id
          apiPort_detail(item.ad_project);
        },
        onCancel() {},
      });
    }
  };
  // 确认完成--评价
  let evalueEvent = () => {
    okFinish({
      ad_project: stateData.rowID,
      user_evaluate_score: stateData.rateValue,
      user_evaluate_content: stateData.areaValue,
    }).then((res) => {
      if (res.data.code === 200) {
        message.success("已确认完成");
        stateData.evalueVisible = false;
        apiPort_list(activeKey.value, 1, 5);
      } else {
        message.error(res.data.msg);
      }
    });
  };
  return { ...toRefs(stateData), evalueEvent, confirmEvent };
}
// 页码相关
let { sizeChange } = relate_page();
function relate_page() {
  let sizeChange = (current, size) => {
    pageNation.currentPage = current;
    pageNation.pageSize = size;
    apiPort_list(activeKey.value, pageNation.currentPage, pageNation.pageSize);
  };
  return { sizeChange };
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>