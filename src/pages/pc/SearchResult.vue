<template>
  <!-- 搜索列表 -->
  <list-view :tableData="list" v-loading="loading" layout="songName,artists,album"></list-view>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchApi } from '../../request/api';
import ListView from './ListView.vue';

const route = useRoute();
const router = useRouter();

const list = ref(null);
const keywords = computed(() => route.query);

if (!keywords) {
  router.push('/pc/main');
}

const loading = ref(false);
watchEffect(() => {
  if (keywords.value) {
    loading.value = true;
    searchApi({ keywords: keywords.value.keywords }).then(res => {
      loading.value = false;
      list.value = res.result.songs;
    });
  }
});
</script>
