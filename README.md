# 音乐播放器

音乐播放器，该项目是基于网易云音乐接口开发，所有数据均来自网易云音乐，部分接口由于限制可能无法使用，本人不保证任何功能的可用性。本项目也不提供任何付费音乐下载功能，所有的功能均为交流学习。请在法律允许的条件下使用，若由此产出的法律问题，本人概不负责。

> 感谢 [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) 提供接口
>
> 核心技术 `vue3 + vite `

### 使用方法

1. 将后端项目克隆到本地运行，详情请查看 [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) 
2. 克隆本项目，请注意`` config.js  ``文件中的后端地址是否为自己的，推荐使用``pnpm``进行安装

```
git clone https://gitee.com/zengbin996/music-vue3-pc.git
pnpm i
pnpm run dev
```

### 项目介绍

使用技术：vue3 + vue-router + vuex + element-plus + less + axios + vite + pnpm

核心技术分析：

功能：用户登录（该接口可能无法使用）、关键词搜索、新歌推荐、歌单推荐、音乐播放、歌词展示、歌曲评论等

项目 UI 展示：

![](https://s1.ax1x.com/2023/02/04/pSyyGLt.png)
![](https://s1.ax1x.com/2023/02/04/pSyy3QA.png)
![](https://s1.ax1x.com/2023/02/04/pSyy8sI.png)
![](https://s1.ax1x.com/2023/02/04/pSyylzd.png)
![](https://s1.ax1x.com/2023/02/04/pSyyQRH.png)