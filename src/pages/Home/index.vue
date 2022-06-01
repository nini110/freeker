<template>
  <div>
    <h2 class="proj_title">
      创造优质广告投放，实现双赢<span @click="toPage">前往项目大厅</span>
    </h2>
    <div class="proj_box">
     <div
        v-for="(item, idx) in projectList"
        :key="idx"
        class="proj_box_div"
        @click="cardClick"
      >
        <div class="proj_box_card">
          <div class="proj_desc">
            我是项目名称
          </div>
          <div class="proj_txt">
            <p class="proj_p"><span>所属项目：</span>{{ item.type }}</p>
            <p class="proj_p"><span>预算金额：</span>{{ item.money }}</p>
            <p class="proj_p"><span>预期目标：</span>{{ item.target }}</p>
            <p class="proj_p"><span>投放时间：</span>{{ item.time }}</p>
            <p class="proj_p"><span>投放平台：</span>{{ item.plat }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { FormOutlined } from "@ant-design/icons-vue";
import { reactive, ref } from "vue";
import { useRouter } from 'vue-router'
// 项目中心
let { projectList, toPage } = projectFun();
let $router = useRouter()
function projectFun() {
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
  ]);
  let toPage = () => {
    $router.push({
      path: '/projectCenter'
    })
  }
  return { projectList, toPage };
}
</script>
<style lang="scss" scoped>
@import "index";
</style>