<template>
  <div class="askanswer">
    <!-- 发表弹窗 -->
    <PostPopup v-if="!isclosePostPopup" />
    <div class="cover cover-one"></div>
    <div class="left-content">
      <div class="top-header">
        <div class="nav">
          <span
            v-for="(nav,navindex) in navlist"
            :key="navindex"
            :class="{ActiveNav: ActiveNav == nav.params}"
            @click="getcontent(nav.params)"
          >{{nav.name}}</span>
        </div>
        <el-button class="post-button" icon="el-icon-edit" @click="post">发布问题</el-button>
      </div>
      <div class="cover cover-two"></div>
      <div class="content-list">
        <div class="hotlist" v-if="$route.params.type == 'hot'">
          <li
            class="list-item"
            v-for="(hotitem,hotindex) in qalist"
            :key="hotindex"
            v-show="qalist.length"
          >
            <div class="question-title">
              <span class="title" @click="todetail(hotitem.question_id)">{{hotitem.question_title}}</span>
              <span @click.stop="followquestion(hotitem)" class="unfollow-question" v-if="!hotitem.isfollow">关注问题</span>
              <span @click.stop="unfollowquestion(hotitem)" class="follow-question" v-else>取消关注</span>
            </div>
            <!--有回答时才显示 -->
            <div v-if="hotitem.answer.answer_id">
              <div class="answer-area">
                <img
                  class="user-avatar"
                  :src="hotitem.answer.user_avatar"
                  alt="用户头像"
                  v-if="hotitem.answer.is_anonymous"
                />
                <img class="user-avatar" src="../assets/icon/anonymous.png" alt="匿名" v-else />
                <div class="content">
                  <div class="time-info">
                    <div class="user-name">{{hotitem.answer.user_nickname}}</div>
                    <div class="post-time" v-html="gettime(hotitem.answer.post_time)"></div>
                  </div>
                  <div
                    class="rich-content"
                    :class="{iscollapsed:hotitem.answer.iscollapsed}"
                    @click="readall(hotitem)"
                  >
                    <div class="RichContent-inner">
                      <span
                        class="RichText ztext CopyrightRichText-richText"
                        itemprop="articleBody"
                      >{{hotitem.answer.answer_content}}</span>
                      <button
                        type="button"
                        class="Button ContentItem-more Button--plain"
                        v-if="hotitem.answer.iscollapsed"
                      >
                        ...阅读全文
                        <span>
                          <i class="el-icon-arrow-down"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <el-collapse accordion>
                <el-collapse-item>
                  <template slot="title">
                    <div class="operate">
                      <div class="agree">
                        <el-button
                          class="el-agree"
                          icon="el-icon-caret-top"
                          v-if="hotitem.answer.isagree"
                          @click.stop="disagree(hotitem)"
                        >赞同 {{calculate(hotitem.answer.agree_count)}}</el-button>
                        <el-button
                          class="el-disagree"
                          icon="el-icon-caret-top"
                          v-else
                          @click.stop="agree(hotitem)"
                        >赞同 {{calculate(hotitem.answer.agree_count)}}</el-button>
                      </div>
                      <div class="answer">
                        <i class="el-icon-chat-line-round" style="font-size:15px"></i>
                        <span>{{calculate(hotitem.answer.comment_count)}}条评论</span>
                      </div>
                      <div
                        class="uncollapsed"
                        v-if="!hotitem.answer.iscollapsed"
                        @click.stop="shouqi(hotitem)"
                      >
                        收起
                        <i class="el-icon-arrow-up"></i>
                      </div>
                    </div>
                  </template>
                  <div class="comments">
                    <div class="post-comment">
                      <el-input
                        class="comment-input"
                        type="textarea"
                        :rows="1"
                        placeholder="和大家分享你的看法吧！"
                        v-model="commenttextarea"
                      ></el-input>
                      <el-button class="post-comment-button">发表</el-button>
                    </div>
                    <div class="sort-order">
                      <div class="sort">
                        <img class="sort-icon" src="../assets/icon/sort.png" alt="排序" />
                        <span
                          class="sort-text"
                        >切换为{{hotitem.answer.comments_sort_by == 'hot'? '时间':'热度'}}排序</span>
                      </div>
                    </div>
                    <li
                      class="comment-list"
                      v-for="(comment,cindex) in hotitem.answer.comments"
                      :key="cindex"
                    >
                      <!-- 一级评论 -->
                      <!-- <div class="user"> -->
                      <img class="user-avatar" :src="comment.user_avatar" alt="用户头像" />
                      <div class="userinfo-comment">
                        <div class="user-nickname-like">
                          <span class="user-nickname">{{comment.user_nickname}}：</span>
                          <!-- <img
                            class="like"
                            v-if="comment.isagreeed"
                            src="../assets/icon/like.png"
                            alt
                          />
                          <img class="like" v-else src="../assets/icon/like-active.png" alt /> -->
                          <!-- 为0不显示 -->
                          <!-- <span
                            class="agree-count"
                            v-if="comment.reply_agree_count"
                          >{{comment.reply_agree_count}}</span> -->
                        </div>
                        <p>{{comment.reply_content}}</p>
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
                              <span class="user-nickname">
                                {{rcomment.author.user_nickname}}
                                <span
                                  v-if="rcomment.reply_to_author.user_id"
                                >回复{{rcomment.reply_to_author.user_nickname}}</span>
                                :
                              </span>
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
                            <p>{{rcomment.reply_content}}</p>
                            <div class="comment-time">
                              <span>{{gettime(comment.reply_time)}}</span>
                              <span class="reply">回复</span>
                            </div>
                          </div>
                        </li> -->
                      </div>
                    </li>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </li>
          <NoData v-show="!qalist.length" text="暂无热门问答或获取失败" />
        </div>
        <div class="follows" v-if="$route.params.type == 'follows'">
          <li
            class="list-item"
            v-for="(hotitem,hotindex) in qalist"
            :key="hotindex"
            v-show="qalist.length || hotitem.isfollow"
          >
            <div class="question-title">
              <span class="title" @click="todetail(hotitem.question_id)">{{hotitem.question_title}}</span>
              <span @click.stop="followquestion(hotitem)"  class="unfollow-question" v-if="!hotitem.isfollow">关注问题</span>
              <span @click.stop="unfollowquestion(hotitem)"  class="follow-question" v-else>取消关注</span>
            </div>
            <!--有回答时才显示 -->
            <div v-if="hotitem.answer.answer_id">
              <div class="answer-area">
                <img
                  class="user-avatar"
                  :src="hotitem.answer.user_avatar"
                  alt="用户头像"
                  v-if="hotitem.answer.is_anonymous"
                />
                <img class="user-avatar" src="../assets/icon/anonymous.png" alt="匿名" v-else />
                <div class="content">
                  <div class="time-info">
                    <div class="user-name">{{hotitem.answer.user_nickname}}</div>
                    <div class="post-time" v-html="gettime(hotitem.answer.post_time)"></div>
                  </div>
                  <div
                    class="rich-content"
                    :class="{iscollapsed:hotitem.answer.iscollapsed}"
                    @click="readall(hotitem)"
                  >
                    <div class="RichContent-inner">
                      <span
                        class="RichText ztext CopyrightRichText-richText"
                        itemprop="articleBody"
                      >{{hotitem.answer.answer_content}}</span>
                      <button
                        type="button"
                        class="Button ContentItem-more Button--plain"
                        v-if="hotitem.answer.iscollapsed"
                      >
                        ...阅读全文
                        <span>
                          <i class="el-icon-arrow-down"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <el-collapse accordion>
                <el-collapse-item>
                  <template slot="title">
                    <div class="operate">
                      <div class="agree">
                        <el-button
                          class="el-agree"
                          icon="el-icon-caret-top"
                          v-if="hotitem.answer.isagree"
                          @click.stop="disagree(hotitem)"
                        >赞同 {{calculate(hotitem.answer.agree_count)}}</el-button>
                        <el-button
                          class="el-disagree"
                          icon="el-icon-caret-top"
                          v-else
                          @click.stop="agree(hotitem)"
                        >赞同 {{calculate(hotitem.answer.agree_count)}}</el-button>
                      </div>
                      <div class="answer">
                        <i class="el-icon-chat-line-round" style="font-size:15px"></i>
                        <span>{{calculate(hotitem.answer.comment_count)}}条评论</span>
                      </div>
                      <div
                        class="uncollapsed"
                        v-if="!hotitem.answer.iscollapsed"
                        @click.stop="shouqi(hotitem)"
                      >
                        收起
                        <i class="el-icon-arrow-up"></i>
                      </div>
                    </div>
                  </template>
                  <div class="comments">
                    <div class="post-comment">
                      <el-input
                        class="comment-input"
                        type="textarea"
                        :rows="1"
                        placeholder="和大家分享你的看法吧！"
                        v-model="commenttextarea"
                      ></el-input>
                      <el-button class="post-comment-button">发表</el-button>
                    </div>
                    <div class="sort-order">
                      <div class="sort">
                        <img class="sort-icon" src="../assets/icon/sort.png" alt="排序" />
                        <span
                          class="sort-text"
                        >切换为{{hotitem.answer.comments_sort_by == 'hot'? '时间':'热度'}}排序</span>
                      </div>
                    </div>
                    <li
                      class="comment-list"
                      v-for="(comment,cindex) in hotitem.answer.comments"
                      :key="cindex"
                    >
                      <!-- 一级评论 -->
                      <!-- <div class="user"> -->
                      <img class="user-avatar" :src="comment.user_avatar" alt="用户头像" />
                      <div class="userinfo-comment">
                        <div class="user-nickname-like">
                          <span class="user-nickname">{{comment.user_nickname}}：</span>
                          <!-- <img
                            class="like"
                            v-if="comment.isagreeed"
                            src="../assets/icon/like.png"
                            alt
                          />
                          <img class="like" v-else src="../assets/icon/like-active.png" alt /> -->
                          <!-- 为0不显示 -->
                          <!-- <span
                            class="agree-count"
                            v-if="comment.reply_agree_count"
                          >{{comment.reply_agree_count}}</span> -->
                        </div>
                        <p>{{comment.reply_content}}</p>
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
                              <span class="user-nickname">
                                {{rcomment.author.user_nickname}}
                                <span
                                  v-if="rcomment.reply_to_author.user_id"
                                >回复{{rcomment.reply_to_author.user_nickname}}</span>
                                :
                              </span>
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
                            <p>{{rcomment.reply_content}}</p>
                            <div class="comment-time">
                              <span>{{gettime(comment.reply_time)}}</span>
                              <span class="reply">回复</span>
                            </div>
                          </div>
                        </li> -->
                      </div>
                    </li>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div class="noanswer" v-else>
              <el-button class="Button-answer" icon="el-icon-edit">去回答</el-button>暂无回答，快来发表你的回答吧！
            </div>
          </li>
          <NoData v-show="!qalist.length" text="还没有您关注的问题" />
        </div>
        <div class="newlist" v-if="$route.params.type == 'new'">
          <li
            class="list-item"
            v-for="(newitem,hotindex) in newquestion"
            :key="hotindex"
            v-show="newquestion.length"
          >
            <div class="question-title">
              <span class="title" @click="todetail(newitem.question_id)">{{newitem.question_title}}</span>
              <span @click.stop="followquestion(newitem)"  class="unfollow-question" v-if="!newitem.isfollow">关注问题</span>
              <span @click.stop="unfollowquestion(newitem)"  class="follow-question" v-else>取消关注</span>
            </div>
            <div class="noanswer">
              <div>暂无回答，快来发表你的回答吧！</div>
              <el-button class="Button-answer" icon="el-icon-edit">我来回答</el-button>
              <span>{{newitem.answer_count}}回答·</span>
              <span>{{newitem.follow_count}}关注·</span>
              <span>{{gettime(newitem.post_time)}}</span>
            </div>
          </li>
          <NoData v-show="!newquestion.length" text="暂无新发布的问题" />
        </div>
      </div>
    </div>
    <!-- 用户卡片和登录 -->
    <div class="right-area">
      <LoginUserinfo />
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import { showformattime,getTime } from "../utils/index.js";
import LoginUserinfo from "@/components/LoginUserinfo.vue";
import NoData from "@/components/NoData";
import PostPopup from "@/components/PostPopup.vue";
import {getnewqustionlist,getfollowquestionlist,gethotquestionlist, followquestion,unfollowquestion} from "../utils/api/question.js";
export default {
  name: "AskAnswer",
  components: {
    LoginUserinfo,
    NoData,
    PostPopup
  },
  data() {
    return {
      commenttextarea: "", //评论内容
      navlist: [
        {
          name: "热门问答",
          params: "hot"
        },
        {
          name: "我关注的",
          params: "follows"
        },
        {
          name: "等你来答",
          params: "new"
        }
      ],
      //问答和我关注的列表，热门问答必须有回答，根据浏览次数热度排序，我关注的回答为空时返回空对象
      qalist: [
        // {
        //   question_id: "1111",
        //   question_title: "如何给猫洗澡?",
        //   isfollow: true,
        //   answer: {
        //     answer_id: "0",
        //     user_nickname: "匿名用户",
        //     user_avatar: require("../assets/img/reg6.jpg"),
        //     is_anonymous: 0, //是否匿名
        //     post_time: "1618654274090",
        //     answer_content: "我不知道",
        //     agree_count: 111,
        //     isagree: false,
        //     comment_count: 22,
        //     iscollapsed: true, //获取数据后手动添加默认折叠
        //     comments: [
        //       //评论数组
        //       {
        //         //一级评论
        //         reply_id: "comments111",
        //         reply_content: "真可爱",
        //         user_id: "", //评论者
        //         user_nickname: "半途",
        //         user_avatar: require("../assets/img/reg3.jpg"),
        //         reply_time: "1618654274090",
        //         reply_agree_count: 0,
        //         isagreeed: Boolean,
        //         //二级评论
        //         related_reply: [
        //           {
        //             reply_id: "111",
        //             author: {
        //               user_id: "",
        //               user_nickname: "乖乖李",
        //               user_avatar: require("../assets/img/reg3.jpg")
        //             },
        //             reply_to_author: {
        //               user_id: "111",
        //               user_nickname: "半途",
        //               user_avatar: require("../assets/img/reg3.jpg")
        //             },
        //             reply_content: "真可爱",
        //             reply_time: "",
        //             reply_agree_count: 111,
        //             isagreeed: Boolean
        //           }
        //         ]
        //       },
        //       {
        //         //一级评论
        //         reply_id: "comments111",
        //         reply_content: "真可爱",
        //         user_id: "",
        //         user_nickname: "半途",
        //         user_avatar: require("../assets/img/reg3.jpg"),
        //         reply_time: "1618654274090",
        //         reply_agree_count: 0,
        //         isagreeed: Boolean,
        //         //二级评论
        //         related_reply: [
        //           {
        //             reply_id: "111",
        //             author: {
        //               user_id: "",
        //               user_nickname: "乖乖李",
        //               user_avatar: require("../assets/img/reg3.jpg")
        //             },
        //             reply_to_author: {
        //               user_id: "",
        //               user_nickname: "半途",
        //               user_avatar: require("../assets/img/reg3.jpg")
        //             },
        //             reply_content: "真可爱",
        //             reply_time: "",
        //             reply_agree_count: 111,
        //             isagreeed: Boolean
        //           }
        //         ]
        //       }
        //     ]
        //   }
        // },
        // {
        //   question_id: "1111",
        //   question_title: "如何给猫洗澡?",
        //   isfollow: false,
        //   answer: {
        //     answer_id: "1",
        //     user_nickname: "半途",
        //     user_avatar: require("../assets/img/reg6.jpg"),
        //     is_anonymous: 1,
        //     post_time: "1618654274090",
        //     answer_content:
        //       "哈哈哈哈哈哈哈哈哈哈或或或或或或或或或或或或或或或或或或或发发发发发发发发发发发付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付付",
        //     agree_count: 1111111,
        //     isagree: true,
        //     comment_count: 22234,
        //     comments: [],
        //     iscollapsed: false //获取数据后手动添加默认折叠或后端统一添加
        //   }
        // }
      ],
      newquestion: [
        // {
        //   question_id: "1111",
        //   question_title: "如何给猫洗澡?",
        //   answer_count: 2,
        //   follow_count: 0,
        //   post_time: "1619346234369",
        //   isfollow:0
        // },
        // {
        //   question_id: "1111",
        //   question_title: "如何给猫洗澡?",
        //   answer_count: 2,
        //   follow_count: 0,
        //   post_time: "1619346234369",
        //   isfollow:1
        // }
      ]
    };
  },
  methods: {
    //发布问题
    post() {
      if(!this.$store.state.userInfo.user_id){
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return
      }
      let PostPopup = {
        isclose: false, //控制发布弹窗开闭
        post: "question" //控制发布话题或帖子，默认帖子
      };
      this.$store.commit("changepostpopup", PostPopup);
    },
    //导航栏切换
    getcontent(i) {
      let self = this;
      // console.log(self.ActiveNav);
      if (self.ActiveNav == i) {
        return;
      }
      self.$router.replace({
        name: "AskAnswer",
        params: {
          type: i
        }
      });
      if(this.$route.params.type == 'new'){
        this.getnew()
      }
      else if(this.$route.params.type == 'follows'){
        this.getfollow()
      } else {
        this.gethot()
      }
    },
    //格式化时间
    gettime(i) {
      return showformattime(i);
    },
    //数据格式化
    calculate(i) {
      if (parseInt(i) >= 10000) {
        i = (parseInt(i) / 10000).toFixed(1);
        return `${i}万`;
      } else {
        return i;
      }
    },
    readall(hotitem) {
      if (hotitem.answer.iscollapsed) {
        this.$set(hotitem.answer, "iscollapsed", false);
      }
    },
    //收起全文
    shouqi(hotitem) {
      if (!hotitem.answer.iscollapsed) {
        this.$set(hotitem.answer, "iscollapsed", true);
      }
    },
    //赞同
    agree(hotitem) {
      console.log(hotitem.answer.isagree);
      if (!hotitem.answer.isagree) {
        this.$set(hotitem.answer, "isagree", true);
      }
      console.log(hotitem.answer.isagree);
    },
    //取消赞同
    disagree(hotitem) {
      console.log(hotitem.answer.isagree);
      if (hotitem.answer.isagree) {
        this.$set(hotitem.answer, "isagree", false);
      }
      console.log(hotitem.answer.isagree);
    },
    todetail(id) {
      this.$router.push({
        name: "Question",
        query: {
          question_id: id
        }
      });
    },
    async getnew(){
      let params = {
        user_id:this.$store.state.userInfo.user_id
      }
      console.log(params)
      let res= await getnewqustionlist(params)
      if(res.data.code == 0) {
        this.newquestion = res.data.data
      }else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    async getfollow(){
      let params = {
        user_id:this.$store.state.userInfo.user_id
      }
      console.log(params)
      let res= await getfollowquestionlist(params)
      if(res.data.code == 0) {
        this.qalist = res.data.data
      }else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    async gethot(){
      let params = {
        user_id:this.$store.state.userInfo.user_id
      }
      console.log(params)
      let res= await gethotquestionlist(params)
      if(res.data.code == 0) {
        this.qalist = res.data.data
      }else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    async followquestion(item){
      if(!this.$store.state.userInfo.user_id){
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return
      }
      let data= {
        question_id:item.question_id,
        user_id:this.$store.state.userInfo.user_id,
        follow_time:getTime()
      }
      console.log(data)
      let res= await followquestion(data)
      if(res.data.code == 0) {
        this.$set(item, "isfollow", 1);
        if(item.follow_count!==undefined){
          let count = item.follow_count + 1;
          this.$set(item, "follow_count", count);
        }
      }else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    },
    async unfollowquestion(item){
      if(!this.$store.state.userInfo.user_id){
        this.$message({
          message: "请先登录！",
          duration: 2000,
          type: "error"
        });
        return
      }
      let data= {
        question_id:item.question_id,
        user_id:this.$store.state.userInfo.user_id,
        follow_time:getTime()
      }
      let res= await unfollowquestion(data)
      if(res.data.code == 0) {
        this.$set(item, "isfollow", 0);
        if(item.follow_count!==undefined){
          let count = item.follow_count - 1;
          this.$set(item, "follow_count", count);
        }
      }else {
        this.$message({
          message: "抱歉，系统异常！",
          duration: 2000,
          type: "error"
        });
      }
    }
  },
  computed: {
    ActiveNav() {
      return this.$route.params.type;
    },
    //是否关闭发表弹窗
    isclosePostPopup() {
      return this.$store.state.PostPopup.isclose;
    }
  },
  watch: {},
  mounted() {
    if (localStorage.userInfo) {
      let userInfo = JSON.parse(localStorage.userInfo);
      this.$store.dispatch("getUserInfo", userInfo);
    }
    if(this.$route.params.type == 'new'){
      this.getnew()
    }
    else if(this.$route.params.type == 'follows'){
      this.getfollow()
    } else {
      this.gethot()
    }
  }
};
</script>
<style lang="scss" scoped>
.askanswer {
  min-height: 800px;
  min-width: 1000px;
  width: 1000px;
  margin: 0 auto;
  margin-top: 65px;
  display: flex;
  .left-content {
    width: 740px;
    .top-header {
      height: 35px;
      display: flex;
      position: fixed;
      top: 65px;
      width: 740px;
      background-color: #f6f6f6;
      .nav {
        background: #fff;
        flex: 1;
        margin-right: 100px;
        border-radius: 2px;
        display: flex;
        justify-content: space-around;
        box-shadow: 1px 1px 5px rgb(207, 206, 206),
          0px -1px 5px rgb(207, 206, 206);
        span {
          flex: 1;
          align-self: center;
          text-align: center;
          letter-spacing: 2px;
          font-weight: 500;
          cursor: pointer;
          border-right: 2px solid rgb(216, 215, 215);
          &:nth-last-child(1) {
            border-right: none;
          }
        }
        .ActiveNav {
          font-weight: 600;
        }
      }
      .post-button {
        width: 100px;
        margin-left: auto;
        background-color: rgb(255, 231, 145);
        color: #fff;
        font-weight: 600;
        box-shadow: 1px 1px 5px rgb(207, 206, 206),
          0px -1px 5px rgb(207, 206, 206);
        &:hover {
          background-color: #fdda5a;
        }
        &:active {
          border: none;
        }
      }
    }
    .content-list {
      margin-top: 45px;
      background: #fff;
      box-shadow: 1px 1px 3px rgb(207, 206, 206);
      padding: 10px 20px;
      .hotlist,
      .newlist,
      .follows {
        .list-item {
          list-style-type: none;
          border-bottom: 1px solid #f0f2f7;
          padding: 8px 0px;
          &:nth-last-child(1) {
            border-bottom: none;
          }
          &:first-child {
            padding-top: 0;
          }
          .question-title {
            width: 100%;
            display: flex;
            height: 30px;
            justify-content: center;
            .title {
              font-size: 16px;
              align-self: center;
              font-weight: 600;
              cursor: pointer;
              &:hover {
                color: #409eff;
              }
            }
            .follow-question {
              margin-left: auto;
              align-self: center;
              text-align: center;
              font-size: 12px;
              color: #fff;
              cursor: pointer;
              width: 70px;
              padding: 5px 8px;
              background-color: #fdda5a;
              border-radius: 2px;
              &:hover {
                background-color: #f8c405;
              }
            }
            .unfollow-question {
              margin-left: auto;
              align-self: center;
              text-align: center;
              font-size: 12px;
              color: #a5a5a5;
              cursor: pointer;
              width: 70px;
              padding: 5px 8px;
              background-color: #fff6d4;
              border-radius: 2px;
              &:hover {
                background-color: #f8c405;
              }
            }
          }
          .answer-area {
            margin: 5px 0px;
            display: flex;
            .user-avatar {
              height: 30px;
              width: 30px;
              object-fit: cover;
              border-radius: 5px;
              border: 1px solid #f0f2f7;
            }
            .content {
              width: 100%;
              margin-left: 5px;
              .time-info {
                display: flex;
                width: 100%;
                height: 30px;
                .user-name {
                  font-size: 14px;
                  align-self: center;
                }
                .post-time {
                  align-self: center;
                  margin-left: auto;
                  font-size: 12px;
                  color: #808080;
                }
              }
              .rich-content {
                line-height: 1.67;
                margin-top: 3px;
                .RichContent-inner {
                  max-height: 80px;
                  word-break: break-all;
                  text-overflow: ellipsis;
                  display: -webkit-Box;
                  -webkit-line-clamp: 3;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  .ztext {
                    word-break: break-word;
                    line-height: 1.6;
                    white-space: normal;
                  }
                  .Button {
                    display: inline-block;
                    font-size: 14px;
                    text-align: center;
                    cursor: pointer;
                    background: none;
                  }
                  .Button--plain {
                    height: auto;
                    padding: 0;
                    line-height: inherit;
                    background-color: transparent;
                    border: none;
                    outline: none;
                    border-radius: 0;
                  }
                  .ContentItem-more {
                    padding: 0;
                    margin-left: 4px;
                    color: #175199;
                  }
                }
              }
              .iscollapsed {
                margin: 3px 0;
                padding-bottom: 3px;
                cursor: pointer;
                transition: color 0.14s ease-out;
                &:hover {
                  color: #646464;
                }
              }
            }
          }
          .operate {
            display: flex;
            width: 100%;
            .agree {
              .el-agree {
                // padding: 7px 8px !important;
                color: #fff;
                background-color: #ffda5a !important;
                &:hover {
                  
                  background-color: #f8c405 !important;
                }
              }
              .el-disagree {
                // padding: 7px 8px !important;
                // color: #409eff;
                // background-color: #ecf5ff !important;
                color: #a5a5a5;
                background-color: #fff6d4 !important;
                &:hover {
                  background-color: #f8c405 !important;
                }
              }
            }
            .answer {
              margin-left: 20px;
              align-self: center;
              color: #8590a6;
              span {
                margin-left: 5px;
                font-size: 12px;
              }
            }
            .uncollapsed {
              color: #8590a6;
              margin-left: auto;
              cursor: pointer;
              margin-right: 50px;
              &:hover {
                color: #76839b;
              }
            }
          }
          .comments {
            padding: 10px 25px;
            border: 1px solid #ebebeb;
            border-radius: 4px;
            box-shadow: 0 1px 3px #1212121a;
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
              padding: 5px 0px;
              border-bottom: 1px solid #ebebeb;
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
          .noanswer {
            color: #8590a6;
            font-size: 14px;
            .Button-answer {
              color: #fff;
              background-color: #fce07b !important;
              margin: 10px 0;
            }
            span {
              display: inline-block;
              margin-left: 20px;
            }
          }
        }
      }
    }
  }
  .right-area {
    position: fixed;
    margin-left: 750px;
  }
}
.cover {
  background-color: #f6f6f6;
  height: 15px;
  position: fixed;
  z-index: 2;
}
.cover-one {
  top: 50px;
  width: 1005px;
  left: 50%;
  transform: translateX(-50%);
}
.cover-two {
  width: 750px;
  top: 100px;
  height: 10px;
  transform: translateX(-5px);
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
