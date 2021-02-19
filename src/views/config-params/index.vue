<template>
  <div>
    <h2>{{ config.title }}</h2>
    <p v-html="config.desc"></p>
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
          title: '配置云盘',
          desc:'这里是云盘使用的模块独有的配置信息，通常你需要完成这里的配置后才能正常访问云盘',
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
          title: '添加云盘',
          desc:'在这里，可以添加一个新的云盘',
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
              this.$router.push({name: 'DriveConfig', query: {path: this.$refs.form.config.path}});
            });
          }
        },
        'edit': {
          title: '编辑云盘',
          desc:'这里是云盘共有的配置项，你可以在这里配置云盘的基本信息，包括但不限于云盘使用的模块、访问密码、readme等等',
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
          title: "基本设置",
          desc:'这里是系统的基本配置项，你必须在完成第一次配置后才能离开这里',
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
              this.$store.commit('system/SET_FLAG', 'ok')
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