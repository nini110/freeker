<template>
  <div>
    <h2 class="proj_title">
      创造优质广告投放，实现双赢<span @click="toPage">前往项目中心</span>
    </h2>
    <div class="proj_box">
      <div v-for="(item, idx) in projectList" :key="idx" class="proj_box_div">
        <div class="proj_box_card">
          <div class="proj_desc">
            {{ item.project_name }}
          </div>
          <div class="proj_txt">
            <p class="proj_p"><span>投放平台</span>{{ item.platCn }}</p>
            <p class="proj_p"><span>预算金额</span>￥{{ item.budget }}</p>
            <p class="proj_p"><span>服务费</span>￥{{ item.brokerage }}</p>
            <p class="proj_p"><span>所属类目</span>{{ item.categoryCn }}</p>
            <p class="proj_p"><span>截止时间</span>{{ item.time }}</p>
          </div>
          <div class="proj_btn">
            <span @click="applyEvent(item)">申请</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { FormOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { reactive, ref, onBeforeMount, toRefs, createVNode, watch } from "vue";
import { useRouter } from "vue-router";
import { getProjList, applyProj, getProjDetail } from "@/api/api";
import dayjs from "dayjs";
import { message, Modal } from "ant-design-vue";
import { useStore } from "vuex";

let $router = useRouter();
const store = useStore();
// 项目中心
let { projectList, apiPort_list, applyEvent, toPage } = projectFun();
function projectFun() {
  let stateDate = reactive({
    projectList: [],
  });
  // 获取列表
  let apiPort_list = () => {
    getProjList({
      no: "",
      page: 1,
      page_size: 3,
      ordering: "-create_time",
    }).then((res) => {
      if (res.data.code === 200) {
        stateDate.projectList = [];
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
        apiPort_list(1, 3);
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
  let watch_store = watch(
    store.state,
    (newval, oldval) => {
      apiPort_list();
    },
    { deep: true }
  );

  onBeforeMount(() => {
    if (!localStorage.getItem("token")) {
      store.commit("pageData/SET_USERNAME", "");
      store.commit("pageData/SET_ACCOUNT", "");
      store.commit("pageData/SET_ACCOUNTID", null);
      store.commit("pageData/SET_USERIMG", "");
    }
    apiPort_list();
  });
  let toPage = () => {
    $router.push({
      path: "/tem/projectCenter",
    });
  };
  return { ...toRefs(stateDate), apiPort_list, applyEvent, toPage };
}
</script>
<style lang="scss" scoped>
@import "index";
</style>