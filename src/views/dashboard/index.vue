<template>
  <div>
    <div>
      <h3>#Server</h3>
      <el-card>
        <p>启动时间: {{ formatDate(system.runtime.time_start) }}</p>
        <p>服务器配置版本: {{ formatDate(system.version) }}</p>
        <p>最近读取配置时间: {{ formatDate(system.runtime.time_read) }}</p>
        <p>最近写入配置时间: {{ formatDate(system.runtime.time_save) }}</p>
        <p>服务器响应时间: {{ responseTime }} s</p>
        <div class="el-alert el-alert--info is-light mt-3">
          <pre><code>{{ JSON.stringify(system, null, 2) }}</code></pre>
        </div>
        <div class="mt-3">
          <el-button size="small" @click="loadRuntime" type="primary" :disabled="isLoadBusy">刷新</el-button>
          <el-button size="small" @click="reload" type="danger" :disabled="isReloadBusy">重载</el-button>
          <span v-show="mode.tips" class="ml-3" style="color: red">tips: 当服务器出现配置异常情况，可点击这里重新加载配置~</span>
        </div>
      </el-card>
    </div>
    <h3>#Local</h3>
    <el-card>
      <p>当前用户名: {{ token ? (token.slice(0, token.indexOf('.'))) : '?' }}</p>
      <p>本地配置版本: {{ formatDate(version) }}</p>
      <p>API 前缀: {{ baseAPIURL }}</p>
      <div class="mt-3">
        <el-button size="small" @click="reloadLocal">重置本地</el-button>
        <span v-show="mode.tips" class="ml-3">tips: 当本地版本号高于服务器版本号时，点这里重置~</span>
      </div>
    </el-card>
    <div v-if="mode.tips && publicData.tips && publicData.tips.length>0">
      <h3>#Tips</h3>
      <el-card>
        <div v-for="a in publicData.tips" :key="a.title">
          <h4>{{ a.title }}</h4>
          <p>{{ a.desc }}</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {formatDate} from '@/utils/formatter';
import {mapGetters} from "vuex";

export default {

  created() {
    this.loadRuntime();
  },

  data() {
    return {
      isLoadBusy: false,
      isReloadBusy: false,
      responseTime: 0,
      system: {
        runtime: {
          time_start: 0,
          time_read: 0,
          time_save: null,
          error_read: null,
          error_write: null
        },
        version: 0,
      }
    }
  },
  computed: {
    ...mapGetters(['version', 'baseAPIURL', 'token', 'mode', 'publicData'])
  },
  methods: {
    formatDate,
    loadRuntime() {
      if (this.isLoadBusy) return;
      this.isLoadBusy = true;
      const s = Date.now();
      this.$op.runTimeInfo().then(data => {
        this.system = data;
        this.isLoadBusy = false
        this.responseTime = (Date.now() - s) / 1000;
      }).catch(() => {
        this.isLoadBusy = false
        this.responseTime = -1
      })
    },
    reload() {
      this.$confirm("确认让服务器重新加载配置", {type: "warning"}).then(() => {
        if (this.isReloadBusy) return;
        this.isReloadBusy = true;
        this.$op.reloadConfig().then(data => {
          const {message} = data;
          this.$message.success(message);
          this.isReloadBusy = false;
        }).catch(() => {
          this.isReloadBusy = false;
        })
      })
    },
    reloadLocal() {
      this.$confirm("重置本地信息").then(() => {
        this.$store.commit('system/RESET_ALL')
        return this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })
    }
  }
}
</script>
