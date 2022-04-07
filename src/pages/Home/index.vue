<template>
    <a-switch
        v-model:checked="status"
        checked-children="开"
        un-checked-children="关"
        @change="switchEvent"
    />
    <div>
        当前开关的状态是：
        <span>{{ statusTxt }}</span>
    </div>
    <Iptcom></Iptcom>
    妈咪{{showTxt}}
</template>
<script setup>
import { ref } from 'vue'
import Iptcom from './child/index.vue'
let status = ref(false)
let statusTxt = ref('')

const switchEvent = val => {
    console.log(val)
    statusTxt.value = val ? '打开' : '关闭'
}

</script>