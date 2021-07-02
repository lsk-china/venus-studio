<template>
    <div class="mainContainer" style="margin-bottom: 0px;">
      <el-dialog
        title="上传头像"
        :visible.sync="showDialog"
        width="30%"
        @close="reloadHead"
        >
        <el-upload
          with-credentials=true
          class="avatar-uploader"
          action="http://localhost:40000/uploadHead"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-button @click="showDialog = false" type="primary" class="closeDialogButton">关闭</el-button>
      </el-dialog>
      <div class="leftContainer" ref="leftContainer">
        <div style="width: 100%;border-bottom: 1px solid #AEAEAE;padding-bottom: 10px">
          <div class="headContainer">
            <img class="head" :src="head" ref="head" @click="showDialog = true"/>
          </div>
          <span class="username" v-text="username"></span>
        </div>
        <div class="leftButton" @click="toProfile">
          <font-awesome-icon :icon="['fas', 'user']" class="fa-2x leftButtonIcon"></font-awesome-icon>
          <span class="leftButtonText">用户信息</span>
        </div>
        <div v-if="!isGuest" class="leftButton" @click="toClockIn">
          <font-awesome-icon :icon="['fas', 'check-square']" class="fa-2x leftButtonIcon"></font-awesome-icon>
          <span class="leftButtonText">每日签到</span>
        </div>
        <div v-if="!isGuest" class="leftButton" @click="toMessage">
          <font-awesome-icon :icon="['fas', 'comment']" class="fa-2x leftButtonIcon"></font-awesome-icon>
          <span class="leftButtonText">消息管理</span>
        </div>
        <div v-if="!isGuest" class="leftButton" @click="toWorkManage">
          <i class="fa fa-2x fa-archive leftButtonIcon"></i>
          <span class="leftButtonText">作品管理</span>
        </div>
      </div>
      <div class="rightContainer">
        <div class="rightHeader">
          <div class="logoutButton" @click="logout">
            <button class="logout">注销</button>
            <i class="fa fa-sign-out fa-2x logoutImg"></i>
          </div>
        </div>
        <keep-alive>
          <component v-bind:is="rightComponent"></component>
        </keep-alive>
      </div>
    </div>
</template>

<script>
import storage from 'good-storage'
import auth from '../api/auth'
import profile from './user/profile'
import clockin from './user/clockin'
import message from './user/message'
import workManage from './user/workManage'

export default {
  data () {
    return {
      head: '',
      username: '',
      showDialog: false,
      imageUrl: '',
      user: null,
      rightComponent: profile,
      managerPermission: false,
      adminPermission: false,
      isGuest: false
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    reloadHead: function () {
      window.location.reload(true)
    },
    logout: function () {
      let that = this
      this.$confirm('确定要退出吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        storage.session.remove('user')
        auth.logout(that)
      })
    },
    toProfile: function () {
      this.rightComponent = profile
    },
    toClockIn: function () {
      this.rightComponent = clockin
    },
    toMessage: function () {
      this.rightComponent = message
    },
    toWorkManage: function () {
      this.rightComponent = workManage
    }
  },
  created () {
    let userinfo = storage.session.get('user')
    if (userinfo === undefined) {
      this.$router.push('/login')
    }
    this.user = userinfo
    console.log(userinfo)
    this.head = 'http://localhost:10001/head/' + userinfo.id.toString() + '.jpg'
    this.username = userinfo.name
    this.managerPermission = userinfo.permission === 'MANAGER' || userinfo.permisssion === 'ADMIN'
    this.adminPermission = userinfo.permission === 'ADMIN'
    this.isGuest = userinfo.permission === 'GUEST'
  },
  mounted () {
    let leftContainer = this.$refs.leftContainer
    let browserHeight = document.documentElement.clientHeight
    leftContainer.style.height = browserHeight + 'px'
  }
}
</script>

<style src="../style/user.less" lang="less" scoped></style>
