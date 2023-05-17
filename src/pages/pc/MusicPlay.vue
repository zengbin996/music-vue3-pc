<template>
  <!-- 播放页 -->
  <div class="play-con">
    <div class="songInfo" v-if="detail.name">
      <div class="title">{{ detail.name }}</div>

      <div class="artists" v-if="detail.ar">{{ detail.ar[0].name }}</div>

      <div class="main">
        <div class="cover" v-if="detail.al">
          <img :src="detail.al.picUrl + '?param=200y200'" :class="musicState ? 'run' : 'pau'" />
        </div>
        <div class="lyrics" v-if="lyricMusic" ref="lyrics">
          <p v-for="(item, index) in lyricMusic" :key="index">{{ item.txt }}</p>
        </div>
      </div>

      <div class="comment" v-if="comments.list">
        <h3>全部评论({{ comments.total }})</h3>
        <p v-for="(item, index) in comments.hot" :key="index" class="hot">
          {{ item.content }}
        </p>
        <p v-for="(item, index) in comments.list" :key="index">{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import { VUEX_MUTATION } from '../../utils/index';
import { getLyricApi, getCommentApi } from '../../request/api';

const store = useStore();
const router = useRouter();
const route = useRoute();
const { id } = route.params;

if (!store.state.list.length) {
  store.commit(VUEX_MUTATION.INSERT, id);
}

const musicState = computed(() => store.state.musicState);
const currentTime = computed(() => store.state.currentTime);
const durationTime = computed(() => store.state.duration);
const list = computed(() => store.state.list);

const detail = computed(() => store.state.musicDetail);
const lyricMusic = computed(() => {
  const lyricState = store.state.musicLyric;

  if (lyricState.length) {
    const lyric = lyricState.split('\n');
    const lyr = [];
    lyric.forEach(item => {
      lyr.push({
        time: dayjs
          .duration({
            m: item.substring(1, 3),
            s: item.substring(4, 6),
            ms: item.substring(7, 10),
          })
          .asSeconds(),
        txt: item.substring(11),
      });
    });
    const l = [];
    lyr.forEach(item => {
      if (item.txt) {
        l.push(item);
      }
    });
    return l;
  } else {
    return '';
  }
});

const comments = reactive({
  list: [],
  hot: [],
  total: 0,
  pageSize: 50,
  pageNumber: 1,
});

// 初始化获取数据
init(id);

watch(
  () => list.value,
  newValue => {
    router.push({ name: 'pcPlay', params: { id: newValue[0] } });
    init(newValue[0]);
  },
  { deep: true }
);

function init(id) {
  // 评论
  getCommentApi({
    id,
    limit: comments.pageSize,
    offset: (comments.pageNumber - 1) * comments.pageSize,
  }).then(res => {
    if (res.code == 200) {
      comments.list = res.comments;
      comments.hot = res.hotComments;
      comments.total = res.total;
    }
  });
}
</script>

<style lang="less" scoped>
.play-con {
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }

  .songInfo {
    width: 1200px;
    margin: auto;

    .title {
      font-size: 22px;
      font-weight: 700;
      line-height: 2;
      padding-top: 20px;
      text-align: center;
    }

    .artists {
      font-size: 14px;
      text-align: center;
      color: #666;
    }

    .main {
      display: flex;
      justify-content: space-between;
      height: 400px;
      padding: 0 50px;

      .cover {
        width: 50%;
        text-align: center;
        line-height: 400px;
        img {
          vertical-align: middle;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          animation: rouate 8s linear infinite;
        }

        .run {
          animation-play-state: running;
        }

        .pau {
          animation-play-state: paused;
        }
      }

      @keyframes rouate {
        0% {
          transform: rotate(0);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .lyrics {
        padding-top: 20px;
        flex: 1;
        text-align: center;
        line-height: 2;
        height: 400px;
        overflow: auto;
        font-size: 16px;

        .current {
          color: #f00;
          // top: 20px;
          font-size: 1.3em;
        }

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }

    .comment {
      padding-top: 20px;
      font-size: 14px;
      line-height: 2;

      .hot {
        font-weight: 700;
      }

      h3 {
        font-size: 17 px;
      }
    }
  }

  .control {
    height: 60px;
    background-color: #111;
    color: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;

    .progress {
      height: 2px;
      .progress-bar {
        height: 2px;
        width: 100%;
        .inner {
          transition: all 100ms;
          position: relative;

          background-color: #f00;
          height: 2px;

          &::after {
            content: '';
            position: absolute;
            right: 0;
            width: 2px;
            height: 2px;
            border-radius: 50%;
            background-color: #f00;
            box-shadow: 0 0 5px 5px rgba(255, 0, 0, 0.5);
          }
        }
      }
    }

    .cut {
      display: flex;
      justify-content: center;
      font-size: 36px;
      line-height: 58px;

      .btn {
        margin: 0 15px;

        cursor: pointer;
      }

      .time {
        font-size: 14px;
        position: absolute;
        transform: translateX(200px);
      }
    }
  }
}
</style>
