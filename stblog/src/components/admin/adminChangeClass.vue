<template>
	<div id="titleShow">
		<div id='zhe'></div>
		<div id="formContent">
			<div class="group_title">
				标题修改为
			</div>
			<div class="group_title">
					<label for="title">名称</label>
					<input type="text" id="title" v-model="title"/>
			</div>
		<input type="button" value="取消" id="titleRes"
			@click="() =>this.$store.commit('changeTitle/changeFlag')"/>
		<input type="button" value="提交" id="titleSub"
			@click="titleCommit"/>
		</div>
	</div>
</template>
<style>
	#titleShow
	{
		width:100%;
		height:100%;
		position:fixed;
		top:0px;
		left:0px;
		z-index:999;
	}
	#zhe
	{
		width:100%;
		height:100%;
		position:absolute;
		background:green;
		opacity: 0.5;
	}

	#formContent
	{
		width:300px;
		height:120px;
		padding:10px;
		position:relative;
		background: #FFFFFF;
		top:50%;
		left:50%;
		transform: translate(-50%,-50%);
		opacity:1;
		z-index:100;

	}
	label
	{
		float:left;
	}
	.group_title
	{
		width:300px;
		height: 50px;
		/*margin:1px;*/
	}
	.group_title>input
	{
		float:left;
		width:230px;
		border:1px solid green;
	}
	#titleRes
	{
		float:left;
		margin-left:30px;
	}
	#titleSub
	{
		float:right;
		margin-right:30px;
	}
</style>
<script>
	export default {
		data() {
			return {
				msg: 'ok',
				title: null
			}
		},
		methods: {
			// 更改内容标题
			titleCommit() {
				let titleParams = {
					title_id: this.$store.state.changeTitle.title_id,
					title: this.title
				}, that = this;
				console.log('titleParams: '+ JSON.stringify(titleParams));
				this.remote.post('/admin/changeContentTitle',JSON.stringify(titleParams), function(data) {
					if(data) {
						console.log(data);

					} else{
						console.log("更改标题失败");
					}
					that.$store.commit('changeTitle/changeFlag');
				});

			}
		}
	}
</script>