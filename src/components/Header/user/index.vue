<template>
  <div ref="aff2">
    <a-modal
      dialogClass="user_dialog"
      v-model:visible="visibleDia"
      title="用户信息"
      @cancel="dialogEvent"
      :keyboard="false"
      :maskClosable="false"
      centered
      :width="600"
      :getContainer="$refs.aff2"
      forceRender
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
            <span class="label"
              ><heart-two-tone two-tone-color="#eb2f96" />昵称</span
            >
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
            <span class="label"><idcard-two-tone />账号</span>
            <span class="cnt">{{ userInfo.account }}</span>
          </div>
          <div class="user_box_item">
            <span class="label"
              ><star-two-tone two-tone-color="#f7b234" />等级</span
            >
            <span class="cnt">{{ userInfo.levelCn }}</span>
          </div>
          <a-collapse v-model:activeKey="activeKey" ghost accordion>
            <a-collapse-panel key="1" :collapsible="collapsibleZizhi">
              <template #header>
                <div>
                  <span class="label"
                    ><safety-certificate-two-tone
                      two-tone-color="#52c41a"
                    />资质</span
                  >
                  <span class="cnt">{{ collapseHeader }}</span>
                </div>
              </template>
              <a-tag
                v-for="(item, idx) in zizhiList"
                :key="idx"
                :color="item.color"
                closable
                @close.prevent="zizhiDelEvent(item)"
              >
                <span
                  v-if="item.platform === 1"
                  class="iconfont icon-pay-jingdong"
                ></span>
                <span v-if="item.platform === 2" class="iconfont icon-douyin">
                </span>
                <span class="txt">{{ item.txt }}</span>
              </a-tag>
              <template #extra
                ><i v-if="zizhiList.length < 6" @click="uploadEvent"><upload-outlined /></i
              ></template>
            </a-collapse-panel>
            <a-collapse-panel key="2" :collapsible="collapsibleMst">
              <template #header>
                <div>
                  <span class="label mst">美事通</span>
                  <span class="cnt">{{ collapseHeader2 }}</span>
                </div>
              </template>
              <a-tag
                v-for="(item, idx) in mstList"
                :key="idx"
                color="orange"
                closable
                @close.prevent="mstDelEvent(item)"
              >
                <span class="mst txt">{{ item.account }}</span>
              </a-tag>
              <template #extra
                ><i v-if="mstList.length < 6" @click="bindEvent"><usergroup-add-outlined /></i
              ></template>
            </a-collapse-panel>
          </a-collapse>
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
            ref="refZizhi"
            :model="zizhiForm"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            :rules="rulesZizhi"
          >
            <a-row>
              <a-col :span="12">
                <a-form-item label="平台" name="platform">
                  <a-select v-model:value="zizhiForm.platform" allow-clear>
                    <a-select-option
                      v-for="(item, idx) in platOptions"
                      :key="idx"
                      :value="item.code"
                      >{{ item.label }}</a-select-option
                    ></a-select
                  >
                </a-form-item>
                <a-form-item label="等级" name="cert_level">
                  <a-select v-model:value="zizhiForm.cert_level" allow-clear
                    ><a-select-option
                      v-for="(item, idx) in certOptions"
                      :key="idx"
                      :value="item.code"
                      >{{ item.label }}</a-select-option
                    ></a-select
                  >
                </a-form-item>
                <a-form-item label="编号" name="cert_number">
                  <a-input v-model:value="zizhiForm.cert_number" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="12"
                ><a-form-item label="上传" name="fileArr">
                  <a-upload-dragger
                    :fileList="zizhiForm.fileArr"
                    name="file"
                    :showUploadList="false"
                    :maxCount="1"
                    :multiple="false"
                    action=""
                    :before-upload="beforeUpload"
                  >
                    <div v-if="zizhiForm.fileArr.length > 0">
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
import {
  HeartTwoTone,
  IdcardTwoTone,
  SafetyCertificateTwoTone,
  InboxOutlined,
  StarTwoTone,
  ExclamationCircleOutlined,
  EditOutlined,
  LinkOutlined,
  VerifiedOutlined,
  UploadOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import {
  uploadZizhi,
  bindMst,
  editNickName,
  editAvatar,
  delZizhi,
  delMst,
} from "@/api/api";
import { message, Modal } from "ant-design-vue";
import { checkPlat, checkLevel, checkNumber, checkFile } from "@/validator";

const refZizhi = ref();
const store = useStore();
let $props = defineProps({
  showDialog: Boolean,
  userInfo: Object,
  zizhiList: Array,
  mstList: Array,
});
let { showDialog, userInfo, zizhiList, mstList } = toRefs($props);
let $emit = defineEmits([
  "changeDialogTag",
  "reGetUser",
  "reGetZiZHi",
  "reGetMst",
]);
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
    collapsibleZizhi: "disabled",
    collapsibleMst: "disabled",
  });
  let watchTag = watch(
    showDialog,
    (newval, oldval) => {
      stateData.collapseHeader =
        zizhiList.value.length > 0 ? zizhiList.value[0].txt : "暂无认证";
      stateData.collapseHeader2 =
        mstList.value.length > 0 ? mstList.value[0].account : "暂未绑定";

      stateData.collapsibleZizhi = zizhiList.value.length > 0 ? "" : "disabled";
      stateData.collapsibleMst = mstList.value.length > 0 ? "" : "disabled";
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
    },
    {
      deep: true,
    }
  );
  let dialogEvent = () => {
    $emit("changeDialogTag", false);
  };
  return {
    ...toRefs(stateData),
    dialogEvent,
  };
}
// 修改昵称
let {
  nickName,
  nickBtnTxt,
  showIpt,
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
    fileList: [],
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
        $emit("reGetUser");
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
      editAvatar({
        img: info.file.originFileObj,
      }).then((res) => {
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
  zizhiForm,
  erweimaForm,
  platOptions,
  certOptions,
  rulesZizhi,
  uploadEvent,
  submitEvent,
  bindEvent,
  zizhiDelEvent,
  knowEvent,
  mstDelEvent,
  beforeUpload,
} = relate_upload();
function relate_upload() {
  let stateData = reactive({
    showUpload: false,
    showErweima: false,
    zizhiForm: {
      platform: "",
      cert_level: "",
      cert_number: "",
      fileArr: [],
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
    rulesZizhi: {
      platform: [{ required: true, validator: checkPlat, trigger: "change" }],
      cert_level: [
        { required: true, validator: checkLevel, trigger: "change" },
      ],
      cert_number: [
        { required: true, validator: checkNumber, trigger: "change" },
      ],
      cert_number: [
        { required: true, validator: checkNumber, trigger: "change" },
      ],
      fileArr: [{ required: true, validator: checkFile, trigger: "change" }],
    },
  });
  let reset = () => {
    stateData.zizhiForm = {
      platform: "",
      cert_level: "",
      cert_number: "",
      fileArr: [],
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
        message.success("资质上传成功");
        stateData.showUpload = false;
        reset();
      } else if (res.data.code === 4005) {
        message.error("最多允许上传6项资质证明");
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  let apiPort_mst = (val) => {
    bindMst(val).then((res) => {
      if (res.data.code === 200) {
        message.success("美事通账户绑定成功");
        stateData.showErweima = false;
        // 需要重新调取展示mst账户
        $emit("reGetMst");
        reset();
      } else if (res.data.code === 4005) {
        message.error("最多允许绑定6个美事通账户");
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 打开上传资质弹层----------------------------------
  let uploadEvent = (e) => {
    e.stopPropagation();
    stateData.showUpload = true;
  };
  // 资质确认 取消
  let submitEvent = (val) => {
    if (val) {
      refZizhi.value.validate().then((res) => {
        apiPort_upload({ ...stateData.zizhiForm });
      });
    } else {
      stateData.showUpload = false;
      reset();
    }
  };
  // 资质删除
  let zizhiDelEvent = (item) => {
    delZizhi(
      {
        no: "",
      },
      item.id
    ).then((res) => {
      if (res.data.code === 200) {
        message.success("资质删除成功");
        $emit("reGetZiZhi");
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 打开绑定美事通弹层------------------------------
  let bindEvent = (e) => {
    e.stopPropagation();
    stateData.showErweima = true;
  };
  // 美事通确认 取消
  let knowEvent = (val) => {
    if (val) {
      apiPort_mst({ ...stateData.erweimaForm });
    } else {
      stateData.showErweima = false;
    }
    reset();
  };
  // 美事通删除
  let mstDelEvent = (item) => {
    delMst(
      {
        no: "",
      },
      item.id
    ).then((res) => {
      if (res.data.code === 200) {
        message.success("美事通账户删除成功");
        $emit("reGetMst");
      } else if (res.data.code === 10016) {
        message.error("删除失败：该美事通账户已绑定订单");
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  let beforeUpload = (file) => {
    stateData.zizhiForm.fileArr = [file];
    console.log({
      ...stateData.zizhiForm
    })
    refZizhi.value.clearValidate("fileArr");
    return false;
  };

  return {
    ...toRefs(stateData),
    uploadEvent,
    submitEvent,
    bindEvent,
    zizhiDelEvent,
    knowEvent,
    mstDelEvent,
    beforeUpload,
  };
}
</script>
<style lang="scss" scoped>
@import "index";
</style>
