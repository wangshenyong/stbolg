<template>
		  <div id="rightside">
		  	<slot name="title"></slot>
            <quill-editor v-model="content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)">
  			</quill-editor>
        </div> 
</template>
<script>
import wysiwyg from '@/components/admin/writetable';
	export default {
		name: "adminContentSection",
		data() {
			return {
				meg:"ok",
				editorOption:{},
				content:null
			}
		},
		mounted() {
			let that = this;
			// 提交数据到数据库
			bus.$on('emitEditor', function() {
				let tempContent = {
					content_title: that.$store.state.showTitle.content_title,
					content: that.content,
					content_id: that.$store.state.showTitle.content_id
				};
				// flag等于1为修改内容等于2为添加类容
				if(that.$store.state.methods.flag == '1') {
					this.remote.post('http://localhost:8080/admin/updateContent', JSON.stringify(tempContent), function(data) {
						if(data.error) {
							console.log('更新类容失败');
						} else {
							console.log('更新类容成功')
						}
					});
				} else {
					tempContent.title = that.$store.state.showTitle.title;
					that.$store.commit('showTitle/changeFlag');
					console.log("send Editor: "+JSON.stringify(tempContent));
				    this.remote.post('http://localhost:8080/admin/postTitleCon', JSON.stringify(tempContent), function(data) {
					if(data.error) {
						console.log('插入失败');
					} else {
						console.log('插入成功');
					}
				});
				}
				
				
			});
			// 获取数据库中的数据
			bus.$on('getContent', data => {this.content = data;
											this.onEditorBlur()});
			// 清空编辑器的数据
			bus.$on('clearEditor', () => {
				console.log("清空了");
				this.content = null;
				localStorage.clear();
				this.content = '编辑我啊';
			});
		},
		methods: {
			onEditorBlur() {
				localStorage.setItem("Editor", this.content);
				console.log('blur');
			},
			onEditorFocus() {
				this.content = 
				localStorage.getItem("Editor")&&localStorage.getItem("Editor")!=this.content
						?localStorage.getItem("Editor")
						:this.content;
				console.log("focus");
			},
			onEditorReady() {
				this.content = this.content;
			}
		}
	}
</script>