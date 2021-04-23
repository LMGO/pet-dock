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
      <!-- 全部 -->
      <!-- <div class="all">全部</div> -->
      <!-- 动态 -->
      <div v-show="issearchingItem == 'post'">
        <div class="post" v-for="(item, index) in postlist" :key="index">
          <div class="detail-area">
            <img class="avatar" :src="item.userinfo.user_avatar" alt="用户头像">
            <div class="detail-info">
              <div class="user-info-time">
                <div class="user-name">{{item.userinfo.user_nickname}}</div>
                <div class="time" v-html="gettime(item.post_time)"></div>
                <!-- <div  >关注TA</div> -->
                <el-button class="follow" v-if="!item.isfollow">关注TA</el-button>
              </div>
              <div class="detail-body">
                <div class="topiclist">
                  <span class="topic" v-for="(topic, topicindex) in item.topic_list" :key="topicindex">#{{topic.topic_name}}</span>
                </div>
                <p class="text">{{item.post_conent}}</p>
                <div class="image-list" v-if="item.post_style == 'image'">
                  <el-image 
                    :preview-src-list="item.postimg"
                    lazy
                    v-for="(image, imageindex) in item.postimg"
                    fit="cover"
                    :src="image"
                    :key="imageindex"
                    ></el-image>
                </div>
                <div class="video-list" v-if="item.post_style == 'video'">
                  <video
                    :src="item.post_video[0]"
                    width="100%"
                    controls="controls"
                  >您的浏览器不支持 video 标签。</video>
                </div>
              </div>
            </div>
          </div>
          <div class="operate">
            <div class="item">
              <img v-if="true" src="../assets/icon/collection.png" alt="">
              <img v-else src="../assets/icon/collection-active.png" alt="">
              <span>{{item.collection_count}}</span>
            </div>
            <div class="item line">
              <!-- <img src="../assets/icon/comment.png" alt="">
              <span>20</span> -->
            </div>
            <div class="item">
              <img v-if="true" src="../assets/icon/like.png" alt="">
              <img v-else src="../assets/icon/like-active.png" alt="">
              <span>{{item.likes_count}}</span>
            </div>
          </div>
          <el-collapse accordion>
            <el-collapse-item class="comment-area">
              <template slot="title">
                展开评论({{item.reply_count}})
              </template>
              <div class="post-comment">
                <el-input
                  class="comment-input"
                  type="textarea"
                  :rows="1"
                  placeholder="和大家分享你的看法吧！"
                  v-model="commenttextarea">
                </el-input>
                <el-button class="post-comment-button">发表</el-button>
              </div>
              <div class="sort-order">
                <div class="sort">
                  <img class="sort-icon" src="../assets/icon/sort.png" alt="排序">
                  <span class="sort-text">切换为{{item.comments_sort_by == 'hot'? '时间':'热度'}}排序</span>
                </div>
              </div>
              <!-- <div 
                class="" 
                v-loading="true"
                element-loading-text="玩命加载中"
                element-loading-background="rgba(255, 255, 255, 0)">
              </div> -->
              <li class="comment-list"  v-for="(comment,cindex) in item.comments" :key="cindex">
                <!-- 一级评论 -->
                <!-- <div class="user"> -->
                  <img class="user-avatar" :src="comment.user_avatar" alt="用户头像">
                  <div class="userinfo-comment">
                      <div class="user-nickname-like">
                        <span class="user-nickname">{{comment.user_nickname}}：</span>
                        <img class="like" v-if="comment.isagreeed" src="../assets/icon/like.png" alt="">
                        <img class="like" v-else src="../assets/icon/like-active.png" alt="">
                        <!-- 为0不显示 -->
                        <span class="agree-count" v-if="comment.replay_agree_count">{{comment.replay_agree_count}}</span>
                      </div>
                      <p>{{comment.comment_content}}</p>
                      <div class="comment-time">
                        <span v-html="gettime(comment.post_reply_time)"></span>
                        <span class="reply">回复</span>
                      </div>
                      <!-- 二级评论 -->
                      <li class="reply-user" v-for="(rcomment,rindex) in comment.related_reply" :key="rindex" >
                          <img class="user-avatar second-avatar" :src="rcomment.author.user_avatar" alt="用户头像">
                          <div class="userinfo-comment">
                            <div class="user-nickname-like">
                              <span class="user-nickname">{{rcomment.author.user_nickname}}：</span>
                              <img class="like" v-if="rcomment.isagreeed" src="../assets/icon/like.png" alt="">
                              <img class="like" v-else src="../assets/icon/like-active.png" alt="">
                              <span  class="agree-count" v-if="rcomment.replay_agree_count">{{rcomment.replay_agree_count}}</span>
                            </div>
                            <p>{{rcomment.comment_content}}</p>
                            <div class="comment-time">
                              <span v-html="gettime(comment.post_reply_time)"></span>
                              <span class="reply">回复</span>
                            </div>

                          </div>

                      </li>
                  <!-- </div> -->
                </div>
              </li> 
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <!-- 视频 -->
      <div v-show="issearchingItem == 'video'">
        <div class="video" v-for="(item, index) in postlist" :key="index">
          <div class="detail-area">
            <img class="avatar" :src="item.userinfo.user_avatar" alt="用户头像">
            <div class="detail-info">
              <div class="user-info-time">
                <div class="user-name">{{item.userinfo.user_nickname}}</div>
                <div class="time" v-html="gettime(item.post_time)"></div>
                <!-- <div  >关注TA</div> -->
                <el-button class="follow" v-if="!item.isfollow">关注TA</el-button>
              </div>
              <div class="detail-body">
                <div class="topiclist">
                  <span class="topic" v-for="(topic, topicindex) in item.topic_list" :key="topicindex">#{{topic.topic_name}}</span>
                </div>
                <p class="text">{{item.post_conent}}</p>
                <!-- <div class="image-list" v-if="item.post_style == 'image'">
                  <el-image 
                    :preview-src-list="srcList"
                    lazy
                    v-for="(item, index) in srcList"
                    fit="cover"
                    :src="item"
                    :key="index"
                    ></el-image>
                </div> -->
                <div class="video-list" v-if="item.post_style == 'video'">
                  <video
                    :src="item.post_video[0]"
                    width="100%"
                    controls="controls"
                  >您的浏览器不支持 video 标签。</video>
                </div>
              </div>
            </div>
          </div>
          <div class="operate">
            <div class="item">
              <img v-if="true" src="../assets/icon/collection.png" alt="">
              <img v-else src="../assets/icon/collection-active.png" alt="">
              <span>{{item.collection_count}}</span>
            </div>
            <div class="item line">
              <!-- <img src="../assets/icon/comment.png" alt="">
              <span>20</span> -->
            </div>
            <div class="item">
              <img v-if="true" src="../assets/icon/like.png" alt="">
              <img v-else src="../assets/icon/like-active.png" alt="">
              <span>{{item.likes_count}}</span>
            </div>
          </div>
          <el-collapse accordion>
            <el-collapse-item class="comment-area">
              <template slot="title">
                展开评论({{item.reply_count}})
              </template>
              <div class="post-comment">
                <el-input
                  class="comment-input"
                  type="textarea"
                  :rows="1"
                  placeholder="和大家分享你的看法吧！"
                  v-model="commenttextarea">
                </el-input>
                <el-button class="post-comment-button">发表</el-button>
              </div>
              <div class="sort-order">
                <div class="sort">
                  <img class="sort-icon" src="../assets/icon/sort.png" alt="排序">
                  <span class="sort-text">切换为{{item.comments_sort_by == 'hot'? '时间':'热度'}}排序</span>
                </div>
              </div>
              <!-- <div 
                class="" 
                v-loading="true"
                element-loading-text="玩命加载中"
                element-loading-background="rgba(255, 255, 255, 0)">
              </div> -->
              <li class="comment-list"  v-for="(comment,cindex) in item.comments" :key="cindex">
                <!-- 一级评论 -->
                <!-- <div class="user"> -->
                  <img class="user-avatar" :src="comment.user_avatar" alt="用户头像">
                  <div class="userinfo-comment">
                      <div class="user-nickname-like">
                        <span class="user-nickname">{{comment.user_nickname}}：</span>
                        <img class="like" v-if="comment.isagreeed" src="../assets/icon/like.png" alt="">
                        <img class="like" v-else src="../assets/icon/like-active.png" alt="">
                        <!-- 为0不显示 -->
                        <span class="agree-count" v-if="comment.replay_agree_count">{{comment.replay_agree_count}}</span>
                      </div>
                      <p>{{comment.comment_content}}</p>
                      <div class="comment-time">
                        <span v-html="gettime(comment.post_reply_time)"></span>
                        <span class="reply">回复</span>
                      </div>
                      <!-- 二级评论 -->
                      <li class="reply-user" v-for="(rcomment,rindex) in comment.related_reply" :key="rindex" >
                          <img class="user-avatar second-avatar" :src="rcomment.author.user_avatar" alt="用户头像">
                          <div class="userinfo-comment">
                            <div class="user-nickname-like">
                              <span class="user-nickname">{{rcomment.author.user_nickname}}：</span>
                              <img class="like" v-if="rcomment.isagreeed" src="../assets/icon/like.png" alt="">
                              <img class="like" v-else src="../assets/icon/like-active.png" alt="">
                              <span  class="agree-count" v-if="rcomment.replay_agree_count">{{rcomment.replay_agree_count}}</span>
                            </div>
                            <p>{{rcomment.comment_content}}</p>
                            <div class="comment-time">
                              <span v-html="gettime(comment.post_reply_time)"></span>
                              <span class="reply">回复</span>
                            </div>

                          </div>

                      </li>
                  <!-- </div> -->
                </div>
              </li> 
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <!-- 文章 -->
      <div v-show="issearchingItem == 'art'">
        <div class="art">
          文章
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import { showformattime } from "../utils/index.js"
import videotest from "../assets/videotest/QQ视频20181122231737.mp4"
export default {
  name: 'CommunityContent',
  components: {
    // 
  },
  props: ['contentType'],
  data(){
    return {
      // issearchingItem: '',
      commenttextarea:'',//评论内容
      // postlist: [
      //   {
      //     post_id: 'tiezi123456', //（文章id）
      //     //多个话题标签
      //     topic_list:[
      //       {
      //         topic_id: 'topic123456',//（话题ID）
      //         topic_name: '宠物猫' //（话题名称）
      //       },{
      //         topic_id: 'topic123456',//（话题ID）
      //         topic_name: '宠物猫真可爱' //（话题名称）
      //       },
      //     ],
      //     userinfo: {
      //       user_id: 'user18487315405' ,
      //       user_nickname: '半途',
      //       user_avatar: require('../assets/img/reg3.jpg')
      //     },
      //     post_style: 'image',//（动态分类text/image/video）
      //     user_grade: 100, //(用户等级0-1000)
      //     isfollow: false ,//(是否关注)
      //     post_conent: '猫仔陪伴的一天，开心',//（帖子内容）
      //     postimg:[
      //       'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
      //       'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
      //       require('../assets/img/reg3.jpg'),
      //       require('../assets/img/reg3.jpg'),
      //       require('../assets/img/reg3.jpg'),
      //       require('../assets/img/reg3.jpg'),
      //       require('../assets/img/reg3.jpg'),
      //     ], //按顺序
      //     post_video: [videotest],//（视频地址）
      //     post_time:'1618654274090',
      //     likes_count: 111, //（点赞数）
      //     collection_count: 20, //（收藏数）
      //     reply_count: 100, //（评论数）
      //     isliked: false,
      //     isfollowed: true,// （是否收藏了）
      //     comments_sort_by:'hot',
      //     comments: [//评论数组
      //       {
      //       //一级评论
      //       post_reply_id: 'comments111',
      //       comment_content:'真可爱',
      //       user_id:'',
      //       user_nickname:'半途',
      //       user_avatar: require("../assets/img/reg3.jpg"),
      //       post_reply_time: '1618654274090',
      //       replay_agree_count:0,
      //       isagreeed: Boolean ,
      //       //二级评论
      //       related_reply:[{
      //         post_reply_id: '111',
      //         author: {
      //           user_id:'',
      //           user_nickname:'乖乖李',
      //           user_avatar:require("../assets/img/reg3.jpg"),
      //         },
      //         reply_to_author:{
      //           user_id:"",
      //           user_nickname:"半途",
      //           user_avatar:require("../assets/img/reg3.jpg"),
      //         },
      //         comment_content: '真可爱',
      //         post_reply_time:'',
      //         replay_agree_count:111,
      //         isagreeed: Boolean 
      //         }]
      //       },{
      //       //一级评论
      //       post_reply_id: 'comments111',
      //       comment_content:'真可爱',
      //       user_id:'',
      //       user_nickname:'半途',
      //       user_avatar: require("../assets/img/reg3.jpg"),
      //       post_reply_time: '1618654274090',
      //       replay_agree_count:0,
      //       isagreeed: Boolean ,
      //       //二级评论
      //       related_reply:[{
      //         post_reply_id: '111',
      //         author: {
      //           user_id:'',
      //           user_nickname:'乖乖李',
      //           user_avatar:require("../assets/img/reg3.jpg"),
      //         },
      //         reply_to_author:{
      //           user_id:"",
      //           user_nickname:"半途",
      //           user_avatar:require("../assets/img/reg3.jpg"),
      //         },
      //         comment_content: '真可爱',
      //         post_reply_time:'',
      //         replay_agree_count:111,
      //         isagreeed: Boolean 
      //         }]
      //       }
      //     ]
      //   },
      //   {
      //     post_id: 'tiezi123456', //（文章id）
      //     //多个话题标签
      //     topic_list:[
      //       {
      //         topic_id: 'topic123456',//（话题ID）
      //         topic_name: '宠物猫' //（话题名称）
      //       },{
      //         topic_id: 'topic123456',//（话题ID）
      //         topic_name: '宠物猫真可爱' //（话题名称）
      //       },
      //     ],
      //     userinfo: {
      //       user_id: 'user18487315405' ,
      //       user_nickname: '半途',
      //       user_avatar: require('../assets/img/reg3.jpg')
      //     },
      //     post_style: 'text',//（动态分类text/image/video）
      //     user_grade: 100, //(用户等级0-1000)
      //     isfollow: false ,//(是否关注)
      //     post_conent: '猫仔陪伴的一天，开心',//（帖子内容）
      //     postimg:[], //按顺序
      //     post_video: [],//（视频地址）
      //     post_time:'1618654274090',
      //     likes_count: 111, //（点赞数）
      //     collection_count: 20, //（收藏数）
      //     reply_count: 100, //（评论数）
      //     isliked: false,
      //     isfollowed: true,// （是否收藏了）
      //     comments_sort_by:'hot',
      //     comments: [//评论数组
      //       {
      //       //一级评论
      //       post_reply_id: 'comments111',
      //       comment_content:'真可爱',
      //       user_id:'',
      //       user_nickname:'半途',
      //       user_avatar: require("../assets/img/reg3.jpg"),
      //       post_reply_time: '1618654274090',
      //       replay_agree_count:0,
      //       isagreeed: Boolean ,
      //       //二级评论
      //       related_reply:[{
      //         post_reply_id: '111',
      //         author: {
      //           user_id:'',
      //           user_nickname:'乖乖李',
      //           user_avatar:require("../assets/img/reg3.jpg"),
      //         },
      //         reply_to_author:{
      //           user_id:"",
      //           user_nickname:"半途",
      //           user_avatar:require("../assets/img/reg3.jpg"),
      //         },
      //         comment_content: '真可爱',
      //         post_reply_time:'',
      //         replay_agree_count:111,
      //         isagreeed: Boolean 
      //         }]
      //       },{
      //       //一级评论
      //       post_reply_id: 'comments111',
      //       comment_content:'真可爱',
      //       user_id:'',
      //       user_nickname:'半途',
      //       user_avatar: require("../assets/img/reg3.jpg"),
      //       post_reply_time: '1618654274090',
      //       replay_agree_count:0,
      //       isagreeed: Boolean ,
      //       //二级评论
      //       related_reply:[{
      //         post_reply_id: '111',
      //         author: {
      //           user_id:'',
      //           user_nickname:'乖乖李',
      //           user_avatar:require("../assets/img/reg3.jpg"),
      //         },
      //         reply_to_author:{
      //           user_id:"",
      //           user_nickname:"半途",
      //           user_avatar:require("../assets/img/reg3.jpg"),
      //         },
      //         comment_content: '真可爱',
      //         post_reply_time:'',
      //         replay_agree_count:111,
      //         isagreeed: Boolean 
      //         }]
      //       }
      //     ]
      //   },
      //   {
      //     post_id: 'tiezi123456', //（文章id）
      //     //多个话题标签
      //     topic_list:[
      //       {
      //         topic_id: 'topic123456',//（话题ID）
      //         topic_name: '宠物猫' //（话题名称）
      //       },{
      //         topic_id: 'topic123456',//（话题ID）
      //         topic_name: '宠物猫真可爱' //（话题名称）
      //       },
      //     ],
      //     userinfo: {
      //       user_id: 'user18487315405' ,
      //       user_nickname: '半途',
      //       user_avatar: require('../assets/img/reg3.jpg')
      //     },
      //     post_style: 'video',//（动态分类text/image/video）
      //     user_grade: 100, //(用户等级0-1000)
      //     isfollow: false ,//(是否关注)
      //     post_conent: '猫仔陪伴的一天，开心',//（帖子内容）
      //     postimg:[], //按顺序
      //     post_video: [videotest],//（视频地址）
      //     post_time:'1618654274090',
      //     likes_count: 111, //（点赞数）
      //     collection_count: 20, //（收藏数）
      //     reply_count: 100, //（评论数）
      //     isliked: false,
      //     isfollowed: true,// （是否收藏了）
      //     comments:[] //评论数组
      //   }
      // ],
      postlist: [
        {
          post_id: 'tiezi123456', //（文章id）
          //多个话题标签
          topic_list:[
            {
              topic_id: 'topic123456',//（话题ID）
              topic_name: '宠物猫' //（话题名称）
            },{
              topic_id: 'topic123456',//（话题ID）
              topic_name: '宠物猫真可爱' //（话题名称）
            },
          ],
          userinfo: {
            user_id: 'user18487315405' ,
            user_nickname: '半途',
            user_avatar: require('../assets/img/reg3.jpg')
          },
          post_style: 'video',//（动态分类text/image/video）
          user_grade: 100, //(用户等级0-1000)
          isfollow: false ,//(是否关注)
          post_conent: '猫仔陪伴的一天，开心',//（帖子内容）
          postimg:[], //按顺序
          post_video: [videotest],//（视频地址）
          post_time:'1618654274090',
          likes_count: 111, //（点赞数）
          collection_count: 20, //（收藏数）
          reply_count: 100, //（评论数）
          isliked: false,
          isfollowed: true,// （是否收藏了）
          comments_sort_by:'hot',
          comments: [//评论数组
            {
            //一级评论
            post_reply_id: 'comments111',
            comment_content:'真可爱',
            user_id:'',
            user_nickname:'半途',
            user_avatar: require("../assets/img/reg3.jpg"),
            post_reply_time: '1618654274090',
            replay_agree_count:0,
            isagreeed: Boolean ,
            //二级评论
            related_reply:[{
              post_reply_id: '111',
              author: {
                user_id:'',
                user_nickname:'乖乖李',
                user_avatar:require("../assets/img/reg3.jpg"),
              },
              reply_to_author:{
                user_id:"",
                user_nickname:"半途",
                user_avatar:require("../assets/img/reg3.jpg"),
              },
              comment_content: '真可爱',
              post_reply_time:'',
              replay_agree_count:111,
              isagreeed: Boolean 
              }]
            },{
            //一级评论
            post_reply_id: 'comments111',
            comment_content:'真可爱',
            user_id:'',
            user_nickname:'半途',
            user_avatar: require("../assets/img/reg3.jpg"),
            post_reply_time: '1618654274090',
            replay_agree_count:0,
            isagreeed: Boolean ,
            //二级评论
            related_reply:[{
              post_reply_id: '111',
              author: {
                user_id:'',
                user_nickname:'乖乖李',
                user_avatar:require("../assets/img/reg3.jpg"),
              },
              reply_to_author:{
                user_id:"",
                user_nickname:"半途",
                user_avatar:require("../assets/img/reg3.jpg"),
              },
              comment_content: '真可爱',
              post_reply_time:'',
              replay_agree_count:111,
              isagreeed: Boolean 
              }]
            }
          ]
        },
        {
          post_id: 'tiezi123456', //（文章id）
          //多个话题标签
          topic_list:[
            {
              topic_id: 'topic123456',//（话题ID）
              topic_name: '宠物猫' //（话题名称）
            },{
              topic_id: 'topic123456',//（话题ID）
              topic_name: '宠物猫真可爱' //（话题名称）
            },
          ],
          userinfo: {
            user_id: 'user18487315405' ,
            user_nickname: '半途',
            user_avatar: require('../assets/img/reg3.jpg')
          },
          post_style: 'video',//（动态分类text/image/video）
          user_grade: 100, //(用户等级0-1000)
          isfollow: false ,//(是否关注)
          post_conent: '猫仔陪伴的一天，开心',//（帖子内容）
          postimg:[], //按顺序
          post_video: [videotest],//（视频地址）
          post_time:'1618654274090',
          likes_count: 111, //（点赞数）
          collection_count: 20, //（收藏数）
          reply_count: 100, //（评论数）
          isliked: false,
          isfollowed: true,// （是否收藏了）
          comments:[] //评论数组
        }
      ],
    }
  },
  methods:{
    getcontent(i) {
      let self = this;
      // self.issearchingItem = i;
      // this.$route.params = {
      //     type: i
      // }
      self.$router.replace({
        name: 'Hot',
        params: {
          type: i
        }
    })
    console.log(self.$route.name)
      if(i == 'all') {
        //获取全部
      } else if( i == 'post') {
        //获取动态
        // self.postlist = []
      } else if(i == 'video') {
        //获取视频
      } else if(i == 'art') {
        //获取文章
      }
    },
    gettime(i){
      return showformattime(i)
    }
  },
  computed:{
    issearchingItem(){
        return this.$route.params.type
      // get() {
      //   return this.$route.params.type
      // },
      // set() {
      //   return this.$route.params.type
      // }
    }
  },
  mounted(){
    console.log(this.$route.params.type)
    console.log(this.contentType)
    //获取不同类型的对应列表
  }
}
</script>
<style lang="scss" scoped>
.hot {
  position: relative;
  border-radius: 2px;
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
    width: 595px;
    margin-top: 45px;
    border-radius: 2px;
    .post, .video {
      background-color: #fff;
      border-radius: 2px;
      padding: 10px 15px;
      margin-top: 10px ;
      &:first-child {
        margin-top: 0;
      }
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
              margin-top: 5px;
              font-size: 12px;
              color: #808080;
            }
            .follow {
              line-height: 14px;
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              color: #fff;
              cursor: pointer;
              border: 1px solid rgb(238, 236, 236);
              padding: 5px 8px;
              background-color: #FDDA5A;
              border-radius: 3px;
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
              max-width: 360px;
              display: flex;
              flex-wrap: wrap;
              margin-top: 4px;
              .el-image {
                width: 110px;
                margin: 2px;
                height: 110px;
                box-sizing: border-box;
                cursor: url('https://img.t.sinajs.cn/t6/style/images/common/big.cur'), auto !important;
              }
            }
            .video-list {
              margin: 4px 10px 2px 2px;
              width: 400px;
            }
          }
        }
      }
      .operate {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 30px;
        margin: 8px;
        padding-top: 5px;
        border-top: 1px solid #ebeef5;
        .item {
          width: 120px;
          padding: 0 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            height: 22px;
            margin-right: 5px;
            cursor: pointer;
          }
          span {
            height: 22px;
            line-height: 26px;
            cursor: pointer;
          }
        }
        .line {
          width: 2px;
          background-color: #CFCFCF;
          height: 15px;
          padding: 0;
        }
      }
      .comment-area {
        padding: 0 30px;
        .post-comment {
          display: flex;
          align-items: center;
          .comment-input {
            flex: 1;
          }
          .post-comment-button {
            width: 56px;
            background-color: #FDDA5A;
            color: #fff;
            margin-left: 20px;
            padding: 5px 8px;
            text-align: center;
          }
        }
        .comment-list{
          clear: both;
          list-style-type: none;
          display: flex;
          margin-top: 6px;
        }
        .reply-user{
          list-style-type: none;
          display: flex;
          margin-top: 6px;
        }
      }
      .sort-order {
        width: 100%;
        margin-left: auto;
        margin: 5px 0;
        border-bottom: 1px solid #EBEEF5;
        .sort {
          display: flex;
          justify-content: flex-end;
          .sort-icon {
            width: 20px;
            height: 20px;
            cursor: pointer;
          }
          .sort-text {
            margin-left: 10px;
            font-size: 12px;
            color: #9F9FA0;
          }
        }
      }
    }
  }
}
// 评论公共样式
.user-avatar{
  height: 30px;
  width: 30px;
  border-radius: 50%;
  cursor: pointer;
}
.second-avatar {
  height: 22px;
  width: 22px;
}
.userinfo-comment {
  font-size: 12px;
  width: 100%;
  margin-left: 5px;
  .user-nickname-like {
    // height: 20px;
    line-height: 20px;
    display: flex;
    .user-nickname {
      font-weight: 600;
      cursor: pointer;
    }
    .like {
      cursor: pointer;
      height: 15px;
      margin-left: auto;
    }
    .agree-count {
      margin-left: 8px;
      color: #9F9FA0;
    }
  }
  p {
    word-break: break-all;
    line-height: 12px;
  }
  .comment-time {
    height: 10px;
    line-height: 10px;
    margin-top: 5px;
    color: rgb(159, 159, 160);
    .reply {
      margin-left: 15px;
      cursor:pointer
    }
  }
}
</style>