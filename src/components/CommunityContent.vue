<template>
  <div class="hot">
    <header class="hot-nav">
      <!-- <div class="nav-item" :class="{issearching:issearchingItem == 'all' @click="getcontent('all')"}">全部</div> -->
      <div class="nav-item" :class="{issearching:issearchingItem == 'post'}" @click="getcontent('post')">动态</div>
      <div class="nav-item" :class="{issearching:issearchingItem == 'video'}" @click="getcontent('video')">视频</div>
      <div class="nav-item" :class="{issearching:issearchingItem == 'art'}" @click="getcontent('art')">文章</div>
      <div class="sousuo">
        <input type="text"/>
        <img src="../assets/icon/sousuo.png" alt="">
      </div>
    </header>
    <!-- 遮挡滑动后的内容 -->
    <div class="cover"></div>
    <div class="content">
      <!-- <div class="all">全部</div> -->
      <div class="post" v-show="issearchingItem == 'post'">
        <div class="detail-area">
          <img class="avatar" src="../assets/img/reg3.jpg" alt="">
          <div class="detail-info">
            <div class="user-info-time">
              <div class="user-name">半途</div>
              <div class="time">五分钟前</div>
              <div class="follow">关注TA</div>
            </div>
            <div class="detail-body">
              <div class="topiclist">
                <span class="topic">#可爱的猫</span>
                <span class="topic">#萌宠日常</span>
              </div>
              <p class="text">
                猫猫陪伴的一天！哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或
              </p>
              <div class="image-list" v-if="srcList.length">
                <el-image 
                  :preview-src-list="srcList"
                  lazy
                  v-for="(item, index) in srcList"
                  fit="cover"
                  :src="item"
                  :key="index"
                  ></el-image>
              </div>
              <!-- <div class="video">
                <video
                  :src="item.video[0]"
                  width="100%"
                  controls="controls"
                  v-if="item.video.length"
                >您的浏览器不支持 video 标签。</video>
              </div> -->
            </div>
          </div>
        </div>
        <div class="bottom-area">点赞喜欢等</div>
      </div>
      <div class="video" v-show="issearchingItem == 'video'">
          视频
      </div>
      <div class="art" v-show="issearchingItem == 'art'">
        文章
      </div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  name: 'CommunityContent',
  components: {
    // 
  },
  props: ['contentType'],
  data(){
    return {
      issearchingItem: 'post',
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
        require('../assets/img/reg3.jpg')
      ]
    }
  },
  methods:{
    getcontent(i) {
      let self = this;
      self.issearchingItem = i;
      if(i == 'all') {
        //获取全部
      } else if( i == 'poat') {
        //获取动态
      } else if(i == 'video') {
        //获取视频
      } else if(i == 'art') {
        //获取文章
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.hot {
  position: relative;
  border-radius: 2px;
  // height: 1000px;
  // background-color: transparent;
  .hot-nav {
    display: flex;
    justify-content: space-between;
    position: fixed;
    z-index: 2;
    top: 65px;
    height: 35px;
    width: 595px;
    background-color: #fff;
    padding: 0 30px 0 60px;
    border-radius: 2px;
    .nav-item {
      letter-spacing: 2px;
      line-height: 35px;
      margin-right: 50px;
      cursor: pointer;
      &:hover {
        font-weight: 600;
      }
    }
    .issearching {
        font-weight: 600;
    }
    .sousuo {
      line-height: 35px;
      flex: 1;
      max-width: 200px;
      margin-left: auto;
      position: relative;
      input {
        padding: 0 20px 0 10px;
        width: 100%;
        height: 25px;
        outline: none;
        border-radius: 8px;
        border: 1px solid rgb(192, 190, 190);
        &:hover{
          box-shadow: 2px 2px 3px rgb(214, 212, 212);
        }
      }
      img {
        position: absolute;
        height: 18px;
        right: 1px;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
      }
    }
  }
  .cover {
    // background-color: #f6f6f6;
    background-color: #fcf7b5;
    height: 10px;
    position: fixed;
    z-index: 2;
    width: 595px;
    top: 100px;
  }
  .content {
    height: 2000px;
    margin-top: 45px;
    background-color: #fff;
    border-radius: 2px;
    .post {
      padding: 10px 15px;
      .detail-area {
        display: flex;
        .avatar {
          height: 40px;
          width: 40px;
          border-radius: 50%;
          display: block;
        }
        .detail-info {
          margin-left: 8px;
          width: 100%;
          .user-info-time {
            position: relative;
            height: 40px;
            // background: turquoise;
            .user-name {
              height: 18px;
              font-size: 14px;
              letter-spacing: 1px;
              font-weight: 500;
            }
            .time {
              margin-top: 2px;
              font-size: 12px;
              color: #808080;
            }
            .follow {
              line-height: 14px;
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              color: #EE7F0A;
            }
          }
          .detail-body {
            .topiclist {
              margin-bottom: 5px;
              .topic {
                color: #1846b3;
                margin-left: 10px ;
                  &:first-child {
                    margin-left: 0;
                  }
              }
            }
            .image-list {
              width: 100%;
              max-width: 400px;
              display: flex;
              flex-wrap: wrap;
              margin-top: 8px;
              .el-image {
                width: 120px;
                margin: 2px;
                height: 120px;
                box-sizing: border-box;
              }
            }
          }
        }
      }
    }
  }
}
</style>