<template>
  <router-view
    v-if="!forceReload"
    @reload="reload"
  />
</template>

<script>
  export default {
    name: "ReportLayout",
    data(){
      return {
        forceReload:false
      }
    },
    methods:{
      reload(){
        this.forceReload=true;
        this.$nextTick(function(){
          this.forceReload=false;
        })
      }
    }
  }
</script>
