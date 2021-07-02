<template>
  <div class="mainContainer">
    <el-dialog
      title="请完成验证"
      :visible.sync="showClockInDialog"
      width="40%"
      class="validDialog"
      >
      <span class="dialog-title">请解决下面的验证码</span><br>
      <img :src="codePath" class="validCodeImage"/>
      <el-input class="validTextField" v-model="codeStr"></el-input>
      <el-button class="validSubmit" @click="submitValidCode" type="primary">提交</el-button>
    </el-dialog>
    <div class="card mainCard">
      <span :class="[{ 'alreadyClockIn' : clockInState === '您今天已经签到过了'}, 'clockinState ']" v-text="clockInState"></span><br>
      <el-button v-if="showClockInButton" type="primary" class="clockinButton" @click="showDialog">签到</el-button>
      <div class="clockinStatistic">
        <span class="splitLine">签到统计</span>
        <div class="terms">
          <div class="statisticTerm" style="margin-left: 0px;">
            <div class="termIcon">
              <font-awesome-icon :icon="['fas', 'calendar-check']" class="fa-5x"></font-awesome-icon>
            </div>
            <span class="termData" v-text="totalTimes"></span>
          </div>
          <div class="statisticTerm">
            <div class="termIcon">
              <font-awesome-icon :icon="['fas', 'rocket']" class="fa-5x"></font-awesome-icon>
            </div>
            <span class="termData" v-text="totalScore"></span>
          </div>
          <div class="statisticTerm">
            <div class="termIcon" style="margin-right: 200px;">
              <font-awesome-icon :icon="['fas', 'clock']" class="fa-5x"></font-awesome-icon>
            </div>
            <span class="termData" v-text="lastClockIn" style="font-size: 1em"></span>
          </div>
        </div>
      </div><br>
    </div>
  </div>
</template>

<script>
import score from '../../api/score'
import auth from '../../api/auth'
import storage from 'good-storage'

export default {
  name: 'clockin',
  data () {
    return {
      showClockInButton: storage.session.get('isColockIn') !== undefined ? storage.session.get('isColockIn') : false,
      clockInState: this.showClockInButton ? '您今天还没有签到哦' : '您今天已经签到过了',
      showClockInDialog: false,
      codeID: '',
      codePath: '',
      codeStr: '',
      totalTimes: '总计签到',
      totalScore: '共获得积分',
      lastClockIn: '上次签到于 '
    }
  },
  methods: {
    showDialog: function () {
      this.showClockInDialog = true
      auth.generateValidCode(this, (resp) => {
        this.codeID = resp.data
        this.codePath = 'http://localhost:40000/getValidCode?codeid=' + this.codeID
        console.log(this.codePath)
      })
    },
    submitValidCode: function () {
      let that = this
      // eslint-disable-next-line no-new
      new Promise(resolve => {
        that.showClockInDialog = false
        storage.session.set('isClockIn', true)
      })
      auth.checkValidCode(this, (resp) => {
        let requestKey = resp.data
        score.clockIn(that, requestKey)
        // eslint-disable-next-line no-new
        new Promise(resolve => {
          setTimeout(() => {
            score.clockInStatistic(that, that.clockInStatisticCallback)
          }, 700)
        })
      }, this.codeID, 'clockin', this.codeStr)
    },
    clockInStatisticCallback: function (resp) {
      let data = resp.data
      console.log(data)
      this.totalTimes = '总计签到'
      this.totalScore = '共获得积分:'
      this.lastClockIn = '上次签到于 '
      this.totalTimes += data.totalTimes
      this.totalTimes += '次'
      this.totalScore += data.totalScore
      this.lastClockIn += data.lastClockInTime
    }
  },
  created () {
    let that = this
    score.canClockIn((resp) => {
      that.showClockInButton = resp.data
      that.clockInState = this.showClockInButton ? '您今天还没有签到哦' : '您今天已经签到过了'
      storage.session.set('isClockIn', resp.data)
    }, this)
    score.clockInStatistic(this, this.clockInStatisticCallback)
  }
}
</script>

<style src="../../style/clockin.less" lang="less"></style>
