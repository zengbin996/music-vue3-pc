<template>
  <!-- 默认主页 -->
  <div class="hot-con">
    <div class="title title-first">新歌推荐</div>
    <div class="content">
      <div class="item" v-for="item in state.recom" :key="item.id" @click="goPlay(item)">
        <div class="img">
          <img :src="item.picUrl + '?param=200y200'" />
        </div>
        <div class="songName">{{ item.name }}</div>
      </div>
    </div>

    <div class="title">最新专辑</div>
    <div class="content">
      <div class="item" v-for="item in state.newestAlbum" :key="item.id" @click="goList(item, 'album')">
        <div>
          <div class="img">
            <img :src="item.blurPicUrl + '?param=200y200'" alt="" />
          </div>
          <div class="songName">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <div class="title">热门歌手</div>
    <div class="content">
      <div class="item" v-for="item in state.artistsList" :key="item.id" @click="goList(item, 'artists')">
        <div>
          <div class="img">
            <img :src="item.img1v1Url + '?param=200y200'" />
          </div>
          <div class="songName">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { recomNewApi, artistsApi, newestApi } from '../../request/api';
import { VUEX_MUTATION } from '../../utils/index';

const router = useRouter();
const store = useStore();

const state = reactive({
  recom: [], //推荐 用户未登录显示推荐新音乐 用户已经登录显示推荐音乐
  artistsList: [], //热门歌手列表
  newestAlbum: [], //最新专辑列表
});

//初始化页面
recomNewApi().then(res => {
  if (res.code === 200) {
    state.recom = res.result;
  }
});

artistsApi().then(res => {
  if (res.code === 200) {
    state.artistsList = res.artists;
  }
});

newestApi().then(res => {
  if (res.code === 200) {
    state.newestAlbum = res.albums.slice(0, 10);
  }
});

// 播放
const goPlay = function ({ id }) {
  store.commit(VUEX_MUTATION.INSERT, id.toString());
  store.commit(VUEX_MUTATION.NEXT);
  router.push({ name: 'pcPlay', params: { id } });
};

// 列表
const goList = function ({ id }, type) {
  if (type === 'album') {
    router.push({
      name: 'pcAlbum',
      params: { id },
    });
  }
  if (type === 'artists') {
    router.push({
      name: 'pcArtists',
      params: { id },
    });
  }
};
</script>

<style lang="less" scoped>
.hot-con {
  width: 1200px;
  margin: auto;

  .title {
    font-weight: 700;
    line-height: 2;
  }

  .title-first {
    margin-top: 20px;
  }

  .content {
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: auto;

    grid-row-gap: 20px;
    grid-column-gap: 40px;

    font-size: 14px;

    .item {
      .img {
        width: 100%;

        img {
          width: 100%;
        }
      }

      .songName {
        line-height: 2;
      }
    }
  }
}
.item {
  cursor: pointer;
}
</style>
