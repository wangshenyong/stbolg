<template>   
               <li>
                    <a :class="expandedShow" 
                    @click="aToggle"
                    >
                    {{menu.title}}
                	</a>
                    <ul @click="ultToggle" 
                    		:class="ulToggle">             
                        <li  class="aVisited" v-for="item in menu.children" 
                        	:contentId="item.content_id" 
                        	@click="getContent"
                        	@dblclick="changeTitle">
                            {{item.content}}
                        </li>
                    </ul>
        		</li>                
</template>
<script>
	export default {
		name: 'adminLeftNav',
		props:[ 'menu'],
		data() {
			return {
				expandedShow: {
					expanded:false,
					collapsed:true,
					heading:true
				},
				ulToggle: {
					navigation:true,
					godNone:true
				}
			}
		},
		methods: {
			// 展开或者闭合目录
			aToggle() {
				this.hideLi();
				this.ulToggle.godNone = !this.ulToggle.godNone;
				this.expandedShow.expanded = !this.expandedShow.expanded;
				console.log("content: "+this.menu)
				console.log("content children: "+this.menu.children)
			},
			// 改变当前选中的列表项的样式
			ultToggle(event) {	
				this.hideLi();
				event.target.className = "aVisited_V";
			},
			// 改变前一个选中的列表项的样式
			hideLi() {
				var showLi = document.querySelector(".aVisited_V");
				if(showLi) {
					showLi.className = "aVisited";
				}
			},
			// 获取内容
			getContent(event) {
				let contentId = event.target.getAttribute('contentId');
				let that = this;
			    this.remote.get('/gestesContent', 
			    	"contentId="+contentId, function(data) {
			    		console.log("event data: "+data);
			    		that.$store.commit('methods/setFlag',1);
			    		that.$store.commit('showTitle/setContent_id', contentId);
			    		bus.$emit("getContent", JSON.parse(data)[0].content);
			    	});
			    // debugger;

			},
			// 改变内容的标题
			changeTitle(event) {
				this.$store.commit('changeTitle/setTitle_id',event.target.getAttribute('contentid'));
				this.$store.commit('changeTitle/changeFlag');
			}
		}
	}
</script>