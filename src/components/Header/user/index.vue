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
      :width="560"
      :getContainer="$refs.aff2"
    >
      <template #footer>
        <a-button key="back" type="primary" @click="dialogEvent"
          >知道了</a-button
        >
      </template>
      <div class="user">
        <div class="user_img">
          <a-upload
            v-model:file-list="fileList"
            name="avatar"
            list-type="picture-card"
            class="uploader-user"
            :showUploadList="false"
            :maxCount="1"
            :multiple="false"
            action=""
            @change="handleImgChange"
          >
            <img
              v-if="store.getters.userImg"
              :src="store.getters.userImg"
              alt="avatar"
            />
            <div v-else>
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </div>
        <div class="user_box" ref="boxref">
          <div class="user_box_item">
            <span class="label iconfont icon-xiaolian2">昵称</span>
            <a-input-group compact v-if="showIpt" size="small" class="cnt">
              <a-input
                v-model:value="nickName"
                allow-clear
                size="middle"
                @change="nickIptEvent"
              />
              <a-button type="primary" size="middle" @click="confirmEvent">{{
                nickBtnTxt
              }}</a-button>
            </a-input-group>
            <span v-else class="cnt"
              >{{ userInfo.username }}<i @click="editEvent"><edit-outlined /></i
            ></span>
          </div>
          <div class="user_box_item">
            <span class="label iconfont icon-zhanghaozhongxinzhanghaoguanli"
              >账号</span
            >
            <span class="cnt">{{ userInfo.account }}</span>
          </div>
          <div class="user_box_item">
            <span class="label iconfont icon-dengji">等级</span>
            <span class="cnt">{{ userInfo.levelCn }}</span>
          </div>
          <div class="user_box_item">
            <span class="label iconfont icon-zizhi">资质</span>
            <div class="cnt">
              <a-collapse
                v-model:activeKey="activeKey"
                ghost
                :collapsible="collapsibleZizhi"
              >
                <a-collapse-panel key="1" :header="collapseHeader">
                  <a-tag
                    v-for="(item, idx) in zizhiList"
                    :key="idx"
                    :color="item.color"
                  >
                    <span
                      v-if="item.platform === 1"
                      class="iconfont icon-pay-jingdong"
                    ></span>
                    <span
                      v-if="item.platform === 2"
                      class="iconfont icon-douyin"
                    >
                    </span>
                    {{ item.txt }}
                  </a-tag>
                  <template #extra
                    ><i @click="uploadEvent"><edit-outlined /></i
                  ></template>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
          <div class="user_box_item">
            <!-- <span class="label iconfont icon-yinxingqia">美事通</span> -->
            <span class="label iconfont">美事通</span>
            <div class="cnt">
              <a-collapse
                v-model:activeKey="activeKey2"
                ghost
                :collapsible="collapsibleMst"
              >
                <a-collapse-panel key="1" :header="collapseHeader2">
                  <a-tag v-for="(item, idx) in mstList" :key="idx" color="blue">
                    {{ item }}
                  </a-tag>
                  <template #extra
                    ><i @click="bindEvent"><link-outlined /></i
                  ></template>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
        </div>
      </div>
      <a-drawer
        v-if="showErweima"
        title=""
        placement="right"
        :closable="false"
        :visible="showErweima"
        :get-container="false"
        :style="{ position: 'absolute' }"
        width="520"
      >
        <div class="erweima">
          <img src="../../../assets/images/nobind3.png" alt="" />
          <img src="../../../assets/images/mst.png" alt="" />
        </div>
        <div class="erweima-form">
          <a-form
            :model="erweimaForm"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 14 }"
          >
            <a-row type="flex">
              <a-col :span="24">
                <a-form-item label="账号">
                  <a-input v-model:value="erweimaForm.account" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="用户名">
                  <a-input v-model:value="erweimaForm.username" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="手机号">
                  <a-input v-model:value="erweimaForm.mobile" allow-clear />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="erweima-btn zizhi-btn">
          <a-button @click="knowEvent(false)">取消</a-button>
          <a-button type="primary" @click="knowEvent(true)">确认</a-button>
        </div>
      </a-drawer>
      <a-drawer
        v-if="showUpload"
        title=""
        placement="right"
        :closable="false"
        :visible="showUpload"
        :get-container="false"
        :style="{ position: 'absolute' }"
        width="520"
      >
        <div class="zizhi">
          <h2><edit-outlined />投手资质上传</h2>
          <a-form
            :model="zizhiForm"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-row>
              <a-col :span="12">
                <a-form-item label="平台">
                  <a-select v-model:value="zizhiForm.platform" allow-clear>
                    <a-select-option
                      v-for="(item, idx) in platOptions"
                      :key="idx"
                      :value="item.code"
                      >{{ item.label }}</a-select-option
                    ></a-select
                  >
                </a-form-item>
                <a-form-item label="等级">
                  <a-select
                    v-model:value="zizhiForm.cert_level"
                    :options="options"
                    allow-clear
                    ><a-select-option
                      v-for="(item, idx) in certOptions"
                      :key="idx"
                      :value="item.code"
                      >{{ item.label }}</a-select-option
                    ></a-select
                  >
                </a-form-item>
                <a-form-item label="编号">
                  <a-input v-model:value="zizhiForm.cert_number" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="12"
                ><a-form-item label="上传">
                  <a-upload-dragger
                    :fileList="fileArr"
                    name="file"
                    :showUploadList="false"
                    :maxCount="1"
                    :multiple="false"
                    action=""
                    :before-upload="beforeUpload"
                  >
                    <div v-if="fileArr.length > 0">
                      <p class="ant-upload-drag-icon">
                        <verified-outlined />
                      </p>
                      <p class="ant-upload-text">资质证书已上传</p>
                    </div>
                    <div v-else>
                      <p class="ant-upload-drag-icon">
                        <inbox-outlined></inbox-outlined>
                      </p>
                      <p class="ant-upload-text">点击或拖拽至区域上传</p>
                    </div>
                  </a-upload-dragger>
                </a-form-item></a-col
              >
            </a-row>
          </a-form>
        </div>
        <div class="zizhi-btn">
          <a-button @click="submitEvent(false)">取消</a-button>
          <a-button type="primary" @click="submitEvent(true)">确认</a-button>
        </div>
      </a-drawer>
    </a-modal>
  </div>
