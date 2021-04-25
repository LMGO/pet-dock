<template>
  <div>
    <div class="nodata">
      <img src="../assets/icon/nodata.png" alt />
      <span>{{text?text:'暂无数据'}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "no-data",
   props: ['text'],
  data() {
    return {};
  },
  methods: {},
  components: {},
  beforeMount() {}
};
</script>
<style lang="scss" scoped>
.nodata {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 60px;
  }
  span {
    margin-left: 10px;
    color: #9f9fa0;
  }
}
</style>