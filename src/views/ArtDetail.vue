<template>
  <div class="art-detail-page" id="art-detail-page">
    <ArtDetail :art_id="$route.params.art_id"/>
  </div>
</template>
<script>
import ArtDetail from "@/components/ArtDetail.vue";
export default {
  name: "art-detail-page",
  components: {
    ArtDetail
  },
  data() {
    return {
    };
  },
  methods: {
  },
  mounted() {}
};
</script>
<style lang="scss">
.art-detail-page {
  min-height: 800px;
  width: 1000px;
  // background-color: #fff;
  margin: 65px auto 0;
}
</style>