</template>
<script setup>
import { reactive, ref, toRefs, watch, createVNode } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { uploadZizhi, bindMst, editNickName, editAvatar } from "@/api/api";
import { message, Modal } from "ant-design-vue";

const store = useStore();

import {
  InboxOutlined,
  EditOutlined,
  UploadOutlined,
  LinkOutlined,
  VerifiedOutlined,
} from "@ant-design/icons-vue";
let $props = defineProps({
  showDialog: Boolean,
  userInfo: Object,
  zizhiList: Array,
  mstList: Array,
});
let { showDialog, userInfo, zizhiList, mstList } = toRefs($props);
let $emit = defineEmits(["changeDialogTag", "closeMstDialog"]);
let {
  visibleDia,
  activeKey,
  activeKey2,
  collapseHeader,
  collapseHeader2,
  collapsibleZizhi,
  collapsibleMst,
  dialogEvent,
} = realte_dialog();
function realte_dialog() {
  let stateData = reactive({
    visibleDia: true,
    activeKey: 0,
    activeKey2: 0,
    collapseHeader: "",
    collapseHeader2: "",
    collapsibleZizhi: false,
    collapsibleMst: false,
  });
  let watchTag = watch(
    showDialog,
    (newval, oldval) => {
      stateData.visibleDia = newval;
    },
    { immediate: true }
  );
  let watch_user = watch(
    userInfo,
    (newval, oldval) => {
      switch (newval.level) {
        case 0:
          newval.levelCn = "初级投手";
          break;
        case 1:
          newval.levelCn = "中级投手";
          break;
        case 2:
          newval.levelCn = "高级投手";
          break;
        default:
          newval.levelCn = "暂无评级";
      }
      stateData.collapseHeader =
        zizhiList.value.length > 0 ? zizhiList.value[0].txt : "暂无认证";
      stateData.collapseHeader2 =
        mstList.value.length > 0 ? mstList.value[0] : "暂未绑定";

      stateData.collapsibleZizhi =
        zizhiList.value.length > 0 ? true : "disabled";
      stateData.collapsibleMst = mstList.value.length > 0 ? true : "disabled";
    },
    {
      deep: true,
    }
  );
  let dialogEvent = () => {
    $emit("changeDialogTag", false);
  };
  let collapseZizhiCge = () => {
    if (zizhiList.value.length === 0) return;
  };
  let collapseMstCge = () => {
    if (mstList.value.length === 0) return;
  };
  return {
    ...toRefs(stateData),
    dialogEvent,
    collapseZizhiCge,
    collapseMstCge,
  };
}
// 修改昵称
let {
  nickName,
  nickBtnTxt,
  showIpt,
  userImageUrl,
  fileList,
  nickIptEvent,
  editEvent,
  confirmEvent,
  handleImgChange,
} = relate_nick();
function relate_nick() {
  let stateData = reactive({
    nickName: "",
    nickBtnTxt: "取消",
    showIpt: false,
    userImageUrl: "",
    fileList: []
  });
  // nick输入框值的按钮相关变化
  let nickIptEvent = (e) => {
    stateData.nickBtnTxt = e.target.value ? "确认" : "取消";
  };
  // 修改用户相关信息
  let apiPort_nickname = (id) => {
    editNickName(
      {
        username: stateData.nickName,
      },
      id
    ).then((res) => {
      if (res.data.code === 200) {
        message.success("操作成功");
        stateData.showIpt = false;
        store.commit("pageData/SET_USERNAME", res.data.data.username);
        // 昵称回显
        $emit("closeMstDialog");
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  let editEvent = () => {
    stateData.showIpt = true;
  };
  let confirmEvent = () => {
    if (stateData.nickName) {
      apiPort_nickname(store.getters.accountId);
    } else {
      stateData.showIpt = false;
    }
  };

  let handleImgChange = (info) => {
    if (info.file.status === "error") {
      editAvatar(
        {
          img: info.file.originFileObj
        }
      ).then((res) => {
        if (res.data.code === 200) {
          message.success("头像上传成功");
          store.commit("pageData/SET_USERIMG", res.data.data.thumb_avatar);
        } else {
          message.error(`${res.data.msg}`);
        }
      });
    }
  };
  return {
    ...toRefs(stateData),
    nickIptEvent,
    editEvent,
    confirmEvent,
    handleImgChange,
  };
}
// 认证资质
let {
  showUpload,
  showErweima,
  fileArr,
  zizhiForm,
  erweimaForm,
  platOptions,
  certOptions,
  uploadEvent,
  submitEvent,
  bindEvent,
  knowEvent,
  beforeUpload,
} = relate_upload();
function relate_upload() {
  let stateData = reactive({
    showUpload: false,
    showErweima: false,
    fileArr: [],
    zizhiForm: {
      platform: "",
      cert_level: "",
      cert_number: "",
      file: [],
    },
    erweimaForm: {
      account: "",
      username: "",
      mobile: "",
    },
    platOptions: [
      {
        label: "京东",
        code: 1,
      },
      {
        label: "抖音",
        code: 2,
      },
    ],
    certOptions: [
      {
        label: "初级投手",
        code: 1,
      },
      {
        label: "中级投手",
        code: 2,
      },
      {
        label: "高级投手",
        code: 3,
      },
    ],
  });
  let reset = () => {
    stateData.fileArr = [];
    stateData.zizhiForm = {
      platform: "",
      cert_level: "",
      cert_number: "",
      file: [],
    };
    stateData.erweimaForm = {
      account: "",
      username: "",
      mobile: "",
    };
  };
  let apiPort_upload = (val) => {
    uploadZizhi(val).then((res) => {
      if (res.data.code === 200) {
        message.success("操作成功");
        stateData.showUpload = false;
        reset();
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  let apiPort_mst = (val) => {
    bindMst(val).then((res) => {
      if (res.data.code === 200) {
        message.success("操作成功");
        stateData.showErweima = false;
        // 需要重新调取展示mst账户
        $emit("closeMstDialog");
        reset();
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 打开上传资质弹层
  let uploadEvent = (e) => {
    e.stopPropagation();
    stateData.showUpload = true;
  };
  // 确认 取消
  let submitEvent = (val) => {
    if (val) {
      apiPort_upload({ ...stateData.zizhiForm });
    } else {
      stateData.showUpload = false;
    }
    reset();
  };
  // 打开绑定美事通弹层
  let bindEvent = (e) => {
    e.stopPropagation();
    stateData.showErweima = true;
  };
  // 确认 取消
  let knowEvent = (val) => {
    if (val) {
      apiPort_mst({ ...stateData.erweimaForm });
    } else {
      stateData.showErweima = false;
    }
    reset();
  };
  let beforeUpload = (file) => {
    stateData.fileArr = [file];
    stateData.zizhiForm.file = [file];
    return false;
  };

  return {
    ...toRefs(stateData),
    uploadEvent,
    submitEvent,
    bindEvent,
    knowEvent,
    beforeUpload,
  };
}
</script>
<style lang="scss" scoped>
@import "index";
</style>
