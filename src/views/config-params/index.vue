<template>
  <div>
    <h2>{{ config.title }}</h2>
    <params-form ref="form" :params="params"></params-form>
    <div class="my-3">
      <el-button type="primary" @click="config.submit()">确 认</el-button>
      <el-button @click="$router.back()">取 消</el-button>
    </div>
  </div>
</template>
<script>
import ParamsForm from "@/components/ParamsForm";
import configAPI from '@/api/config';

export default {
  components: {ParamsForm},
  created() {
    this.config.created();
  },
  data() {
    return {
      select: {
        'config': {
          title: 'drive-config',
          created: () => {
            configAPI.getDriveConfig(this.path).then(data => {
              const {config, params} = data;
              params.forEach(e => {
                if (config[e.name]) e.value = config[e.name]
              });
              this.params = params;
            })
          },
          submit: () => {
            configAPI.setDriveConfig(this.path, this.$refs.form.config).then(() => {
              this.$message({
                message: '设置成功',
                type: 'success',
                duration: 1500
              })
              this.$router.push({name: 'DriveList'})
            });
          }
        },
        'add': {
          title: 'drive-add',
          created: () => {
            configAPI.getDrive().then(data => {
              this.params = data.params;
            })
          },
          submit: () => {
            configAPI.addDrive(this.$refs.form.config).then(() => {
              this.$message({
                message: '添加成功,即将进入云盘配置页面',
                type: 'success',
                duration: 1500
              })
              this.$router.push({name: 'DriveConfig', query: this.$route.meta.path});
            });
          }
        },
        'edit': {
          title: 'drive-edit',
          created: () => {
            configAPI.getDrive(this.path).then(({drive, params}) => {
              params.forEach(e => {
                if (drive[e.name]) e.value = drive[e.name]
              });
              this.$set(params.find(e => e.name === 'path') || {}, 'hidden', true);
              this.params = params;
            })
          },
          submit: () => {
            configAPI.addDrive(this.$refs.form.config).then(() => {
              this.$message({
                message: '设置成功',
                type: 'success',
                duration: 1500
              })
              this.$router.push({name: 'DriveList'})
            });
          }
        },
        'base': {
          title: "base-setting",
          created: () => {
            configAPI.getSysConfig().then(data => {
              const {config, params} = data;
              params.forEach(e => {
                if (config[e.name]) e.value = config[e.name]
              });
              this.params = params;
            })
          },
          submit: () => {
            configAPI.setSysConfig(this.$refs.form.config).then(() => {
              this.$message({
                message: '设置成功',
                type: 'success',
                duration: 1500
              })
              this.$router.push({name: 'Dashboard'})
            });
          }
        },
        default: {
          title: 'page-error',
          created: () => {
          }
        }
      },
      params: []
    };
  },
  computed: {
    config() {
      return this.select[this.$route.meta.type] || this.select.default
    },
    path() {
      return this.$route.query.path;
    }
  }
}
</script>