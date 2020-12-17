<template>
  <div style="position: fixed;width: 100%;height: 100%;top: 0;left: 0;" v-if="menuData.row" @click="hiddenMenu"
       @contextmenu.prevent="hiddenMenu">
    <ul class="el-dropdown-menu el-popper"
        :style="{position: 'absolute', left: menuData.x+'px', top: menuData.y+'px', 'transform-origin': 'center bottom','z-index': 2017}"
        x-placement="top-start">

      <template v-if="listData.file">
        <li v-if="menuData.row.type === 0" tabindex="-1" class="el-dropdown-menu__item"
            @click="preview($store.getters.baseURL + path + '?preview')"><i class="el-icon-view"></i>预览
        </li>
        <li tabindex="-1" class="el-dropdown-menu__item" @click="handleClipboard($store.getters.baseURL + path,$event)">
          <i class="el-icon-share"></i>分享
        </li>
      </template>
      <template v-else-if="menuData.mvOrCp===1">
        <li tabindex="-1" class="el-dropdown-menu__item" @click="fMove"><i class="el-icon-ship"></i>确认移动</li>
        <li tabindex="-1" class="el-dropdown-menu__item" @click="setMvOrCp(0)"><i class="el-icon-close"></i>取消移动
        </li>
      </template>
      <template v-else-if="menuData.mvOrCp===2">
        <li tabindex="-1" class="el-dropdown-menu__item" @click="fCopy"><i class="el-icon-copy-document"></i>确认粘贴</li>
        <li tabindex="-1" class="el-dropdown-menu__item" @click="setMvOrCp(0)"><i class="el-icon-close"></i>取消复制
        </li>
      </template>
      <template v-else>
        <li v-if="menuData.row.type === 0" tabindex="-1" class="el-dropdown-menu__item"
            @click="preview($store.getters.baseURL + path +menuData.row.name+ '?preview')"><i class="el-icon-view"></i>预览
        </li>
        <li v-else tabindex="-1" class="el-dropdown-menu__item"
            @click="$router.push({name: 'FileList', params: {pathMatch: path+ menuData.row.name+'/'}})"><i
            class="el-icon-view"></i>打开
        </li>
        <li tabindex="-1" class="el-dropdown-menu__item" @click="fRename"><i class="el-icon-edit"></i>重命名</li>
        <li tabindex="-1" class="el-dropdown-menu__item" @click="setMvOrCp(1)"><i
            class="el-icon-ship"></i>移动
        </li>
        <li tabindex="-1" class="el-dropdown-menu__item" @click="setMvOrCp(2)"><i
            class="el-icon-copy-document"></i>复制
        </li>
        <li tabindex="-1" class="el-dropdown-menu__item" @click="fRemove"><i class="el-icon-delete"></i>删除</li>
        <li tabindex="-1" class="el-dropdown-menu__item"
            @click="handleClipboard($store.getters.baseURL + path+menuData.row.name,$event)"><i
            class="el-icon-share"></i>分享
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import fileAPI from '@/api/file-cmd'
import clipboard from "@/utils/clipboard";

export default {
  data() {
    return {
      cache: this.$store.getters.fileListCache,
      menuData: this.$store.getters.fileListMenu,
    }
  },
  methods: {
    hiddenMenu() {
      this.menuData.row = null;
    },
    fRename() {
      const row = this.menuData.row;
      if (!row) return;
      const path = this.path + row.name;
      const oldType = row.type;
      let name = '?';
      this.$prompt('请输入新文件名', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '文件名不能为空'
      }).then(({value}) => {
        row.type = -1;
        name = value;
        console.log('ren ' + path + ' ' + name)
        return fileAPI.ren(path, name);
      }).then(() => {
        row.type = oldType;
        row.name = name;
        this.$notify.success('ren ' + path + ' ' + name)
      }).catch((action) => {
        row.type = typeof action === 'string' ? oldType : -2;
      });
    },
    fMkdir() {
      const path = this.path;
      let name = '?';
      this.$prompt('请输入文件夹名', '新建文件夹', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '文件夹名不能为空'
      }).then(({value}) => {
        name = value;
        console.log('mkdir ' + path + ' ' + name)
        return fileAPI.mkdir(path, name);
      }).then(() => {
        this.$store.commit('fileList/CACHE_APPEND', {path, row: {type: 1, name, time: Date.now(), size: 0, mime: ''}})
        this.$notify.success('mkdir ' + path + ' ' + name)
      });
    },
    fRemove() {
      const row = this.menuData.row;
      if (!row) return;
      const path = this.path + row.name;
      const oldType = row.type;
      this.$confirm('删除该文件, 是否继续?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.type = -1;
        console.log('rm ' + path)
        return fileAPI.rm(path);
      }).then(() => {
        row.type = oldType;
        this.$store.commit('fileList/CACHE_POP', {path, row});
        this.$notify.success('rm ' + path);
      }).catch((action) => {
        row.type = typeof action === 'string' ? oldType : -2;
      });
    },
    fCopy() {
      if (this.menuData.mvOrCp !== 2) return;
      const {srcRow, srcPath} = this.menuData;
      const path = this.path;
      const oldType = srcRow.type;
      srcRow.type = -1;
      this.$store.commit('fileList/CACHE_DIRTY', {path, dirty: -1});
      console.log('cp ' + srcPath + srcRow.name + ' ' + path);
      fileAPI.cp(srcPath + srcRow.name, path).then(() => {
        srcRow.type = oldType;
        this.$store.commit('fileList/CACHE_APPEND', {path, row: srcRow});
        this.$store.commit('fileList/CACHE_DIRTY', {path, dirty: null});
        this.$notify.success('cp ' + srcPath + srcRow.name + ' ' + path);
      }).catch(() => {
        srcRow.type = -2;
        this.$store.commit('fileList/CACHE_DIRTY', {path, dirty: -2});
      });
      this.setMvOrCp(0);
    },
    fMove() {
      if (this.menuData.mvOrCp !== 1) return;
      const {srcRow, srcPath} = this.menuData;
      const path = this.path;
      const oldType = srcRow.type;
      srcRow.type = -1;
      this.$store.commit('fileList/CACHE_DIRTY', {path, dirty: -1});
      console.log('mv ' + srcPath + srcRow.name + ' ' + path)
      fileAPI.mv(srcPath + srcRow.name, path).then(() => {
        srcRow.type = oldType;
        this.$store.commit('fileList/CACHE_MOVE', {srcPath, srcRow, path});
        this.$store.commit('fileList/CACHE_DIRTY', {path, dirty: null});
        this.$notify.success('mv ' + srcPath + srcRow.name + ' ' + path);
      }).catch(() => {
        srcRow.type = -2;
        this.$store.commit('fileList/CACHE_DIRTY', {path, dirty: -2});
      });
      this.setMvOrCp(0);
    },
    setMvOrCp(mvOrCp) {
      this.menuData.mvOrCp = mvOrCp;
      if (mvOrCp === 0) {
        this.menuData.srcPath = null;
        this.menuData.srcRow = null;
      } else {
        this.menuData.srcPath = this.path;
        this.menuData.srcRow = this.menuData.row;
      }
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    },
    preview(url) {
      window.open(url, '_blank')
    }
  },
  computed: {
    ...mapGetters(["listData", "path"]),
  }
}
</script>