<template>
  <div>
    <el-breadcrumb separator="/" class="mt-3 p-3" style="border-radius: 4px;background-color: rgb(233, 233, 233);">
      <el-breadcrumb-item v-for="e in breadPaths" :key="e.label" :to="e.to">{{ e.label }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input v-model="search" placeholder="过滤...(字符串/正则)" class="mt-3"></el-input>

    <el-table
        :data="list"
        class="op-l-table mt-3"
        style="border-radius: 4px;border: 1px solid #DCDFE6;"
        @row-contextmenu="showMenu"
    >
      <el-table-column
          type="index"
          class-name="op-l-icon"
      >
        <template v-slot:header>
          <svg-icon
              :class-name="listData.$dirty?(listData.$dirty===-1?'op-l-refresh op-c-warning':'op-l-refresh op-l-danger'):'op-l-refresh'"
              icon-class="autorenew"
              @click="fetch()"></svg-icon>
        </template>
        <template slot-scope="scope">
          <svg-icon :icon-class="getIconClass(scope.row)"
                    :class-name="scope.row.type===-1?'op-i-loading':''"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column
          label="name"
          property="name"
          sortable
      >
        <template slot-scope="scope">
          <div @click="ch(scope.row)">{{ scope.row.name }}</div>
        </template>
      </el-table-column>
      <el-table-column
          label="time"
          property="time"
          :formatter="formatDate0"
          sortable
          class-name="hidden-sm-and-down op-l-time"
      >
      </el-table-column>
      <el-table-column
          label="size"
          property="size"
          :formatter="formatSize0"
          sortable
          class-name="hidden-xs-only op-l-size"
      >
      </el-table-column>


      <infinite-loading
          v-if="listData.nextToken"
          spinner="waveDots"
          slot="append"
          @infinite="infiniteHandler"
          force-use-infinite-wrapper1=".el-table__body-wrapper">
      </infinite-loading>
    </el-table>

    <div style="position: fixed;right: 0;bottom: 0" class="mr-3 mb-5">
      <div class="op-s-icon my-3" @click="handleClipboard($store.getters.baseURL + path,$event)">
        <svg-icon icon-class="content-paste" style="pointer-events: none"></svg-icon>
      </div>
      <el-dropdown @command="handleSideMenuCommand">
        <div class="op-s-icon">
          <svg-icon icon-class="menu"></svg-icon>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="touch">新建文本</el-dropdown-item>
          <el-dropdown-item command="mkdir">新建文件夹</el-dropdown-item>
          <el-dropdown-item command="upload-files">上传文件</el-dropdown-item>
          <el-dropdown-item command="upload">任务状态</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <file-context-menu ref="fileMenu"></file-context-menu>
    <file-touch></file-touch>
    <file-uploader ref="fileUploader"></file-uploader>
  </div>
</template>

<script>
import {formatDate, formatSize} from '@/utils/formatter';
import FileUploader from "./components/file-uploader";
import FileTouch from "./components/file-touch";
import FileContextMenu from "./components/file-context-menu";
import {mapGetters} from 'vuex';
import fileAPI from "@/api/file-cmd";
import clipboard from "@/utils/clipboard";

export default {
  components: {FileContextMenu, FileTouch, FileUploader},
  data() {
    return {
      cache: this.$store.getters.fileListCache,
      search: '',
      menuData: this.$store.getters.fileListMenu
    }
  },

  created() {
    const path = this.$route.params.pathMatch;
    if (path && path.startsWith('/')) {
      this.$store.commit('fileList/PATH_SET', path);
    } else {
      this.$router.push({name: 'FileList', params: {pathMatch: '/'}, replaced: true});
    }
    console.log('created:' + path)
  },

  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
      if (to.path !== from.path) {
        this.$store.commit('fileList/PATH_SET', to.params.pathMatch)
      }
      console.log('watch:' + to.params.pathMatch);
    },
  },

  methods: {
    ch(row) {
      console.log(row);
      if (row.type < 0) return;
      if (row.type === 0) {
      } else {
        this.$router.push({name: 'FileList', params: {pathMatch: this.path + row.name + "/"}});
      }
    },
    fetch() {
      const path = this.path || '/';
      if (this.listData.$loading) {
        this.$message({
          message: "waiting for the last response",
          type: 'warning',
          duration: 5 * 1000
        })
        return;
      }
      this.cache[path] = {$loading: true, $dirty: -1};
      fileAPI.ls(path).then(data => {
        this.cache[path] = data;
      }).catch(err => {
        this.cache[path] = err;
        this.$set(err, '$dirty', -2);
        if (err.normal) {

        }
      });
    },
    formatDate0(row) {
      return formatDate(row.time);
    },
    formatSize0(row) {
      return formatSize(row.size);
    },
    infiniteHandler($state) {
      const nextToken = this.listData.nextToken;
      if (nextToken) {
        const path = this.path;
        const old = this.cache[path];
        fileAPI.ls(path, nextToken).then((data) => {
          if (nextToken === old.nextToken && old.list) {
            old.nextToken = data.nextToken;
            old.list = old.list.concat(data.list);
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
      if (row.type === -2) return 'alert-circle-outline';
      else if (row.type === -1) return 'spinner';
      else if (row.type === 0) return 'file';
      else if (row.type === 1) return 'folder';
      else if (row.type === 3) return 'folder-google-drive';
      return '';
    },
    showMenu(row, _, event) {
      event.preventDefault();
      if (row.type < 0) return;
      this.menuData.x = event.clientX;
      this.menuData.y = event.clientY;
      this.menuData.row = row;
    },

    handleSideMenuCommand(c) {
      if (c === 'mkdir') this.$refs['fileMenu'].fMkdir();
      else if (c === 'touch') this.$store.getters.fileListTouch.visible = true;
      else if (c === 'upload-files') this.$refs['fileUploader'].upload();
      else if (c === 'upload') this.$store.getters.fileListUpload.visible = true;
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  },
  computed: {
    ...mapGetters(["path", "listData"]),
    list() {
      if (this.listData.$loading) {
        return [{name: 'Loading...', time: null, size: null, mime: '', type: -1}];
      } else if (this.listData.message) {
        return [{name: this.listData.message, time: null, size: null, mime: '', type: -2}];
      } else if (this.listData.file) {
        return [this.listData.file];
      } else if (this.listData.list) {
        const list = this.listData.list;
        if (this.search) {
          const r = this.search;
          if (r.startsWith('/')) {
            if (r.length > 1) {
              const last = r.lastIndexOf('/');
              const reg = last === 0 ? new RegExp(r.slice(1)) : new RegExp(r.slice(1, last), r.slice(last + 1));
              return list.filter(e => reg.test(e.name));
            }
          } else {
            return list.filter(e => e.name.includes(r));
          }
        }
        return list;
      } else {
        this.fetch();
        return [{name: 'Loading...', time: null, size: null, mime: '', type: -1}];
      }
    },
    breadPaths() {
      const arr = [{label: 'Home', to: {name: 'FileList', params: {pathMatch: '/'}}}];
      this.path.split('/').filter(e => e).reduce((s, e) => {
        s += e + '/'
        arr.push({label: e, to: {name: 'FileList', params: {pathMatch: s}}});
        return s;
      }, '/');
      return arr;
    }
  }
}
</script>
<style>

.op-l-table colgroup {
  display: none;
}

.op-l-table::before {
  display: none;
}

.op-l-table::after {
  display: none;
}

.op-l-table table:last-child tr:last-child td {
  border-bottom: unset;
}

.op-l-icon {
  width: 40px;
  position: relative;
}

.op-l-icon .svg-icon {
  position: absolute;
  width: 28px !important;
  height: 28px !important;
  top: 5px;
  left: 10px;
  cursor: pointer;
}

.op-l-refresh.svg-icon {
  position: unset;
  height: 20px !important;;
}

.op-l-time {
  width: 220px;
}

.op-l-size {
  width: 120px;
}

.op-l-table th {
  padding: 5px 0;
}

.op-l-table td {
  padding: 10px 0;
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