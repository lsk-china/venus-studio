<template>
  <div style="width: 100%;height: 100%;">
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
      <el-row class="row">
        <el-col class="col">
          <div class="contentWrapper" id="contentWrapper" v-if="this.workInstance">
            <div class="contentHeader">
              <el-row>
                <el-col>
                  <span class="workTitle" v-text="workInstance.name"></span>
                </el-col>
              </el-row>
              <el-row class="workMeta">
                <el-col span="1">
                  <i class="fa fa-eye"></i>
                  <span class="workViews" v-text="workInstance.views"></span>
                </el-col>
                <el-col span="2">
                  <i class="fa fa-comments"></i>
                  <span class="workComments" v-text="workReply.length"></span>
                </el-col>
              </el-row>
              <div class="dividerWrapper">
                <el-divider class="divider"></el-divider>
              </div>
            </div>
            <div class="uploaderContainer">
              <el-avatar :src="'http://localhost:10001/head/' + this.workInstance.ownerID + '.jpg'"></el-avatar>
              <div class="uploaderMeta">
                <div style="width: 100%; display: flex;">
                  <span class="uploaderName" v-text="uploader.name"></span>
                </div>
                <div style="width: 100%; display: flex;">
                  <span class="uploadTime" v-text="workInstance.createDate"></span>
                </div>
              </div>
            </div>
            <div class="content" :key="workDetailKey" v-html="workDetail"></div>
            <div class="dividerWrapper">
              <el-divider class="divider"></el-divider>
            </div>
            <div class="downloadWrapper">
              <span class="downTitle" v-text="'下载： ' + parseInt(workInstance.assets)"></span>
              <div class="fileList" id="fileList">
                <div class="noDownloads" v-if="workInstance.assets === 0">暂时没有可以下载的文件哦~</div>
                <div  v-if="workInstance.assets > 0"
                      v-for="(asset) in workAssets"
                      v-bind:key="asset.aid"
                      :class="workInstance.assets !== 1  ? 'fileListTerm' : 'fileListTerm noBorder'"
                >
                  <div>
                    <span v-text="asset.name"></span>
                  </div>
                  <div>
                    <span class="downloadButton" @click="downloadAsset(asset)">点击下载</span>
                    <i class="fa fa-download" aria-hidden="true"></i>
                    <span v-text="asset.downloads"></span>
                    <span v-text="asset.uploadTime"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col class="col">
          <div class="replyCard">
            <div class="replyWrapper" id="replyWrapper" v-if="workInstance">
              <div class="replyHeader">
                <span class="totalReplies" v-text="'全部回复:' + workReply.length" placeholder="排序方式……"></span>
              </div>
              <span class="noReply" v-show="this.workReply.length === 0">还没有回复哦~</span>
              <div class="repliesContainer" v-show="this.workReply.length !== 0" id="repliesContainer">
                <div class="reply"
                     v-for="reply in workReply"
                     v-bind:key="reply.id"
                >
                  <div class="senderInfoContainer">
                    <el-avatar :src="'http://localhost:10001/head/' + reply.senderID + '.jpg'" class="senderAvatar"></el-avatar>
                    <div>
                      <el-row>
                        <el-col style="display: flex">
                          <span class="senderName" v-text="reply.senderName"></span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col>
                          <span class="sendDate" v-text="reply.sendDate"></span>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <span class="replyContent" v-text="reply.content"></span>
                  <div class="replyMeta">
                    <div class="replyLike">
                      <i :class="['fa', 'fa-thumbs-o-up', reply.liked ? 'liked' : '', 'likeIcon']" @click="changeReplyLikeState(reply)" aria-hidden="true"></i>
                      <span class="replyLike" v-text="reply.likes"></span>
                    </div>
                  </div>
                </div>
              </div>
              <!--            <el-divider :style="replyDividerStyle"></el-divider>-->
            </div>
            <div class="createReplyWrapper">
              <el-input type="textarea" :rows="5" placeholder="发表回复……" resize="none" v-model="addReplyContent"></el-input>
              <el-button type="primary" class="createReplyButton button" @click="addReply">发布</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import storage from 'good-storage'
