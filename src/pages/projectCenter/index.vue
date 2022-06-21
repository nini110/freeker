<template>
  <div v-if="showList">
    <div class="searchIpt">
      <a-form :model="formData" layout="inline">
        <a-form-item label="项目">
          <a-input
            v-model:value="formData.projName"
            placeholder="请输入项目名称"
          />
        </a-form-item>
        <a-form-item label="类目">
          <a-select
            v-model:value="formData.catgory"
            size="large"
            placeholder="请选择类目"
          >
            <a-select-option value="lucy">家用电器</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="">
          <a-button type="primary">搜索</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="proj_box">
      <div v-for="(item, idx) in projectList" :key="idx" class="proj_box_div">
        <div class="proj_box_card">
          <div class="proj_desc">
            {{ item.project_name }}<span>￥{{ item.brokerage }}</span>
          </div>
          <div class="proj_txt" @click="cardClick(item)">
            <p class="proj_p"><span>所属类目：</span>{{ item.categoryCn }}</p>
            <p class="proj_p"><span>预算金额：</span>{{ item.budget }}</p>
            <p class="proj_p"><span>预期目标：</span>{{ item.target }}</p>
            <p class="proj_p"><span>投放平台：</span>{{ item.platCn }}</p>
            <p class="proj_p"><span>截止时间：</span>{{ item.time }}</p>
          </div>
          <div class="proj_btn">
            <i>{{ item.create_time }}</i
            ><span @click="applyEvent(item)">申请</span>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination fixed">
      <a-pagination
        v-model:current="pageNation.currentPage"
        v-model:pageSize="pageNation.pageSize"
        :pageSizeOptions="['6', '12', '18']"
        show-size-changer
        :total="pageNation.totalNum"
        @change="sizeChange"
      />
    </div>
  </div>
  <DetailPage
    v-else
    :stusCode="99"
    :resData="resData"
    @back="detailClose"
  ></DetailPage>
</template>
<script setup>
import { ref, reactive, watch, onBeforeMount, toRefs, createVNode } from "vue";
import { FormOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import DetailPage from "../detailPage/index.vue";
import { useRoute } from "vue-router";
import { getProjList, applyProj, getProjDetail } from "@/api/api";
import dayjs from "dayjs";
import { message, Modal } from "ant-design-vue";
// import { Item } from "ant-design-vue/lib/menu";

let $route = useRoute();
let pageNation = reactive({
  currentPage: 1,
  pageSize: 6,
  totalNum: null,
});
// 项目中心
let { projectList, apiPort_list, applyEvent } = relate_proj();
function relate_proj() {
  const stateDate = reactive({
    projectList: [],
  });
  // 获取列表
  let apiPort_list = (page, page_size) => {
    getProjList({
      haha: "",
      ordering: "-create_time",
      page,
      page_size,
    }).then((res) => {
      if (res.data.code === 200) {
        stateDate.projectList = [];
        pageNation.totalNum = res.data.total;
        let result = res.data.data;
        result.forEach((item, idx) => {
          switch (parseInt(item.category)) {
            case 1:
              item.categoryCn = "家用电器";
              break;
            case 2:
              item.categoryCn = "手机数码";
              break;
            case 3:
              item.categoryCn = "电脑办公";
              break;
            case 4:
              item.categoryCn = "家居厨具";
              break;
            case 5:
              item.categoryCn = "服饰鞋品";
              break;
            case 6:
              item.categoryCn = "美妆";
              break;
            case 7:
              item.categoryCn = "母婴用品";
              break;
            case 8:
              item.categoryCn = "玩具乐器";
              break;
            case 9:
              item.categoryCn = "食品饮料";
              break;
            case 10:
              item.categoryCn = "医药保健";
              break;
            case 11:
              item.categoryCn = "图书";
              break;
          }
          switch (parseInt(item.delivery_platform)) {
            case 1:
              item.platCn = "京准通";
              break;
          }
          item.create_time = dayjs(item.create_time).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          // 报名截止时间
          item.time = dayjs(item.project_end_date).format("YYYY-MM-DD HH:mm");
          // 目标
          let target = "";
          let delivery_target = JSON.parse(item.delivery_target);
          delivery_target
            .slice(0, delivery_target.length - 2)
            .forEach((val, index) => {
              target += `${val.label}：${val.value}`;
            });
          let obj = {
            ...item,
            target,
          };
          stateDate.projectList.push(obj);
        });
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 申请事件
  let apiPort_apply = (id) => {
    applyProj({
      ad_project: id,
    }).then((res) => {
      if (res.data.code === 200) {
        message.success("申请成功，等待审核");
        apiPort_list(1, 6);
      } else if (res.data.code === 4105) {
        message.error("请先上传资质信息");
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  let applyEvent = (row) => {
    Modal.confirm({
      title: `是否确认申请当前项目`,
      centered: true,
      icon: createVNode(ExclamationCircleOutlined),
      onOk() {
        apiPort_apply(row.id);
      },
      onCancel() {
        console.log("Cancel");
      },
      class: "test",
    });
  };
  let watchRoute = watch(
    () => $route.name,
    (newval, oldval) => {
      stateDate.showList =
        newval === "projectCenter" || newval.indexOf("pc_") === -1;
    },
    { immediate: true }
  );
  onBeforeMount(() => {
    apiPort_list(pageNation.currentPage, pageNation.pageSize);
  });
  return { ...toRefs(stateDate), apiPort_list, applyEvent };
}
// 详情相关
let { showList, resData, cardClick, detailClose } = relate_detail();
function relate_detail() {
  const stateDate2 = reactive({
    showList: true,
    resData: {},
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
  let cardClick = (item) => {
    apiPort_detail(item.id);
  };
  let detailClose = () => {
    stateDate2.showList = true;
    apiPort_list(1, 5);
  };
  return { ...toRefs(stateDate2), cardClick, detailClose };
}
// 搜索相关
let { formData } = relate_search();
function relate_search() {
  let formData = ref({
    projName: "",
    catgory: null,
  });
  return { formData };
}
// 页码相关
let { sizeChange } = relate_page();
function relate_page() {
  let sizeChange = (current, size) => {
    pageNation.currentPage = current;
    pageNation.pageSize = size;
    apiPort_list(pageNation.currentPage, pageNation.pageSize);
  };
  return { sizeChange };
}
</script>
<style lang="scss" scoped>
@import "./index.scss";
@import "../home/index.scss";
</style>