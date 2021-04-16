<template>
  <div class="newpost">
    <CommunityContent content-type="newPost"/>
  </div>
</template>
<script>
// @ is an alias to /src
import CommunityContent from '@/components/CommunityContent.vue'
export default {
  name: 'NewPost',
  components: {
    CommunityContent
  },
  data(){
    return {
      // issearchingItem: 'post'
    }
  },
  methods:{
    // getcontent(i) {
    //   let self = this;
    //   self.issearchingItem = i;
    //   if(i == 'all') {
    //     //获取全部
    //   } else if( i == 'poat') {
    //     //获取动态
    //   } else if(i == 'video') {
    //     //获取视频
    //   } else if(i == 'art') {
    //     //获取文章
    //   }
    // }
  }
}
</script>