<template>
  <div>
    <h3>#基本设置</h3>
    <ParamsForm :params="params" :values="values"></ParamsForm>
    <el-card class="mt-3">
      <p v-if="version0===1">似乎是首次加载，你需要完成基本配置才能继续</p>
      <div>
        <el-button size="small" type="primary" @click="saveBasicConfig" :disabled="version0===1 && version!==1">保存配置</el-button>
        <el-button size="small" type="danger" @click="reloadLocal" :disabled="version0===1 && version===1">重置本地</el-button>
        <span v-show="mode.tips" class="ml-3">tips: 当本地版本号高于服务器版本号时，点这里重置~</span>
      </div>
    </el-card>
  </div>
</template>
<script>
import ParamsForm from "@/components/ParamsForm";
import {mapGetters} from 'vuex'

export default {
  components: {ParamsForm},
  created() {
    this.$store.commit('system/SET_VERSION', this.version0);
    this.$op.fetchBasicConfig().then(data => {
      const {basic, params, version} = data;
      this.values = basic;
      this.params = params;
      this.$store.commit('system/SET_VERSION', version)
    })
  },
  data() {
    return {
      values: {},
      params: [],
    }
  },
  computed: {
    ...mapGetters([
      'version', 'token', 'mode', 'version0'
    ])
  },
  methods: {
    saveBasicConfig() {
      this.$confirm("提交修改", '', {lockScroll: false}).then(() => {
        this.$op.saveBasicConfig(this.values, this.version).then(data => {
          const v = this.version;
          const {version, message, token} = data;
          if (this.version0 === 1) {
            this.$store.state.system.version0 = version;
            this.$store.commit('system/SET_TOKEN', token);
          }
          this.$message.success(message);
          this.$store.commit('system/SET_VERSION', version);
          if (v === 1 && v < version) {
            this.$router.push({name: 'MoreSetting'})
            this.$notify.success("安装成功，现在可以添加云盘了")
          }
        })
      })
    },
    reloadLocal() {
      this.$confirm("重置本地信息").then(() => {
        this.$store.commit('system/RESET_ALL')
        window.location.reload();
      })
    }
  }
}
</script>