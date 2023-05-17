<template>
  <div class="container">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>歌单</span>
        </div>
      </template>
      <div class="card-content" v-if="toListData" v-loading="loading">
        <div class="item" v-for="item in toListData" :key="item.id" @click="goList(item)">
          <img :src="item.picUrl + '?param=200y200'" />
          <span class="title"> {{ item.name }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { personalized } from '../../request/api';

const router = useRouter();

const toListData = ref([]);
const loading = ref(false);

init();
function init() {
  loading.value = true;

  personalized().then(res => {
    loading.value = false;
    toListData.value = res.result;
  });
}

function goList({ id }) {
  router.push({
    name: 'pcSongSingleList',
    params: { id },
  });
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
