<template>
  <Header></Header>
  <div v-if="$route.name === 'home'" class="content ts">
    <div class="content_txt">
      <img src="../../assets/images/slide1.jpg" alt="" />
    </div>
    <div class="content_img">
      <a-carousel v-if="$route.name === 'home'" autoplay>
        <img src="../../assets/images/fixed1.webp" alt="" />
        <img src="../../assets/images/fixed2.webp" alt="" />
      </a-carousel>
    </div>

    <div class="content_box ts">
      <router-view class="content_box_mid"></router-view>
    </div>
    <div class="footer">
      Copyrihgt(C) 2010-2022 aFoucs.com.cn,All Rights Reserved
    </div>
  </div>
  <div v-else class="content">
    <!-- <a-spin size="large" :indicator="indicator" :spinning="true" tip="加载中"> -->
      <div class="content_box">
        <a-affix :offset-top="85">
          <div class="content_box_lt">
            <SideMenu></SideMenu>
          </div>
        </a-affix>
        <router-view class="content_box_rt"></router-view>
      </div>
    <!-- </a-spin> -->
  </div>

  <a-back-top :visibilityHeight="100" />
</template>
<script setup>
import Header from "@/components/Header";
import SideMenu from "@/components/SideMenu";
import { useRoute } from "vue-router";
import { LoadingOutlined } from "@ant-design/icons-vue";

const $route = useRoute();
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>