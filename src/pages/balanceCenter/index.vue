<template>
  <div>
    <div v-if="showList" class="planBox">
      <a-list item-layout="vertical" :data-source="balanceData">
        <template #footer> </template>
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <span @click="openPage">
                  {{ item.name }}
                </span>
              </template>
            </a-list-item-meta>
            <div class="planBox_info">
              <p><account-book-outlined /><span>佣金</span><span>100</span></p>
              <p>
                <user-outlined /><span>提现账号</span><span>美事通账号</span>
              </p>
              <p><appstore-outlined />申请结算</p>
            </div>
          </a-list-item>
        </template>
      </a-list>
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
    <DetailPage v-else :stusCode="5" @back="detailClose"></DetailPage>
  </div>
</template>
<script setup>
import { ref, computed, reactive } from "vue";
import {
  AccountBookOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons-vue";
import DetailPage from "../detailPage/index.vue";

let { balanceData, showList, openPage, detailClose } = relate_balance();
function relate_balance() {
  let showList = ref(true);
  let balanceData = reactive([
    {
      name: "这是项目一",
      content: "hghjdagsjd",
    },
    {
      name: "这是项目二",
      content: "423443",
    },
  ]);
  let openPage = () => {
    showList.value = false
  };
    let detailClose = () => {
    showList.value = true;
  };
  return { balanceData, showList, openPage, detailClose };
}
//
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