<template>
  <div>
    <el-row>
      <el-col :span="20" :offset="2">
        <div style="padding: 15px 0;position: relative;border-bottom: solid 1px #e6e6e6;">
          <a target="_blank" href="https://github.com/ukuq/onepoint">
            <img :src="favicon" alt="logo" style="width: 32px;height: 32px">
          </a>
          <el-menu :class="menuClass" :mode="menuMode" :router="true">
            <el-menu-item index="/">文件管理</el-menu-item>
            <el-submenu index="2">
              <template slot="title">云盘管理</template>
              <el-menu-item index="/drive-add">新增云盘</el-menu-item>
              <el-menu-item index="/drive-list">云盘信息</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">系统设置</template>
              <el-menu-item index="/setting">基本设置</el-menu-item>
              <el-menu-item index="/pass-setting">密码设置</el-menu-item>
            </el-submenu>
            <el-menu-item index="/dashboard">运行状态</el-menu-item>
          </el-menu>
          <el-dropdown class="avatar-container right-menu-item hover-effect" style="float: right">
            <span><svg-icon icon-class="account-circle" style="width: 28px;height: 28px;"></svg-icon></span>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/">
                <el-dropdown-item>Home</el-dropdown-item>
              </router-link>
              <router-link :to="{name:'Dashboard'}">
                <el-dropdown-item>Dashboard</el-dropdown-item>
              </router-link>
              <a target="_blank" href="http://github.com/ukuq/onepoint-vue">
                <el-dropdown-item>Github</el-dropdown-item>
              </a>
              <el-dropdown-item>
                <span>v210127</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">
                <span style="display:block;">Log Out</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        <router-view class="mt-3" :key="$route.path"/>
      </el-col>
    </el-row>
    <div style="position:fixed;left:0;bottom: 0;z-index: 2017" class="ml-3 mb-5 op-s-icon d-md-none" @click="showMenu">
      <svg-icon :icon-class="menuShow?'chevron-left':'chevron-right'"></svg-icon>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      menuMode: 'horizontal',
      menuShow: false,
    }
  },
  computed: {
    menuClass() {
      if (this.menuMode) return "d-md-block d-none op-m-menu-h";
      return this.menuShow ? "op-m-menu-v" : "op-m-menu-v d-none";
    },
    favicon() {
      return this.$store.state.system.baseURL + '/favicon.ico'
    }
  },
  methods: {
    showMenu() {
      if (this.menuMode) this.menuMode = '';
      this.menuShow = !this.menuShow;
    },
    async logout() {
      this.$store.commit('system/SET_STATE', {token: ''})
      return this.$router.push(`/login?redirect=${this.$route.fullPath}`)
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

.op-m-menu-h {
  position: absolute;
  top: 0;
  left: 32px;
  border-bottom: none !important;
}

.op-m-menu-v {
  position: fixed;
  top: 0;
  left: 0;
  border-bottom: none;
  z-index: 2017;
  width: 200px;
  height: 100%;
}
</style>