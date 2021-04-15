<template>
  <div class="hot">
    <header class="hot-nav">
      <div>全部</div>
      <div>动态</div>
      <div>文章</div>
      <div>视频</div>
    </header>
    <!-- 遮挡滑动后的内容 -->
    <div class="cover"></div>
    <div class="content">

    </div>
  </div>
</template>

<style lang="scss" scoped>
.hot {
  position: relative;
  height: 1000px;
  background-color: transparent;
  .hot-nav {
    display: flex;
    position: fixed;
    top: 65px;
    height: 35px;
    width: 595px;
    background-color: #fff;
  }
  .cover {
    background-color: #f6f6f6;
    height: 10px;
    position: fixed;
    z-index: 999;
    width: 595px;
    top: 100px;
  }
}

.content {
  height: 2000px;
  // padding-top: 60px;
  margin-top: 45px;
  background-color: #fff;
  z-index: -1;
}
</style>