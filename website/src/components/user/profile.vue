<template>
  <div class="mainContainer">
    <el-dialog
      width="30%"
      :visible.sync="showJoinDialog"
      title="补充信息"
      >
      <span class="label">请填写qq号码</span>
      <el-input type="text" class="qqInput" v-model="qq"></el-input>
      <el-button class="applyJoinButton" type="primary" @click="applyJoin">提交</el-button>
    </el-dialog>
    <div class="card" style="height: 440px;width: 570px;">
      <div class="row topRow">
        <span class="cardTitle">用户信息</span>
      </div>
      <div class="row grey">
        <span class="rowContentLeft">用户ID:</span>
        <span class="rowContentRight" v-text="id"></span>
      </div>
      <div class="row">
        <span class="rowContentLeft">用户名:</span>
        <span class="rowContentRight" v-text="name"></span>
      </div>
      <div class="row grey">
        <span class="rowContentLeft">邮箱</span>
        <span class="rowContentRight" v-text="mail"></span>
      </div>
      <div class="row">
        <span class="rowContentLeft">用户权限:</span>
        <span class="rowContentRight" v-text="group"></span>
      </div>
      <el-button v-if="group === 'GUEST'" class="joinUsButton" type="primary" :disabled="isApplySent" @click="showJoinDialog = true" v-text="joinUsButtonText"></el-button>
    </div>
    <div v-if="group !== 'GUEST'" class="card cardScore">
      <span class="cardTitle" style="margin-top: 10px;">积分信息</span>
      <el-progress class="scoreProgress" type="dashboard" :percentage="persentToNextLevel"></el-progress><br>
      <span class="userLevel" v-text="currentLevel"></span><br>
      <span class="userLevel" v-text="score"></span>
    </div>
  </div>
</template>

<script>
import storage from 'good-storage'
import message from '../../api/message'

export default {
  name: 'profile',
  data () {
    return {
      id: 0,
      name: '',
      group: '',
      mail: '',
      persentToNextLevel: 0,
      score: '当前积分： ',
      currentLevel: '用户等级： ',
      isApplySent: false,
      showJoinDialog: false,
      qq: '',
      joinUsButtonText: '加入我们'
    }
  },
  methods: {
    calcLevelData: function (score) {
      if (score === 0) {
        this.persentToNextLevel = 0.0
        this.currentLevel += '小萌新'
      } else if (score > 0 && score <= 50) {
        this.persentToNextLevel = ((50 - score) / 50).toFixed(3) * 100
        if (score === 50) {
          this.persentToNextLevel = 100
        }
        this.currentLevel += '小萌新'
      } else if (score > 50 && score <= 100) {
        this.persentToNextLevel = ((100 - score) / 100).toFixed(3) * 100
        this.currentLevel += '初出茅庐'
      } else if (score > 100 && score <= 200) {
        this.persentToNextLevel = ((200 - score) / 200).toFixed(3) * 100
        this.currentLevel += '普通员工'
      } else if (score > 200 && score <= 300) {
        this.persentToNextLevel = ((300 - score) / 300).toFixed(3) * 100
        this.currentLevel += '高级员工'
      } else if (score > 300 && score <= 500) {
        this.persentToNextLevel = ((500 - score) / 500).toFixed(3) * 100
        this.currentLevel += '特级员工'
      } else if (score > 500 && score <= 1000) {
        this.persentToNextLevel = ((1000 - score) / 1000).toFixed(3) * 100
        this.currentLevel += '超级员工'
      } else if (score > 1000 && score <= 2000) {
        this.persentToNextLevel = ((2000 - score) / 2000).toFixed(3) * 100
        this.currentLevel += '专家程序员'
      } else if (score > 2000 && score <= 2500) {
        this.persentToNextLevel = ((2500 - score) / 2500).toFixed(3) * 100
        this.currentLevel += '小bug程序员'
      } else if (score > 2500 && score <= 3000) {
        this.persentToNextLevel = ((3000 - score) / 3000).toFixed(3) * 100
        this.currentLevel += '大bug程序员'
      } else if (score > 3000 && score <= 4000) {
        this.persentToNextLevel = ((4000 - score) / 4000).toFixed(3) * 100
        this.currentLevel += '员工长'
      } else if (score > 4000 && score <= 5000) {
        this.persentToNextLevel = ((5000 - score) / 5000).toFixed(3) * 100
        this.currentLevel += '副室长'
      } else {
        this.persentToNextLevel = 100.0
        this.currentLevel += '秘书'
      }
    },
    applyJoin: function () {
      this.showJoinDialog = false
      this.isApplySent = true
      this.joinUsButtonText = '申请已发送'
      message.applyJoin(this, this.qq)
    }
  },
  created () {
    let userinfo = storage.session.get('user')
    this.id = userinfo.id
    this.name = userinfo.name
    this.mail = userinfo.mail
    this.group = userinfo.permission
    this.score += userinfo.score
    this.calcLevelData(userinfo.score)
    if (this.group === 'GUEST') {
      let that = this
      message.isApplySent(this, resp => {
        if (resp.data) {
          that.isApplySent = true
          that.joinUsButtonText = '申请已发送'
        }
      })
    }
  }
}
</script>

<style src="../../style/userProfile.less" lang="less"></style>
