<template>
  <el-dialog
      title="新建文本"
      :visible.sync="touchData.visible"
      width="80%">
    <p>文件名</p>
    <el-input
        placeholder="请输入内容"
        v-model="touchData.name">
    </el-input>
    <p>文件内容</p>
    <el-input
        type="textarea"
        :rows="12"
        placeholder="请输入内容"
        v-model="touchData.content">
    </el-input>
    <span slot="footer" class="dialog-footer">
    <el-button @click="touchData.visible = false">取 消</el-button>
    <el-button type="primary" @click="touch">确 定</el-button>
  </span>
  </el-dialog>
</template>
<script>
import fileAPI from "@/api/file-cmd";
export default {
  data(){
    return{
      touchData:this.$store.getters.fileListTouch
    }
  },
  methods:{
    touch(){
      const path = this.$store.getters.path;
      this.$store.commit('fileList/CACHE_DIRTY',{path,dirty:-1});
      const name = this.touchData.name;
      console.log('touch '+name)
      fileAPI.touch(path,name,this.touchData.content).then(()=>{
        this.$store.commit('fileList/CACHE_DIRTY',{path,dirty:null});
        this.$store.commit('fileList/CACHE_APPEND',{path,row:{type:0,name,time:Date.now(),size:null,mime:'?'}})
        this.$notify.success('mkdir '+path+' '+name)
      }).catch(()=>{
        this.$store.commit('fileList/CACHE_DIRTY',{path,dirty:-2});
      })
      this.touchData.visible=false;
    }
  }
}
</script>