<template>
  <div class="container">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>推荐音乐</span>
        </div>
      </template>
      <div class="card-content" v-if="state.sings.length" v-loading="loading">
        <div class="item" v-for="item in state.sings" :key="item.id" @click="goPlay(item)">
          <img :src="item.al.picUrl + '?param=200y200'" />
          <span class="title"> {{ item.name }}</span>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>推荐歌单</span>
        </div>
      </template>
      <div class="card-content" v-if="state.singSongle.length">
        <div class="item" v-for="item in state.singSongle" :key="item.id" @click="goList(item)">
          <img :src="item.picUrl + '?param=200y200'" />
          <span class="title"> {{ item.name }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { recommendApi, recommendSingSongleApi } from '../../request/api';
import { VUEX_MUTATION } from '../../utils/index';

const router = useRouter();
const store = useStore();

const state = reactive({
  sings: [],
  singSongle: [],
});
const loading = ref(false);

init();
function init() {
  loading.value = true;

  recommendApi().then(res => {
    loading.value = false;
    state.sings = res.data.dailySongs;
  });
  recommendSingSongleApi().then(res => (state.singSongle = res.recommend));
}

function goList({ id }) {
  router.push({
    name: 'pcSongSingleList',
    params: { id },
  });
}
function goPlay({ id }) {
  store.commit(VUEX_MUTATION.INSERT, id.toString());
  store.commit(VUEX_MUTATION.NEXT);
  router.push({ name: 'pcPlay', params: { id } });
}
</script>

<style lang="less" scoped>
.container {
  width: 1200px;
  margin: 0 auto;

  .box-card {
    margin-top: 20px;

    .card-content {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: auto;
      grid-row-gap: 20px;
      grid-column-gap: 40px;
      font-size: 15px;

      .item {
        box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.1);
        cursor: pointer;

        img {
          width: 200px;
          height: 200px;
        }

        .title {
          display: block;
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 2;
        }
      }
    }
  }
}
</style>
