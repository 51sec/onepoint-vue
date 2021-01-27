<template>
  <div>
    <el-table
        :data="drives"
        stripe
        border
        style="width: 100%">
      <el-table-column v-for="a in attributes" :key="a" :prop="a" :label="a"></el-table-column>
      <el-table-column label="#edit">
        <template slot-scope="scope">
          <el-button @click="editDrive(scope.row.path)" type="text" size="small"><i class="el-icon-edit"></i>
          </el-button>
          <el-button @click="configDrive(scope.row.path)" type="text" size="small"><i class="el-icon-setting"></i>
          </el-button>
          <el-button @click="deleteDrive(scope.row.path)" type="text" size="small"><i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import configAPI from '@/api/config';

export default {
  created() {
    configAPI.getDrives().then(data => {
      const {attributes, drives} = data;
      this.drives = drives;
      this.attributes = attributes;
    });
  },
  data() {
    return {
      drives: [],
      attributes: []
    }

  },
  methods: {
    editDrive(path) {
      this.$router.push({name: 'DriveEdit', query: {path}});
    },
    configDrive(path) {
      this.$router.push({name: 'DriveConfig', query: {path}});
    },
    deleteDrive(path) {
      this.$confirm("确认删除云盘:" + path).then(() => {
        configAPI.removeDrive(path).then(() => {
          this.$message({
            message: "删除云盘:" + path,
            type: 'success',
            duration: 1500
          })
          this.drives = this.drives.filter(e => e.path !== path);
        });
      });
    }
  }
}
</script>