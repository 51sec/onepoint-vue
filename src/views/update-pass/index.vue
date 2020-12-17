<template>
  <div>
    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px">
      <el-form-item label="旧用户名" prop="user0">
        <el-input v-model="form.user0" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="旧密码" prop="pass0">
        <el-input type="password" v-model="form.pass0" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新用户名" prop="user">
        <el-input v-model="form.user" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="form.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="form.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import configAPI from '@/api/config';

export default {
  data() {
    return {
      form: {
        user0: '',
        pass0: '',
        user: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        user0: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入旧用户名'));
            } else {
              callback();
            }
          }, trigger: 'blur'
        }],
        pass0: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入旧密码'));
            } else {
              callback();
            }
          }, trigger: 'blur'
        }],
        pass: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'));
              } else {
                if (this.form.checkPass !== '') {
                  this.$refs.form.validateField('checkPass');
                }
                callback();
              }
            }, trigger: 'blur'
          }
        ],
        checkPass: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'));
              } else if (value !== this.form.pass) {
                callback(new Error('两次输入密码不一致!'));
              } else {
                callback();
              }
            }, trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          configAPI.setSysPass(this.form).then(()=>{this.$message({
            message: 'Update pass successfully',
            type: 'success',
            duration: 1500
          })});
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>