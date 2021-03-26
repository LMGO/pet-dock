<template>
  <div id="app">
    <!-- 不是注册页时显示导航栏 -->
    <Header  v-show="$route.path !=='/register'" /> 
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
}
ul {
  padding: 0;
  display: block;
  list-style-type: none;
}
body {
  background: #f6f6f6;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
