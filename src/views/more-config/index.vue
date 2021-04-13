<template>
  <div>
    <h3>#云盘配置</h3>
    <el-card>
      <el-table
          :data="Object.entries(drives)"
          stripe
      >
        <el-table-column type="index" width="50"/>
        <el-table-column prop="0" label="挂载路径">
          <template slot-scope="scope">
            <p :style="scope.row[1]?{}:{'text-decoration': 'line-through',color: 'red'}">{{ scope.row[0] }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="1" label="模块类型">
          <template slot-scope="scope">
            {{ scope.row[1] && scope.row[1].module }}
          </template>
        </el-table-column>
        <el-table-column label="#编辑">
          <template slot-scope="scope">
            <el-button @click="showDialog(scope.row,0)" type="text" size="small" :disabled="!scope.row[1]"><i
                class="el-icon-edit"></i>
            </el-button>
            <el-button @click="showDialog(scope.row,1)" type="text" size="small"
                       :disabled="!(scope.row[1] && scope.row[1].module)"><i class="el-icon-setting"></i>
            </el-button>
            <el-button @click="deleteDrive(scope.row[0])" type="text" size="small" :disabled="!scope.row[1]"><i
                class="el-icon-delete"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-3">
        <el-button size="small" @click="showDialog([],-1)"><i class="el-icon-plus"></i>添加</el-button>
        <el-button size="small" :disabled="isLoadingDrive" @click="loadDrives"><i
            :class="isLoadingDrive?'el-icon-loading':'el-icon-download'"></i>重载
        </el-button>
        <el-button size="small" type="primary" :disabled="isSavingDrive" @click="saveDrives"><i
            :class="isSavingDrive?'el-icon-loading':'el-icon-upload2'"></i>保存
        </el-button>
        <span v-show="mode.tips" class="ml-3">tips: 修改之后记得点击保存~ 不然信息会丢失</span>
      </div>
    </el-card>
    <el-dialog
        :visible.sync="driveDialog.visible"
        width="80%"
        :before-close="driveDialogClose"
        ref="drive-dialog"
    >
      <span slot="title"><i class="el-icon-map-location"></i> {{ driveDialog.title }}</span>
      <params-form :params="driveDialog.params" :values="driveDialog.values"
                   style="margin-top: -30px;"></params-form>
      <span slot="footer">
        <el-button type="primary" @click="driveDialog.ok">确定</el-button>
      </span>
    </el-dialog>

    <h3>#密码设置</h3>
    <el-button @click="updatePassword">修改密码</el-button>
    <span v-show="mode.tips" class="ml-3">tips: 点击这里，快速修改密码~</span>
    <h3>#详细设置</h3>
    <el-card>
      <h3 v-if="!setting">未加载配置</h3>
      <codemirror v-else v-model="setting" :options="options" style="margin: -20px -20px 0 -20px;"></codemirror>
      <div class="mt-3">
        <el-button size="small" @click="setting=''" :disabled="!setting"><i class="el-icon-close"></i>隐藏</el-button>
        <el-button size="small" @click="exportConfig"><i class="el-icon-download"></i>加载</el-button>
        <el-button size="small" @click="importConfig" :disabled="!setting" type="primary"><i
            class="el-icon-upload2"></i>提交
        </el-button>
        <span v-show="mode.tips" class="ml-3" style="color: red">tips: 此项用于快速导入导出配置 和上面的操作是等效的~</span>
      </div>
    </el-card>
  </div>
</template>
<script>

import ParamsForm from "@/components/ParamsForm";
import {mapGetters} from "vuex";

import {codemirror} from 'vue-codemirror-lite'

import 'codemirror/theme/solarized.css'

// mode
import 'codemirror/mode/javascript/javascript.js'

// active-line.js
import 'codemirror/addon/selection/active-line.js'

// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/indent-fold.js'

import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'

export default {
  components: {
    ParamsForm, codemirror
  },
  created() {
    this.loadDrives();
  },
  data() {
    return {
      isLoadingDrive: false,
      isSavingDrive: false,

      drives: {},
      moduleParams: [],
      privateModuleParams: {},

      driveDialog: {
        visible: false,
        params: [],
        values: {},
        title: '',
        ok: () => {
        },
      },

      setting: '',
      options: {
        tabSize: 4,
        lineNumbers: true,
        mode: {name: "javascript", json: true},
        theme: 'solarized',
        line: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        styleSelectedText: true,
        lineWrapping: true,
        highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
        matchBrackets: true,
        autoCloseBrackets: true
      }
    }
  },
  methods: {
    showDialog([path, drive], type) {
      this.driveDialog.visible = true;
      this.driveDialog.buttonDisabled = false;
      this.driveDialog.ok = () => this.driveDialogClose();
      if (type === 0) {
        this.driveDialog.values = drive;
        this.driveDialog.params = this.moduleParams.filter(e => e.name !== 'path' && e.name !== 'module');
        this.driveDialog.title = path;
      } else if (type === 1) {
        this.driveDialog.values = drive.config;
        this.driveDialog.params = this.privateModuleParams[drive.module];
        this.driveDialog.title = path;
      } else {
        this.driveDialog.values = drive = {config: {}};
        this.driveDialog.params = this.moduleParams;
        this.driveDialog.title = '新增云盘 1/2';
        this.driveDialog.ok = () => {
          this.driveDialog.values = drive.config;
          this.driveDialog.params = this.privateModuleParams[drive.module];
          this.driveDialog.title = '新增云盘 2/2';
          this.driveDialog.ok = () => {
            const p = drive.path;
            delete drive.path;
            this.drives[p] = drive;
            this.driveDialogClose();
          };
          this.$nextTick(() => {
            this.$refs['drive-dialog'].$el.scrollTop = 0;
          });
        }
      }
    },
    driveDialogClose() {
      if (this.driveDialog.visible) this.driveDialog.visible = false;
      this.driveDialog.values = {};
      this.driveDialog.params = [];
    },
    deleteDrive(path) {
      this.drives[path] = null;
    },
    loadDrives() {
      this.isLoadingDrive = true;
      this.$op.fetchDrives().then(data => {
        const {drives, moduleParams, privateModuleParams, version} = data;
        this.drives = drives;
        this.moduleParams = moduleParams;
        this.privateModuleParams = privateModuleParams;
        this.$store.commit('system/SET_VERSION', version);
        this.isLoadingDrive = false;
      }).catch(() => this.isLoadingDrive = false)
    },
    saveDrives() {
      this.isSavingDrive = true;
      this.$op.saveDrives(this.drives, this.version).then(data => {
        const {message, version} = data;
        this.$message.success(message);
        this.$store.commit('system/SET_VERSION', version);
        this.isSavingDrive = false
      }).catch(() => this.isSavingDrive = false)
    },

    updatePassword() {
      this.requirePassword(value => {
        this.requirePassword(value1 => {
          this.requirePassword(value2 => {
            console.debug(value, value1, value2);
            if (!value || !value1 || !value2 || value2 !== value1) {
              this.$message.warning('输入内容不合法或两次密码不一致')
            } else {
              this.$op.updatePassword(value, value1, this.version).then(data => {
                const {version, message} = data;
                this.$message.success(message);
                this.$store.commit('system/SET_VERSION', version);
              });
            }
          }, '请再次输入新密码')
        }, '请输入新密码')
      }, '请输入旧密码');
    },

    requirePassword(callback, message = "请输入密码") {
      this.$prompt(message, {inputType: 'password'}).then(({value}) => {
        callback(value);
      });
    },

    exportConfig() {
      this.requirePassword(value => {
        this.$op.exportConfig(value).then(data => this.setting = JSON.stringify(data.config, null, 2));
      });
    },
    importConfig() {
      this.requirePassword(value => {
        let config;
        try {
          config = JSON.parse(this.setting);
        } catch (e) {
          this.$message.error("配置不合法！");
          return;
        }
        this.$op.importConfig(value, config).then(data => {
          const {version, message} = data;
          this.$message.info(message);
          this.$store.commit('system/SET_VERSION', version);
        });
      });
    }
  },
  computed: {
    ...mapGetters([
      'version',
      'mode'
    ])
  }
}
</script>
<style>
.CodeMirror {
  height: auto !important;
}

.CodeMirror-scroll {
  min-height: 300px;
  max-height: 1000px;
}
</style>