<template>
		 <ul id="nav">          
              <adminMenu :menu="item" v-for="item in menu"  ></adminMenu>	 
              <li @click="addSubject"><a class="collapsed">添加</a></li>       
         </ul>
</template>
<script>
import adminMenu from '@/components/admin/adminMenu'

	export default {
		name: 'adminLeftNav',
		components:{adminMenu},
		data() {
			return {
				menu:null
		}	
	},
	methods: {
		// 添加分类与内容
		addSubject() {
			this.$store.commit('methods/setFlag',2);
			localStorage.clear();
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