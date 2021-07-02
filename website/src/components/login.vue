<template>
  <div class="mainContainer">
    <img class="background" src="../assets/login/background.jpg"/>
    <div class="login">
      <h1 class="title">请登录</h1>
      <div class="inputs">
        <div>
          <span class="label">用户名:</span>
          <el-input class="input" v-model="username"></el-input><br>
        </div>
        <div>
          <span class="label">密码：</span>
          <el-input class="input" type="password" v-model="password" @input="passwordInput"></el-input>
        </div>
        <el-button class="submit" type="primary" @click="login()">登录</el-button>
      </div>
      <div class="links">
        <router-link class="link" to="/register">注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../api/auth'
import storage from 'good-storage'

export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login: function () {
      let that = this
      auth.login(this.username, this.password, () => {
        auth.userinfo((data) => {
          console.log(data.data)
          storage.session.set('user', data.data)
        }, that)
        setTimeout(() => { that.$router.push('/') }, 500)
      }, this)
    },
    passwordInput: function (e) {
      console.log(e)
    }
  }
}
</script>

<style src="../style/login.less" lang="less" scoped></style>
