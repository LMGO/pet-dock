<template>
  <div class="newpost">
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
  }
}
</script>