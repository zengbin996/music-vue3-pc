<template>
  <!-- 专辑列表 -->
  <list-view :tableData="list" v-loading="loading" layout="songName,artists,album"></list-view>
</template>

<script>
import { playListDetail, detailApi } from '../../request/api';
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

  methods: {
    async getList(id) {
      this.loading = true;
      const detail = await playListDetail({ id });
      const idList = [];
      detail.privileges.forEach(item => idList.push(item.id));
      const res = await detailApi({ ids: idList.join() });
      this.list = res.songs;
      this.loading = false;
    },
  },
};
</script>
