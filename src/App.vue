<template>
  <div id="app">
    <!-- 不是注册页时显示导航栏 -->
    <div class="header-nav">
      <p-header v-show="$route.path !=='/reg'" /> 
    </div>
    <router-view/>
    <pFooter/>
  </div>
</template>
<script>
import PHeader from '@/components/Header.vue'
import PFooter from '@/components/Footer.vue'

export default {
  name: 'Home',
  components: {
    PHeader,
    PFooter
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
ul {
  padding: 0;
  display: block;
  list-style-type: none;
}
body {
  // background: #fcf8c6;
  background: #f6f6f6;
  font-size: 15px;
  color: #121212;
    &::-webkit-scrollbar {
      display: none;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.header-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.el-image-viewer__img {
  max-height: 550px !important;
}
// .el-collapse-item__content {
//   padding-bottom: 34px !important;
// }
</style>
