<template>
  <!-- 音乐播放组件 -->
  <audio
    controls
    autoplay
    id="audio"
    class="audio"
    ref="audio"
    v-if="src"
    :src="src"
    @pause="audioPause"
    @play="audioPlay"
    @timeupdate="timeupdate"
    @canplay="canplay"
    @ended="ended"
  ></audio>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { VUEX_MUTATION, VUEX_ACTION, PLAY_PATTERN } from '../utils/index';
const store = useStore();

const src = computed(() => store.state.src);
const audio = ref(null);

//播放
const audioPause = () => {
  store.commit(VUEX_MUTATION.TOGGLE, false);
};

//暂停
const audioPlay = () => {
  store.commit(VUEX_MUTATION.TOGGLE, true);
};

// 更新
const timeupdate = () => {
  if (!audio.value) return;
  const current = audio.value.currentTime;
  store.commit(VUEX_MUTATION.SET_CURRENT_TIME, current);
};

//加载完成
const canplay = () => {
  const duration = audio.value.duration;
  store.commit(VUEX_MUTATION.SET_DURATION, duration);
};

//播放完毕
const ended = () => {
  //列表播放
  if (store.state.playPattern == PLAY_PATTERN.listNext) {
    store.commit(VUEX_MUTATION.NEXT);
  }

  //随机播放
  if (store.state.playPattern == PLAY_PATTERN.listRandom) {
    store.commit(VUEX_MUTATION.RANDOM_SONG);
  }

  //单曲循环
  if (store.state.playPattern == PLAY_PATTERN.singleCycle) {
    audio.value.load();
  }
};

//列表发生变化开始播放
watchEffect(() => {
  if (store.state.list.length != 0) store.dispatch(VUEX_ACTION.GET_URL, store.state.list[0]);
});

//状态发生变化播放/暂停
watch(
  () => store.state.musicState,
  newVlaue => {
    if (newVlaue && audio.value) {
      audio.value.play();
    } else {
      audio.value.pause();
    }
  }
);
</script>

<style lang="less" scoped>
.audio {
  display: none;
}
</style>
