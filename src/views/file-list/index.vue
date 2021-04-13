<template>
  <div>
    <file-preview :list-data="listData"></file-preview>
    <el-breadcrumb separator="/" class="mt-3 p-3" style="border-radius: 4px;background-color: rgb(233,233,233);">
      <el-breadcrumb-item v-for="e in breadPaths" :key="e.label">
        <el-button type="text" @click="cd(e.to)" style="padding: 0">{{ e.label }}</el-button>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-input v-model="search" :placeholder="'过滤...（当前共有 '+listData.list.length+' 个项目）'" class="mt-3"></el-input>
    <el-table
        :data="listFilter"
        class="op-l-table mt-3"
        style="border-radius: 4px;border: 1px solid #DCDFE6;"
    >
      <el-table-column
          label="name"
          property="name"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="cd(scope.row)" style="padding: 0" :title="scope.row.name">
            <svg-icon :icon-class="getIconClass(scope.row)"
                      :class-name="scope.row.type===WAITING?'op-i-loading':''"
                      svg-style="width: 26;height: 26px;vertical-align: -7px;"
            ></svg-icon>
            <span>{{ scope.row.name }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
          label="time"
          property="time"
          width="160"
          align="right"
          :formatter="formatDate0"
      >
      </el-table-column>
      <el-table-column
          label="size"
          property="size"
          :formatter="formatSize0"
          width="100"
          align="right"
      >
      </el-table-column>
      <el-table-column
          width="130"
          align="right"
      >
        <template v-slot:header>
          <ul>
            <li>
              <el-button type="text" @click="fMkdir"><i class="el-icon-folder-add"></i></el-button>
            </li>
            <li>
              <el-button type="text" @click="$store.commit('fileList/SHOW_TOUCH')"><i class="el-icon-document-add"></i>
              </el-button>
            </li>
            <li>
              <el-button type="text" @click="$store.getters.fileListUpload.visible=true"><i class="el-icon-upload2"></i>
              </el-button>
            </li>
            <li>
              <el-button type="text" :disabled="!pasteData.row || !pasteData.path" @click="pasteData.visible=true"><i
                  class="el-icon-document-copy"></i>
              </el-button>
            </li>
            <li>
              <el-button type="text" @click="refreshList" :disabled="listData.$s===WAITING"
                         :style="{color:listData.$s===DIRTY?'red':''}"><i
                  class="el-icon-refresh-right"></i></el-button>
            </li>
          </ul>
        </template>
        <ul slot-scope="scope">
          <li>
            <el-button type="text" @click="fRename(scope.row)" :disabled="scope.row.type<0"><i class="el-icon-edit"></i>
            </el-button>
          </li>
          <li>
            <el-button type="text" @click="(pasteData.path=path) && (pasteData.row=scope.row)"
                       :disabled="scope.row.type<0 ||  (pasteData.path===path && pasteData.row===scope.row)">
              <i class="el-icon-document-copy"></i>
            </el-button>
          </li>
          <li>
            <el-button type="text" @click="fRemove(scope.row)" :disabled="scope.row.type<0"
            ><i class="el-icon-delete"></i></el-button>
          </li>
        </ul>
      </el-table-column>
      <infinite-loading
          v-if="listData.nextToken"
          spinner="waveDots"
          slot="append"
          @infinite="infiniteHandler"
          force-use-infinite-wrapper1=".el-table__body-wrapper">
      </infinite-loading>
    </el-table>
    <div v-if="mode.readme" class="markdown-body mt-3 p-3"
         style="border-radius: 4px;border: 1px solid rgb(220, 223, 230);"
         v-html="readme"></div>
    <div style="position: fixed;right: 0;bottom: 0" class="mr-3 mb-5">
      <div class="op-s-icon my-3" @click="handleClipboard($store.getters.baseURL + path,$event)">
        <svg-icon icon-class="content-paste" style="pointer-events: none"></svg-icon>
      </div>
      <div class="op-s-icon my-3" @click="modeVisible=true">
        <i class="el-icon-setting"></i>
      </div>
    </div>
    <file-touch @touch="fTouch"></file-touch>
    <file-uploader ref="fileUploader"></file-uploader>
    <el-dialog :visible.sync="pasteData.visible" :title="pasteData.row?pasteData.path + pasteData.row.name:''" center>
      <div style="text-align: center;margin-top: -20px">
        <el-button size="small" @click="fMvCp(1)">移动</el-button>
        <el-button size="small" @click="fMvCp(2)">复制</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="modeVisible" title="喜好设置">
      <div>
        <label> 多图预览: </label>
        <el-switch v-model="mode.image"></el-switch>
        <label> 音乐模式: </label>
        <el-switch v-model="mode.music"></el-switch>
        <label> 脚标显示: </label>
        <el-switch v-model="mode.footer"></el-switch>
        <label> Readme: </label>
        <el-switch v-model="mode.readme"></el-switch>
        <label> Tips: </label>
        <el-switch v-model="mode.tips"></el-switch>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small" @click="$store.commit('system/SAVE_MODE')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {formatDate, formatSize} from '@/utils/formatter';
import FileUploader from "./components/file-uploader";
import FileTouch from "./components/file-touch";
import {mapGetters} from 'vuex';
import clipboard from "@/utils/clipboard";
import FilePreview from "@/views/file-list/components/file-preview";
import marked from 'marked'
import axios from "axios";

import 'github-markdown-css/github-markdown.css'
import {deepClone} from "@/utils";

const OK = -1;
const WAITING = -2;
const DIRTY = -3;

export default {
  components: {FilePreview, FileTouch, FileUploader},
  data() {
    return {
      cache: this.$store.getters.fileListCache,
      search: '',
      OK, WAITING, DIRTY,
      pasteData: {
        visible: false,
        row: null,
        path: null,
      },
      modeVisible: false
    }
  },

  created() {
    const path = this.$route.params.pathMatch || '/';
    if (!path.startsWith('/')) {
      this.$router.push({name: 'FileList', params: {pathMatch: '/'}, replaced: true});
    } else {
      if (path !== '/') this.$store.commit('fileList/SET_PATH', path)
      console.log('created:' + path)
    }
  },

  methods: {
    cd(row) {
      console.log(row);
      if (typeof row === 'string') {
        this.$store.commit('fileList/SET_PATH', row)
      } else if (row.type === 1 || row.type === 3) {
        this.$store.commit('fileList/SET_PATH', this.path + row.name + '/')
      } else if (row.type === 0) {
        this.$store.commit('fileList/SHOW_PREVIEW', row)
      }
    },
    formatDate0(row) {
      return formatDate(row.time);
    },
    formatSize0(row) {
      return formatSize(row.size);
    },
    infiniteHandler($state) {
      const next = this.listData.nextToken;
      if (next) {
        const path = this.path;
        this.$op.ls(path, next).then(data => {
          const {list, nextToken} = data;
          const old = this.cache[path];
          if (next === old.nextToken && old.list) {
            old.nextToken = nextToken;
            old.list = old.list.concat(list);
          }
          $state.loaded();
        }).catch(() => {
          $state.error();
        })
      } else {
        $state.complete();
      }
    },
    getIconClass(row) {
      if (row.type === DIRTY) return 'alert-circle-outline';
      else if (row.type === WAITING) return 'spinner';
      else if (row.type === 0) return 'file';
      else if (row.type === 1) return 'folder';
      else if (row.type === 3) return 'folder-google-drive';
      return '';
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    },

    fetchList(c, p) {
      if (c[p].$s === WAITING) {
        this.$message.warning("waiting for the last request");
        return;
      }
      c[p] = {
        list: [{
          name: 'Loading...',
          mime: "",
          size: null,
          time: null,
          type: WAITING
        }],
        $s: WAITING
      }
      this.$op.ls(p).then(data => {
        const {list, nextToken} = data;
        c[p].list = list;
        c[p].nextToken = nextToken
        c[p].$s = OK
      }).catch(err => {
        c[p].list = [{
          name: err.message,
          mime: "",
          size: null,
          time: null,
          type: DIRTY
        }];
        c[p].$s = DIRTY
      })
    },

    refreshList() {
      this.fetchList(this.cache, this.path)
      this.pasteData.path = null;
      this.pasteData.row = null;
    },

    fOpt({path, row, msg}, f, resolve, reject) {
      let oldType;
      const listData = this.cache[path];
      listData.$s = WAITING;
      if (msg) console.info(msg);
      if (row) {
        oldType = row.type;
        row.type = WAITING;
      }
      f().then(data => {
        if (row) row.type = oldType;
        listData.$s = OK;
        if (resolve) resolve(data);
        if (msg) this.$notify.success(msg);
      }).catch(err => {
        console.debug(err);
        if (row) row.type = DIRTY;
        listData.$s = DIRTY;
        if (reject) reject();
      });
    },

    fMkdir() {
      const path = this.path;
      const l = this.cache[path];
      this.$prompt('请输入文件夹名', '', {
        inputPattern: /^[^\\/]+$/,
        inputErrorMessage: '文件夹名不合法'
      }).then(({value}) => {
        const row = {
          name: value,
          mime: "",
          size: null,
          time: null,
          type: 1
        };
        const msg = 'mkdir ' + path + value;
        this.fOpt({path, row, msg}, async () => this.$op.mkdir(path, value), () => l.list.unshift(row));
      })
    },
    fTouch() {
      const path = this.path;
      const l = this.cache[path];
      const name = this.touchData.name || 'new-file.' + Date.now() + '.txt';
      const content = this.touchData.content;
      const row = {
        name: name,
        mime: "",
        size: null,
        time: null,
        type: 0
      };
      this.$confirm('新建文件: ' + name).then(() => {
        this.touchData.visible = false;
        const msg = 'touch ' + path + ' ' + name;
        this.fOpt({
              path,
              row,
              msg
            }, async () => this.$op.touch(this.path, name, content),
            () => (this.touchData.name = this.touchData.content = '') || l.list.unshift(row));
      })
    },
    fRename(row) {
      const path = this.path;
      this.$prompt('请输入新文件名(原:' + row.name + ")", '', {
        inputPattern: /^[^\\/]+$/,
        inputErrorMessage: '文件名不合法'
      }).then(({value: name}) => {
        const msg = 'ren ' + path + ' ' + name;
        this.fOpt({path, row, msg}, async () => this.$op.ren(path + row.name, name), () => row.name = name);
      });
    },
    fMvCp(type) {
      const row = this.pasteData.row;
      const sPath = this.pasteData.path;
      const path = this.path;
      if (!row || !sPath) return;
      this.$confirm((type === 1 ? '移动到: ' : '复制到: ') + path).then(() => {
        this.pasteData.visible = false;
        const msg = (type === 1 ? 'mv ' : 'cp ') + sPath + row.name + " " + path;
        this.fOpt({path, row, msg}, async () => this.$op[type === 1 ? 'mv' : 'cp'](sPath + row.name, path), () => {
          if (type === 1) this.cache[sPath].list = this.cache[sPath].list.filter(e => e !== row);
          this.cache[path].list.unshift(deepClone(row));
        });//源路径 目的路径，源路径只锁row，不必锁整个list
      })
    },
    fRemove(row) {
      const path = this.path + row.name;
      const l = this.cache[this.path];
      this.$confirm('删除:' + row.name, '', {
        type: 'warning'
      }).then(() => {
        const msg = 'rm ' + path;
        this.fOpt({
          path: this.path,
          row,
          msg
        }, async () => this.$op.rm(path), () => l.list = l.list.filter(e => e !== row));
      });
    },

    loadReadme(c, p, e) {
      this.$set(c[p], 'readme', '加载中。。。');
      axios.get(e.url || (this.pathPrefix + 'README.md'), {responseType: 'text'}).then(res => {
        c[p].readme = marked(res.request.responseText);
      }).catch((err) => {
        c[p].readme = '加载失败:' + err.message;
      });
    }
  },
  computed: {
    ...mapGetters(["path", "pathPrefix", "previewData", "publicData", "mode", "touchData"]),
    listData() {
      const c = this.cache;
      const p = this.path;
      if (c[p] === undefined || c[p].$s === null) {
        this.$set(c, p, {list: [{name: 'init...', mime: "", size: null, time: null, type: DIRTY}], $s: OK});
        this.fetchList(c, p);
      }
      return c[p];
    },
    breadPaths() {
      const arr = [{label: 'Home', to: '/'}];
      this.path.split('/').filter(e => e).reduce((s, e) => {
        s += e + '/'
        arr.push({label: e, to: s});
        return s;
      }, '/');
      return arr;
    },
    listFilter() {
      const s = this.search;
      return this.listData.list.filter(e => e.type === DIRTY || e.name.includes(s));
    },
    readme() {
      if (!this.mode.readme) return '';
      const p = this.path;
      const l = this.cache[p];
      if (l.readme) return l.readme;
      let e = l.list.find(e => e.name === 'README.md')
      if (e) {
        this.loadReadme(this.cache, p, e)
        return l.readme;
      }
      const r1 = (this.publicData.drives || []).find(e => p.startsWith(e.path));
      return r1 && r1.readme || (this.publicData.site || {}).readme || 'readme!';
    }
  }
}
</script>
<style>

.op-l-table::before {
  display: none;
}

.op-l-table::after {
  display: none;
}

.op-l-table table:last-child tr:last-child td {
  border-bottom: unset;
}

.op-l-table th {
  padding: 5px 0;
}

.op-l-table td {
  padding: 3px 0;
}

.op-l-table colgroup col:nth-child(5) {
  display: none;
}

@media only screen and (max-width: 991px) {
  .op-l-table tr th:nth-child(2),
  .op-l-table tr td:nth-child(2),
  .op-l-table colgroup col:nth-child(2) {
    display: none;
  }

  .op-l-table colgroup col:nth-child(1) {
    width: auto;
  }
}

@media only screen and (max-width: 767px) {
  .op-l-table tr th:nth-child(3),
  .op-l-table tr td:nth-child(3),
  .op-l-table colgroup col:nth-child(3) {
    display: none;
  }
}

.op-l-table ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.op-l-table ul li {
  display: inline-block;
  margin-right: 5px;
}

.op-i-loading {
  animation: rotating 2s linear infinite;
}

.op-c-warning {
  color: #E6A23C;
}

.op-l-danger {
  color: #F56C6C;
}
</style>