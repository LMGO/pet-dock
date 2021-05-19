<template>
  <div class="hot">
    <header class="hot-nav">
      <!-- <div class="nav-item" :class="{issearching:issearchingItem == 'all' @click="getcontent('all')"}">全部</div> -->
      <div
        class="nav-item"
        :class="{issearching:issearchingItem == 'post'}"
        @click="getcontent('post')"
      >动态</div>
      <div
        class="nav-item"
        :class="{issearching:issearchingItem == 'video'}"
        @click="getcontent('video')"
      >视频</div>
      <div
        class="nav-item"
        :class="{issearching:issearchingItem == 'art'}"
        @click="getcontent('art')"
      >文章</div>
      <div class="sousuo">
        <!-- <input type="text" placeholder="搜搜你感兴趣的内容" />
        <img src="../assets/icon/sousuo.png" alt />-->
      </div>
    </header>
    <!-- 遮挡滑动后的内容 -->
    <div class="content">
      <!-- 全部 -->
      <!-- <div class="all">全部</div> -->
      <!-- 动态 -->
      <div v-show="issearchingItem == 'post'">
        <div class="post" v-for="(item, index) in postlist" :key="index">
          <div class="detail-area">
            <img class="avatar" :src="item.user_avatar" alt="用户头像" />
            <div class="detail-info">
              <div class="user-info-time">
                <div class="user-name">{{item.user_nickname}}</div>
                <div class="time" v-html="gettime(item.post_time)"></div>
                <!-- 还需要判断是不是本人 -->
                <el-button
                  class="unfollow"
                  @click.stop="followuser(item)"
                  v-if="!item.isfollow && $store.state.userInfo.user_id!=item.user_id"
                >关注TA</el-button>
                <el-button
                  class="follow"
                  @click.stop="unfollowuser(item)"
                  v-if="item.isfollow && $store.state.userInfo.user_id!=item.user_id"
                >已关注</el-button>
              </div>
              <div class="detail-body">
                <div class="topiclist">
                  <span
                    class="topic"
                    v-for="(topic, topicindex) in item.topiclist"
                    :key="topicindex"
                  >#{{topic.topic_name}}</span>
                </div>
                <p class="text">{{item.post_content}}</p>
                <div class="image-list" v-if="item.post_style == 'image'">
                  <el-image
                    :preview-src-list="item.post_image"
                    lazy
                    v-for="(image, imageindex) in item.post_image"
                    fit="cover"
                    :src="image.image_id"
                    :key="imageindex"
                  ></el-image>
                </div>
                <div class="video-list" v-if="item.post_style == 'video'">
                  <video
                    :src="item.post_video[0].video_id"
                    width="100%"
                    controls="controls"
                  >您的浏览器不支持 video 标签。</video>
                </div>
              </div>
            </div>
          </div>
          <div class="operate">
            <div class="item">
              <img
                @click.stop="collectionpost(item)"
                v-if="!item.iscollection"
                src="../assets/icon/collection.png"
                alt
              />
              <img
                @click.stop="uncollectionpost(item)"
                v-else
                src="../assets/icon/collection-active.png"
                alt
              />
              <span>{{calculatedata(item.post_collections)}}</span>
            </div>
            <div class="item line">
              <!-- <img src="../assets/icon/comment.png" alt="">
              <span>20</span>-->
            </div>
            <div class="item">
              <img
                @click.stop="likepost(item)"
                v-if="!item.isliked"
                src="../assets/icon/like.png"
                alt
              />
              <img @click.stop="dislikepost(item)" v-else src="../assets/icon/like-active.png" alt />
              <span>{{calculatedata(item.post_likes)}}</span>
            </div>
          </div>
          <el-collapse accordion @change="cleartext">
            <el-collapse-item class="comment-area">
              <template slot="title">展开评论({{calculatedata(item.post_comments)}})</template>
              <div class="post-comment">
                <el-input
                  class="comment-input"
                  type="textarea"
                  :rows="1"
                  placeholder="和大家分享你的看法吧！"
                  v-model="commenttextarea"
                ></el-input>
                <el-button @click.stop="comment(item)" class="post-comment-button">发表</el-button>
              </div>
              <div class="sort-order">
                <div class="sort">
                  <img class="sort-icon" src="../assets/icon/sort.png" alt="排序" />
                  <span class="sort-text">切换为{{item.comments_sort_by == 'hot'? '时间':'热度'}}排序</span>
                </div>
              </div>
              <!-- <div 
                class="" 
                v-loading="true"
                element-loading-text="玩命加载中"
                element-loading-background="rgba(255, 255, 255, 0)">
              </div>-->
              <li class="comment-list" v-for="(comment,cindex) in item.comments" :key="cindex">
                <!-- 一级评论 -->
                <!-- <div class="user"> -->
                <img class="user-avatar" :src="comment.user_avatar" alt="用户头像" />
                <div class="userinfo-comment">
                  <div class="user-nickname-like">
                    <span class="user-nickname">{{comment.user_nickname}}：</span>
                    <!-- <img class="like" v-if="comment.isagreeed" src="../assets/icon/like.png" alt />
                    <img class="like" v-else src="../assets/icon/like-active.png" alt />-->
                    <!-- 为0不显示 -->
                    <!-- <span
                      class="agree-count"
                      v-if="comment.reply_agree_count"
                    >{{comment.reply_agree_count}}</span>-->
                  </div>
                  <p>{{comment.comment_content}}</p>
                  <div class="comment-time">
                    <span v-html="gettime(comment.reply_time)"></span>
                    <!-- <span class="reply">回复</span> -->
                  </div>
                  <!-- 二级评论 -->
                  <!-- <li
                    class="reply-user"
                    v-for="(rcomment,rindex) in comment.related_reply"
                    :key="rindex"
                  >
                    <img
                      class="user-avatar second-avatar"
                      :src="rcomment.author.user_avatar"
                      alt="用户头像"
                    />
                    <div class="userinfo-comment">
                      <div class="user-nickname-like">
                        <span class="user-nickname">{{rcomment.author.user_nickname}}：</span>
                        <img
                          class="like"
                          v-if="rcomment.isagreeed"
                          src="../assets/icon/like.png"
                          alt
                        />
                        <img class="like" v-else src="../assets/icon/like-active.png" alt />
                        <span
                          class="agree-count"
                          v-if="rcomment.reply_agree_count"
                        >{{rcomment.reply_agree_count}}</span>
                      </div>
                      <p>{{rcomment.comment_content}}</p>
                      <div class="comment-time">
                        <span v-html="gettime(comment.reply_time)"></span>
                        <span class="reply">回复</span>
                      </div>
                    </div>
                  </li>-->
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
            <img class="avatar" :src="item.user_avatar" alt="用户头像" />
            <div class="detail-info">
              <div class="user-info-time">
                <div class="user-name">{{item.user_nickname}}</div>
                <div class="time" v-html="gettime(item.post_time)"></div>
                <el-button
                  class="unfollow"
                  @click.stop="followuser(item)"
                  v-if="!item.isfollow && $store.state.userInfo.user_id!=item.user_id"
                >关注TA</el-button>
                <el-button
                  class="follow"
                  @click.stop="unfollowuser(item)"
                  v-if="item.isfollow && $store.state.userInfo.user_id!=item.user_id"
                >已关注</el-button>
              </div>
              <div class="detail-body">
                <div class="topiclist">
                  <span
                    class="topic"
                    v-for="(topic, topicindex) in item.topiclist"
                    :key="topicindex"
                  >#{{topic.topic_name}}</span>
                </div>
                <p class="text">{{item.post_content}}</p>
                <!-- <div class="image-list" v-if="item.post_style == 'image'">
                  <el-image 
                    :preview-src-list="srcList"
                    lazy
                    v-for="(item, index) in srcList"
                    fit="cover"
                    :src="item"
                    :key="index"
                    ></el-image>
                </div>-->
                <div class="video-list" v-if="item.post_style == 'video'">
                  <video
                    :src="item.post_video[0].video_id"
                    width="100%"
                    controls="controls"
                  >您的浏览器不支持 video 标签。</video>
                </div>
              </div>
            </div>
          </div>
          <div class="operate">
            <div class="item">
              <img
                @click.stop="collectionpost(item)"
                v-if="!item.iscollection"
                src="../assets/icon/collection.png"
                alt
              />
              <img
                @click.stop="uncollectionpost(item)"
                v-else
                src="../assets/icon/collection-active.png"
                alt
              />
              <span>{{calculatedata(item.post_collections)}}</span>
            </div>
            <div class="item line">
              <!-- <img src="../assets/icon/comment.png" alt="">
              <span>20</span>-->
            </div>
            <div class="item">
              <img
                @click.stop="likepost(item)"
                v-if="!item.isliked"
                src="../assets/icon/like.png"
                alt
              />
              <img @click.stop="dislikepost(item)" v-else src="../assets/icon/like-active.png" alt />
              <span>{{calculatedata(item.post_likes)}}</span>
            </div>
          </div>
          <el-collapse accordion>
            <el-collapse-item class="comment-area">
              <template slot="title">展开评论({{calculatedata(item.post_comments)}})</template>
              <div class="post-comment">
                <el-input
                  class="comment-input"
                  type="textarea"
                  :rows="1"
                  placeholder="和大家分享你的看法吧！"
                  v-model="commenttextarea"
                ></el-input>
                <el-button class="post-comment-button" @click.stop="comment(item)">发表</el-button>
              </div>
              <div class="sort-order">
                <div class="sort">
                  <img class="sort-icon" src="../assets/icon/sort.png" alt="排序" />
                  <span class="sort-text">切换为{{item.comments_sort_by == 'hot'? '时间':'热度'}}排序</span>
                </div>
              </div>
              <!-- <div 
                class="" 
                v-loading="true"
                element-loading-text="玩命加载中"
                element-loading-background="rgba(255, 255, 255, 0)">
              </div>-->
              <li class="comment-list" v-for="(comment,cindex) in item.comments" :key="cindex">
                <!-- 一级评论 -->
                <!-- <div class="user"> -->
                <img class="user-avatar" :src="comment.user_avatar" alt="用户头像" />
                <div class="userinfo-comment">
                  <div class="user-nickname-like">
                    <span class="user-nickname">{{comment.user_nickname}}：</span>
                    <!-- <img class="like" v-if="comment.isagreeed" src="../assets/icon/like.png" alt />
                    <img class="like" v-else src="../assets/icon/like-active.png" alt />-->
                    <!-- 为0不显示 -->
                    <span
                      class="agree-count"
                      v-if="comment.reply_agree_count"
                    >{{comment.reply_agree_count}}</span>
                  </div>
                  <p>{{comment.comment_content}}</p>
                  <div class="comment-time">
                    <span v-html="gettime(comment.reply_time)"></span>
                    <!-- <span class="reply">回复</span> -->
                  </div>
                  <!-- 二级评论 -->
                  <!-- <li
                    class="reply-user"
                    v-for="(rcomment,rindex) in comment.related_reply"
                    :key="rindex"
                  >
                    <img
                      class="user-avatar second-avatar"
                      :src="rcomment.author.user_avatar"
                      alt="用户头像"
                    />
                    <div class="userinfo-comment">
                      <div class="user-nickname-like">
                        <span class="user-nickname">{{rcomment.author.user_nickname}}：</span>
                        <img
                          class="like"
                          v-if="rcomment.isagreeed"
                          src="../assets/icon/like.png"
                          alt
                        />
                        <img class="like" v-else src="../assets/icon/like-active.png" alt />
                        <span
                          class="agree-count"
                          v-if="rcomment.reply_agree_count"
                        >{{rcomment.reply_agree_count}}</span>
                      </div>
                      <p>{{rcomment.comment_content}}</p>
                      <div class="comment-time">
                        <span v-html="gettime(comment.reply_time)"></span>
                        <span class="reply">回复</span>
                      </div>
                    </div>
                  </li>-->
                </div>
              </li>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <!-- 文章 -->
      <div v-show="issearchingItem == 'art'">
        <div class="art" v-for="(item, index) in artlist" :key="index">
          <div class="detail-area">
            <img class="avatar" :src="item.user_avatar" alt="用户头像" />
            <div class="detail-info">
              <div class="user-info-time">
                <div class="user-name">{{item.user_nickname}}</div>
                <div class="time" v-html="gettime(item.post_time)"></div>
                <!-- 还需要判断是不是本人 -->
                <el-button
                  class="unfollow"
                  @click.stop="followuser(item)"
                  v-if="!item.isfollow && $store.state.userInfo.user_id!=item.user_id"
                >关注TA</el-button>
                <el-button
                  class="follow"
                  @click.stop="unfollowuser(item)"
                  v-if="item.isfollow && $store.state.userInfo.user_id!=item.user_id"
                >已关注</el-button>
              </div>
              <div class="detail-body art-body" @click.stop="todetail(item.art_id)">
                <span class="art_guide">导读：{{item.art_guide}}</span>
                <img :src="item.art_cover" alt />
                <!-- 无封面显示替代图 -->
                <!-- <img v-else width="100%" height="100%" src="" alt=""> -->
                <span class="art-title">【 {{item.art_title}} 】</span>
              </div>
            </div>
          </div>
          <div class="operate artoperate">
            <div class="item read">
              <span>阅 读：</span>
              <span>{{calculatedata(item.art_browses)}}</span>
            </div>
            <div class="item">
              <img
                @click.stop="collectionart(item)"
                v-if="!item.iscollection"
                src="../assets/icon/collection.png"
                alt
              />
              <img
                @click.stop="uncollectionart(item)"
                v-else
                src="../assets/icon/collection-active.png"
                alt
              />
              <span>{{calculatedata(item.art_collections)}}</span>
            </div>
            <!-- 分割线 -->
            <div class="item line"></div>
            <div class="item">
              <img
                @click.stop="likeart(item)"
                v-if="!item.isliked"
                src="../assets/icon/like.png"
                alt
              />
              <img @click.stop="dislikeart(item)" v-else src="../assets/icon/like-active.png" alt />
              <span>{{calculatedata(item.art_likes)}}</span>
            </div>
          </div>
          <el-collapse accordion @change="cleartext">
            <el-collapse-item class="comment-area">
              <template slot="title">展开评论({{calculatedata(item.art_comments)}})</template>
              <div class="post-comment">
                <el-input
                  class="comment-input"
                  type="textarea"
                  :rows="1"
                  placeholder="和大家分享你的看法吧！"
                  v-model="commenttextarea"
                ></el-input>
                <el-button @click.stop="commentart(item)" class="post-comment-button">发表</el-button>
              </div>
              <div class="sort-order">
                <div class="sort">
                  <img class="sort-icon" src="../assets/icon/sort.png" alt="排序" />
                  <span class="sort-text">切换为{{item.comments_sort_by == 'hot'? '时间':'热度'}}排序</span>
                </div>
              </div>
              <!-- <div 
                class="" 
                v-loading="true"
                element-loading-text="玩命加载中"
                element-loading-background="rgba(255, 255, 255, 0)">
              </div>-->
              <li class="comment-list" v-for="(comment,cindex) in item.comments" :key="cindex">
                <!-- 一级评论 -->
                <!-- <div class="user"> -->
                <img class="user-avatar" :src="comment.user_avatar" alt="用户头像" />
                <div class="userinfo-comment">
                  <div class="user-nickname-like">
                    <span class="user-nickname">{{comment.user_nickname}}：</span>
                    <!-- <img class="like" v-if="comment.isagreeed" src="../assets/icon/like.png" alt />
                    <img class="like" v-else src="../assets/icon/like-active.png" alt />-->
                    <!-- 为0不显示 -->
                    <!-- <span
                      class="agree-count"
                      v-if="comment.reply_agree_count"
                    >{{comment.reply_agree_count}}</span>-->
                  </div>
                  <p>{{comment.comment_content}}</p>
                  <div class="comment-time">
                    <span v-html="gettime(comment.reply_time)"></span>
                    <!-- <span class="reply">回复</span> -->
                  </div>
                  <!-- 二级评论 -->
                  <!-- <li
                    class="reply-user"
                    v-for="(rcomment,rindex) in comment.related_reply"
                    :key="rindex"
                  >
                    <img
                      class="user-avatar second-avatar"
                      :src="rcomment.author.user_avatar"
                      alt="用户头像"
                    />
                    <div class="userinfo-comment">
                      <div class="user-nickname-like">
                        <span class="user-nickname">{{rcomment.author.user_nickname}}：</span>
                        <img
                          class="like"
                          v-if="rcomment.isagreeed"
                          src="../assets/icon/like.png"
                          alt
                        />
                        <img class="like" v-else src="../assets/icon/like-active.png" alt />
                        <span
                          class="agree-count"
                          v-if="rcomment.reply_agree_count"
                        >{{rcomment.reply_agree_count}}</span>
                      </div>
                      <p>{{rcomment.comment_content}}</p>
                      <div class="comment-time">
                        <span v-html="gettime(comment.reply_time)"></span>
                        <span class="reply">回复</span>
                      </div>
                    </div>
                  </li>-->
                </div>
              </li>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import { showformattime, getTime, uuid } from "../utils/index.js";
