<template>
  <div class="mainContainer">
    <el-dialog
      title="请完成验证"
      :visible.sync="showCreateMessageVerifyDialog"
      width="40%"
      class="validDialog"
    >
      <span class="dialog-title">请解决下面的验证码</span><br>
      <img :src="createMessageCodePath" class="validCodeImage"/>
      <el-input class="validTextField" v-model="createMessageCodeStr"></el-input>
      <el-button class="validSubmit" @click="submitValidCode" type="primary">提交</el-button>
    </el-dialog>
    <div class="card messageCard">
      <span class="cardTitle">消息列表</span>
      <i class="fa fa-refresh refreshButton fa-2x" @click="reloadTable(1)"></i>
      <div class="tableWrapper" ref="table">
        <keep-alive>
          <el-table :data="messages" stripe class="messageTable" border width="100%" v-on:row-click="handleRowClick">
            <el-table-column prop="id" label="消息ID" width="50px" align="center"></el-table-column>
            <el-table-column prop="creater" label="创建者ID" width="50px" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200px" align="center"></el-table-column>
            <el-table-column prop="content" label="内容" width="330px" align="center" :formatter="testFormatter"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="slot">
                <div class="operationButtons">
                  <el-button type="primary" class="deleteButton" @click="deleteMessage(slot.row)">删除</el-button>
                  <el-button type="primary" class="deleteButton" @click="allowJoin(slot.row)" v-if="slot.row.type === 'APPLY_JOIN'">允许</el-button>
                  <el-button type="primary" class="deleteButton" @click="passWork(slot.row)" v-if="slot.row.type === 'WORK_CHECK'">通过</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </keep-alive>
        <el-pagination class="pagination" :current-page="currentPage" :page-size="pageSize" :page-count="totalPages" layout="prev, pager, next" @current-change="reloadTable"></el-pagination>
      </div>
    </div>
    <div class="card createMessageCard">
      <el-row>
        <el-col>
          <span class="cardTitle">发布消息</span>
        </el-col>
      </el-row>
      <el-row class="createMessageRow">
        <el-col :span=4 class="labelCol">
          <span class="label">内容</span>
        </el-col>
        <el-col :span=20>
          <div ref="contentDiv">
            <el-input type="textarea" :rows="4" v-model="createMessageContent" class="createMessageInput createMessageContent"></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row class="createMessageRow">
        <el-col :span=4 class="labelCol">
          <span class="label">类型</span>
        </el-col>
        <el-col :span=20>
          <div ref="typeDiv">
            <el-select class="createMessageInput" v-model="createMessageType">
              <el-option class="createMessageType" label="普通" value="NORMAL"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row class="createMessageRow">
        <el-col :span=4 class="labelCol">
          <span class="label">显示权限</span>
        </el-col>
        <el-col :span=20>
          <div ref="typeDiv">
            <el-select class="createMessageInput" v-model="createMessageShowPermission">
              <el-option
                v-for="permission in createMessageAvailableShowPermission"
                :label="permission"
                :value="permission"
                v-bind:key="permission"
                class="createMessageType"
                ></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-button class="createMessageSubmit" @click="createMessage" type="primary">发布</el-button>
    </div>
  </div>
</template>

<script>
import message from '../../api/message'
import auth from '../../api/auth'
import storage from 'good-storage'
import work from '../work'

