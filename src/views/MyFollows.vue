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