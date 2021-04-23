<template>
  <div class="hotpost">
    <CommunityContent content-type="hot"/>
  </div>
</template>
<script>
// @ is an alias to /src
import CommunityContent from '@/components/CommunityContent.vue'
export default {
  name: 'Hot',
  components: {
    CommunityContent
  },
  data(){
    return {
    }
  },
  methods:{
  },
  mounted() {
    this.$route.params.type = 'post'
  }
}
</script>