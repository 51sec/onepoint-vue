<template>
  <el-dialog
      :title=path
      :visible.sync="touchData.visible"
      width="80%"
      :fullscreen="fullscreen"
  >
    <div style="margin: -30px -10px;">
      <el-input
          placeholder="请输入文件名"
          v-model="touchData.name"
          v-show="!fullscreen"
      >
      </el-input>
      <codemirror v-model="touchData.content" :options="touchDateCodeOptions" style="font-size: 25px;"></codemirror>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="fullscreen = !fullscreen" size="small">全 屏</el-button>
      <el-button @click="touchData.visible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="$emit('touch')" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {codemirror} from 'vue-codemirror-lite'
import {mapGetters} from "vuex";

export default {
  components: {codemirror},
  data() {
    return {
      fullscreen:false
    }
  },
  computed: {
    ...mapGetters(['touchData', 'path']),
    touchDateCodeOptions() {
      return {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        mode: {
          filename: this.touchData.name
        },
      }
    }
  }
}
</script>