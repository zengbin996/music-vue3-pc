import { get } from './index';
import { BASE_URL } from '../config';

//默认参数
const defaultParams = { offset: 0, limit: 10 };

//登录
export const loginApi = p => get(BASE_URL + '/login/cellphone', p);

//验证码
export const captchaApi = p => get(BASE_URL + '/captcha/sent', p);

//二维码登录
export const qrKeyApi = p => get(BASE_URL + '/login/qr/key', p);
export const qrCreateApi = p => get(BASE_URL + '/login/qr/create', p);
export const qrCheckApi = p => get(BASE_URL + '/login/qr/check', p);
export const userAccountApi = p => get(BASE_URL + '/user/account', p);

//退出登录
export const logoutApi = () => get(BASE_URL + '/logout');

//获取URL
export const getUrlApi = p => get(BASE_URL + '/song/url', p);

//推荐新歌
export const recomNewApi = p => get(BASE_URL + '/personalized/newsong', p);

//热门歌手
export const artistsApi = (p = defaultParams) => get(BASE_URL + '/top/artists', p);

//最新专辑
export const newestApi = p => get(BASE_URL + '/album/newest', p);

//专辑内容
export const albumDteailApi = p => get(BASE_URL + '/album', p);

//歌手热门歌曲
export const artistsSongsApi = p => get(BASE_URL + '/artists', p);

//搜索
export const searchApi = p => get(BASE_URL + '/cloudsearch', p);

//获取歌曲详情
export const detailApi = p => get(BASE_URL + '/song/detail', p);

//获取歌词
export const getLyricApi = p => get(BASE_URL + '/lyric', p);

//获取评论
export const getCommentApi = p => get(BASE_URL + '/comment/music', p);

//每日推荐音乐
export const recommendApi = p => get(BASE_URL + '/recommend/songs', p);

//每日推荐歌单
export const recommendSingSongleApi = p => get(BASE_URL + '/recommend/resource', p);

//获取排行榜
export const toplistApi = p => get(BASE_URL + '/toplist', p);

//推荐歌单
export const personalized = p => get(BASE_URL + '/personalized', p);

//获取用户歌单
export const playListApi = p => get(BASE_URL + '/user/playlist', p);

//获取歌单内容
export const playListDetail = p => get(BASE_URL + '/playlist/detail', p);
