<template>
  <div>
    <params-form ref="form" :params="params"></params-form>
    <el-row style="margin-top: 10px">
      <el-button type="primary" @click="saveConfig">SaveConfig</el-button>
    </el-row>
  </div>
</template>
<script>
import ParamsForm from "@/components/ParamsForm";
import configAPI from '@/api/config';
export default {
  components: {ParamsForm},
  created() {
    configAPI.getSysConfig().then(data=>{
      const {config,params} = data;
      params.forEach(e=>{
        if(config[e.name])e.value=config[e.name];
        console.log(config[e.name]);
      });
      console.log(config)
      this.params = params.sort((a, b) => b.level-a.level);
    });
  },
  data() {
    return {
      params:[]
    };
  },
  methods:{
    saveConfig(){
      configAPI.setSysConfig(this.$refs.form.config).then(()=>{
        this.$message({
        message: 'Save successfully',
        type: 'success',
        duration: 1500
      })});
    }
  }
}
</script>
<style>
.box-card{
  margin-top: 10px;
}
.form-star:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
</style>>