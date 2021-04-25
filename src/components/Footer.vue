<template>
<div>
    <el-row>
      <el-col :span="24">
        <div class="footer">
          <p class="copyright">Copyright © 2021 petdock(宠坞). All rights reserved.</p>
        </div>
      </el-col>
    </el-row>
</div>
</template>
<script>
export default {
  name: "p-footer",
  data() {
    return {};
  },
  methods: {},
  components: {},
  beforeMount() {}
};
</script>
<style lang="scss" scoped>
.footer {
  min-width: 1000px;
  margin: 0 auto;
  padding: 10px 0;
  // background: #fff;
  border-top: 1px solid #EBEEF5;
  .copyright {
      text-align: center;
  }
}
</style>