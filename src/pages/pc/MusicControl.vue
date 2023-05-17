<template>
  <!-- 控制器 -->
  <div class="control" :style="'height:' + height + 'px'" v-if="store.state.list.length">
    <div class="box">
      <div class="progress">
        <div class="progress-bar">
          <div class="inner" :style="'width:' + (currentTime / durationTime) * 100 + '%'"></div>
        </div>
      </div>

      <div class="cut">
        <div class="btn">
          <el-tooltip content="上一首" placement="left" effect="light">
            <i class="el-icon-caret-left" @click="store.commit(VUEX_MUTATION.PREVIOUS)"></i>
          </el-tooltip>
        </div>

        <div class="btn">
          <el-tooltip content="播放/暂停" placement="top" effect="light">
            <i
              :class="musicState ? 'el-icon-video-pause' : 'el-icon-video-play'"
              @click="store.commit(VUEX_MUTATION.TOGGLE)"
            ></i>
          </el-tooltip>
        </div>

        <div class="btn">
          <el-tooltip content="下一首" placement="right" effect="light">
            <i class="el-icon-caret-right" @click="store.commit(VUEX_MUTATION.NEXT)"></i>
          </el-tooltip>
        </div>

        <div class="time">{{ formatMinute(currentTime) }} / {{ formatMinute(durationTime) }}</div>
      </div>

      <div class="lyric">
        <div :class="lyric.current == 0 ? 'activity' : ''">{{ lyric.lyrArr[0] }}</div>
        <div :class="lyric.current == 1 ? 'activity' : ''">{{ lyric.lyrArr[1] }}</div>
      </div>

      <div class="title" v-if="musicDetail.name">
        <span> {{ musicDetail.name }}</span>
        <span> - {{ musicDetail.ar[0].name }}</span>
      </div>

      <div class="list-view">
        <el-tooltip content="播放列表" placement="left" effect="light">
          <el-icon :size="20" @click="openList">
            <fold />
          </el-icon>
        </el-tooltip>
      </div>
    </div>

    <div class="mini">
      <i :class="height ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="handleHidden"></i>
    </div>

    <el-drawer v-model="drawer" :with-header="false" direction="rtl" :before-close="handleClose">
      <template v-if="playList.length">
        <el-table :data="playList" style="width: 100%" :height="playListHeight" @row-click="rowClick">
          <el-table-column label="播放列表">
            <template #default="scope">
              <span>{{ scope.row.name }}</span>
              <span> - {{ scope.row.ar[0].name }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import $ from 'jquery';
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { Fold } from '@element-plus/icons';
import { VUEX_MUTATION } from '../../utils/index';
import { timeFormat } from '../../utils/index';
import { detailApi } from '../../request/api';
dayjs.extend(duration);

const store = useStore();
const musicState = computed(() => store.state.musicState);
const currentTime = computed(() => store.state.currentTime);
const durationTime = computed(() => store.state.duration);
const musicLyric = computed(() => store.state.musicLyric);
const musicDetail = computed(() => store.state.musicDetail);
const list = computed(() => store.state.list);

const lyric = reactive({
  current: 0,
  lyrArr: [],
  arr: [],
});

watchEffect(() => {
  let arr = musicLyric.value.split('\n');
  let arr2 = [];
  arr.forEach(i => {
    if (i.substr(11)) {
      arr2.push({
        duration: timeFormat(i.slice(1, 10)),
        txt: i.substr(11),
      });
    }
  });
  lyric.arr = arr2;
});

watchEffect(() => {
  let i = lyric.arr.findIndex(i => {
    return i.duration > currentTime.value * 1000;
  });

  if (lyric.arr[i] && lyric.lyrArr.indexOf(lyric.arr[i].txt) == -1) {
    lyric.lyrArr[lyric.current] = lyric.arr[i].txt;
    lyric.current = lyric.current == 0 ? 1 : 0;
  }
});

//播放列表
const playListHeight = $(window).height() - 20;
const drawer = ref(false);
const openList = () => (drawer.value = true);
const playList = ref([]);
const handleClose = () => {
  drawer.value = false;
};

const rowClick = ({ id }) => {
  store.commit(VUEX_MUTATION.INSERT, id);
  store.commit(VUEX_MUTATION.NEXT);
};

watch(
  () => list.value,
  newValue => detailApi({ ids: newValue.join() }).then(res => (playList.value = res.songs))
);

//时间格式化
const formatMinute = ms => dayjs.duration(ms * 1000).format('mm:ss');

const height = ref(60);
//收起控制条
const handleHidden = () => (height.value = height.value ? 0 : 60);
</script>

<style lang="less" scoped>
.control {
  height: 60px;
  background-color: #111;
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 100%;
  transition: all 300ms;

  .box {
    position: relative;
    color: #fff;

    .lyric {
      position: absolute;
      line-height: 60px;
      top: 0;
      left: 15%;
      display: flex;

      .activity {
        color: red;
      }

      div {
        width: 200px;
      }

      div:nth-child(1) {
        transform: translate(-10px, -5px);
      }
      div:nth-child(2) {
        transform: translate(10px, 5px);
      }
    }

    .title {
      position: absolute;
      line-height: 60px;
      top: 0;
      right: 15%;
      font-size: 14px;
    }

    .list-view {
      position: absolute;
      line-height: 60px;
      top: 0;
      right: 50px;

      .el-icon {
        cursor: pointer;
        vertical-align: middle;
      }
    }
  }

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

  .mini {
    color: white;
    cursor: pointer;
    position: absolute;
    top: -20px;
    right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    line-height: 25px;
    text-align: center;
    background-color: #111;
  }
}
</style>
