<template>
  <a-modal
    class="mdmodal"
    v-model:visible="mdVisible"
    title=""
    :footer="null"
    centered
    :maskClosable="false"
    :keyboard="false"
    :width="430"
    @cancel="mdEvent(1)"
  >
    <div class="md">
      <div class="md_title">个人实名认证</div>
      <div class="md_tip">认证成功即可申领需求,开启更多服务内容</div>
      <ul class="md_ul">
        <li class="iconfont icon-wanshanshuju">完善实名认证</li>
        <li class="iconfont icon-tengxunshimingrenzheng">专属认证标识</li>
        <li class="iconfont icon-tuijian">优先推荐需求</li>
      </ul>
      <div class="md_btn">
        <a-button class="no" @click="mdEvent(1)">先去看看</a-button>
        <a-button class="yes" type="primary" @click="mdEvent(2)"
          >立即认证</a-button
        >
      </div>
    </div>
  </a-modal>
</template>
  <script setup>
import { toRefs, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const $route = useRoute();
const $router = useRouter();
const store = useStore();
let $props = defineProps({
  showMdModal: {
    type: Boolean,
  },
});
let $emits = defineEmits(["closeMod"]);
let { showMdModal } = toRefs($props);
let { mdVisible, mdEvent } = relate_modal();
function relate_modal() {
  let stateData = reactive({
    mdVisible: false,
  });
  let watch_show = watch(
    showMdModal,
    (newval, oldval) => {
      stateData.mdVisible = newval;
    },
    { immediate: true }
  );
  // let watch_log = watch(
  //   () => store.getters.firstLog,
  //   (newval, oldval) => {
  //     stateData.mdVisible = newval;
  //   },
  //   { immediate: true }
  // );
  let mdEvent = (val) => {
    if (val === 1) {
      stateData.mdVisible = false;
      $emits("closeMod");
    } else {
      localStorage.setItem("menuTag", "per");
      $router.push({
        path: `/personM/personCenter`,
      });
    }
  };
  return { ...toRefs(stateData), mdEvent };
}
</script>
  <style lang="scss" scoped>
@import "index.scss";
</style>