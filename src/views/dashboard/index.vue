<template>
  <div>
    <div>
      <h3>#Time</h3>
      <p class="el-alert el-alert--success is-light mt-3">启动时间: {{ formatDate(system.runtime.time_start) }}</p>
      <p class="el-alert el-alert--success is-light mt-3">最近读取时间: {{ formatDate(system.runtime.time_read) }}</p>
      <p class="el-alert el-alert--success is-light mt-3">最近保存时间: {{ formatDate(system.runtime.time_save) }}</p>
    </div>
    <h3>#RunTime</h3>
    <div class="el-alert el-alert--info is-light mt-3">
      <pre><code>{{ JSON.stringify(system, null, 2) }}</code></pre>
    </div>
    <h3>#Configuration</h3>
    <div class="el-alert el-alert--info is-light mt-3">
      <pre style="overflow-x: auto"><code>{{ JSON.stringify(config, null, 2) }}</code></pre>
    </div>
    <el-button class="my-3" @click="ask">导出配置</el-button>
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
      },
      config: null,
    }
  },
  computed: {},
  methods: {
    formatDate,
    ask() {
      this.$prompt('请输入密码', {inputType: 'password'}).then(async ({value}) => {
        this.config = await configAPI.exportConfig({password: value});
      })
    }
  }

}
</script>
