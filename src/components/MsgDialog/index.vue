<template>
  <div ref="aff1">
    <a-modal
      v-model:visible="diaVisible"
      @ok="handlecancel"
      @cancel="handlecancel"
      title="消息中心"
      cancelText="已读"
      okText="关闭"
      centered
      :maskClosable="false"
      :keyboard="false"
      forceRender
      :getContainer="$refs.aff1"
    >
      <div class="msgBox" v-for="(item, idx) in msgList" :key="idx">
        <a-comment>
          <template #actions>
            <span key="comment-basic-reply-to">去查看</span>
          </template>
          <template #author><a>系统消息</a></template>
          <template #avatar>
            <a-avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
          </template>
          <template #content>
            <p>{{item.txt}}</p>
          </template>
          <template #datetime>
            <a-tooltip>
              <span>{{item.time}}</span>
            </a-tooltip>
          </template>
        </a-comment>
        <div class="msgBox_left"></div>
        <div class="msgBox_right"></div>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import {
  UserOutlined,
  MobileOutlined,
  CheckOutlined,
  LockOutlined,
} from "@ant-design/icons-vue";
import { ref, watch, toRefs, onMounted, reactive } from "vue";
import dayjs from "dayjs";
let $props = defineProps({
  showMsg: {
    type: Boolean,
  },
});
let $emit = defineEmits(["changeMsgTag"]);
// 消息相关
let { diaVisible, watchShow, handlecancel, msgList } = relate_msg();
function relate_msg() {
  let diaVisible = ref(false);
  let propsData = toRefs($props);
  let watchShow = watch(
    propsData.showMsg,
    (newval, oldval) => {
      diaVisible.value = newval;
    },
    { immediate: true }
  );
  let handlecancel = () => {
    $emit("changeMsgTag");
  };
  //   ---------
  let msgList = reactive([
    {
      time: "2022-05-05",
      txt: "您的******项目已经申请通过了快去查看吧",
      label: "任务消息",
      flag: 1,
    },
    {
      time: "2022-05-05",
      txt: "您的******项目已经申请通过了快去经申请通过了快去经申请通过了快去查看吧",
      label: "任务消息",
      flag: 1,
    },
    {
      time: "2022-05-05",
      txt: "您的******项目已经申请通过了快去查看吧",
      label: "系统消息",
      flag: 2,
    },
    {
      time: "2022-05-05",
      txt: "您的******项目已经申请通过过过过快去快去过过了快去查看吧",
      label: "任务消息",
      flag: 1,
    },
    {
      time: "2022-05-05",
      txt: "您的******项目已经申请通过了快去查看吧",
      label: "任务消息",
      flag: 1,
    },
    {
      time: "2022-05-05",
      txt: "您的******项****项****项****项****项目已经申请通过了快去查看吧",
      label: "任务消息",
      flag: 1,
    },
    {
      time: "2022-05-01",
      txt: "平台新增平台新增平台新增平台新增平台新增平台新增",
      label: "系统消息",
      flag: 2,
    },
    {
      time: "2022-05-01",
      txt: "平台新增平台新增平台新增平台新增平台新增平台新增",
      label: "系统消息",
      flag: 2,
    },
  ]);
  return { diaVisible, watchShow, handlecancel, msgList };
}
</script>

<style lang="scss" scoped>
@import "index.scss";
</style>