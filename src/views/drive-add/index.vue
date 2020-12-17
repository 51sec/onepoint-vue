<template>
<div>
  <el-tabs v-model="activeTab">
    <el-tab-pane v-for="e in c_modules" :name="e" :key="e" :label="e"></el-tab-pane>
  </el-tabs>
  <params-form ref="form" :params="params"></params-form>
  <el-row style="margin-top: 10px">
    <el-button type="primary" @click="addOneDrive()">SaveConfig</el-button>
  </el-row>
</div>
</template>
<script>
import ParamsForm from "@/components/ParamsForm";
import configAPI from '@/api/config';
export default {
  components: {ParamsForm},
  created() {
    configAPI.getDrivesParams().then(data=>{
      const {modules,params} = data;
      this.c_modules = modules;
      this.activeTab = modules[0];
      Object.values(params).forEach(e=>e.sort((a, b) => b.level-a.level));
      this.c_params = params;
    });
  },
  data() {
    return {
      config:{
        drive_map:{}
      },
      c_modules:[],
      c_params:{},
      activeTab:'',
    };
  },
  methods:{
    addOneDrive(){
      const o = JSON.parse(JSON.stringify(this.$refs.form.config));
      o.module = this.activeTab;
      configAPI.addDrive(o).then(()=>{
        this.$message({
          message: 'Add drive successfully',
          type: 'success',
          duration: 1500
        })
        this.$router.push({name:'DriveList'})
      });
    }
  },
  computed: {
    params(){
      return this.c_params[this.activeTab] || [];
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
</style>