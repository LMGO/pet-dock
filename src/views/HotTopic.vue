<template>
  <div class="hottopic">
    <div class="title">
      <img class="hot-icon" src="../assets/icon/hot.png" alt="">
      <span class="title-text">话题TOP</span>
    </div>
    <div class="cover"></div>
    <div class="topic-list">
      <li class="topic" v-for="(topic,index) in topiclist" :key="index" @click="todetail(topic)">
        <div class="topic-content">
          <div class="topic-title">
            <span class="top" :class="{topone:index==0,toptwo:index==1,topthree:index == 2}">TOP{{index+1}}</span>
            #{{topic.topic_name}}#
          </div>
          <div class="description">{{topic.topic_description}}</div>
          <div class="topic-data">
            <div class="hot">热度：<span v-html="calculate(topic.topic_hot)"></span></div>
            <div class="talk">讨论：<span v-html="calculate(topic.discuss_count)"></span></div>
            <div class="topic_author">发起者：{{topic.user_nickname}}</div>
          </div>
        </div>
        <img class="topic-cover" :src="topic.topic_cover" alt="话题封面" v-show="topic.topic_cover">
      </li>
    </div>
  </div>
</template>
<script>
import { gethotlist } from "../utils/api/topic.js"
export default {
  name: 'HotTopic',
  components: {
    // 
  },
  data(){
    return {
      topiclist:[
        {
          topic_id:'topic123456',
          topic_name:'给猫洗澡ddddddddddddddddddddddddddddddddddddddddddddddd',
          topic_description:'你是如何给猫洗澡的呢，一起来分享吧！你是如何给猫洗澡的呢，一起来分享吧！fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffHHHH哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffHHHH哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或',
          topic_cover:require('../assets/img/reg4.jpg'),
          user_id:'',
          user_nickname:'半途',
          user_avatar: require('../assets/img/reg4.jpg'),
          browse: 10000,
          discuss_count: 1000//引用次数累计
        },{
          topic_id:'',
          topic_name:'给猫洗澡',
          topic_description:'你是如何给猫洗澡的呢，一起来分享吧！你是如何给猫洗澡的呢，一起来分享吧！fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffHHHH哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffHHHH哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或',
          topic_cover:require('../assets/img/reg4.jpg'),
          user_id:'',
          user_nickname:'半途',
          user_avatar: require('../assets/img/reg4.jpg'),
          browse: 10000,
          discuss_count: 1000//引用次数累计
        },{
          topic_id:'',
          topic_name:'给猫洗澡',
          topic_description:'你是如何给猫洗澡的呢，一起来分享吧！你是如何给猫洗澡的呢，一起来分享吧！fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffHHHH哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffHHHH哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或',
          topic_cover:require('../assets/img/reg4.jpg'),
          user_id:'',
          user_nickname:'半途',
          user_avatar: require('../assets/img/reg4.jpg'),
          browse: 10000,
          discuss_count: 1000//引用次数累计
        },{
          topic_id:'',
          topic_name:'给猫洗澡',
          topic_description:'你是如何给猫洗澡的呢，一起来分享吧！你是如何给猫洗澡的呢，一起来分享吧！fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffHHHH哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffHHHH哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或或',
          topic_cover:require('../assets/img/reg4.jpg'),
          user_id:'',
          user_nickname:'半途',
          user_avatar: require('../assets/img/reg4.jpg'),
          browse: 10000,
          discuss_count: 1000//引用次数累计
        }
      ]
    }
  },
  methods:{
    //数据格式化
    calculate(i) {
      if(parseInt(i)>=10000){
        i = (parseInt(i)/10000).toFixed(1)
        return `${i}万`;
      } else {
        return i;
      }
    },
    todetail(i) {
      this.$router.push({
        path: '/search', 
        query: {topicid: i.topic_id}
      });
    }
  },
  async mounted(){
    let res = await gethotlist()
    this.topiclist = res.data.data
  }
}
</script>
<style lang="scss" scoped>
.hottopic {
  width: 595px;
  .title {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 2;
    top: 65px;
    width: 595px;
    background-color: #fff;
    padding: 0 30px 0 60px;
    border-radius: 2px;
    .hot-icon {
      height: 18px;
    }
    .title-text{
      margin-left: 3px;
      font-size: 13px;
      display: inline-block;
      letter-spacing: 1px;
      font-weight: 600;
    }
  }
  .cover {
    background-color: #f6f6f6;
    // background-color: #fcf7b5;
    height: 10px;
    position: fixed;
    z-index: 2;
    width: 595px;
    top: 105px;
  }
  .topic-list {
    width: 100%;
    margin-top: 50px;
    border-radius: 2px;
    // background-color: #fff;
    .topic {
      margin: 8px 0px;
      list-style-type: none;
      display: flex;
      border-radius: 5px;
      padding: 10px 12px;
      border-bottom: 1px solid #EBEEF5;
      background-color: #fff;
      .topic-content{
        flex: 1;
        display: flex;
        flex-direction: column;
        font-size: 12px;
        .topic-title {
          width: 100%;
          height: 20px;
          font-size: 14px;
          max-width:400px ;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          cursor: pointer;
          &:hover {
            color: #fdda5a;
          }
          .top {
            margin-right: 10px;
          }
          .topone {
            color: #f84904;
          }
          .toptwo {
            color: #ec4741;
          }
          .topthree {
            color: #f78686;
          }
        }
        .description {
          margin: 3px 0;
          word-break: break-all;
          overflow: hidden;
          text-overflow:ellipsis;
          display: -webkit-Box;/*必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 */
          -webkit-line-clamp: 3;
          -webkit-Box-orient: vertical;
        }
        .topic-data {
          display: flex;
          flex: 1;
          justify-content: space-between;
          .hot,.talk {
            flex: 1;
          }
          .topic_author {
            flex: 2;
          }
        }
      }
      .topic-cover {
        margin-left: 12px;
        height: 100px;
        width: 150px;
        object-fit: cover;
        border-radius: 5px;
      }
    }
  }
}
</style>
