<template>
  <div>
    <div class="container" style="border-bottom: 1px solid #dcdfe6;">
      <div class="d-inline-block op-header-logo">
        <a target="_blank" :href="baseURL">
          <img :src="favicon" alt="logo" style="height: 32px;transform: translateY(10px);">
        </a>
      </div>
      <ul class="d-inline-block op-header-nav">
        <li>
          <router-link :to="{name:'FileList',params:{pathMatch:'/'}}"><i class="el-icon-s-home"></i>
            <span>文件管理</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{name:'BasicSetting'}"><i class="el-icon-s-tools"></i>
            <span>基本设置</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{name:'MoreSetting'}"><i class="el-icon-more"></i>
            <span>更多设置</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{name:'Dashboard'}"><i class="el-icon-info"></i>
            <span>运行状态</span>
          </router-link>
        </li>
      </ul>
      <el-dropdown style="float: right;transform:translateY(15px)" class="d-inline-block">
        <div>
          <svg-icon icon-class="account-circle" style="width: 28px;height: 28px;"></svg-icon>
        </div>
        <el-dropdown-menu slot="dropdown" class="header-right">
          <el-dropdown-item @click.native="$op.open('http://github.com/ukuq/onepoint')"><span>Github</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="container">
      <router-view class="mt-3 pb-3" :key="$route.path"/>
    </div>
    <div v-show="mode.footer" style="text-align: center;margin-top: -1rem;" class="py-1">Just One Point!<span
        v-if="publicData.version"> & Version: {{ publicData.version }}</span>
    </div>
  </div>
</template>

<script>

import {mapGetters} from "vuex";
import marked from "marked";

export default {
  created() {
    if (this.version0 !== 1) this.$op.site().then(data => {
      const {drives, site, tips, version} = data;
      drives.sort((a, b) => b.path.localeCompare(a.path));
      drives.forEach(e => e.readme = marked(e.readme));
      site.readme = marked(site.readme);
      this.publicData.drives = drives;
      this.publicData.site = site;
      document.title = site.name;
      this.publicData.tips = tips || []
      this.publicData.version = version || 0
    })
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['mode', 'publicData', 'baseURL', 'version0']),
    favicon() {
      return this.baseURL + '/favicon.ico'
    }
  },
  methods: {
    logout() {
      this.$confirm("退出登录", "", {type: "warning"}).then(() => {
        this.$store.dispatch('system/logout');
      })
    }
  }
}
</script>
<style>
.op-s-icon {
  background-color: #FFFFFF;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  z-index: 5;
}

.op-header-logo {
  margin: 0;
  padding: 0 10px;
}

ul.op-header-nav {
  height: 60px;
  padding: 0;
  margin: 0;
  list-style-type: none;
}

ul.op-header-nav li {
  display: inline-block;
  line-height: 60px;
  margin-right: 10px;
}

ul.op-header-nav a {
  color: #909399;
  text-decoration: none;
}

ul.op-header-nav a:hover {
  color: black;
}

ul.op-header-nav a.router-link-active.router-link-exact-active {
  color: #1890ff;
}

ul.op-header-nav li span {
  display: none;
}

@media (min-width: 768px) {
  ul.op-header-nav li span {
    display: unset;
  }

  ul.op-header-nav li {
    margin-right: 40px;
  }

  .op-header-logo {
    padding: 0 40px;
  }
}
</style>