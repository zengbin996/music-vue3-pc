<template>
  <!-- 列表组件 -->
  <div class="container">
    <el-table :data="props.tableData" style="width: 100%" @row-click="rowClick">
      <el-table-column label="序号" width="100">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="歌名" v-if="layout.indexOf('songName') != -1" width="200"> </el-table-column>

      <el-table-column label="歌手" v-if="layout.indexOf('artists') != -1" width="200">
        <template #default="scope">
          <span v-for="(item, index) in scope.row.ar" :key="index"
            ><span @click.stop="artistsClick(scope.row.ar, index)" class="item">{{ item.name }}</span>
            {{ scope.row.ar.length == index + 1 ? '' : '，' }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="专辑" v-if="layout.indexOf('album') != -1" width="200">
        <template #default="scope">
          <span @click.stop="albumClick(scope.row.al)" class="item">
            {{ scope.row.al.name }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="时长">
        <template #default="scope">
          {{ dateFormat(scope.row.dt) }}
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template #header>
          <el-button size="small" type="primary" @click="palyAll"> 播放全部 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import { VUEX_MUTATION, dateFormat } from '../../utils/index';

const props = defineProps({ tableData: Array, layout: String });
const layout = props.layout.split(',');

const store = useStore();
const router = useRouter();

const rowClick = ({ id }) => {
  store.commit(VUEX_MUTATION.INSERT, id.toString());
  store.commit(VUEX_MUTATION.NEXT);
  router.push({ name: 'pcPlay', params: { id } });
};

const artistsClick = (id, index) => {
  router.push({
    name: 'pcArtists',
    params: { id: id[index].id },
  });
};

const albumClick = ({ id }) => {
  router.push({
    name: 'pcAlbum',
    params: { id },
  });
};

const palyAll = () => {
  let list = [];
  props.tableData.forEach(item => {
    list.push(item.id);
  });
  store.commit(VUEX_MUTATION.UPDATE_LIST, list);
  router.push({ name: 'pcPlay', params: { id: list[0] } });
};
</script>

<style>
.container {
  width: 1200px;
  margin: 0 auto;
  margin-top: 20px;
}

.item {
  cursor: pointer;
}
</style>
