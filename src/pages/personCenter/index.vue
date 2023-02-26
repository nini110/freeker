<template>
  <div class="personBox">
    <a-tabs v-model:activeKey="activeKey" class="tabBox">
      <a-tab-pane v-for="item in tabList" :key="item.key">
        <template #tab>
          <span>
            {{ item.name }}
          </span>
        </template>
      </a-tab-pane>
    </a-tabs>
    <div v-if="activeKey === '1'">
      <div v-if="descEdit" class="userBox">
        <div class="userBox_outer">
          <img class="avatar" :src="store.getters.userImg" alt="avatar" />
          <div class="userBox_rt">
            <div class="userBox_rt_tp">
              <span>{{ initInfo.username }}</span>
            </div>
            <div class="userBox_rt_btm">
              <div class="icon">
                <div v-if="initInfo.if_authentication === 2">
                  <img src="../../assets/icons/IDcard2.png" alt="" />
                </div>
                <div v-else>
                  <img src="../../assets/icons/IDcard1.png" alt="" />
                </div>
              </div>
              <div class="icon">
                <div v-if="zzListArr.length > 0">
                  <img src="../../assets/icons/verify2.png" alt="" />
                </div>
                <div v-else>
                  <img src="../../assets/icons/verify1.png" alt="" />
                </div>
              </div>
              <span class="title">这个不知道是什么这个不知道是什么</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="descEdit" class="descBox">
        <a-descriptions bordered title="个人资料">
          <template #extra>
            <a-button type="primary" @click="descEvent(1)">编辑</a-button>
          </template>
          <a-descriptions-item
            v-for="(item1, idx1) in descList"
            :key="idx1"
            :label="item1.label"
            :span="item1.span || 3"
            >{{ item1.val }}</a-descriptions-item
          >
        </a-descriptions>
      </div>
      <div v-else class="descBox">
        <p class="descBox_title">个人资料修改</p>
        <a-form
          class="flex50 ts"
          ref="refForm1"
          :model="formState1"
          name="basic"
          layout="vertical"
          autocomplete="off"
          :rules="rules1"
        >
          <a-form-item class="flexw100" label="头像">
            <a-upload
              v-model:file-list="user_avatar"
              name="avatar"
              list-type="picture-card"
              class="uploader-user"
              :showUploadList="false"
              :maxCount="1"
              :multiple="false"
              action=""
              @change="avatarChange"
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
            <p class="uploader_msg">支持JPG、JPEG、PNG且不超过5M。</p>
            <a-divider style="border-color: #ddd6d6; margin-bottom: 0" dashed />
          </a-form-item>
          <a-form-item label="账户" name="account" class="ts">
            <a-input v-model:value="formState1.account" disabled />
          </a-form-item>
          <a-form-item label="用户名" name="username">
            <a-input v-model:value="formState1.username" />
          </a-form-item>
          <a-form-item label="账户类型" name="account_type" class="ts">
            <a-select v-model:value="formState1.account_type">
              <a-select-option
                v-for="(item, idx) in typeOpt"
                :key="idx"
                :value="item.label"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="账户角色" name="account_role">
            <a-select v-model:value="formState1.account_role">
              <a-select-option
                v-for="(item, idx) in roleOpt"
                :key="idx"
                :value="item.label"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="手机号" name="mobile" class="ts">
            <a-input v-model:value="formState1.mobile" />
          </a-form-item>
          <a-form-item label="毕业院校" name="graduated">
            <a-input v-model:value="formState1.graduated" />
          </a-form-item>
          <a-form-item label="最高学历" name="education" class="ts">
            <a-radio-group
              v-model:value="formState1.education"
              button-style="solid"
            >
              <a-radio-button
                v-for="(item, idx) in educationOpt"
                :key="idx"
                :value="item.label"
                >{{ item.label }}</a-radio-button
              >
            </a-radio-group>
          </a-form-item>
          <a-form-item class="btnrow">
            <a-button class="red_bd" shape="round" @click="descEvent(1)"
              >取 消</a-button
            >
            <a-button
              type="primary"
              class="red_solid"
              shape="round"
              @click="descEvent(2)"
              >提 交</a-button
            >
          </a-form-item>
        </a-form>
      </div>
      <div v-if="skillEdit" class="descBox">
        <div v-if="!initInfo.work_time" class="nodatadiv ts">
          <img src="../../assets/images/nodataRZ.png" alt="" />
          <div @click="skillEvent(0)">请完善技能信息</div>
        </div>
        <div v-else class="fl100">
          <a-descriptions bordered title="专业技能">
            <template #extra>
              <a-button type="primary" @click="skillEvent(1)">编辑</a-button>
            </template>
            <a-descriptions-item
              v-for="(item1, idx1) in skillList"
              :key="idx1"
              :label="item1.label"
              :span="item1.span || 3"
              >{{ item1.val }}</a-descriptions-item
            >
            <a-descriptions-item
              label="个人介绍"
              ><div v-html="initInfo.self_introduction"></div></a-descriptions-item
            >
          </a-descriptions>
        </div>
      </div>
      <div v-else class="descBox">
        <p class="descBox_title">专业技能修改</p>
        <a-form
          class="flex50 ts"
          :model="formState2"
          ref="refForm2"
          name="basic"
          layout="vertical"
          autocomplete="off"
          :rules="rules2"
        >
          <a-form-item label="工作方式" name="work_type" class="flexw100">
            <a-radio-group
              v-model:value="formState2.work_type"
              button-style="solid"
            >
              <a-radio-button value="兼职">兼职</a-radio-button>
              <a-radio-button value="全职">全职</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="工作年限" name="work_years" class="ts">
            <a-input-number
              v-model:value="formState2.work_years"
              addon-after="年"
            ></a-input-number>
          </a-form-item>
          <a-form-item label="工作时间" name="work_time">
            <a-time-range-picker
              v-model:value="formState2.work_time"
              format="HH:mm"
              value-format="HH:mm"
            />
          </a-form-item>
          <!-- <a-form-item label="个人优势" name="self_introduction">
            <a-input v-model:value="formState2.self_introduction" />
          </a-form-item> -->
          <a-form-item
            label="个人优势"
            name="self_introduction"
            class="flexw100"
          >
            <div style="border: 1px solid #ccc">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              ></Toolbar>
              <Editor
                v-model="formState2.self_introduction"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleCreated"
                @onChange="editorChange"
              />
            </div>
          </a-form-item>
          <a-form-item class="btnrow">
            <a-button class="red_bd" shape="round" @click="skillEvent(1)"
              >取 消</a-button
            >
            <a-button
              class="red_solid"
              shape="round"
              type="primary"
              @click="skillEvent(2)"
              >提 交</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div v-if="activeKey === '2'">
      <div class="tipBox">
        <p>温馨提示</p>
        <p>
          请准备好您的身份证（正反面）照片，上传清晰的证件照，且身份信息不能被遮挡，便于平台快速审核。您提供的照片灵狐科技会严格保护，仅用于入驻时的身份认证。
        </p>
      </div>
      <div class="setpBox">
        <a-steps :current="currentStep1" :status="currentStatus">
          <a-step
            v-for="(item, idx) in setpBox1"
            :key="idx"
            :title="item.title"
          >
            <template #icon>
              <span class="iconfont" :class="item.icon"></span>
            </template>
          </a-step>
        </a-steps>
      </div>
      <div v-if="sfEdit" class="descBox">
        <div class="nodatadiv ts" v-if="initInfo.if_authentication === 0">
          <img src="../../assets/images/nodataRZ.png" alt="" />
          <div @click="sfEvent(0)">请完善实名信息</div>
        </div>
        <div v-else class="fl100">
          <a-descriptions bordered title="实名信息" :column="1">
            <template #extra>
              <a-button
                v-if="initInfo.if_authentication === 3"
                type="primary"
                @click="sfEvent(1)"
                >重新认证</a-button
              >
            </template>
            <a-descriptions-item
              v-for="(item1, idx1) in sfList"
              :key="idx1"
              :label="item1.label"
              >{{ item1.val }}</a-descriptions-item
            >
            <a-descriptions-item label="身份证照">
              <div class="sfBox">
                <div class="sfBox_img">
                  <span>头像面</span>
                  <img :src="sf_fan_url" alt="" />
                </div>
                <div class="sfBox_img">
                  <span>国徽面</span>
                  <img :src="sf_zheng_url" alt="" />
                </div>
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
      <div v-else class="descBox">
        <p class="descBox_title">身份信息修改</p>
        <a-form
          :model="formState3"
          name="basic"
          ref="refForm3"
          class="flex50"
          layout="vertical"
          autocomplete="off"
          :rules="rules3"
        >
          <a-form-item label="真实姓名" name="real_name" class="ts">
            <a-input v-model:value="formState3.real_name" />
          </a-form-item>
          <a-form-item label="身份证号" name="id_card">
            <a-input v-model:value="formState3.id_card" />
          </a-form-item>
          <a-form-item label="身份证照" name="realPic" class="flexw100">
            <a-divider style="border-color: #ddd6d6" dashed />
            <div class="idBox">
              <div class="idBox_lf">
                <a-upload
                  v-model:file-list="formState3.id_card_back_img"
                  name="avatar"
                  list-type="picture-card"
                  class="uploader_id"
                  :show-upload-list="false"
                  :maxCount="1"
                  :multiple="false"
                  action=""
                  :before-upload="idFanEvent"
                >
                  <img v-if="showedFanUrl" :src="showedFanUrl" alt="avatar" />
                  <div v-else>
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
                <span class="uploader_tip">头像面</span>
              </div>
              <div class="idBox_rt">
                <img
                  class="uploader_id"
                  src="../../assets/images/fan.png"
                  alt=""
                />
                <span class="uploader_tip">示例图</span>
              </div>
              <p class="uploader_msg">
                请上传本人身份证人像面照片，头像、证件信息不能被遮挡
              </p>
            </div>
            <a-divider style="border-color: #ddd6d6" dashed />
            <div class="idBox">
              <div class="idBox_lf">
                <a-upload
                  v-model:file-list="formState3.id_card_positive_img"
                  name="file"
                  list-type="picture-card"
                  class="uploader_id"
                  :showUploadList="false"
                  :maxCount="1"
                  :multiple="false"
                  action=""
                  :before-upload="idZhengEvent"
                >
                  <img
                    v-if="showedZhengUrl"
                    :src="showedZhengUrl"
                    alt="avatar"
                  />
                  <div v-else>
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
                <span class="uploader_tip">国徽面</span>
              </div>
              <div class="idBox_rt">
                <img
                  class="uploader_id"
                  src="../../assets/images/zheng.png"
                  alt=""
                />
                <span class="uploader_tip">示例图</span>
              </div>
              <p class="uploader_msg">
                请上传本人身份证国徽面照片，证件有效期不能被遮挡
              </p>
            </div>
          </a-form-item>
          <a-form-item class="btnrow">
            <a-button class="red_bd" shape="round" @click="sfEvent(1)"
              >取 消</a-button
            >
            <a-button
              class="red_solid"
              shape="round"
              type="primary"
              @click="sfEvent(2)"
              >提 交</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div v-if="activeKey === '3'">
      <div class="tipBox">
        <p>温馨提示</p>
        <p>
          请准备好您的投手资质证书照片，上传清晰的资质证书，且信息不能被遮挡，便于平台快速审核，方便您快速申领需求，赚取您的第一桶金，您提供的资质照片灵狐科技会严格保护，仅用于申领需求门槛。
        </p>
      </div>
      <div class="tagBox">
        <div>
          <a-tag
            v-for="(item, idx) in zzListArr"
            :key="idx"
            :color="item.color"
            closable
            @close.prevent="zizhiDelEvent(item)"
            @click="zzClickEvent(item)"
          >
            <span class="txt">{{ item.txt }}</span>
          </a-tag>
        </div>
        <div><a-button type="primary" @click="zzEvent(1)">上传</a-button></div>
      </div>
      <div v-if="zzEdit" class="descBox">
        <div v-if="zzListArr.length === 0" class="nodatadiv">
          <img src="../../assets/images/nodataRZ.png" alt="" />
          <div>暂无资质信息</div>
        </div>
        <div v-else class="fl100">
          <a-descriptions bordered title="投手资质" :column="1">
            <!-- <template #extra>
              <a-button
                v-if="curentZz.status == 2"
                type="primary"
                @click="zzEvent(2)"
                >编辑</a-button
              >
            </template> -->
            <a-descriptions-item
              v-for="(item1, idx1) in zzList"
              :key="idx1"
              :label="item1.label"
            >
              <span class="stus" :class="item1.class">{{
                item1.val
              }}</span></a-descriptions-item
            >
            <a-descriptions-item label="资质证书">
              <div class="sfBox">
                <div class="sfBox_img">
                  <img :src="curentZzSrc" alt="" />
                </div>
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
      <div v-else class="descBox">
        <p class="descBox_title">投手资质上传</p>
        <a-form
          :model="formState4"
          name="basic"
          ref="refForm4"
          class="flex50 ts"
          layout="vertical"
          autocomplete="off"
          :rules="rules4"
        >
          <a-form-item class="flexw100" label="适用平台" name="platform">
            <a-radio-group
              v-model:value="formState4.platform"
              button-style="solid"
            >
              <a-radio-button
                v-for="(item, idx) in platOpt"
                :key="idx"
                :value="item.value"
                >{{ item.label }}</a-radio-button
              >
            </a-radio-group>
          </a-form-item>
          <a-form-item label="资质等级" name="cert_level" class="ts">
            <a-select v-model:value="formState4.cert_level">
              <a-select-option
                v-for="(item, idx) in levelOpt"
                :key="idx"
                :value="item.value"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="有效期" name="term_of_validity">
            <a-range-picker
              v-model:value="formState4.term_of_validity"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </a-form-item>
          <a-form-item label="资质证书" name="cert_image" class="ts">
            <a-upload
              v-model:file-list="formState4.cert_image"
              name="avatar"
              list-type="picture-card"
              class="uploader-user"
              :showUploadList="false"
              :maxCount="1"
              :multiple="false"
              action=""
              :before-upload="zzUpEvent"
            >
              <img v-if="showedZZUrl" :src="showedZZUrl" alt="avatar" />
              <div v-else>
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <p class="uploader_msg">支持JPG、JPEG、PNG且不超过5M。</p>
          </a-form-item>
          <a-form-item class="btnrow">
            <a-button class="red_bd" shape="round" @click="zzEvent(3)"
              >取 消</a-button
            >
            <a-button
              type="primary"
              class="red_solid"
              shape="round"
              @click="zzEvent(4)"
              >保存</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  ref,
  refs,
  reactive,
  toRefs,
  onBeforeMount,
  onBeforeUnmount,
  watch,
  toRef,
  shallowRef,
} from "vue";
import { useStore } from "vuex";
import {
  editBaseInfo,
  userBaseInfo,
  editAvatar,
  realUserVarify,
  uploadZizhi,
  getZizhi,
  delZizhi,
} from "@/api/api";
import { message } from "ant-design-vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
const store = useStore();
const refForm1 = ref();
const refForm2 = ref();
const refForm3 = ref();
const refForm4 = ref();
const editorRef = shallowRef();
// 编辑器相关
let { toolbarConfig, editorConfig, mode, handleCreated, editorChange } =
  relate_editor();
