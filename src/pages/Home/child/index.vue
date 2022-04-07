<template>
    <a-input-search
        v-model:value="iptvalue"
        placeholder="请输入内容"
        enter-button="Search"
        size="large"
        @search="searchEvent"
    />
    <div>
        当前输入的内容是：
        <span>{{ showTxt }}</span>
    </div>
</template>
<script setup>
import { ref } from 'vue'
let { showTxt, iptvalue, searchEvent } = iptevent()
function iptevent() {
    let showTxt = ref('')
    let iptvalue = ref('')
    function searchEvent(val) {
        showTxt.value = val
    }
    return { showTxt, iptvalue, searchEvent }
}
</script>