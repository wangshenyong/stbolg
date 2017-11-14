<!-- <template>
	<div>
		<li>
			<div 
			 @click="toggle"
			  @dblclick="changetype"
			 >
			 {{obj.name}}
			 <span v-if="isFolder">{{open?'-':'+'}}</span>	
			</div>
		</li>
		<ul v-show='open' v-if="isFolder">
			<item v-for="obj in obj.children" :model="obj"></item>
			<li @click="additem">+</li>
		</ul>
	</div>
</template>
<script>
	export default {
		name: 'item',
		props:{
			model: Object
		},
		data() {
			return {
				open: false,
				obj:this.model
			}
		},
		computed: {
			isFolder: function() {
				return this.obj.children && this.obj.children.length;
			}
		},
		methods: {
			toggle() {
				return this.open = !this.open;
			},
			changetype() {
				if(!this.isFolder) {
					var temp = {
					name:"ok3"
				}
				var name = this.obj.name;
				// this.model.name = name;
				this.obj = {
					name:name,
					children:[
					{name:"ok4"}
					]
				}

				// this.model.children.push(temp);
				console.log("temp");
				this.open = true;
				}
				
			},
			additem() {
				this.obj.children.push({name:"addok"});
			}
		}
	}
</script> -->