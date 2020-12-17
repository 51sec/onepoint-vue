<template>
  <div>
    <el-table
        :data="drives"
        border
        style="width: 100%">
      <el-table-column v-for="a in attributes" :key="a" :prop="a" :label="a"></el-table-column>
      <el-table-column label="#edit" width="100">
        <template slot-scope="scope">
          <el-button @click="editDrive(scope.row.path,scope.row.module)" type="text" size="small"><i class="el-icon-edit"></i>编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import configAPI from '@/api/config';
export default {
  created() {
    configAPI.getDrives().then(data=>{
      const {attributes,drives}=data;
      this.drives = drives;
      this.attributes=attributes;
    });
  },
  data() {
    return {
      drives:[],
      attributes:[]
    }

  },
  methods:{
    editDrive(path,module){
      this.$router.push({name:'DriveEdit',query:{path,module}});
    }
  }
}
</script>