function relate_editor() {
  let stateData = reactive({
    toolbarConfig: {
      /* 工具栏配置 */
      toolbarKeys: [
        "bold",
        "color",
        "bgColor",
        "headerSelect",
        "|",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "bulletedList",
        "numberedList",
        "|",
        // 菜单组，包含多个菜单
        {
          key: "group-link",
          title: "链接",
          menuKeys: ["insertLink", "editLink", "unLink", "viewLink"],
        },
        // {
        //   key: "group-image", // 必填，要以 group 开头
        //   title: "图片", // 必填
        //   menuKeys: [
        //     "uploadImage",
        //     "deleteImage",
        //     "editImage",
        //     "viewImageLink",
        //   ],
        // },
        "divider",
        "|",
        "undo",
        "|",
        "clearStyle",
      ],
    },
    editorConfig: {
      placeholder:
        "简要的介绍您公司的“背景”、“商品”或“推广诉求”，以及“投手意见”等.",
      readOnly: false,
    },
    mode: "default",
  });
  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
  });
  let handleCreated = (editor) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
  };
  let editorChange = () => {};
  return { ...toRefs(stateData), handleCreated, editorChange };
}
let {
  tagClosable,
  initInfo,
  activeKey,
  descEdit,
  skillEdit,
  sfEdit,
  zzEdit,
  typeOpt,
  roleOpt,
  educationOpt,
  platOpt,
  levelOpt,
  setpBox1,
  currentStatus,
  currentStep1,
  user_avatar,
  sf_zheng_url,
  sf_fan_url,
  showedZhengUrl,
  showedFanUrl,
  showedZZUrl,
  curentZz,
  curentZzSrc,
  formState1,
  formState2,
  formState3,
  formState4,
  tabList,
  descList,
  skillList,
  zzList,
  zzListArr,
  sfList,
  rules1,
  rules2,
  rules3,
  rules4,
  descEvent,
  skillEvent,
  sfEvent,
  zzEvent,
  zzClickEvent,
  avatarChange,
  idZhengEvent,
  idFanEvent,
  zzUpEvent,
  zizhiDelEvent,
} = relate_init();
function relate_init() {
  const ckRealpic = (rule, value) => {
    if (
      stateData.formState3.id_card_positive_img.length !== 0 &&
      stateData.formState3.id_card_back_img.length !== 0
    ) {
      return Promise.resolve();
    } else {
      return Promise.reject("请完善身份证照");
    }
  };
  const ckZZImg = (rule, value) => {
    if (value.length !== 0) {
      return Promise.resolve();
    } else {
      return Promise.reject("请上传资质证书");
    }
  };
  let stateData = reactive({
    tagClosable: true,
    initInfo: {},
    activeKey: "1",
    descEdit: true,
    skillEdit: true,
    sfEdit: true,
    zzEdit: true,
    typeOpt: [
      {
        label: "外部",
        value: "1",
      },
      {
        label: "内部",
        value: "2",
      },
    ],
    roleOpt: [
      {
        label: "角色1",
        value: "1",
      },
      {
        label: "角色2",
        value: "2",
      },
    ],
    educationOpt: [
      {
        label: "大专",
        value: "1",
      },
      {
        label: "本科",
        value: "2",
      },
      {
        label: "硕士",
        value: "3",
      },
      {
        label: "博士",
        value: "4",
      },
    ],
    platOpt: [
      {
        label: "京东",
        value: 1,
      },
      {
        label: "抖音",
        value: 2,
      },
    ],
    levelOpt: [
      {
        label: "初级",
        value: 1,
      },
      {
        label: "中级",
        value: 2,
      },
      {
        label: "高级",
        value: 3,
      },
    ],
    currentStatus: "",
    currentStep1: 0,
    setpBox1: [
      {
        title: "实名认证",
        icon: "icon-shimingrenzheng1",
      },
      {
        title: "等待审核",
        icon: "icon-shenhe",
      },
      {
        title: "",
        icon: "",
      },
    ],
    user_avatar: null,
    sf_zheng_url: "",
    sf_fan_url: "",
    showedZhengUrl: "",
    showedFanUrl: "",
    showedZZUrl: "",
    curentZz: null, //
    curentZzSrc: "", //
    formState1: {
      account: "",
      username: "",
      account_type: "内部",
      account_role: "",
      mobile: "",
      graduated: "",
      education: "本科",
    },
    formState2: {
      work_years: "",
      work_type: "兼职",
      work_time: "",
      self_introduction: "",
    },
    formState3: {
      real_name: "",
      id_card: "",
      id_card_positive_img: [],
      id_card_back_img: [],
    },
    formState4: {
      platform: 1,
      cert_level: 1,
      term_of_validity: [],
      cert_image: [],
    },
    tabList: [
      {
        key: "1",
        name: "基本信息",
      },
      {
        key: "2",
        name: "实名认证",
      },
      {
        key: "3",
        name: "资质信息",
      },
    ],
    descList: [
      {
        label: "账户",
        code: "account",
        val: "",
        span: 2,
      },
      {
        label: "昵称",
        code: "username",
        val: "",
      },
      {
        label: "账户类型",
        code: "account_type",
        val: "",
        span: 2,
      },
      {
        label: "账户角色",
        code: "account_role",
        val: "",
      },
      {
        label: "手机号",
        code: "mobile",
        val: "",
      },
      {
        label: "毕业院校",
        code: "graduated",
        val: "",
        span: 2,
      },
      {
        label: "最高学历",
        code: "education",
        val: "",
      },
    ],
    skillList: [
      {
        label: "工作年限",
        code: "work_years",
        val: "",
      },
      {
        label: "工作方式",
        code: "work_type",
        val: "",
        span: 2,
      },
      {
        label: "工作时间",
        code: "work_time",
        val: "",
      },
      // {
      //   label: "个人介绍",
      //   code: "self_introduction",
      //   val: "",
      // },
    ],
    sfList: [
      {
        label: "真实姓名",
        code: "real_name",
        val: "",
      },
      {
        label: "身份证号",
        code: "id_card",
        val: "",
      },
    ],
    zzList: [
      {
        label: "状态",
        code: "statusCN",
        class: "",
        val: "",
      },
      {
        label: "适用平台",
        code: "platform_cn",
        val: "",
      },
      {
        label: "资质等级",
        code: "cert_level_cn",
        val: "",
      },
      {
        label: "有效期",
        code: "term_of_validity",
        val: "",
      },
    ],
    zzListArr: [],
    rules1: {
      account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      username: [
        { required: true, message: "请输入昵称", trigger: ["blur", "change"] },
      ],
      account_type: [
        {
          required: true,
          message: "请选择账户类型",
          trigger: ["blur", "change"],
        },
      ],
      account_role: [
        {
          required: true,
          message: "请选择账户角色",
          trigger: ["blur", "change"],
        },
      ],
      mobile: [
        {
          required: true,
          message: "请输入手机号",
          trigger: ["blur", "change"],
        },
      ],
    },
    rules2: {
      work_years: [
        {
          required: true,
          message: "请输入工作年限",
          trigger: ["blur", "change"],
        },
      ],
      work_type: [
        {
          required: true,
          message: "请选择工作方式",
          trigger: ["blur", "change"],
        },
      ],
      work_time: [
        {
          required: true,
          message: "请选择工作时间",
          trigger: ["blur", "change"],
        },
      ],
      self_introduction: [
        {
          required: true,
          message: "请输入个人优势",
          trigger: ["blur", "change"],
        },
      ],
    },
    rules3: {
      real_name: [
        { required: true, message: "请输入真实姓名", trigger: "blur" },
      ],
      id_card: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
      realPic: [{ required: true, validator: ckRealpic, trigger: "blur" }],
    },
    rules4: {
      platform: [
        { required: true, message: "请选择适用平台", trigger: "change" },
      ],
      cert_level: [
        { required: true, message: "请选择资质等级", trigger: "change" },
      ],
      term_of_validity: [
        { required: true, message: "请选择有效期", trigger: "change" },
      ],
      cert_image: [{ required: true, validator: ckZZImg, trigger: "change" }],
    },
  });
  onBeforeMount(() => {
    apiPort_DetailInfo();
    apiPort_ziZhi();
  });
  // 实名认证接口
  let apiPort_upsf = (val) => {
    realUserVarify(val).then((res) => {
      if (res.data.code === 200) {
        refForm3.value.resetFields();
        stateData.showedFanUrl = "";
        stateData.showedZhengUrl = "";
        message.success("保存成功");
        apiPort_DetailInfo();
        stateData.sfEdit = true;
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 上传资质接口
  let apiPort_upzz = (val) => {
    uploadZizhi(val).then((res) => {
      if (res.data.code === 200) {
        refForm4.value.resetFields();
        stateData.showedZZUrl = "";
        message.success("资质上传成功");
        stateData.zzEdit = true;
        apiPort_ziZhi();
      } else if (res.data.code === 4005) {
        message.error("最多允许上传6项资质证明");
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 获取资质列表
  let apiPort_ziZhi = () => {
    getZizhi({
      no: "",
      status: "0,1,2",
    }).then((res) => {
      // 资质
      if (res.data.code === 200) {
        stateData.zzListArr = [];
        let result = res.data.data;
        if (result.length > 0) {
          result.forEach((val, idx) => {
            switch (val.platform) {
              case 1:
                val.platform_cn = "京东";
                val.color = "#f24239ed";
                break;
              case 2:
                val.platform_cn = "抖音";
                val.color = "#544b4b";
                break;
            }
            switch (val.cert_level) {
              case 1:
                val.cert_level_cn = "初级投手";
                break;
              case 2:
                val.cert_level_cn = "中级投手";
                break;
              case 3:
                val.cert_level_cn = "高级投手";
                break;
            }
            switch (val.status) {
              case "0":
                val.statusCN = "审核中";
                val.class = "grey iconfont icon-dengdai";
                break;
              case "1":
                val.statusCN = "已通过";
                val.class = "green iconfont icon-yanshoujijiesuanguanli";
                break;
              case "2":
                val.statusCN = "未通过";
                val.class = "red iconfont icon-shenhebutongguo";
                break;
            }
            stateData.zzListArr.push({
              ...val,
              term_of_validity: JSON.parse(val.term_of_validity),
              color: val.color,
              txt: val.platform_cn + val.cert_level_cn,
            });
            // stateData.tagClosable = stateData.zzListArr.length > 1;
          });
          zzClickEvent(stateData.zzListArr[0]);
        }
      } else {
        message.error("资质信息查询失败");
      }
    });
  };
  // 获取详情
  let apiPort_DetailInfo = () => {
    userBaseInfo({
      no: "",
    }).then((res) => {
      if (res.data.code === 200) {
        stateData.initInfo = res.data.data;
        switch (res.data.data.if_authentication) {
          case 0:
          case 1:
          case 2:
            stateData.setpBox1[2].title = "认证成功";
            stateData.setpBox1[2].icon = "icon-shimingrenzheng";
            stateData.currentStatus = "process";
            break;
          case 3:
            stateData.setpBox1[2].title = "认证失败";
            stateData.setpBox1[2].icon = "icon-shenhebutongguo";
            stateData.currentStatus = "error";
            break;
        }
        stateData.descList.forEach((val, idx) => {
          for (let i in res.data.data) {
            if (i === val.code) {
              val.val = res.data.data[i];
              break;
            }
          }
        });
        stateData.skillList.forEach((item, idx) => {
          for (let i in res.data.data) {
            if (i === item.code) {
              if (item.code === "work_years") {
                item.val = `${res.data.data[i]}年`;
              } else if (
                item.code === "work_time" &&
                res.data.data["work_time"]
              ) {
                let tg = JSON.parse(res.data.data[i]);
                item.val = `${tg[0]} 至 ${tg[1]}`;
              } else {
                item.val = res.data.data[i];
              }
              break;
            }
          }
        });
        stateData.sfList.forEach((item, idx) => {
          for (let i in res.data.data) {
            if (i === item.code) {
              item.val = res.data.data[i];
              break;
            }
          }
        });
        stateData.sf_zheng_url = res.data.data.id_card_positive_img;
        // stateData.showedZhengUrl = res.data.data.id_card_positive_img;
        stateData.sf_fan_url = res.data.data.id_card_back_img;
        // stateData.showedFanUrl = res.data.data.id_card_back_img;
        stateData.currentStep1 = res.data.data.if_authentication;
      }
    });
  };
  let descEvent = (val) => {
    if (val === 1) {
      stateData.descEdit = !stateData.descEdit;
      stateData.formState1.account = stateData.initInfo.account;
      stateData.formState1.username = stateData.initInfo.username;
      stateData.formState1.account_type = stateData.initInfo.account_type;
      stateData.formState1.account_role = stateData.initInfo.account_role;
      stateData.formState1.mobile = stateData.initInfo.mobile;
      stateData.formState1.graduated = stateData.initInfo.graduated;
      stateData.formState1.education = stateData.initInfo.education || "本科";
    } else {
      if (val === 2) {
        refForm1.value.validate().then((res) => {
          editBaseInfo(
            {
              ...stateData.formState1,
            },
            store.getters.accountId
          ).then((res) => {
            if (res.data.code === 200) {
              message.success("个人资料修改成功");
              apiPort_DetailInfo();
              stateData.descEdit = true;
            }
          });
        });
      }
    }
  };
  let skillEvent = (val) => {
    if (val === 0) {
      stateData.skillEdit = false;
    } else if (val === 1) {
      stateData.skillEdit = !stateData.skillEdit;
      stateData.formState2.work_years = stateData.initInfo.work_years;
      stateData.formState2.work_type = stateData.initInfo.work_type;
      stateData.formState2.work_time = JSON.parse(stateData.initInfo.work_time);
      stateData.formState2.self_introduction =
        stateData.initInfo.self_introduction;
    } else {
      if (val === 2) {
        refForm2.value.validate().then((res) => {
          editBaseInfo(
            {
              ...stateData.formState2,
              work_time: JSON.stringify(stateData.formState2.work_time),
            },
            store.getters.accountId
          ).then((res) => {
            if (res.data.code === 200) {
              apiPort_DetailInfo();
              stateData.skillEdit = true;
            } else {
              message.error(`${res.data.msg}`);
            }
          });
        });
      }
    }
  };
  let sfEvent = (val) => {
    if (val === 0) {
      // 新增
      stateData.sfEdit = false;
    } else if (val === 1) {
      // 编辑
      stateData.sfEdit = !stateData.sfEdit;
      // stateData.formState3.real_name = stateData.initInfo.real_name;
      // stateData.formState3.id_card = stateData.initInfo.id_card;
    } else {
      refForm3.value.validate().then(() => {
        apiPort_upsf({ ...stateData.formState3 });
      });
    }
  };
  let zzEvent = (val) => {
    if (val === 1) {
      // 上传
      if (stateData.zzListArr.length >= 5) {
        message.error("上限五个资质");
        return;
      }
      stateData.zzEdit = false;
    } else if (val === 2) {
      // stateData.formState4.platform = stateData.curentZz.platform;
      // stateData.formState4.cert_level = stateData.curentZz.cert_level;
      // stateData.formState4.term_of_validity = stateData.curentZz.term_of_validity;
      // stateData.showedZZUrl = stateData.curentZz.cert_image;
      stateData.zzEdit = false;
      // 编辑
    } else if (val === 3) {
      // 取消
      stateData.zzEdit = true;
    } else {
      refForm4.value.validate().then(() => {
        apiPort_upzz({
          ...stateData.formState4,
          term_of_validity: JSON.stringify(
            stateData.formState4.term_of_validity
          ),
        });
      });
    }
  };
  // 资质列表点击事件
  let zzClickEvent = (target) => {
    stateData.zzListArr.forEach((val, idx) => {
      val.color = target.id === val.id ? "#108ee9" : "blue";
    });
    stateData.zzList.forEach((item, idx) => {
      for (let i in target) {
        if (i === item.code) {
          if (i === "term_of_validity") {
            item.val = `${target[i][0]} 至 ${target[i][1]}`;
          } else if (i === "statusCN") {
            item.val = target[i];
            item.class = target.class;
          } else {
            item.val = target[i];
          }
          break;
        }
      }
    });
    stateData.curentZz = target;
    stateData.curentZzSrc = target.cert_image;
  };
  // 资质删除事件
  let zizhiDelEvent = (item) => {
    console.log(stateData.zzListArr);
    delZizhi(
      {
        no: "",
      },
      item.id
    ).then((res) => {
      if (res.data.code === 200) {
        message.success("资质删除成功");
        apiPort_ziZhi();
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  // 头像事件
  let avatarChange = (info) => {
    if (info.file.status === "error") {
      editAvatar({
        img: info.file.originFileObj,
      }).then((res) => {
        if (res.data.code === 200) {
          message.success("头像修改成功");
          store.commit("pageData/SET_USERIMG", res.data.data.thumb_avatar);
        } else {
          message.error(`${res.data.msg}`);
        }
      });
    }
    return false;
  };
  // 身份证 - 国徽面--图片添加事件
  let idZhengEvent = (file) => {
    stateData.formState3.id_card_positive_img = [file];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      stateData.showedZhengUrl = e.target.result;
    };
    return false;
  };
  // 身份证 - 头像面--图片添加事件
  let idFanEvent = (file) => {
    stateData.formState3.id_card_back_img = [file];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      stateData.showedFanUrl = e.target.result;
    };
    return false;
  };
  // 资质图片添加事件
  let zzUpEvent = (file) => {
    stateData.formState4.cert_image = [file];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      stateData.showedZZUrl = e.target.result;
    };
    return false;
  };
  return {
    ...toRefs(stateData),
    descEvent,
    skillEvent,
    sfEvent,
    zzEvent,
    zzClickEvent,
    avatarChange,
    idZhengEvent,
    idFanEvent,
    zzUpEvent,
    zizhiDelEvent,
  };
}
</script>
<style scoped lang="scss">
@import "index.scss";
</style>