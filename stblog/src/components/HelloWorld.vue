<!-- 
<template>
  <div class="hello">
    <ul>
       <item v-for="model in obj" :model="model"></item>
    </ul>
  
  </div>
</template>

<script>
import item from '@/components/item'
export default {
  name: 'HelloWorld',
  components: {item},
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      obj:[
        {name: "ok1"},
        {children: [

                  {name:'okd2'},
                  {name: 'okd3'}
                ],
                name:"ok2"
              }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
 -->