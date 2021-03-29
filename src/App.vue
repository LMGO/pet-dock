<template>
  <div id="app">
    <!-- 不是注册页时显示导航栏 -->
    <Header v-show="$route.path !=='/reg'" /> 
    <router-view/>
  </div>
</template>
<script>
import Header from '@/components/Header.vue'

export default {
  name: 'Home',
  components: {
    Header
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
  background: #f6f6f6;
  // background: rgb(253, 252, 234);
  font-size: 15px;
  color: #121212;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
