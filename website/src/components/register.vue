<template>
  <div class="mainContainer">
    <img src="../assets/login/background.jpg" class="backgroundImage"/>
    <div class="panel">
      <h1 class="title">请注册</h1>
      <div class="inputs">
        <el-row class="row">
          <el-col span="4" class="labelCol">
            <span class="label">用户名</span>
          </el-col>
          <el-col span="20">
            <el-input class="input" v-model="username"></el-input>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col span="4" class="labelCol">
            <span class="label">密码</span>
          </el-col>
          <el-col span="20">
            <el-input class="input" v-model="password" type="password"></el-input>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col span="4">
            <span class="label" style="margin-top: 0px">重复密码</span>
          </el-col>
          <el-col span="20">
            <el-input class="input" v-model="repeatPassword" type="password" @input="checkPassword"></el-input>
            <i :class="repeatPasswordIcon"></i>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col span="4" class="labelCol">
            <span class="label">邮箱</span>
          </el-col>
          <el-col span="20">
            <el-input class="input" v-model="email" type="email"></el-input>
          </el-col>
        </el-row>
      </div>
      <el-button class="registerButton" @click="register" type="primary">注册</el-button>
    </div>
  </div>
</template>

<script>
import auth from '../api/auth'

export default {
  name: 'register',
  data () {
    return {
      username: '',
      password: '',
      repeatPassword: '',
      repeatPasswordIcon: '',
      email: ''
    }
  },
  methods: {
    checkPassword: function () {
      if (this.password === this.repeatPassword) {
        this.repeatPasswordIcon = 'fa fa-2x fa-check-circle right'
        return true
      } else {
        this.repeatPasswordIcon = 'fa fa-2x fa-times-circle wrong'
        return false
      }
    },
    register: function () {
      let username = this.username.trim()
      let password = this.password.trim()
      let email = this.email.trim()
      if (username === '' || password === '' || email === '') {
        this.$message.error('请填写全部字段！')
        return
      }
      if (!this.checkPassword()) {
        this.$message.error('密码不一致！')
        return
      }
      let that = this
      auth.register(username, password, email, this, resp => {
        if (resp.data === 'Success') {
          this.$router.push('/doneRegister')
        } else {
          that.$message.error('注册失败！ ' + resp.data.message)
        }
      })
    }
  }
}
</script>

<style src="../style/register.less" lang="less" scoped></style>
