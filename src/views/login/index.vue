<template>
  <el-card style="max-width: 450px;margin: 200px auto;">
    <el-form :model="loginForm" ref="loginForm" :rules="loginRules" autocomplete="on" style="position: relative">
      <i class="el-icon-setting" style="float: right;cursor: pointer" @click="showSetting=!showSetting"></i>
      <h3>Login Form</h3>
      <el-form-item prop="username">
        <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
            prefix-icon="el-icon-user"
        />
      </el-form-item>
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <el-input
              prefix-icon="el-icon-lock"
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="suffix" @click="showPwd" :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </el-input>
        </el-form-item>
      </el-tooltip>

      <el-form-item v-show="showSetting" prop="baseURL">
        <el-input
            ref="baseURL"
            v-model="loginForm.baseURL"
            placeholder="baseURL"
            name="baseURL"
            type="url"
            tabindex="3"
            autocomplete="on"
            prefix-icon="el-icon-setting"
        />
      </el-form-item>
      <el-form-item v-show="showSetting" prop="PATH_ADMIN">
        <el-input
            ref="PATH_ADMIN"
            v-model="loginForm.PATH_ADMIN"
            placeholder="PATH_ADMIN"
            name="PATH_ADMIN"
            type="text"
            tabindex="4"
            autocomplete="on"
            prefix-icon="el-icon-setting"
        />
      </el-form-item>
      <el-form-item v-show="showSetting" prop="PATH_API">
        <el-input
            ref="PATH_API"
            v-model="loginForm.PATH_API"
            placeholder="PATH_API"
            name="PATH_API"
            type="text"
            tabindex="5"
            autocomplete="on"
            prefix-icon="el-icon-setting"
        />
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                 @click.native.prevent="handleLogin">Login
      </el-button>
    </el-form>
  </el-card>
</template>

<script>

export default {
  name: 'Login',
  created() {
    const s = new URL(window.location).searchParams;
    if(s.get('base_url')){
      if(s.get('base_url'))this.loginForm.baseURL=s.get('base_url');
      if(s.get('path_api'))this.loginForm.baseURL=s.get('path_api');
      if(s.get('path_admin'))this.loginForm.baseURL=s.get('path_admin');
    }
    if(window.opConfig){
      this.loginForm.baseURL=window.opConfig.baseURL;
      this.loginForm.PATH_API=window.opConfig.PATH_API;
      this.loginForm.PATH_ADMIN=window.opConfig.PATH_ADMIN;
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('Please enter the user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('The password can not be empty'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        baseURL: this.$store.state.system.baseURL,
        PATH_API: this.$store.state.system.PATH_API,
        PATH_ADMIN: this.$store.state.system.PATH_ADMIN,
        username: '',
        password: '',
      },
      showSetting: false,
      loginRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock(e) {
      const {key} = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('system/login', this.loginForm)
              .then(() => {
                this.$router.push({path: this.$route.query.redirect || '/'})
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
        } else {
          return false
        }
      })
    }
  }
}
</script>


