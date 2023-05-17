/**
 * 此处写入 公共方法 枚举
 */

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

//vuex muation
export const VUEX_MUTATION = {
  SET_DURATION: 'SET_DURATION',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME',
  TOGGLE: 'TOGGLE',
  PREVIOUS: 'PREVIOUS',
  NEXT: 'NEXT',
  INSERT: 'INSERT',
  UPDATE_LIST: 'UPDATE_LIST',
  SET_DETAIL: 'SET_DETAIL',
  RANDOM_SONG: 'RANDOM_SONG',
  SET_LYRIC: 'SET_LYRIC',
};

export const VUEX_ACTION = {
  GET_URL: 'GET_URL',
};

//播放模式
export const PLAY_PATTERN = {
  listNext: '1',
  listRandom: '2',
  singleCycle: '3',
};

/**
 * 时间格式化
 * @param '00:00.000' 时间格式
 * @returns 毫秒值
 */

export const timeFormat = function (s) {
  let ms = dayjs
    .duration({
      minutes: s.substr(0, 2),
      seconds: s.substr(3, 2),
      milliseconds: s.substr(6, 3),
    })
    .asMilliseconds();

  return ms;
};

export const dateFormat = ms => dayjs.duration(ms).format('mm:ss');
