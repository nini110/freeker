<template>
  <div v-if="showList">
    <div class="searchIpt">
      <a-form :model="formData" layout="inline">
        <a-form-item label="项目">
          <a-input v-model:value="formData.projName" placeholder="请输入项目名称"/>
        </a-form-item>
        <a-form-item label="类目">
          <a-select v-model:value="formData.catgory" size="large" placeholder="请选择类目">
            <a-select-option value="lucy">家用电器</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="">
          <a-button type="primary">搜索</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="proj_box">
      <div
        v-for="(item, idx) in projectList"
        :key="idx"
        class="proj_box_div"
      >
        <div class="proj_box_card">
          <div class="proj_desc">我是项目名称<span>￥100</span></div>
          <div class="proj_txt" @click="cardClick">
            <p class="proj_p"><span>所属项目：</span>{{ item.type }}</p>
            <p class="proj_p"><span>预算金额：</span>{{ item.money }}</p>
            <p class="proj_p"><span>预期目标：</span>{{ item.target }}</p>
            <p class="proj_p"><span>投放时间：</span>{{ item.time }}</p>
            <p class="proj_p"><span>投放平台：</span>{{ item.plat }}</p>
          </div>
          <div class="proj_btn"><i>2022-05-18 18:06:27</i><span>申请</span></div>
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
  </div>
  <DetailPage v-else stusCode="none" @back="detailClose"></DetailPage>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import { FormOutlined } from "@ant-design/icons-vue";
import DetailPage from "../detailPage/index.vue";
import { useRoute } from "vue-router";
let $route = useRoute();
// 项目中心
let { projectList, showList, cardClick, detailClose, watchRoute } =
  relate_proj();
function relate_proj() {
  let projectList = reactive([
    {
      title: "EDG跨品联合活动",
      desc: "2022-01-01",
      type: "家用电器",
      money: "80000",
      target: "ROI: 20  CTR: 3%",
      time: "2022-03-03",
      plat: "京准通",
    },
    {
      title: "EDG跨品联合活动",
      desc: "2022-01-01",
      type: "家用电器",
      money: "80000",
      target: "ROI: 20  CTR: 3%",
      time: "2022-03-03",
      plat: "京准通",
    },
    {
      title: "EDG跨品联合活动",
      desc: "2022-01-01",
      type: "家用电器",
      money: "80000",
      target: "ROI: 20  CTR: 3%",
      time: "2022-03-03",
      plat: "京准通",
    },
    {
      title: "EDG跨品联合活动",
      desc: "2022-01-01",
      type: "家用电器",
      money: "80000",
      target: "ROI: 20  CTR: 3%",
      time: "2022-03-03",
      plat: "京准通",
    },
    {
      title: "EDG跨品联合活动",
      desc: "2022-01-01",
      type: "家用电器",
      money: "80000",
      target: "ROI: 20  CTR: 3%",
      time: "2022-03-03",
      plat: "京准通",
    },
    {
      title: "EDG跨品联合活动",
      desc: "2022-01-01",
      type: "家用电器",
      money: "80000",
      target: "ROI: 20  CTR: 3%",
      time: "2022-03-03",
      plat: "京准通",
    },
  ]);
  let showList = ref(true);
  let cardClick = () => {
    showList.value = false;
  };
  let detailClose = () => {
    showList.value = true;
  };
  let watchRoute = watch(
    () => $route.name,
    (newval, oldval) => {
      showList.value =
        newval === "projectCenter" || newval.indexOf("pc_") === -1;
    },
    { immediate: true }
  );
  return { projectList, showList, cardClick, detailClose, watchRoute };
}
// 搜索相关
let { formData } = relate_search();
function relate_search() {
  let formData = ref({
    projName: "",
    catgory: null
  });
  return { formData };
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
@import "../home/index.scss";
@import "./index.scss";
</style>