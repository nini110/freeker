<template>
  <div>这是新增的权限页面</div>
  <p>{{ username }}</p>
  <h2 @click="cmt1">按钮： 改变store的username 为 小明</h2>
  <h2 @click="cmt2">按钮： 改变store的username 为 三星</h2>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useStore } from "vuex";
let store = useStore();
let { username, cmt1, cmt2 } = init();
function init() {
  const username = computed(() => {
      return store.getters.user
  })
  let cmt1 = () => {
    store.commit("pageData/SET_USER", "小明");
  };
  let cmt2 = () => {
    store.commit("pageData/SET_USER", "三星");
  };
  return { username, cmt1, cmt2};
}
</script>
