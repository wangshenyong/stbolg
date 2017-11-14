<template>
		 <div>
		 	    <div id="breadcrumb">
             <ul>
                <li>
                    <img src="/static/img/icon_breadcrumb.png" alt="Location">
                </li>
                <li>
                  <strong>Location:</strong>
                </li>
                <li>
                  <a href="#" title="">Sub Section</a>
                </li>
                <li>/</li>
                <li class="current">Control Panel</li>
                <li>view</li>
                <li class="submit_editor" 
                    @click="submit_editor">
                  <a href="javascript:;">保存</a>
                </li>
                 <li class="submit_editor" 
                    @click="clear_editor">
                  <a href="javascript:;">清空</a>
                </li>
             </ul>
          </div>
          <adminContentSection>
            <!-- <h2  class="left" slot="title" >{{content.title}}</h2> -->
           <!--  <div class="contentBoxContent" slot="content">{{content.content}}</div> -->
          </adminContentSection>
        </div>
</template>
<script>
import adminContentSection from '@/components/admin/adminContentSection';

  export default {
        name: 'adminContent',
        components:{adminContentSection},
		data() {
			return {
				msg:"k",
			}
		},
    methods: {
      // 提交编辑的类容
      submit_editor() {
       this.$store.state.methods.flag == '2'?this.$store.commit('showTitle/changeFlag'):
       bus.$emit('emitEditor');
      },
      // 清空编辑的类容
      clear_editor() {
        bus.$emit('clearEditor');
      }
    }
	}
</script>