<template>
  <div>
    <h3>#基本设置</h3>
    <p v-if="version===1">似乎是首次加载，你需要完成基本配置才能继续</p>
    <ParamsForm :params="params" :values="values"></ParamsForm>
    <div style="position: fixed;right: 0;bottom: 0" class="mr-3 mb-5">
      <div class="op-s-icon my-3" @click="saveBasicConfig">
        <i class="el-icon-upload"></i>
      </div>
    </div>
  </div>
</template>
<script>
import ParamsForm from "@/components/ParamsForm";
import {mapGetters} from 'vuex'

export default {
  components: {ParamsForm},
  created() {
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
      'version'
    ])
  },
  methods: {
    saveBasicConfig() {
      this.$confirm("提交修改", '', {lockScroll: false}).then(() => {
        this.$op.saveBasicConfig(this.values, this.version).then(data => {
          const v = this.version;
          const {version, message} = data;
          this.$message.success(message);
          this.$store.commit('system/SET_VERSION', version);
          if (v === 1 && v < version) {
            this.$router.push({name: 'MoreSetting'})
            this.$notify.success("安装成功，现在可以添加云盘了")
          }
        })
      })
    }
  }
}
</script>