<template>
  <div class="container">
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>我创建的歌单</span>
        </div>
      </template>
      <div class="card-content" v-if="songSingle.oneself.length">
        <div class="item" v-for="(item, index) in songSingle.oneself" :key="item.id" @click="goList(item)">
          <img :src="item.coverImgUrl + '?param=200y200'" />
          <span class="title"> {{ index == 0 ? '我喜欢的音乐' : item.name }}</span>
        </div>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>我收藏的歌单</span>
        </div>
      </template>
      <div class="card-content" v-if="songSingle.collected.length">
        <div class="item" v-for="item in songSingle.collected" :key="item.id" @click="goList(item)">
          <img :src="item.coverImgUrl + '?param=200y200'" />
          <span class="title"> {{ item.name }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { playListApi } from '../../request/api';

const router = useRouter();
const loginInfo = JSON.parse(localStorage.getItem('loginInfo') || {});
const uid = loginInfo.profile.userId;

const songSingle = reactive({
  oneself: [],
  collected: [],
});

init();

function init() {
  playListApi({ uid }).then(res => {
    const list = res.playlist;
    const oneself = [];
    const collected = [];

    list.forEach(item => {
      if (item.userId == uid) {
        oneself.push(item);
      } else {
        collected.push(item);
      }
    });
    songSingle.oneself = oneself;
    songSingle.collected = collected;
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
