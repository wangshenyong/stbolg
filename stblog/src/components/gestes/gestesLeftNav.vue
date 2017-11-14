<template>
		 <ul id="nav">          
              <gestesMenu :menu="item" v-for="item in menu"  ></gestesMenu>	         
         </ul>
</template>
<script>
import gestesMenu from '@/components/gestes/gestesMenu'

	export default {
		name: 'gestesLeftNav',
		components:{gestesMenu},
		data() {
			return {
				menu:null
		}	
	},
	mounted:function() {
		console.log(this.remote)
		let that = this;
		console.log(that)
		this.remote.get("http://localhost:8080/gestesTitle", {}, function(data) {
			console.log("meun:" +data)
			that.menu = JSON.parse(data);
			console.log("meun:" +data)
		});
	}
}
</script>