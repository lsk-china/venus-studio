<template>
  <div>
    <div class="backgroundContainer">
      <div class="backgroundWrapper">
        <background class="particleBackground" dot-color="#FFF"></background>
        <img src="../assets/index/headimg.jpg" class="backgroundImage"/>
      </div>
    </div>
    <header>
      <div class="loginAndRegisterContainer">
        <router-link to="/login" :style="displayLogin" class="link">登录</router-link>
        <router-link to="/register" :style="displayLogin" class="link">注册</router-link>
        <img class="userHead" :src="head" :style="displayHead" @click="$router.push('/user')"/>
      </div>
      <div class="navContainer">
        <div class="navLink" @click="toWork">
          <span>作品</span>
        </div>
      </div>
    </header>
    <div class="mainContainer">
      <div class="mainWrapper">
        <h1 class="title">欢迎来到金星工作室的主页</h1>
      </div>
    </div>
  </div>
</template>

<script>
import particleBackground from './particleBackground'
import auth from '../api/auth'
import {getCookie} from '../util/cookieutil'
import storage from 'good-storage'

export default {
  name: 'index',
  data () {
    return {
      displayLogin: 'display: block',
      displayHead: 'display: none',
      head: ''
    }
  },
  components: {
    'background': particleBackground
  },
  methods: {
    toWork: function () {
      this.$router.push('/works')
    }
  },
  created () {
    if (getCookie('token') === null) {
      auth.token(this)
    }
    let userinfo = storage.session.get('user')
    if (userinfo !== undefined) {
      console.log(userinfo)
      let id = userinfo.id
      this.head = 'http://localhost:10001/head/' + id.toString() + '.jpg'
      this.displayLogin = 'display: none'
      this.displayHead = 'display: block'
    }
  }
}
</script>

<style src="../style/index.less" lang="less" scoped></style>
