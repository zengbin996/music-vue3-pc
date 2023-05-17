<template>
  <!-- 专辑列表 -->
  <list-view :tableData="list" v-loading="loading" layout="songName,artists"></list-view>
</template>

<script>
import { albumDteailApi } from '../../request/api';
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
      if (newValue.name == 'pcAlbum') {
        this.getList(newValue.params.id);
      }
    },
  },

  methods: {
    getList(id) {
      this.loading = true;
      albumDteailApi({ id }).then(res => {
        this.loading = false;
        this.list = res.songs;
      });
    },
  },
};
</script>
