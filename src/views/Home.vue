<template>
  <div class="home">
    <!-- 遮挡滑动后的内容 -->
    <div class="cover"></div>
    <nav class="Left-nav">
      <div class="nav-list">
        <div class="BeforeActive" v-for="(item,index) in navlist" :key="index" :class="{ActivePath: ActivePath == item.name}" @click="goto(item)">{{item.navname}}</div>
      </div>
    </nav>
    <section class="center-content">
      <router-view></router-view>
    </section>
    <!-- 用户卡片和登录 -->
    <div class="right-area">
      <LoginUserinfo/>
    </div>
  </div>
</template>

<script>
  // @ is an alias to /src
  import LoginUserinfo from '@/components/LoginUserinfo.vue'

  export default {
    name: 'Home',
    components: {
      LoginUserinfo
    },
    data(){
      return {
        // ActivePath:'',
        navlist:[
          {
            navname: '社区热门',
            name: 'Hot',
            path:'/home/hot',
            params: 'post'//默认展示所有post
          },
          {
            navname: '话题推荐',
            name: 'Hottopic',
            path:'/home/hottopic',
            params: 'hot'//默认展示热门话题
          },
          {
            navname: '最新发布',
            name: 'Newpost',
            path:'/home/newpost',
            params: 'post'//默认展示所有post
          },
          {
            navname: '我关注的',
            name: 'Myfollow',
            path:'/home/myfollow',
            params: 'post'//默认先展示所有post
          },
          {
            navname: '好物推荐',
            name: 'ProductRecommendation',
            path:'/home/productrecommendation',
            params: 'hot'//默认先展示热销商品
          }
        ]
      }
    },
    methods:{
      goto(i) {
        if(this.ActivePath != i.name) {
          this.ActivePath = i.name
          this.$router.replace({name:i.name,params:{type:i.params,}})
        }
      }
    },
    computed: {
      ActivePath:{
        get() {
          return this.$route.name
        },
        set() {
          return this.$route.name
        }
      }
    },
    watch: {
    }
  }
</script>
<style lang="scss" scoped>
.home {
  margin: 65px auto;
  width: 1000px;
  display: flex;
  position: relative;
  overflow: hidden;
  font-size: 14px;
  // min-height: 1000px;
  .cover {
    background-color: #f6f6f6;
    // background-color: #fcf7b5;
    height: 15px;
    position: fixed;
    z-index: 1;
    width: 1000px;
    top: 50px;
  }
  .Left-nav {
    position: fixed;
    width: 135px;
    background-color: #fff;
    padding: 20px 10px;
    height: 200px;
    border-radius: 2px;
    box-shadow: 1px 1px 3px rgb(207, 206, 206),-1px -1px 5px rgb(207, 206, 206);
    .nav-list {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;
      align-items: center;
      list-style: none;
      .BeforeActive {
        color: #121212;
        position: relative;
        cursor: pointer;
        letter-spacing: 2px;
        &:hover {
          font-weight: 600;
        }
      }
      .ActivePath{
        font-weight: 600;
        font-size: 15px;
        color: rgb(253,218,90);
      }
    }
  }
  .center-content {
    width: 595px;
    margin:0 250px 0 145px;
    // min-height: 1000px;
  }
  .right-area {
    position: fixed;
    margin-left: 750px;
  }
}

</style>
