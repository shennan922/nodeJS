<template>
  <div id="app">
    <!-- <div id="nav"> -->
      <!-- <router-link to="/">Home</router-link> | -->
      <!-- <router-link to="/about">About</router-link> -->
    <!-- </div> -->
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>
<script>
export default {
  name:'app',
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return{
      isRouterAlive:true
    }
  },
  methods:{
    reload(){
      this.isRouterAlive=false,
      this.$nextTick(function(){
        this.isRouterAlive=true
      })
    }

  }

}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 1000px;
}
#edui_fixedlayer {
  z-index: 99999!important;
}
// #edui-default{
//   z-index: 99999!important;
// }

#nav {
  //padding: 30px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
body {
  margin: 0;
  overflow: auto;
}
  .el-dialog__body{
    padding-left:20px!important;
  }
  // .el-input--prefix .el-input__inner {
  //   padding-left: 5px!important; 
  // }
</style>
