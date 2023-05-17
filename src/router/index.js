import { createRouter, createWebHashHistory } from 'vue-router';
import { ElMessage } from 'element-plus';

const routes = [
  {
    name: 'index',
    path: '/',
    component: () => import('../pages/index.vue'),

    children: [
      {
        name: 'pc',
        path: '/pc',
        component: () => import('../pages/pc/index.vue'),
        redirect: '/pc/main',
        children: [
          {
            name: 'pcMain',
            path: '/pc/main',
            component: () => import('../pages/pc/MusicMain.vue'),
          },
          {
            name: 'pcSearchResult',
            path: '/pc/result',
            component: () => import('../pages/pc/SearchResult.vue'),
          },
          {
            name: 'pcPlay',
            path: '/pc/play/:id',
            component: () => import('../pages/pc/MusicPlay.vue'),
          },
          {
            name: 'pcAlbum',
            path: '/pc/album/:id',
            component: () => import('../pages/pc/AlbumList.vue'),
          },
          {
            name: 'pcArtists',
            path: '/pc/artists/:id',
            component: () => import('../pages/pc/ArtistsList.vue'),
          },
          {
            name: 'pcSongSingleList',
            path: '/pc/songsinglelist/:id',
            component: () => import('../pages/pc/SongSingleList.vue'),
          },
          {
            name: 'pcRanking',
            path: '/pc/ranking',
            component: () => import('../pages/pc/MusicRanking.vue'),
          },
          {
            name: 'pcRecommend',
            path: '/pc/recommend',
            component: () => import('../pages/pc/MusicRecommend.vue'),
          },
          {
            name: 'pcSongSingle',
            path: '/pc/SongSingle',
            component: () => import('../pages/pc/MusicSongSingle.vue'),
          },
          {
            name: 'pcUserInfo',
            path: '/pc/userinfo',
            component: () => import('../pages/pc/UserInfo.vue'),
          },
        ],
      },
      {
        name: 'mobile',
        path: '/mobile',
        component: () => import('../pages/mobile/index.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//需要登录才能访问的地址
const routerLimit = ['pcUserInfo', 'pcRecommend', 'pcSongSingle'];

router.beforeEach(to => {
  if (routerLimit.indexOf(to.name) != -1) {
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo') || '{}');
    if (!Object.keys(loginInfo).length) {
      ElMessage('访问该页面需要先登录');
      return '/pc/main';
    }
  }
});

export default router;
