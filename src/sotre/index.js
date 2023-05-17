import { createStore } from 'vuex';
import _ from 'lodash';

import { VUEX_MUTATION, VUEX_ACTION, PLAY_PATTERN } from '../utils/index';
import { getUrlApi, getLyricApi, detailApi } from '../request/api';

const store = createStore({
  state() {
    return {
      musicState: false,
      src: '', //当前播放地址
      list: [], //列表
      duration: 0, //总时长
      currentTime: 0, //当前播放进度
      playPattern: PLAY_PATTERN.listNext, //播放模式
      musicDetail: {}, //音乐其他数据
      musicLyric: '',
    };
  },
  mutations: {
    //设置播放地址
    setSrc(state, src) {
      state.src = src;
    },

    //设置总时长
    [VUEX_MUTATION.SET_DURATION](state, duration) {
      state.duration = duration;
    },

    //设置当前时间
    [VUEX_MUTATION.SET_CURRENT_TIME](state, currentTime) {
      state.currentTime = currentTime;
    },

    //播放/暂停
    [VUEX_MUTATION.TOGGLE](state, s) {
      const play = s ?? !state.musicState;
      state.musicState = play;
    },

    //上一首
    [VUEX_MUTATION.PREVIOUS](state) {
      const list = [...state.list];
      const current = list.pop();
      list.unshift(current);
      state.list = list;
    },

    //下一首
    [VUEX_MUTATION.NEXT](state) {
      if (state.playPattern == PLAY_PATTERN.listRandom) {
        this.commit(VUEX_MUTATION.RANDOM_SONG);
        return;
      }

      const list = [...state.list];
      const current = list.shift();
      list.push(current);
      state.list = list;
    },

    //随机播放
    [VUEX_MUTATION.RANDOM_SONG](state) {
      const list = [...store.state.list];
      const item = _.sample(list);
      list.splice(list.indexOf(item), 1);
      list.unshift(item);
      state.list = list;
    },

    //插入音乐 下一首
    [VUEX_MUTATION.INSERT](state, musicId) {
      const list = [...state.list];
      list.splice(1, 0, musicId);
      state.list = list;
    },

    //更新列表 直接播放
    [VUEX_MUTATION.UPDATE_LIST](state, list) {
      state.list = list;
    },

    //设置音乐详情信息
    [VUEX_MUTATION.SET_DETAIL](state, detail) {
      state.musicDetail = detail;
    },

    //设置歌词
    [VUEX_MUTATION.SET_LYRIC](state, lyric) {
      state.musicLyric = lyric;
    },
  },

  actions: {
    //加载音乐
    [VUEX_ACTION.GET_URL]({ commit }, id) {
      //播放地址
      getUrlApi({ id }).then(res => {
        commit('setSrc', res.data[0].url);
      });

      //歌词
      getLyricApi({ id }).then(res => {
        if (res.lrc) {
          store.commit(VUEX_MUTATION.SET_LYRIC, res.lrc.lyric);
        } else {
          store.commit(VUEX_MUTATION.SET_LYRIC, '[99:99.999] 暂无歌词');
        }
      });

      //歌曲其他信息
      detailApi({ ids: id }).then(res => {
        store.commit(VUEX_MUTATION.SET_DETAIL, res.songs[0]);
      });
    },
  },
});

export default store;
