<template>
  <div class="detailBox">
    <div class="detailBox_topbtn" :class="iconClass">
      <a-button @click="backEvent">
        <template #icon><LeftOutlined /></template>返回</a-button
      >
    </div>
    <div class="detailBox_div">
      <h2>项目描述</h2>
      <p class="detailBox_desc">
        任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述
        任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述
      </p>
    </div>
    <div class="detailBox_div">
      <h2>项目信息</h2>
      <div class="detailBox_info">
        <h3>京东国际******</h3>
        <div class="detailBox_info_box">
          <p v-for="(item, idx) in detailList" :key="idx" :class="item.class">
            <span>{{ item.label }}：</span><span>{{ item.value }}</span>
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="
        stusCode === 2 ||
        stusCode === 3 ||
        stusCode === 4 ||
        stusCode === 5 ||
        stusCode === 6
      "
      class="detailBox_div"
    >
      <h2>投放信息</h2>
      <div class="detailBox_info">
        <div class="detailBox_info_box">
          <p v-for="(item, idx) in toufangList" :key="idx" :class="item.class">
            <span>{{ item.label }}：</span><span>{{ item.value }}</span>
          </p>
        </div>
      </div>
    </div>
    <div v-if="stusCode === 4 || stusCode === 5" class="detailBox_div">
      <h2>数据信息</h2>
      <div class="detailBox_info">
        <div class="detailBox_info_box">
          <p v-for="(item, idx) in shujuList" :key="idx" :class="item.class">
            <span>{{ item.label }}：</span><span>{{ item.value }}</span>
          </p>
        </div>
      </div>
    </div>
    <div v-if="stusCode === 5" class="detailBox_div">
      <h2>评价</h2>
      <div class="detailBox_desc">
        <a-rate :value="2" disabled />
        <div>
          任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述
          任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述
        </div>
      </div>
    </div>
    <div v-if="stusCode === 6" class="detailBox_div">
      <h2>取消原因</h2>
      <div class="detailBox_desc">
        任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述
        任务描述任务描述任务描述任务描述任务描述任务描述任务描述任务描述
      </div>
    </div>
    <div class="detailBox_btn">
      <a-button v-if="stusCode === 'none'" type="primary" block>去申请</a-button>
      <a-button v-if="stusCode === 1" type="primary" block>取消申请</a-button>
      <a-button v-if="stusCode === 4" type="primary" block>确认完成</a-button>
      <a-button v-if="stusCode === 5" type="primary" block>前往结算</a-button>
    </div>
  </div>
</template>
<script setup>
import { ref, toRefs, toRef, reactive, watch } from "vue";
import { LeftOutlined } from "@ant-design/icons-vue";
const $props = defineProps({
  stusCode: Number,
});
// 项目详情页相关
let $emit = defineEmits(["back"]);
let { detailList, currentPlanCode, backEvent, iconClass, watch_stusCode } = relate_detail();
function relate_detail() {
  let { stusCode } = toRefs($props);
  let detailList = reactive([
    {
      label: "服务费",
      value: 100,
      class: "one",
    },
    {
      label: "预算金额",
      value: 3500000,
      class: "one",
    },
    {
      label: "服务类型",
      value: "美妆护肤,个人护理",
      class: "one",
    },
    {
      label: "投放平台",
      value: "京准通",
      class: "one",
    },

    {
      label: "投放比例",
      value: "站内：80%  站外：20%",
      class: "two",
    },
    {
      label: "活动投放类型",
      value: "联合活动系统",
      class: "one",
    },
    {
      label: "活动解放节奏",
      value: "投放时间：3月2日-3月15日，重点时间：3.4（晚8）3.7-3.8，3.15",
      class: "three",
    },
    {
      label: "参与品牌",
      value: "--",
      class: "two",
    },
    {
      label: "投放代理数量",
      value: 1,
      class: "one",
    },
    {
      label: "投放时间",
      value: "2022.02.28-2022.03.17",
      class: "two",
    },
    {
      label: "应标截止日期",
      value: "2022.02.24",
      class: "one",
    },
  ]);
  let backEvent = () => {
    $emit("back");
  };
  let iconClass;
  let watch_stusCode = watch(
    stusCode,
    (newval, oldval) => {
      switch (newval) {
        case 1:
          iconClass = "dsh";
          break;
        case 2:
          iconClass = "dqd";
          break;
        case 3:
          iconClass = "jxz";
          break;
        case 4:
          iconClass = "dqr";
          break;
        case 5:
          iconClass = "ywc";
          break;
        case 6:
          iconClass = "yqx";
          break;
      }
    },
    { immediate: true }
  );
  return { detailList, currentPlanCode, backEvent, iconClass, watch_stusCode };
}
// 投放信息
let { toufangList } = relate_toufang();
function relate_toufang() {
  let toufangList = reactive([
    {
      label: "账号",
      value: 100,
      class: "one",
    },
    {
      label: "密码",
      value: 3500000,
      class: "one",
    },
    {
      label: "地址",
      value:
        "https://agency.jd.com/?ReturnUrl=https://agency.jd.com/crm/agent/#/bid/manage",
      class: "three",
    },
  ]);
  return { toufangList };
}
// 数据信息
let { shujuList } = relate_shuju();
function relate_shuju() {
  let shujuList = reactive([
    {
      label: "花费",
      value: 100,
      class: "one",
    },
    {
      label: "展示数",
      value: 141148,
      class: "one",
    },
    {
      label: "点击数",
      value: 100,
      class: "one",
    },
    {
      label: "点击率",
      value: 141148,
      class: "one",
    },
    {
      label: "平均千次展示成本",
      value: 100,
      class: "one",
    },
    {
      label: "平均点击成本",
      value: 141148,
      class: "one",
    },
    {
      label: "总订单行数",
      value: 100,
      class: "one",
    },
    {
      label: "总订单金额",
      value: 141148,
      class: "one",
    },
  ]);
  return { shujuList };
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>