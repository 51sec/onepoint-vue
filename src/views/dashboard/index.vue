<template>
  <div>
    <div>
      <p class="el-alert el-alert--success is-light mt-3">启动时间: {{ formatDate(system.runtime.time_start) }}</p>
      <p class="el-alert el-alert--success is-light mt-3">最近读取时间: {{ formatDate(system.runtime.time_read) }}</p>
      <p class="el-alert el-alert--success is-light mt-3">最近保存时间: {{ formatDate(system.runtime.time_save) }}</p>
    </div>
    <div class="el-alert el-alert--info is-light mt-3">
      <pre><code>{{ JSON.stringify(system, null, 2) }}</code></pre>
    </div>
  </div>
</template>

<script>
import configAPI from "@/api/config";
import {formatDate} from '@/utils/formatter';

export default {

  created() {
    configAPI.runTimeInfo().then((data) => {
      this.system = data;
    });
  },

  data() {
    return {
      system: {
        runtime: {
          time_start: 0,
          time_read: 0,
          time_save: null,
          error_read: null,
          error_write: null
        }
      }
    }
  },
  computed: {},
  methods: {
    formatDate
  }

}
</script>
