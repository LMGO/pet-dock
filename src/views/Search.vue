<template>
  <div class="search-page">
    <div class="back">
      <el-button @click="back" class="back-buton" icon="el-icon-arrow-left" circle></el-button>
    </div>
    <div>

    </div>
  </div>
</template>
<script>
export default {
  name: 'Search',
  components: {
    // CommunityContent
  },
  data(){
    return {
      // issearchingItem: 'post'
    }
  },
  methods:{
    back() {
      this.$router.back(1)
    },
    getdata(){
      //
    }
  },
  mounted(){
    console.log(this.$route.query)
  }
}
</script>
<style lang="scss" scoped>
.search-page {
  min-height: 800px;
  width: 1000px;
  margin: 0 auto;
  margin-top: 65px;
  position: relative;
  border-radius: 5px;
  .back {
    position: fixed;
    z-index: 1;
    top: 65px;
    transform: translateX(-60px);
    .back-buton {
      height: 45px;
      width: 45px;
      // background-color: #ffe589;
    }
  }
}
</style>