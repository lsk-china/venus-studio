<template>
  <div class="mainContainer">
    <img src="../assets/login/background.jpg" class="backgroundImage"/>
    <div class="panel">
      <h1 class="title">完成注册</h1>
      <el-row class="row">
        <el-col span="4">
          <span class="label">注册码</span>
        </el-col>
        <el-col span="20">
          <el-input class="input" v-model="registerCode"></el-input>
        </el-col>
      </el-row>
      <el-button class="submit" type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import auth from '../api/auth'

export default {
  name: 'doneRegister',
  data () {
    return {
      registerCode: ''
    }
  },
  methods: {
    submit: function () {
      if (this.registerCode === '') {
        this.$message.error('请填写注册码！')
        return
      }
      auth.doneRegister(this, this.registerCode, resp => {
        if (resp.data === 'Success') {
          this.$router.push('/')
        } else {
          this.$message.error('注册失败！ ' + resp.data.message)
        }
      })
    }
  }
}
</script>

<style src="../style/doneRegister.less" lang="less" scoped></style>
