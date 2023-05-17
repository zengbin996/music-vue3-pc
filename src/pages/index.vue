<template>
  <div class="mobile">
    <a href="http://116.204.127.62:9001/">当前是pc项目移动的请点击这里</a>
  </div>
  <router-view></router-view>
  <!-- 移动端和PC公用音乐播放组件 -->
  <audio-play></audio-play>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
import AudioPlay from './AudioPlay.vue';

export default {
  components: { AudioPlay },

  setup() {
    const router = useRouter();
    const route = useRoute();
    //判断是手机还是电脑 这里通过浏览器尺寸大于992判断

    if (route.path == '/') {
      router.push({ name: 'pc' });

      // if (document.documentElement.clientWidth > 992) {
      // } else {
      //   router.push({ name: 'mobile' });
      // }
    }
  },
};
</script>

<style scoped>
.mobile {
  text-align: center;
}

@media screen and (min-width: 992px) {
  .mobile {
    display: none;
  }
}
</style>
