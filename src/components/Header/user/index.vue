<template>
  <div ref="aff2">
    <a-modal
      dialogClass="user_dialog"
      v-model:visible="visibleDia"
      title="用户信息"
      :footer="null"
      @cancel="dialogEvent"
      :keyboard="false"
      :maskClosable="false"
      centered
      :width="660"
      :getContainer="$refs.aff2"
    >
      <template #footer>
        <a-button key="back" type="primary" @click="dialogEvent"
          >知道了</a-button
        >
      </template>
      <div class="user">
        <div class="user_img">
          <img src="../../../assets/user.png" alt="" />
        </div>
        <div class="user_box">
          <p>
            <span class="label iconfont icon-xiaolian2">昵称：</span>
            <a-input-group v-if="showIpt" compact>
              <a-input v-model:value="nickName" allow-clear />
              <a-button @click="confirmEvent">确定</a-button>
            </a-input-group>
            <span v-else
              >张山<i @click="editEvent"><edit-outlined /></i
            ></span>
          </p>
          <p>
            <span class="label iconfont icon-zhanghaozhongxinzhanghaoguanli"
              >账号：</span
            >
            <span>123456789</span>
          </p>
          <p>
            <span class="label iconfont icon-dengji">投手等级：</span>
            <span>高级</span>
          </p>
          <p>
            <span class="label iconfont icon-zizhi">投放资质：</span>
            <span
              >京东五星投手<i @click="uploadEvent"><edit-outlined /></i
            ></span>
          </p>
          <p>
            <span class="label iconfont icon-yinxingqia">美事通账号：</span>
            <span class="bind">未绑定<i @click="bindEvent"><link-outlined /></i></span>
          </p>
        </div>
      </div>
      <div v-if="showErweima" class="erweima">
        <img src="../../../assets/images/mst.png" alt="">
        <img src="../../../assets/images/weweima.webp" alt="">
      </div>
      <div v-if="showUpload" class="zizhi">
        <h2><edit-outlined />修改</h2>
        <a-form
          :model="zizhiForm"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <div class="ant-form-div">
            <a-form-item label="平台">
              <a-select
                v-model:value="zizhiForm.plat"
                :options="options"
                allow-clear
              ></a-select>
            </a-form-item>
            <a-form-item label="等级">
              <a-select
                v-model:value="zizhiForm.level"
                :options="options"
                allow-clear
              ></a-select>
            </a-form-item>
            <a-form-item label="编号">
              <a-input v-model:value="zizhiForm.code" allow-clear />
            </a-form-item>
          </div>
          <div class="ant-form-div">
            <a-form-item label="上传">
              <a-upload-dragger
                v-model:fileList="fileList"
                name="file"
                :multiple="true"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                @change="handleChange"
                @drop="handleDrop"
              >
                <p class="ant-upload-drag-icon">
                  <inbox-outlined></inbox-outlined>
                </p>
                <p class="ant-upload-text">点击或拖拽至区域上传</p>
              </a-upload-dragger>
            </a-form-item>
          </div>
        </a-form>
        <div class="zizhi-btn">
          <a-button type="primary" html-type="submit" @click="fromSave"
            >确认</a-button
          >
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import { reactive, ref, toRefs, watch } from "vue";
import { message } from "ant-design-vue";
import {
  InboxOutlined,
  EditOutlined,
  UploadOutlined,
  LinkOutlined
} from "@ant-design/icons-vue";
let $props = defineProps({
  showDialog: {
    type: Boolean,
  },
});
let $emit = defineEmits(["changeDialogTag"]);
let { visibleDia, watchTag, dialogEvent } = realte_dialog();
function realte_dialog() {
  let propsData = toRefs($props);
  let visibleDia = ref(true);
  let watchTag = watch(
    propsData.showDialog,
    (newval, oldval) => {
      visibleDia.value = newval;
    },
    { immediate: true }
  );
  let dialogEvent = () => {
    $emit("changeDialogTag", false);
  };
  return { visibleDia, watchTag, dialogEvent };
}
// 修改昵称
let { nickName, showIpt, editEvent, confirmEvent } = relate_nick();
function relate_nick() {
  let nickName = ref("");
  let showIpt = ref(false);
  let editEvent = () => {
    if (showUpload.value) {
      message.warning({
        content: "请先确认修改信息",
        duration: 2,
      });
      return
    }
    showIpt.value = true;
  };
  let confirmEvent = () => {
    showIpt.value = false;
  };
  return { nickName, showIpt, editEvent, confirmEvent };
}
// 认证资质
let { showUpload, uploadEvent, zizhiForm, fromSave, showErweima, bindEvent } = relate_upload();
function relate_upload() {
  let showUpload = ref(false);
  let uploadEvent = () => {
    if (showIpt.value) {
      message.warning({
        content: "请先确认修改信息",
        duration: 2,
      });
      return
    }
    showUpload.value = !showUpload.value;
  };
  let zizhiForm = reactive({
    plat: "",
    level: "",
    code: "",
    file: "",
  });
  let fromSave = () => {
    showUpload.value = !showUpload.value;
  };
  // ----
  let showErweima = ref(false)
  let bindEvent = () => {
    showErweima.value = !showErweima.value
    setTimeout(() => {
      showErweima.value = false
    }, 150000)
  }
  return { showUpload, uploadEvent, zizhiForm, fromSave, showErweima, bindEvent };
}
</script>
<style lang="scss" scoped>
@import "index";
</style>
