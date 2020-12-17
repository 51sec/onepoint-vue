<template>
  <div>
    <el-dialog
        title="上传状态"
        :visible.sync="uploadData.visible"
        width="80%">
      <el-table
          class="op-u-table"
          :data="uploadData.queue"
          style="width: 100%">
        <el-table-column
            prop="state"
            label="state">
          <div slot-scope="scope">
            {{getState(scope.row.state)}}
            <i v-show="scope.row.state !== 1" class="el-icon-delete" style="cursor: pointer" @click="remove(scope.row)"></i>
            <i v-show="scope.row.state === 1" class="el-icon-video-pause" style="cursor: pointer" @click="stop(scope.row)"></i>
            <i v-show="scope.row.state < 0" class="el-icon-refresh-right" style="cursor: pointer" @click="retry(scope.row)"></i>
          </div>
        </el-table-column>
        <el-table-column
            prop="name"
            label="name">
          <div slot-scope="scope">{{scope.row.file.name}}</div>
        </el-table-column>
        <el-table-column
            prop="path"
            label="path"
            class-name="hidden-xs-only"
        >
        </el-table-column>
        <el-table-column
            prop="time"
            label="time"
            :formatter="formatDate"
            class-name="hidden-xs-only"
        >
        </el-table-column>
        <el-table-column
            prop="offset"
            label="offset"
            :formatter="formatSize"
            class-name="hidden-xs-only"
        >
        </el-table-column>
        <el-table-column
            prop="progress"
            label="progress"
            :formatter="progress"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
    <input type="file" ref="upload-files" multiple @change="uploadOnChange" class="d-none"/>
    <input type="file" ref="upload-folder" webkitdirectory @change="uploadOnChange" class="d-none"/>
  </div>
</template>
<script>
import axios from "axios";
import fileAPI from "@/api/file-cmd";
import {formatDate,formatSize} from '@/utils/formatter'
export default {
  data() {
    return {
      path:'',
      uploadData:this.$store.getters.fileListUpload
    }
  },
  methods: {
    fUpload() {
      const now = this.uploadData.now;
      fileAPI.upload(now.path, now.file.name).then(data => {
        this.fileUpload(data, data.uploadUrl);
      }).catch(() => {
        now.state = -1;
        this.uploadNext();
      });
    },
    uploadNext() {
      if (this.uploadData.now && this.uploadData.now.state === 1) return;
      this.uploadData.now = this.uploadData.queue.find((e) => e.state === 0);
      if(this.uploadData.now){
        this.uploadData.now.state=1;
        this.fUpload();
      }
    },
    uploadOnChange(event) {
      console.log(event.target.files);
      let files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.uploadData.queue.push({
          path: this.path,
          file: files[i],
          time: new Date(),
          state: 0,
          offset: 0,
          startTime: 0
        });
      }
      this.uploadNext();
    },
    fileUpload(res, url) {
      let offset, offset1;
      const _this = this;
      const uploadNow = this.uploadData.now;
      if(!uploadNow || uploadNow.state!==1){
        this.uploadNext();
        return;
      }
      const file = uploadNow.file;
      let s2 = res.nextExpectedRanges[0].split("-");
      offset = Number(s2[0]);
      offset1 = s2[1] ? Number(s2[1]) + 1 : file.size;
      if (offset1 > offset + 10485760) offset1 = offset + 10485760;
      let reader = new FileReader();
      reader.readAsArrayBuffer(file.slice(offset, offset1));
      reader.onload = function (event) {
        console.log("send: [" + offset + "," + offset1 + ")");
        const source = axios.CancelToken.source();
        axios.put(url, event.target.result, {
          headers: {
            //'Content-Length': offset1 - offset,
            "Content-Range": `bytes ${offset}-${offset1 - 1}/${file.size}`
          },
          onUploadProgress: progressEvent => {
            uploadNow.offset = offset + progressEvent.loaded;
            if(uploadNow.state!==1)source.cancel();
          },
          withCredentials: false,
          cancelToken:source.token
        })
            .then(r => {
              console.log(r.data);
              console.log("success: [" + offset + "," + offset1 + ")");
              uploadNow.offset=offset1;
              if (r.status === 201) {
                _this.$store.commit('fileList/CACHE_APPEND', uploadNow.path, {
                  type: 0,
                  name: file.name,
                  size: file.size,
                  mime: file.type,
                  time: file.lastModified
                });
                _this.$notify.success("upload " + uploadNow.path + " " + file.name);
                console.log("success: " + JSON.stringify(res));
                uploadNow.state = 2;
                _this.uploadNext();
              } else if (r.status === 202) {
                _this.fileUpload(r.data, url);
              } else throw r;
            })
            .catch(err => {
              console.log(err);
              _this.$notify.error(String(err.message));
              if(uploadNow)uploadNow.state = -1;
              _this.uploadNext();
            });
      };
    },
    upload(){
      this.path=this.$store.getters.path;
      this.$refs['upload-files'].click();
    },
    getState(state){

      if(state===-2)return '已取消';
      if(state===-1)return '错误';
      if(state===0)return '等待';
      if(state===1)return '上传中';
      if(state===2)return '完成';
      return '未知';
    },
    formatDate(row){
      return formatDate(row.time)
    },
    formatSize(row){
      return formatSize(row.offset)
    },
    remove(row){
      const i = this.uploadData.queue.indexOf(row);
      if(i>=0)this.uploadData.queue.splice(i,1);
    },
    stop(row){
      row.state=-2
      this.uploadNext();
    },
    retry(row){
      row.state=0;
      this.uploadNext();
    },
    progress(row){
      return Number(row.offset/row.file.size*100).toFixed(0)+'%';
    }
  }
}
</script>
<style>
.op-u-table colgroup {
  display: none;
}
</style>