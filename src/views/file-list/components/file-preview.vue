<template>
  <div>
    <aplayer v-if="mode.music && audioList.length"
             :list="audioList"
             :music.sync="aPlayerData.music"
             :repeat.sync="aPlayerData.repeat"
             :shuffle.sync="aPlayerData.shuffle"
             style="margin: 0;"
             class="mt-3"
    >
    </aplayer>
    <div v-if="mode.image">
      <div v-if="imageList.length" class="preview-images">
        <span v-for="img in imageList" :key="img.title" @click="$store.commit('fileList/SHOW_PREVIEW',img.item)">
      <img v-lazy="img.src" :alt="img.title"></span>
      </div>
    </div>
    <el-dialog :visible.sync="previewData.visible" :title="name" width="80%"
               style="text-align: center;" @opened="onOpened" @closed="onClosed">
      <div style="margin: -30px 0">
        <p v-if="type===1">不支持的预览</p>
        <audio v-else-if="type===2" :src="url" controls autoplay style="width: 100%;"></audio>
        <img v-else-if="type===3" :src="url" :alt="url" style="width: 80%">
        <div v-else-if="type===4" id="d-player"></div>
        <div v-else-if="type===5" style="text-align: left;">
          <!--          <codemirror :code="content" -->
          <!--                      :options="{lineNumbers:true}"></codemirror>-->
          <p v-show="isCodeLoading">加载中。。。</p>
          <pre v-html="codeHtml" class="el-card" style="overflow: auto;"></pre>
        </div>
        <p v-else-if="type===6">文件太大，不支持预览</p>
      </div>
      <div slot="footer" style="text-align: center;">
        <el-button size="small"
                   @click="clipboard(pathPrefix+name + (previewData.item && previewData.item.type===0?'?preview':''),$event)">
          <i class="el-icon-share"></i>分享
        </el-button>
        <el-button size="small" @click="$op.open(pathPrefix+name)"><i class="el-icon-download"></i>下载</el-button>
        <!--        <el-button size="small" v-show="type===5 && !isCodeLoading && !contentError" @click="$store.commit('fileList/SHOW_TOUCH',{name,content})"><i class="el-icon-edit"></i>编辑</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>
<script>

import flvjs from 'flv.js';
import Hls from 'hls.js';

window.flvjs = flvjs;
window.Hls = Hls;

import {mapGetters} from "vuex";
import axios from 'axios';
import Aplayer from "vue-aplayer";
import DPlayer from 'dplayer/dist/DPlayer.min'
import clipboard from "@/utils/clipboard";

import hljs from 'highlight.js';
import 'highlight.js/styles/xcode.css'
import {text2Html} from "@/utils";

export default {
  components: {
    Aplayer
  },
  props: {
    listData: Object
  },
  data() {
    return {
      isCodeLoading: false,
      player: null,
      aPlayerData: {
        music: {
          src: "http://example.com/404"
        },
        repeat: "no-repeat",
        shuffle: false
      },
      contentError: false,
      content: '',
      clipboard,
      textMaxSize: 32 * 1024
    }
  },
  methods: {
    onOpened() {
      if (this.type === 4) {
        this.player = new DPlayer({
          container: document.getElementById("d-player"), autoplay: false, video: {
            url: this.url
          }
        });
      } else if (this.type === 5) {
        if (this.isCodeLoading) return;
        this.content = '';
        this.contentError = false;
        this.isCodeLoading = true;
        axios.get(this.url, {responseType: 'text'}).then(res => {
          this.content = res.request.responseText;
          this.isCodeLoading = false
        }).catch(err => {
          this.content = 'failed: ' + err.message;
          this.isCodeLoading = false
          this.contentError = true;
        })
      }
    },
    onClosed() {
      if (this.player) this.player.destroy();
      this.previewData.item = null
    }
  },
  computed: {
    ...mapGetters(["pathPrefix", "previewData", "mode"]),
    type() {
      const item = this.previewData.item;
      if (item && item.mime) {
        const mime = item.mime;
        if (mime.startsWith('audio')) return 2;
        else if (mime.startsWith('image')) return 3;
        else if (mime.startsWith('video')) return 4;
        else if (mime.startsWith('text')) {
          if (item.size > this.textMaxSize) return 6;
          else return 5;
        } else {
          const ext = item.name.slice(item.name.lastIndexOf('.') + 1);
          if (['js', 'css', 'py', 'html', 'c', 'cpp', 'java', 'json'].includes(ext)) return 5;
          else if (['m3u8'].includes(ext)) return 4;
        }
      }
      return 1;
    },
    url() {
      const item = this.previewData.item;
      return item && item.url || (this.pathPrefix + item.name);
    },
    name() {
      return this.previewData.item && this.previewData.item.name
    },

    list() {
      const d = this.listData;
      return d && d.list || [];
    },

    audioList() {
      const p = this.pathPrefix;
      return this.list.filter(e => e.type === 0 && e.mime.startsWith('audio')).map(e => {
        return {
          title: e.name,
          src: e.url || (p + e.name)
        }
      })
    },
    imageList() {
      const p = this.pathPrefix;
      return this.list.filter(e => e.type === 0 && e.mime.startsWith('image')).map(e => {
        return {
          title: e.name,
          src: e.url || (p + e.name),
          item: e
        }
      })
    },
    codeHtml() {
      return (this.previewData.item || {}).size < (this.textMaxSize / 2) ? hljs.highlightAuto(this.content).value : text2Html(this.content);
    },
  },
}
</script>
<style>
.preview-images img {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  color: #303133;
  padding: 5px;
  margin: 5px;
  height: 200px;
  cursor: pointer;
}
</style>