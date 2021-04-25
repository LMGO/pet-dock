<template>
  <div class="myfollows">
    <CommunityContent content-type="myFollows"/>
  </div>
</template>
<script>
// @ is an alias to /src
import CommunityContent from '@/components/CommunityContent.vue'
export default {
  name: 'Myfollows',
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