<template>
  <div v-if="showList">
    <a-tabs class="planTabs" v-model:activeKey="activeKey">
      <a-tab-pane
        v-for="item in menuList"
        :key="item.code"
        :tab="item.label"
      ></a-tab-pane>
    </a-tabs>
    <div v-for="(item, idx) in dataList" :key="idx" class="planBox">
      <div class="planBox_title">
        <p>
          <span>订单号：</span><span>{{ item.order }}</span>
        </p>
        <p>
          <span>提交时间：</span><span>{{ item.time }}</span>
        </p>
      </div>
      <div class="planBox_info">
        <div>{{ item.label }}</div>
        <div>
          <span :class="item.cls" class="sts">{{ item.status }}</span>
        </div>
        <div>
          <span class="label">投放平台</span>
          <span>{{ item.plat }}</span>
        </div>
        <div>
          <span class="label">服务费</span>
          <span class="mny">{{ item.money }}</span>
        </div>
        <div class="planBox_info_btn">
          <span @click="toDetail(item)">查看详情</span>
          <span v-if="item.cls === 'dsh'" @click="cancelEvent(item)"
            >取消申请</span
          >
          <span v-if="item.cls === 'dqr'" @click="confirmEvent(2)"
            >确认完成</span
          >
          <span v-if="item.cls === 'ywc'">前往结算</span>
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
  <DetailPage v-else :stusCode="statusCode" @back="detailClose"></DetailPage>
</template>
<script setup>
import { ref, reactive, createVNode } from "vue";
import { Modal } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import DetailPage from "../detailPage/index.vue";

let $router = useRouter();
const menuList = reactive([
  {
    label: "全部",
    code: 0,
  },
  {
    label: "待审核",
    code: 1,
  },
  {
    label: "待开始",
    code: 2,
  },
  {
    label: "进行中",
    code: 3,
  },
  {
    label: "待确认",
    code: 4,
  },
  {
    label: "已完成",
    code: 5,
  },
  {
    label: "已取消",
    code: 6,
  },
]);
const dataList = reactive([
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "待审核",
    statusCode: 1,
    cls: "dsh",
    plat: "京准通",
    money: "￥100",
  },
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "待开始",
    statusCode: 2,
    cls: "dqd",
    plat: "京准通",
    money: "￥100",
  },
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "进行中",
    statusCode: 3,
    cls: "jxz",
    plat: "京准通",
    money: "￥100",
  },
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "待确认",
    statusCode: 4,
    cls: "dqr",
    plat: "京准通",
    money: "￥100",
  },
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "已完成",
    statusCode: 5,
    cls: "ywc",
    plat: "京准通",
    money: "￥100",
  },
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "已取消",
    statusCode: 6,
    cls: "yqx",
    plat: "京准通",
    money: "￥100",
  },
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "已取消",
    statusCode: 6,
    cls: "yqx",
    plat: "京准通",
    money: "￥100",
  },
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "已取消",
    statusCode: 6,
    cls: "yqx",
    plat: "京准通",
    money: "￥100",
  },
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "已取消",
    statusCode: 6,
    cls: "yqx",
    plat: "京准通",
    money: "￥100",
  },
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "已取消",
    statusCode: 6,
    cls: "yqx",
    plat: "京准通",
    money: "￥100",
  },
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "已取消",
    statusCode: 6,
    cls: "yqx",
    plat: "京准通",
    money: "￥100",
  },
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "已取消",
    statusCode: 6,
    cls: "yqx",
    plat: "京准通",
    money: "￥100",
  },
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "已取消",
    statusCode: 6,
    cls: "yqx",
    plat: "京准通",
    money: "￥100",
  },
  {
    time: "2022-12-12 15:07",
    order: "2454756656576",
    label: "京东国际****",
    status: "已取消",
    statusCode: 6,
    cls: "yqx",
    plat: "京准通",
    money: "￥100",
  },
]);
let activeKey = ref(0)
// 公共的东西
let { showList, cancelEvent, statusCode, toDetail, detailClose } = relate_plan();
function relate_plan() {
  let showList = ref(true);
  let statusCode = ref(0)
  let cancelEvent = (item) => {
    Modal.confirm({
      title: "是否确认取消?",
      icon: createVNode(ExclamationCircleOutlined),
      content: `任务：${item.label}，订单号${item.order}`,
      cancelText: "取消",
      okText: "确认",
      closable: true,
      centered: true,
      onOk() {},
      onCancel() {},
    });
  };
  let toDetail = (item) => {
    showList.value = false;
    statusCode.value = item.statusCode
  };
  let detailClose = () => {
    showList.value = true;
  };
  return { showList, cancelEvent, statusCode, toDetail, detailClose };
}
// 确认完成相关
let { confirmEvent, evalueVisible, evalueEvent, rateValue, areaValue } = realte_confirm();
function realte_confirm() {
  let evalueVisible = ref(false);
  let rateValue = ref(3);
  let areaValue = ref("");
  let confirmEvent = (val) => {
    if (val === 2) {
      evalueVisible.value = true;
      let evalueEvent = () => {

      }
    } else {
      Modal.confirm({
        title: "请先完成数据上传再进行确认",
        icon: createVNode(ExclamationCircleOutlined),
        cancelText: "取消",
        okText: "上传",
        closable: true,
        centered: true,
        onOk() {},
        onCancel() {},
      });
    }
  };
  return { confirmEvent, evalueVisible, evalueEvent, rateValue, areaValue };
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