<template>
  <div class="mainContainer">
    <el-dialog width="50%"
               title="上传资源"
               :visible.sync="showUploadAssetDialog"
    >
      <el-upload
        class="upload-demo"
        drag
        action="http://localhost:40000/uploadWorkAsset"
        :auto-upload=false
        ref="upload"
        :with-credentials="true"
        :data="{wid: this.currentWorkID}"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <el-button class="button" type="primary" @click="upload">上传</el-button>
    </el-dialog>
    <div class="card mainCard">
      <span class="cardTitle">作品管理</span>
      <div class="selfWorksContainer">
        <div class="work" v-for="(work,i) in selfWorks" v-bind:key="work.id">
          <div class="workLeftPart" @click="toWorkPage(work)">
            <img :src="'http://localhost:10001/work/' + work.realID + '/hdImg.jpg'" class="workHeadImg">
            <span v-if="work.enable === 0" class="checking">[审核中]</span>
            <span v-text="work.name" class="workName"></span>
            <i class="fa fa-pencil-square editName" aria-hidden="true" @click="renameWork(work, i)"></i>
          </div>
          <div class="workRightPart">
            <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
            <span v-text="work.likes" class="workLikes"></span>
            <i class="fa fa-archive"></i>
            <span v-text="work.assets" class="workAssets"></span>
            <div class=options>
              <span class="option" @click="showUploadDialog(work.realID)">上传资源</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import work from '../../api/work'
// import { dataAxios } from '../../api/base'
// import upload from '../../util/uploadutil'
export default {
  name: 'workManage',
  data () {
    return {
      selfWorks: null,
      currentSelfWorkPage: 1,
      showUploadAssetDialog: false,
      currentWorkID: 0,
      widAndRealIDIndex: {}
    }
  },
  methods: {
    renameWork: function (row, i) {
      let newName = prompt('新的名字？')
      if (newName === null || newName === '') {
        return
      }
      work.changeWorkName(this, row.realID, newName).then(value => {
        this.selfWorks[i].name = newName
      })
    },
    showUploadDialog: function (id) {
      this.currentWorkID = id
      this.showUploadAssetDialog = true
    },
    toWorkPage: function (row) {
      this.$router.push('/work/' + row.realID)
    },
    upload: function () {
      this.$refs.upload.submit()
    }
  },
  created () {
    work.queryWorksByUser(this, this.currentSelfWorkPage, resp => {
      let data = resp.data
      console.log(data)
      this.selfWorks = data
      this.selfWorks.forEach(ele => {
        let index = this.selfWorks.indexOf(ele)
        this.$set(this.widAndRealIDIndex, ele.realID, index)
        work.queryWorkLikeById(this, ele.realID).then(result => {
          this.$set(this.selfWorks[index], 'likes', result)
        })
      })
    })
  }
}
</script>

<style src="../../style/workManage.less" lang="less" scoped></style>
