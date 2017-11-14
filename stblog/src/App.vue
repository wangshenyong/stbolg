<template>
  <div id="app">
    <toolSubmit v-if="this.$store.state.showTitle.flag"></toolSubmit>
    <adminChangeClass v-if="this.$store.state.changeTitle.flag"></adminChangeClass>
    <router-view/>

  </div>
</template>

<script>
import toolSubmit from '@/components/admin/toolSubmit'; 
import adminChangeClass from '@/components/admin/adminChangeClass'; 
export default {
  name: 'app',
  components:{toolSubmit,adminChangeClass},
  data() {
    return {
      mes: "ok"
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;

}
</style>
