<template>
  <div>
    <params-form ref="form" :params="params"></params-form>
    <el-row style="margin-top: 10px">
      <el-button type="primary" @click="addOneDrive()">Save</el-button>
      <el-button type="danger" @click="removeOneDrive()">Delete</el-button>
      <el-button  @click="$router.push({name:'DriveList'})">Cancel</el-button>
    </el-row>
  </div>
</template>
<script>
import ParamsForm from "@/components/ParamsForm";
import configAPI from '@/api/config';
export default {
  components: {ParamsForm},
  created() {
    configAPI.getDrive(this.$route.query.path).then(data=>{
      const {drive,params,path} = data;
      params.sort((a, b) => b.level-a.level);
      params.forEach(e=>{if(drive[e.name])e.value=drive[e.name]});
      const c =params.find(e=>e.name==='x_path');
      this.$set(c,'value',path);
      this.$set(c,'hidden',true);
      this.params=params;
    });
  },
  data() {
    return {
      params:[]
    };
  },
  methods:{
    addOneDrive(){
      const o = JSON.parse(JSON.stringify(this.$refs.form.config));
      o.module = this.$route.query.module;
      configAPI.addDrive(o).then(()=>{
        this.$message({
          message: 'Update drive successfully',
          type: 'success',
          duration: 1500
        })
        this.$router.push({name:'DriveList'})
      });
    },
    removeOneDrive(){
      configAPI.removeDrive( this.$route.query.path).then(()=>{
        this.$message({
          message: 'Delete drive successfully',
          type: 'success',
          duration: 1500
        })
        this.$router.push({name:'DriveList'})
      });
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