import {
  gethotpostlist,
  gethotvideolist,
  getnewpostlist,
  getnewvideolist,
  getfollowpostlist,
  getfollowvideolist,
  likepost,
  dislikepost,
  collectionpost,
  uncollectionpost,
  commentpost
} from "../utils/api/post.js";
import { followuser, unfollowuser } from "../utils/api/user.js";
import { gethotartlist, getnewartlist,getfollowartlist,likeart,dislikeart,collectionart,uncollectionart,commentart } from "../utils/api/art.js";
// import videotest from "../assets/videotest/QQ视频20181122231737.mp4";
export default {
  name: "CommunityContent",
  components: {
    //
  },
  props: ["contentType"],
  data() {
    return {
      commenttextarea: "", //评论内容
      postlist: [],
      artlist: [
        // {
        //   user_avatar: "http://cdn.fengblog.xyz/54f9b66041ab8c16",
        //   user_grade: 0,
        //   user_id: "usera52d4284838",
        //   user_nickname: "半途",
        //   art_id: "11",
        //   art_title: "养猫的第十五天",
        //   art_cover: "http://cdn.fengblog.xyz/54f9b66041ab8c16",
        //   art_guide: "养猫，",
        //   art_content: "哈哈哈",
        //   post_time: "1620279629571",
        //   art_likes: 0,
        //   art_collections: 0,
        //   art_comments: 1,
        //   art_browses: 0,
        //   iscollection: 0,
        //   isliked: 0,
        //   isfollow: 0,
        //   is_public: 1,
        //   comments: [
        //     {
        //       comment_content: "哈哈哈哈，我觉得都很可爱，你们觉得呢",
        //       reply_id: "pce3cc604eaca6a",
        //       reply_time: "1620284257493",
        //       user_avatar: "http://cdn.fengblog.xyz/54f9b66041ab8c16",
        //       user_id: "usera52d4284838",
        //       user_nickname: "半途"
        //     }
        //   ]
        // }
      ]
    };
  },
  methods: {
    cleartext() {
      this.commenttextarea = "";
    },
    //导航栏切换
    async getcontent(i) {
      this.commenttextarea = "";
      let self = this;
      if (self.issearchingItem == i) {
        return;
      }
      self.$router.replace({
        name: self.$route.name,
        params: {
          type: i
        }
      });
      console.log(self.$route.name);
      if (i == "all") {
        //获取全部
      } else if (i == "post") {
        //获取动态
        let params = {
          user_id: this.$store.state.userInfo.user_id
        };
        if (this.contentType == "hot") {
          let res = await gethotpostlist(params);
          if (res.data.code == 0) {
            this.postlist = res.data.data;
          } else {
            this.$message({
              message: "抱歉，系统异常！",
              duration: 2000,
              type: "error"
            });
          }
        }
        if (this.contentType == "newPost") {
          let res = await getnewpostlist(params);
          if (res.data.code == 0) {
            this.postlist = res.data.data;
          } else {
            this.$message({
              message: "抱歉，系统异常！",
              duration: 2000,
              type: "error"
            });
          }
        }
        if (this.contentType == "myFollows") {
          let res = await getfollowpostlist(params);
          if (res.data.code == 0) {
            this.postlist = res.data.data;
          } else {
            this.$message({
              message: "抱歉，系统异常！",
              duration: 2000,
              type: "error"
            });
          }
        }
      } else if (i == "video") {
        //获取视频
        let params = {
          user_id: this.$store.state.userInfo.user_id
        };
        if (this.contentType == "hot") {
          let res = await gethotvideolist(params);
          if (res.data.code == 0) {
            this.postlist = res.data.data;
          } else {
            this.$message({
              message: "抱歉，系统异常！",
              duration: 2000,
              type: "error"
            });
          }
        }
        if (this.contentType == "newPost") {
          let res = await getnewvideolist(params);
          if (res.data.code == 0) {
            this.postlist = res.data.data;
          } else {
            this.$message({
              message: "抱歉，系统异常！",
              duration: 2000,
              type: "error"
            });
          }
        }
        if (this.contentType == "myFollows") {
          let res = await getfollowvideolist(params);
          if (res.data.code == 0) {
            this.postlist = res.data.data;
          } else {
            this.$message({
              message: "抱歉，系统异常！",
              duration: 2000,
              type: "error"
            });
          }
        }
      } else if (i == "art") {
        //获取文章
        let params = {
          user_id: this.$store.state.userInfo.user_id
        };
        if (this.contentType == "hot") {
          let res = await gethotartlist(params);
          if (res.data.code == 0) {
            this.artlist = res.data.data;
          } else {
            this.$message({
              message: "抱歉，系统异常！",
              duration: 2000,
              type: "error"
            });
          }
        }
        if (this.contentType == "newPost") {
          let res = await getnewartlist(params);
          if (res.data.code == 0) {
            this.artlist = res.data.data;
          } else {
            this.$message({
              message: "抱歉，系统异常,获取失败！",
              duration: 2000,
              type: "error"
            });
          }
        }
        if (this.contentType == "myFollows") {
          let res = await getfollowartlist(params);
          if (res.data.code == 0) {
            this.postlist = res.data.data;
          } else {
            this.$message({
              message: "抱歉，系统异常！",
              duration: 2000,
              type: "error"
            });
          }
        }
      }
    },
    //格式化时间
    gettime(i) {
      return showformattime(i);
    },
    //格式化点赞收藏数据
    calculatedata(i) {
      if (parseInt(i) >= 10000) {
        i = (parseInt(i) / 10000).toFixed(1);
        return `${i}万`;
      } else {
        return i;
      }
    },
    async followuser(i){
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        follow: i.user_id,
        fans: this.$store.state.userInfo.user_id,
        follow_time: getTime()
      };
      let res = await followuser(data);
      if (res.data.code == 0) {
        this.$set(i, "isfollow", 1);
      }else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    async unfollowuser(i){
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        follow: i.user_id,
        fans: this.$store.state.userInfo.user_id
      };
      let res = await unfollowuser(data);
      if (res.data.code == 0) {
        this.$set(i, "isfollow", 0);
      }else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    /*--------------帖子部分----------------*/
    //点赞
    async likepost(item) {
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        post_id: item.post_id,
        user_id: this.$store.state.userInfo.user_id,
        operate_time: getTime()
      };
      let res = await likepost(data);
      if (res.data.code == 0) {
        let count = item.post_likes + 1;
        this.$set(item, "isliked", 1);
        this.$set(item, "post_likes", count);
      } else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //取消点赞
    async dislikepost(item) {
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        post_id: item.post_id,
        user_id: this.$store.state.userInfo.user_id
      };
      let res = await dislikepost(data);
      if (res.data.code == 0) {
        this.$set(item, "isliked", 0);
        let count = item.post_likes - 1;
        this.$set(item, "post_likes", count);
      } else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //收藏
    async collectionpost(item) {
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        post_id: item.post_id,
        user_id: this.$store.state.userInfo.user_id,
        operate_time: getTime()
      };
      let res = await collectionpost(data);
      if (res.data.code == 0) {
        this.$set(item, "iscollection", 1);
        let count = item.post_collections + 1;
        this.$set(item, "post_collections", count);
      } else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //取消收藏
    async uncollectionpost(item) {
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        post_id: item.post_id,
        user_id: this.$store.state.userInfo.user_id
      };
      let res = await uncollectionpost(data);
      if (res.data.code == 0) {
        this.$set(item, "iscollection", 0);
        let count = item.post_collections - 1;
        this.$set(item, "post_collections", count);
      } else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //评论
    async comment(item) {
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      if (!this.commenttextarea) {
        this.$message({
          message: "评论内容不能为空！",
          duration: 2000,
          type: "warning"
        });
        return;
      }
      let data = {
        reply_id: uuid("post_comment"),
        post_id: item.post_id,
        user_id: this.$store.state.userInfo.user_id,
        comment_content: this.commenttextarea,
        reply_time: getTime()
      };
      await commentpost(data).then(res => {
        if (res.data.code == 0) {
          let list = item.comments;
          let obj = {
            reply_id: data.reply_id,
            comment_content: data.comment_content,
            user_id: this.$store.state.userInfo.user_id,
            user_nickname: this.$store.state.userInfo.user_nickname,
            user_avatar: this.$store.state.userInfo.user_avatar,
            reply_time: data.reply_time
          };
          console.log(list);
          list.push(obj);
          item.comments = list;
          let count = item.post_comments + 1;
          this.$set(item, "post_comments", count);
          console.log(item);
          this.commenttextarea = "";
          this.$message({
            message: "评论成功！",
            duration: 2000,
            type: "success"
          });
        }
      });
    },
    /*--------------文章部分----------------*/
    todetail(e) {
      this.$router.push({
        name: "ArtDetail",
        params: {
          art_id: e
        }
      });
    },
    //点赞
    async likeart(item) {
      console.log(item);
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        art_id: item.art_id,
        user_id: this.$store.state.userInfo.user_id,
        operate_time: getTime()
      };
      let res = await likeart(data)
      if(res.data.code == 0) {
        let count = item.art_likes + 1;
        this.$set(item, "isliked", 1);
        this.$set(item, "art_likes", count);
      }else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //取消点赞
    async dislikeart(item) {
      console.log(item);
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        art_id: item.art_id,
        user_id: this.$store.state.userInfo.user_id
      };
      let res = await dislikeart(data)
      if(res.data.code == 0) {
        this.$set(item, "isliked", 0);
        let count = item.art_likes - 1;
        this.$set(item, "art_likes", count);
      }else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //收藏
    async collectionart(item) {
      console.log(item);
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        art_id: item.art_id,
        user_id: this.$store.state.userInfo.user_id,
        operate_time: getTime()
      };
      let res = await collectionart(data)
       if(res.data.code == 0) {
        this.$set(item, "iscollection", 1);
        let count = item.art_collections + 1;
        this.$set(item, "art_collections", count);
      }else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //取消收藏
    async uncollectionart(item) {
      console.log(item);
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      let data = {
        art_id: item.art_id,
        user_id: this.$store.state.userInfo.user_id
      };
      let res = await uncollectionart(data)
      if(res.data.code == 0) {
        this.$set(item, "iscollection", 0);
        let count = item.art_collections - 1;
        this.$set(item, "art_collections", count);
      }else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    //评论
    async commentart(item) {
      console.log(item);
      if (!this.$store.state.userInfo.user_id) {
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return;
      }
      if (!this.commenttextarea) {
        this.$message({
          message: "评论内容不能为空！",
          duration: 2000,
          type: "warning"
        });
        return;
      }
      let data = {
        reply_id:uuid("art_comment"),
        art_id: item.art_id,
        user_id: this.$store.state.userInfo.user_id,
        comment_content:this.commenttextarea,
        reply_time:getTime()
      };
      await commentart(data).then(res=>{
        if(res.data.code == 0){
          let list = item.comments
          let obj = {
            reply_id: data.reply_id,
            comment_content: data.comment_content,
            user_id: this.$store.state.userInfo.user_id,
            user_nickname: this.$store.state.userInfo.user_nickname,
            user_avatar: this.$store.state.userInfo.user_avatar,
            reply_time: data.reply_time,
          }
          console.log(list)
          list.push(obj)
          item.comments = list
          let count = item.art_comments + 1;
          this.$set(item, "art_comments", count);
          console.log(item)
          this.commenttextarea = ''
          this.$message({
            message: "评论成功！",
            duration: 2000,
            type: "success"
          });
        }
      })
    }
  },
  computed: {
    issearchingItem() {
      return this.$route.params.type;
      // get() {
      //   return this.$route.params.type
      // },
      // set() {
      //   return this.$route.params.type
      // }
    }
  },
  async mounted() {
    if (localStorage.userInfo) {
      let userInfo = JSON.parse(localStorage.userInfo);
      this.$store.dispatch("getUserInfo", userInfo);
    }
    if (this.$route.params.type == "post") {
      let params = {
        user_id: this.$store.state.userInfo.user_id
      };
      if (this.contentType == "hot") {
        let res = await gethotpostlist(params);
        if (res.data.code == 0) {
          this.postlist = res.data.data;
        } else {
          this.$message({
            message: "抱歉，系统异常！",
            duration: 2000,
            type: "error"
          });
        }
      }
      if (this.contentType == "newPost") {
        let res = await getnewpostlist(params);
        if (res.data.code == 0) {
          this.postlist = res.data.data;
        } else {
          this.$message({
            message: "抱歉，系统异常！",
            duration: 2000,
            type: "error"
          });
        }
      }
      if (this.contentType == "myFollows") {
        let res = await getfollowpostlist(params);
        if (res.data.code == 0) {
          this.postlist = res.data.data;
        } else {
          this.$message({
            message: "抱歉，系统异常！",
            duration: 2000,
            type: "error"
          });
        }
      }
    } else if (this.$route.params.type == "video") {
      let params = {
        user_id: this.$store.state.userInfo.user_id
      };
      if (this.contentType == "hot") {
        let res = await gethotvideolist(params);
        if (res.data.code == 0) {
          this.postlist = res.data.data;
        } else {
          this.$message({
            message: "抱歉，系统异常！",
            duration: 2000,
            type: "error"
          });
        }
      }
      if (this.contentType == "newPost") {
        let res = await getnewvideolist(params);
        if (res.data.code == 0) {
          this.postlist = res.data.data;
        } else {
          this.$message({
            message: "抱歉，系统异常！",
            duration: 2000,
            type: "error"
          });
        }
      }
      if (this.contentType == "myFollows") {
        let res = await getfollowvideolist(params);
        if (res.data.code == 0) {
          this.postlist = res.data.data;
        } else {
          this.$message({
            message: "抱歉，系统异常！",
            duration: 2000,
            type: "error"
          });
        }
      }
    } else if (this.$route.params.type == "art") {
      let params = {
        user_id: this.$store.state.userInfo.user_id
      };
      if (this.contentType == "hot") {
        let res = await gethotartlist(params);
        if (res.data.code == 0) {
          this.artlist = res.data.data;
        } else {
          this.$message({
            message: "抱歉，系统异常！",
            duration: 2000,
            type: "error"
          });
        }
      }
      if (this.contentType == "newPost") {
        let res = await getnewartlist(params);
        if (res.data.code == 0) {
          this.artlist = res.data.data;
        } else {
          this.$message({
            message: "抱歉，系统异常！",
            duration: 2000,
            type: "error"
          });
        }
      }
      if (this.contentType == "myFollows") {
        let res = await getfollowartlist(params);
        if (res.data.code == 0) {
          this.artlist = res.data.data;
        } else {
          this.$message({
            message: "抱歉，系统异常！",
            duration: 2000,
            type: "error"
          });
        }
      }
    }
  }
};
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
    box-shadow: 1px 1px 3px rgb(207, 206, 206);
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
      font-size: 12px;
      input {
        padding: 0 20px 0 10px;
        width: 100%;
        height: 25px;
        outline: none;
        border-radius: 15px;
        background-color: #fafafa;
        border: 1px solid rgb(192, 190, 190);
        &:hover {
          box-shadow: 1px 1px 3px rgb(214, 212, 212);
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
  .content {
    width: 595px;
    margin-top: 45px;
    border-radius: 2px;
    .post,
    .video,
    .art {
      background-color: #fff;
      border-radius: 2px;
      padding: 10px 15px;
      margin-top: 10px;
      box-shadow: 1px 1px 3px rgb(207, 206, 206);
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
              background-color: #fdda5a !important;
              border-radius: 3px;
              &:hover {
                background-color: #f8c405 !important;
              }
            }
            .unfollow {
              line-height: 14px;
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              color: #a5a5a5;
              cursor: pointer;
              border: 1px solid rgb(238, 236, 236);
              padding: 5px 8px;
              background-color: #fff6d4 !important;
              border-radius: 3px;
              &:hover {
                background-color: #f8c405 !important;
              }
            }
          }
          .detail-body {
            .topiclist {
              margin-bottom: 5px;
              .topic {
                color: #1846b3;
                margin-left: 10px;
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
                cursor: url("https://img.t.sinajs.cn/t6/style/images/common/big.cur"),
                  auto !important;
              }
            }
            .video-list {
              margin: 4px 10px 2px 2px;
              width: 400px;
            }
          }
          .art-body {
            position: relative;
            display: flex;
            flex-direction: column;
            height: 220px;
            width: calc(100% - 48px);
            border-radius: 2px;
            border: 1px solid rgb(238, 236, 236);
            overflow: hidden;
            .art_guide {
              height: 80%;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background: transparent;
              z-index: 1;
              &:hover {
                color: #fff;
              }
            }
            img {
              position: absolute;
              top: 0;
              left: 0;
              height: 80%;
              width: 100%;
              object-fit: cover;
              opacity: 0.6;
              border-radius: 2px;
            }
            .art-title {
              flex: 1;
              background: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
              font-weight: 600;
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
          background-color: #cfcfcf;
          height: 15px;
          padding: 0;
        }
      }
      .artoperate {
        .read {
          width: 100px;
          font-size: 13px;
          margin-right: auto;
        }
      }
      .comment-area {
        padding: 0 30px;
        box-shadow: 1px 1px 3px rgb(207, 206, 206);
        .post-comment {
          display: flex;
          align-items: center;
          .comment-input {
            flex: 1;
          }
          .post-comment-button {
            width: 56px;
            background-color: #fdda5a;
            color: #fff;
            margin-left: 20px;
            padding: 5px 8px;
            text-align: center;
          }
        }
        .comment-list {
          clear: both;
          list-style-type: none;
          display: flex;
          margin-top: 6px;
          border-bottom: 1px solid #f0f2f7;
          padding: 7px 0px;
          &:nth-last-child(1) {
            border-bottom: none;
          }
        }
        .reply-user {
          list-style-type: none;
          display: flex;
          margin-top: 6px;
        }
        .sort-order {
          width: 100%;
          margin-left: auto;
          margin: 8px 0;
          border-bottom: 1px solid #ebeef5;
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
              color: #9f9fa0;
            }
          }
        }
      }
    }
  }
}
// 评论公共样式
.user-avatar {
  height: 30px;
  width: 30px;
  object-fit: cover;
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
      color: #9f9fa0;
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
      cursor: pointer;
    }
  }
}
</style>