import work from '../api/work'
import auth from '../api/auth'
import { assetsAxios } from '../api/base'
import reply from '../api/reply'
import { getUserInfo } from '../util/userutil'
import loadedDirective from '../directives/loadedDirective'

export default {
  name: 'work',
  data () {
    return {
      displayLogin: true,
      head: '',
      displayHead: false,
      workInstance: null,
      workViews: 0,
      workComments: 0,
      uploader: null,
      workDetail: null,
      workDetailKey: 0,
      workReply: [],
      replySorter: '',
      replyDividerStyle: '',
      addReplyContent: '',
      workAssets: null,
      createReplyContent: ''
    }
  },
  directives: {
    loaded: loadedDirective
  },
  methods: {
    loadContent: async function (workID) {
      let resp = await assetsAxios.get('/', {
        params: {
          id: workID
        }
      })
      this.workDetail = resp.data
    },
    changeStyle: function () {
      setTimeout(() => {
        let contentWrapper = document.getElementById('contentWrapper')
        let replyWrapper = document.getElementById('replyWrapper')
        let fileList = document.getElementById('fileList')
        let repliesContainer = document.getElementById('repliesContainer')
        let fileListHeight = parseInt(window.getComputedStyle(fileList).height)
        let replyWrapperHeight = parseInt(window.getComputedStyle(replyWrapper).height)
        // eslint-disable-next-line no-unused-vars
        let repliesContainerHeight = parseInt(window.getComputedStyle(repliesContainer).height)
        console.log(replyWrapperHeight)
        let contentWrapperMargin = parseInt(window.getComputedStyle(contentWrapper).marginTop)
        contentWrapper.style.marginTop = (contentWrapperMargin + replyWrapperHeight + fileListHeight + 150) + 'px'
        let replyWrapperWidth = parseInt(window.getComputedStyle(replyWrapper).width)
        this.replyDividerStyle = 'width: ' + (replyWrapperWidth - 25) + 'px'
      }, 500)
    },
    addReply: function () {
      reply.addReply(this, this.addReplyContent, this.workInstance.wid).then((resp) => {
        console.log(resp)
        this.workReply.push(resp)
        this.addReplyContent = ''
      })
    },
    toUser: function () {
      this.$router.push('/user')
    },
    downloadAsset: function (asset) {
      let aid = asset.aid
      let url = 'http://localhost:40000/downloadWorkAsset?aid=' + aid
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    loadReplyUserNames: async function () {
      this.workReply.forEach(ele => {
        console.log(ele)
        // eslint-disable-next-line no-new
        new Promise(resolve => {
          console.log(ele)
          getUserInfo(ele.senderID).then(result => {
            let username = result.name
            console.log(username)
            this.$set(ele, 'senderName', username)
          })
        })
      })
    },
    loadReplyLikes: function () {
      this.workReply.forEach(aReply => {
        let rid = aReply.rid
        reply.queryReplyLikesById(this, rid, (resp) => {
          let result = resp.data
          this.$set(aReply, 'likes', result)
        })
        reply.isReplyLiked(this, rid, resp => {
          let result = resp.data
          this.$set(aReply, 'liked', result)
        })
      })
    },
    changeReplyLikeState: function (aReply) {
      if (aReply.liked) {
        aReply.liked = false
        aReply.likes--
        reply.deLikeReply(this, aReply.rid)
      } else {
        aReply.liked = true
        aReply.likes++
        reply.likeReply(this, aReply.rid)
      }
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
    let workID = this.$route.params.wid
    if (workID !== undefined) {
      work.queryWorkById(this, workID, resp => {
        this.workInstance = resp.data
        console.log(resp.data)
        let uploaderID = resp.data.ownerID
        auth.queryUserById(this, uploaderID, (resp2) => {
          this.uploader = resp2.data
          console.log(this.uploader)
        })
        reply.queryWorkReplies(this, resp.data.wid, (resp2) => {
          this.workReply = resp2.data
          this.loadReplyLikes()
        })
        this.loadContent(resp.data.wid)
        work.queryWorkAssets(this, resp.data.wid).then(data => {
          this.workAssets = data
          this.changeStyle()
        })
        work.increaseWorkViews(this, resp.data.wid)
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.changeStyle()
    })
  }
}
</script>

<style src="../style/work.less" lang="less" scoped></style>
