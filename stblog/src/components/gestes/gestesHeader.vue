<template>
		<div id="header">
    			<a href="javascript:;" title="" ><img  @click="ok" src="static/img/cp_logo.png" alt="Control Panel" class="logo" /></a >
   			 <div  style="float:left;color:red" @click="pot">osdfsdfk</div>
   			 <div id="searcharea">

        		<input type="text" class="searchbox" v-model="search" placeholder="搜索。。。。。" />
        		<input type="submit" value="搜索" class="searchbtn" 
        			@click="remoteget"/>

    		</div>
    		
	    </div>
</template>
<style>
</style>
<script>
	export default {
		data() {
			return {
				mes:"k",
				search: null
			}
		},
		methods: {
			remoteget() {
				var temp = {
					name:"wang",
					password:"wang"
				}
				remote.get("http://localhost:8080/title",temp,function(data) {
					console.log("re: "+data);
				});
			},
			ok() {
				remote.get("http://localhost:8080/ok",null,function(data) {
					console.log("ok: "+data);
				});
			},
			pot() {
				remote.get("http://localhost:8084/pot",null,function(data) {
					console.log("pot: "+data);
				});
			}
		}
	}
</script>