<template>
	<div id="titleShow">
		<div id='zhe'></div>
		<div id="formContent">
			<div class="group_title">
					<label for="group">分类</label>
					<input type="text" id="group" v-model="groupTitle" list="groupList"/>
					<datalist id="groupList">
					<option value="ok"></option>
					<option value="ok2"></option>
					<option value="ok3"></option>
					</datalist>
			</div>
			<div class="group_title">
					<label for="title">标题</label>
					<input type="text" id="title" v-model="title"/>
			</div>
		<input type="button" value="取消" id="titleRes"
			@click="() =>this.$store.commit('showTitle/changeFlag')"/>
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
		name: 'titleSubmit',
		data() {
			return {
				groupTitle: null,
				title: null
			}
		},
		methods: {
			titleCommit() {
				this.$store.commit('showTitle/setTitle', this.groupTitle);
				this.$store.commit('showTitle/setContent_title', this.title);
				// 提交编辑器的事件emitEditor,emitEditor事件将数据提交到后台
				
				bus.$emit('emitEditor');
				
			}
		}
		
	}
</script>