export default {
  name: 'message',
  data () {
    return {
      messages: null,
      totalPages: 0,
      currentPage: 1,
      pageSize: 20,
      createMessageContent: '',
      createMessageType: 'NORMAL',
      createMessageShowPermission: '',
      createMessageAvailableShowPermission: ['USER', 'MANAGER', 'ADMIN'],
      createMessageCodeID: '',
      createMessageCodePath: '',
      createMessageCodeStr: '',
      createMessageRequestKey: '',
      showCreateMessageVerifyDialog: false,
      permissions: ['USER', 'MANAGER', 'ADMIN']
    }
  },
  methods: {
    reloadTable: function (val) {
      console.log(val)
      this.currentPage = val
      let that = this
      message.messages(this, 0, val, (resp) => {
        that.messages = resp.data.result
      })
    },
    testFormatter: function (row, column, cellValue, index) {
      let result = ''
      switch (row.type) {
        case 'NORMAL':
          result = row.content
          break
        case 'APPLY_JOIN':
          let jsonMessage = JSON.parse(row.content)
          let qq = jsonMessage.qq
          let username = jsonMessage.username
          let content = '用户' + username + '申请加入，QQ：' + qq
          result = content
          break
        default:
          result = row.content
      }
      return result
    },
    deleteMessage: function (row) {
      console.log(row)
      let that = this
      message.deleteMessage(this, row.id, (resp) => {
        let data = resp.data
        if (data !== 'Success') {
          let code = data.code
          if (code === 403) {
            that.$message.error('删除失败：权限不够')
          } else {
            that.$message.error('删除失败：未知错误')
          }
          console.log(data)
        } else {
          // eslint-disable-next-line
          new Promise(resolve => {
            let index = that.messages.indexOf(row)
            console.log(index)
            that.messages.splice(index, 1)
          })
          that.$message.success('删除成功')
        }
      })
    },
    createMessage: function () {
      let content = this.createMessageContent
      let type = this.createMessageType
      if (content === '' || type === '') {
        this.$message.error('请先填写全部信息!')
        return
      }
      console.log(content)
      console.log(type)
      this.showCreateMessageVerifyDialog = true
      auth.generateValidCode(this, (resp) => {
        this.createMessageCodeID = resp.data
        this.createMessageCodePath = 'http://localhost:40000/getValidCode?codeid=' + this.createMessageCodeID
        console.log(this.createMessageCodePath)
      })
    },
    submitValidCode: function () {
      let that = this
      auth.checkValidCode(this, resp => {
        let data = resp.data
        if (data.code === undefined) {
          that.createMessageRequestKey = data
          message.createMessage(that, that.createMessageContent, that.createMessageType, that.createMessageShowPermission, that.createMessageRequestKey)
        } else {
          let reason = data.message
          that.$message.error('验证失败: ' + reason)
        }
      }, this.createMessageCodeID, 'createMessage', this.createMessageCodeStr)
      this.showCreateMessageVerifyDialog = false
    },
    allowJoin: function (row) {
      let mid = row.id
      let that = this
      message.allowJoin(this, mid, resp => {
        if (resp.data === 'Success') {
          message.deleteMessage(that, mid, resp => {
            that.reloadTable(1)
          })
        }
      })
      return false
    },
    passWork: function (row) {
      let wid = row.content.wid
      let mid = row.id
      work.enableWork(this, wid).then(resp => {
        console.log(resp)
        message.deleteMessage(this, mid, resp => {
          this.reloadTable(1)
        })
      })
      return false
    },
    handleRowClick: function (rRow, column, event) {
      console.log(event)
      console.log(rRow)
      let row = rRow
      let rowType = row.type
      switch (rowType) {
        case 'WORK_CHECK':
          let content = JSON.parse(row.content)
          this.$router.push('/work/' + content.wid)
      }
    }
  },
  created () {
    let that = this
    // eslint-disable-next-line
    new Promise(resolve => {
      let userinfo = storage.session.get('user')
      let permission = userinfo.permission
      let index = that.permissions.indexOf(permission)
      console.log(index)
      that.createMessageAvailableShowPermission.splice(index + 1, that.createMessageAvailableShowPermission.length - 1)
      // console.log(that.createMessageAvailableShowPermission)
      // that.createMessageAvailableShowPermission.push(permission)
      that.createMessageShowPermission = permission
    })
    message.messages(this, 0, 1, (resp) => {
      console.log(resp.data)
      that.messages = resp.data.result
      that.totalPages = parseInt(resp.data.totalPages)
    })
    console.log(this)
  },
  mounted () {
    let contentDiv = this.$refs.contentDiv
    let contentHeight = window.getComputedStyle(contentDiv).height
    console.log(contentHeight)
  }
}
</script>

<style src="../../style/message.less" lang="less" scoped></style>
