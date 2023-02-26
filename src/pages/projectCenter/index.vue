<template>
  <div v-if="showList">
    <div class="searchIpt">
      <a-form ref="refForm" :model="formData" layout="inline">
        <a-form-item label="项目">
          <a-input
            v-model:value="formData.project_name"
            placeholder="请输入项目名称"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="类目">
          <a-select
            v-model:value="formData.category"
            placeholder="请选择类目"
            allow-clear
          >
            <a-select-option
              v-for="(item, idx) in platOption"
              :key="idx"
              :value="item.value"
              >{{ item.label }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="">
          <a-button @click="resetEvent">重置</a-button>
          <a-button type="primary" @click="searchEvent">搜索</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div v-if="projectList.length === 0" class="proj_box proj_box_empty">
      <a-empty />
    </div>
    <div v-else class="dataBox">
      <div class="proj_box">
        <div v-for="(item, idx) in projectList" :key="idx" class="proj_box_div">
          <div class="proj_box_card">
            <div class="proj_desc">
              {{ item.project_name }}
            </div>
            <div class="proj_txt" @click="cardClick(item)">
              <p class="proj_p"><span>投放平台</span>{{ item.platCn }}</p>
              <p class="proj_p"><span>项目预算</span>￥{{ item.budget }}</p>
              <p class="proj_p"><span>服务费</span>￥{{ item.brokerage }}</p>
              <p class="proj_p"><span>产品类型</span>{{ item.categoryCn }}</p>
              <p class="proj_p"><span>截止时间</span>{{ item.time }}</p>
            </div>
            <div class="proj_btn">
              <span @click="applyEvent(item)">申请</span>
            </div>
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
    </div>
    <MdModal :showMdModal="showMdModal" @closeMod="closeModEvent"></MdModal>
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
import { useStore } from "vuex";
import { getProjList, applyProj, getProjDetail } from "@/api/api";
import dayjs from "dayjs";
import { message, Modal, Empty } from "ant-design-vue";
import optionJs from "@/utils/option.js";
import MdModal from "../../components/MdModal";
const store = useStore();
let $route = useRoute();
let pageNation = reactive({
  currentPage: 1,
  pageSize: 6,
  totalNum: null,
});
const refForm = ref();
// 项目中心
let {
  showMdModal,
  projectList,
  platOption,
  formData,
  apiPort_list,
  applyEvent,
  searchEvent,
  resetEvent,
  closeModEvent,
} = relate_proj();
function relate_proj() {
  const stateDate = reactive({
    showMdModal: false,
    projectList: [],
    platOption: null,
    formData: {
      project_name: "",
      category: null,
    },
  });
  let closeModEvent = () => {
    stateDate.showMdModal = false;
  };
  // 获取列表
  let apiPort_list = (page, page_size) => {
    getProjList({
      ...stateDate.formData,
      no: "",
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
              item.platCn = "京东";
              break;
            case 2:
              item.platCn = "抖音";
              break;
          }
          item.create_time = dayjs(item.create_time).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          // 报名截止时间
          item.time = dayjs(item.project_end_date).format("YYYY-MM-DD HH:mm");
          let obj = {
            ...item,
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
        message.error("请先上传项目对应投放平台资质信息");
      } else if (res.data.code === 4006) {
        message.error("申请失败，该项目已超出申请截止时间");
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  let applyEvent = (row) => {
    if (store.getters.verifyFlag === 2) {
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
    } else {
      stateDate.showMdModal = true;
    }
  };
  let searchEvent = () => {
    if (stateDate.formData.project_name || stateDate.formData.category) {
      apiPort_list(1, 6);
    }
  };
  let resetEvent = () => {
    stateDate.formData = {
      project_name: "",
      category: null,
    };
    apiPort_list(1, 6);
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
    stateDate.platOption = optionJs.categoryOpt;
    apiPort_list(pageNation.currentPage, pageNation.pageSize);
  });
  return {
    ...toRefs(stateDate),
    closeModEvent,
    apiPort_list,
    applyEvent,
    searchEvent,
    resetEvent,
  };
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
        no: "",
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
@import "../Home/index.scss";
</style>