<template>
  <div class="detailBox" ref="deta">
    <div class="detailBox_topbtn" :class="iconClass">
      <a-page-header title="返回" @back="backEvent"> </a-page-header>
    </div>
    <div class="detailBox_div">
      <h2>项目描述</h2>
      <p class="detailBox_desc">
        {{ resData.describe }}
      </p>
    </div>
    <div class="detailBox_div">
      <h2>项目信息</h2>
      <div class="detailBox_info">
        <h3>{{ resData.project_name }}</h3>
        <div class="detailBox_info_box">
          <p
            v-for="(item, idx) in detailData.detailList"
            :key="idx"
            class="w50"
          >
            <span>{{ item.label }}</span
            ><span>{{ item.value }}</span>
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="
        stusCode === 4 ||
        stusCode === 5 ||
        stusCode === 6 ||
        stusCode === 7 ||
        stusCode === 8 ||
        stusCode === 9
      "
      class="detailBox_div"
    >
      <h2>投放信息</h2>
      <div class="detailBox_info">
        <div class="detailBox_info_box">
          <!-- 待通过 + 已完成 -->
          <p v-if="stusCode === 7 || stusCode === 9">已过期</p>
          <p
            v-else
            v-for="(item, idx) in detailData.toufanglist"
            :key="idx"
            class="w33"
          >
            <span>{{ item.label }}</span
            ><span v-if="idx === 2"
              ><a :href="item.value" target="blank">点击查看</a></span
            ><span v-else>{{ item.value }}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 待确认 待通过 未通过 已完成 -->
    <div
      v-if="
        stusCode === 6 || stusCode === 7 || stusCode === 8|| stusCode === 9
      "
      class="detailBox_div"
    >
      <!-- 待确认 未通过 -->
      <h2>
        数据信息<span
          v-if="(stusCode === 6 || stusCode === 8) && showEdit"
          class="editspan"
          @click="editDataEvent"
          >（修改数据）</span
        >
      </h2>
      <div class="detailBox_info">
        <div class="detailBox_info_box">
          <p v-if="stusCode === 6 && noDatainfo">暂无数据</p>
          <p
            v-else
            v-for="(item, idx) in detailData.shujuList"
            :key="idx"
            class="w33"
          >
            <span>{{ item.label }}</span
            ><span>{{ item.value }}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 待通过： 可以看到自己的评价 -->
    <!-- 待通过 已完成 -->
    <div v-if="stusCode === 7 || stusCode === 9" class="detailBox_div">
      <h2>评价</h2>
      <div class="detailBox_desc">
        <span class="label">项目评价</span>
        <a-rate :value="resData.user_evaluate_score" disabled />
        <div class="rateInfo">
          {{ resData.user_evaluate_content }}
        </div>
        <div v-if="stusCode === 9">
          <span class="label">投手评价</span>
          <a-rate :value="resData.merchant_evaluate_score" disabled />
          <div class="rateInfo">
            {{ resData.merchant_evaluate_content }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="stusCode === 8" class="detailBox_div">
      <h2>未通过原因</h2>
      <div class="detailBox_desc">{{ resData.project_cancel_reason }}</div>
    </div>
    <div v-if="stusCode === 3" class="detailBox_div">
      <h2>驳回原因</h2>
      <div class="detailBox_desc">
        {{ resData.project_cancel_reason }}
      </div>
    </div>
    <div class="detailBox_btn">
      <a-button v-if="stusCode === 99" type="primary" block @click="applyEvent"
        >申请</a-button
      >
      <!-- 申请中 -->
      <a-button v-if="stusCode === 0" type="primary" block>取消申请</a-button>
      <!-- 待确认 + 有数据 -->
      <a-button
        v-if="stusCode === 6 && !noDatainfo"
        type="primary"
        block
        @click="finishEvent"
        >确认完成</a-button
      >
      <!-- 待确认 + 无数据 -->
      <a-button
        v-if="stusCode === 6 && noDatainfo"
        type="primary"
        block
        @click="uploadDataEvent"
        >上传数据</a-button
      >
      <!-- 未通过 -->
      <a-button
        v-if="stusCode === 8"
        type="primary"
        block
        @click="upAgainEvent"
        >重新确认完成</a-button
      >
      <a-button v-if="stusCode === 9" type="primary" block>前往结算</a-button>
    </div>
    <!-- 数据信息上传 -->
    <a-modal
      v-model:visible="dataDialog"
      title="数据信息上传"
      @ok="handleOk"
      centered
      :getContainer="$refs.deta"
      :maskClosable="false"
      class="dataDialog"
    >
      <a-form :model="formData" v-bind="formItemLayout"
        ><a-row>
          <a-col :span="12">
            <a-form-item label="花费">
              <a-input
                v-model:value="formData.cost"
                placeholder="请输入花费"
              /> </a-form-item
          ></a-col>
          <a-col :span="12">
            <a-form-item label="展示数">
              <a-input
                v-model:value="formData.display"
                placeholder="请输入展示数"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="点击数">
              <a-input
                v-model:value="formData.click"
                placeholder="请输入点击数"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="点击率">
              <a-input
                v-model:value="formData.clickPer"
                placeholder="请输入点击率"
                ><template #addonAfter>%</template></a-input
              >
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="平均千次展示成本">
              <a-input
                v-model:value="formData.thDisCost"
                placeholder="请输入平均千次展示成本"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="平均点击成本">
              <a-input
                v-model:value="formData.disCost"
                placeholder="请输入平均点击成本"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="总订单行数">
              <a-input
                v-model:value="formData.total"
                placeholder="请输入总订单行数"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="总订单金额">
              <a-input
                v-model:value="formData.totalMoney"
                placeholder="请输入总订单金额"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 确认完成的评价 -->
    <a-modal
      v-model:visible="evalueVisible"
      title="评价"
      ok-text="确认"
      cancel-text="取消"
      centered
      :maskClosable="false"
      :keyboard="false"
      :getContainer="$refs.deta"
      @ok="evalueEvent"
    >
      <a-rate v-model:value="rateValue" />
      <a-textarea
        v-model:value="areaValue"
        placeholder="请输入评价内容"
        :auto-size="{ minRows: 2, maxRows: 5 }"
        allow-clear
      />
    </a-modal>
  </div>
</template>
<script setup>
import { ref, toRefs, toRef, reactive, watch, createVNode } from "vue";
import { LeftOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import dayjs from "dayjs";
import { applyProj, uploadData, okFinish, upAagain } from "@/api/api";

const $props = defineProps({
  stusCode: Number,
  resData: Object,
  userID: Number,
});
let { stusCode, resData, userID } = toRefs($props);
let noDatainfo = ref(true);
let showEdit = ref(false);
// 项目详情页相关
let $emit = defineEmits(["back", "finish"]);
let { iconClass, detailData, backEvent } = relate_detail();
function relate_detail() {
  let stateDate = reactive({
    iconClass: "",
    detailData: {
      detailList: [], // 项目信息
      toufanglist: [], // 投放信息
      shujuList: [], //数据信息
    },
  });
  let backEvent = () => {
    $emit("back");
  };
  let watch_resData = watch(
    resData,
    (newval, oldval) => {
      let target = stateDate.detailData;
      // 投放比例
      let proportion = JSON.parse(newval.delivery_proportion);
      target.delivery_proportion = `站内${proportion.percentInner}%、站外${proportion.percentOutter}%`;
      // 目标  节奏  数量等等
      let info = JSON.parse(newval.delivery_target);
      // 投放数量
      target.delivery_num = info[info.length - 1].value;
      // 投放节奏
      target.delivery_jiezou = info[info.length - 2].value;
      // 投放时间
      let startdate = dayjs(newval.delivery_start_date).format(
        "YYYY-MM-DD HH:mm"
      );
      let enddate = dayjs(newval.delivery_end_date).format("YYYY-MM-DD HH:mm");
      (target.delivery_date = startdate + " 至 " + enddate),
        // 截止时间
        (target.project_end_date = dayjs(newval.project_end_date).format(
          "YYYY-MM-DD HH:mm"
        ));
      // 上传时间
      target.create_time = dayjs(newval.create_time).format("YYYY-MM-DD HH:mm");
      // 目标
      target.delivery_target = "";
      let delivery_target = JSON.parse(newval.delivery_target);
      delivery_target
        .slice(0, delivery_target.length - 2)
        .forEach((val, index) => {
          target.delivery_target += `${val.label}：${val.value}`;
        });
      // 产品类型
      switch (parseInt(newval.category)) {
        case 1:
          target.categoryCn = "家用电器";
          break;
        case 2:
          target.categoryCn = "手机数码";
          break;
        case 3:
          target.categoryCn = "电脑办公";
          break;
        case 4:
          target.categoryCn = "家居厨具";
          break;
        case 5:
          target.categoryCn = "服饰鞋品";
          break;
        case 6:
          target.categoryCn = "美妆";
          break;
        case 7:
          target.categoryCn = "母婴用品";
          break;
        case 8:
          target.categoryCn = "玩具乐器";
          break;
        case 9:
          target.categoryCn = "食品饮料";
          break;
        case 10:
          target.categoryCn = "医药保健";
          break;
        case 11:
          target.categoryCn = "图书";
          break;
      }
      // 投放平台
      switch (parseInt(newval.delivery_platform)) {
        case 1:
          target.platformCn = "京准通";
          break;
      }
      target.detailList = [
        {
          label: "服务费",
          value: newval.brokerage + "元",
        },
        {
          label: "预算金额",
          value: newval.budget + "元",
        },
        {
          label: "产品类型",
          value: target.categoryCn,
        },
        {
          label: "投放平台",
          value: target.platformCn,
        },

        {
          label: "投放比例",
          value: target.delivery_proportion,
        },
        {
          label: "投放目标",
          value: target.delivery_target,
        },
        {
          label: "投放时间",
          value: target.delivery_date,
        },
        {
          label: "活动投放类型",
          value: newval.service_type,
        },
        {
          label: "活动投放节奏",
          value: target.delivery_jiezou,
        },
        {
          label: "参与品牌",
          value: newval.delivery_brand,
        },
        {
          label: "投放数量",
          value: target.delivery_num,
        },
        {
          label: "任务领取截止时间",
          value: target.project_end_date,
        },
      ];
      // 投放信息:待启动 进行中 待确认
      if (newval.delivery_info) {
        let toufang = JSON.parse(newval.delivery_info);
        target.toufanglist = [
          {
            label: "账号",
            value: toufang.account,
          },
          {
            label: "密码",
            value: toufang.pwd,
          },
          {
            label: "地址链接",
            value: toufang.url,
          },
        ];
      }
      // 数据信息: 待确认(有数据)  待通过 已完成
      if (newval.delivery_result) {
        noDatainfo.value = false;
        showEdit.value = true;
        let delRes = JSON.parse(newval.delivery_result);
        target.shujuList = [
          {
            label: "花费",
            value: delRes.cost,
          },
          {
            label: "展示数",
            value: delRes.display,
          },
          {
            label: "点击数",
            value: delRes.click,
          },
          {
            label: "点击率",
            value: delRes.clickPer,
          },
          {
            label: "平均千次展示成本",
            value: delRes.thDisCost,
          },
          {
            label: "平均点击成本",
            value: delRes.disCost,
          },
          {
            label: "总订单行数",
            value: delRes.total,
          },
          {
            label: "总订单金额",
            value: delRes.totalMoney,
          },
        ];
      }
    },
    { immediate: true, deep: true }
  );
  let watch_stusCode = watch(
    stusCode,
    (newval, oldval) => {
      switch (newval) {
        case 0:
        case 1:
        case 2:
          iconClass = "dsh";
          break;
        case 3:
          iconClass = "ybh";
          break;
        case 4:
          iconClass = "dqd";
          break;
        case 5:
          iconClass = "jxz";
          break;
        case 6:
          iconClass = "dqr";
          break;
        case 7:
          iconClass = "dtg";
          break;
        case 8:
          iconClass = "wtg";
          break;
        case 9:
          iconClass = "ywc";
          break;
        case 10:
          iconClass = "dhk";
          break;
        case 11:
          iconClass = "ddk";
          break;
        case 12:
          iconClass = "yjs";
          break;                    
      }
    },
    { immediate: true }
  );
  return { ...toRefs(stateDate), backEvent, iconClass };
}
// 数据信息
let {
  dataDialog,
  evalueVisible,
  rateValue,
  areaValue,
  formData,
  uploadDataEvent,
  editDataEvent,
  handleOk,
  applyEvent,
  finishEvent,
  evalueEvent,
  upAgainEvent,
} = relate_shuju();
function relate_shuju() {
  let stateData = reactive({
    dataDialog: false,
    evalueVisible: false,
    rateValue: 0,
    areaValue: "",
    formData: {
      cost: 0, // 花费
      display: 0, // 展示数
      click: 0, // 点击数
      clickPer: 0, //点击率
      thDisCost: 0, // 平均千次展示成本
      disCost: 0, // 平均点击成本
      total: 0, // 总订单行数
      totalMoney: 0, // 总订单金额
    },
  });
  // 申请事件
  let apiPort_apply = (id) => {
    applyProj({
      ad_project: id,
    }).then((res) => {
      if (res.data.code === 200) {
        message.success("申请成功，等待审核");
        $emit("back");
      } else if (res.data.code === 4105) {
        message.error("请先上传资质信息");
      } else {
        message.error(`${res.data.msg}`);
      }
    });
  };
  let applyEvent = () => {
    Modal.confirm({
      title: `是否确认申请当前项目`,
      centered: true,
      icon: createVNode(ExclamationCircleOutlined),
      onOk() {
        apiPort_apply(resData.value.id);
      },
      onCancel() {
        console.log("Cancel");
      },
      class: "test",
    });
  };
  // 上传数据--打开弹层---------------------
  let uploadDataEvent = () => {
    stateData.dataDialog = true;
  };
  let editDataEvent = () => {
    stateData.dataDialog = true;
    let delRes = JSON.parse(resData.value.delivery_result);
    stateData.formData.cost = delRes.cost;
    stateData.formData.display = delRes.display;
    stateData.formData.click = delRes.click;
    stateData.formData.clickPer = delRes.clickPer;
    stateData.formData.thDisCost = delRes.thDisCost;
    stateData.formData.disCost = delRes.disCost;
    stateData.formData.total = delRes.total;
    stateData.formData.totalMoney = delRes.totalMoney;
  };
  // 上传数据--确认操作
  let handleOk = () => {
    uploadData(
      {
        delivery_result: JSON.stringify(stateData.formData),
      },
      userID.value
    ).then((res) => {
      if (res.data.code === 200) {
        message.success("数据信息上传成功");
        noDatainfo.value = false;
        showEdit.value = true;
        stateData.dataDialog = false;
        let delRes = JSON.parse(res.data.data.delivery_result);
        detailData.value.shujuList = [
          {
            label: "花费",
            value: delRes.cost,
          },
          {
            label: "展示数",
            value: delRes.display,
          },
          {
            label: "点击数",
            value: delRes.click,
          },
          {
            label: "点击率",
            value: delRes.clickPer,
          },
          {
            label: "平均千次展示成本",
            value: delRes.thDisCost,
          },
          {
            label: "平均点击成本",
            value: delRes.disCost,
          },
          {
            label: "总订单行数",
            value: delRes.total,
          },
          {
            label: "总订单金额",
            value: delRes.totalMoney,
          },
        ];
      } else {
        message.error(res.data.msg);
      }
    });
  };
  // 确认完成--打开弹层----------------------
  let finishEvent = () => {
    stateData.evalueVisible = true;
  };
  // 确认完成--评价操作
  let evalueEvent = () => {
    okFinish({
      ad_project: resData.value.id,
      user_evaluate_score: stateData.rateValue,
      user_evaluate_content: stateData.areaValue,
    }).then((res) => {
      if (res.data.code === 200) {
        message.success("已确认完成");
        stateData.evalueVisible = false;
        $emit("back");
      } else {
        message.error(res.data.msg);
      }
    });
  };
  let upAgainEvent = () => {
    upAagain({
      ad_project: resData.value.id,
    }).then((res) => {
      if (res.data.code === 200) {
        message.success("操作成功");
        $emit("back");
      } else {
        message.error(res.data.msg);
      }
    });
  };

  return {
    ...toRefs(stateData),
    uploadDataEvent,
    editDataEvent,
    handleOk,
    applyEvent,
    finishEvent,
    evalueEvent,
    upAgainEvent,
  };
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>