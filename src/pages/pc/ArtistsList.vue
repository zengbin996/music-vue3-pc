<template>
  <!-- 歌手歌曲列表 -->
  <list-view :tableData="list" v-loading="loading" layout="songName,artists,album"></list-view>
</template>

<script>
import { artistsSongsApi } from '../../request/api';
import ListView from './ListView.vue';

export default {
  components: {
    ListView,
  },
  data() {
    return {
      list: [],
      loading: false,
    };
  },
  created() {
    const { id } = this.$route.params;
    this.getList(id);
  },

  watch: {
    $route: function (newValue) {
      if (newValue.name == 'pcArtists') {
        this.getList(newValue.params.id);
      }
    },
  },

  methods: {
    getList(id) {
      this.loading = true;
      artistsSongsApi({ id }).then(res => {
        this.loading = false;
        this.list = res.hotSongs;
      });
    },
  },
};
</script>
