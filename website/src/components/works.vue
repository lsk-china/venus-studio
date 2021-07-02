<template>
  <div style="height: 100%; width: 100%">
    <background class="background" dot-color="#999"></background>
    <header class="header">
      <div class="headerLeft">
        <router-link to="/" class="toIndex">金星工作室</router-link>
      </div>
      <div class="headerRight">
        <router-link to="/login" v-if="displayLogin" class="link">登录</router-link>
        <router-link to="/register" v-if="displayLogin" class="link">注册</router-link>
        <el-avatar :src="head" v-if="displayHead" @click="toUser"></el-avatar>
      </div>
    </header>
    <div class="mainContainer">
    </div>
  </div>
</template>

<script>
import storage from 'good-storage'
import particleBackground from './particleBackground'
import work from '../api/work'

export default {
  name: 'works',
  data () {
    return {
      displayLogin: true,
      head: '',
      displayHead: false,
      works: null,
      page: 0
    }
  },
  components: {
    background: particleBackground
  },
  methods: {
    toUser: function () {
      this.$router.push('/user')
    }
  },
  created () {
    let userinfo = storage.session.get('user')
    if (userinfo !== undefined) {
      console.log(userinfo)
      let id = userinfo.id
      this.head = 'http://localhost:10001/head/' + id.toString() + '.jpg'
      this.displayLogin = false
      this.displayHead = true
    }
    work.queryAllWorks(this, 0).then(resp => {
      console.log(resp)
    })
  }
}
</script>

<style src="../style/works.less" lang="less" scoped></style>
