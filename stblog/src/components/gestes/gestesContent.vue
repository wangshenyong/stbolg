<template>
		 <div>
		 	    <div id="breadcrumb"
            @storeContent="setContent">
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
             </ul>
          </div>
          <gestesContentSection>
            <h2  class="left" slot="title" >{{content.title}}</h2>
            <div class="contentBoxContent" slot="content">{{content.content}}</div>
          </gestesContentSection>
        </div>
</template>
<script>
import gestesContentSection from '@/components/gestes/gestesContentSection';
	export default {
        name: 'gestesContent',
        components:{gestesContentSection},
		data() {
			return {
				msg:"k",
        content:{
          title :'标题',
          content:'内容'
        }
			}
		},
    methods: {
      setContent(data) {
        this.content =data[0];
        console.log("conent: "+data[0]);
      }
    },
    // 注册事件storecontent，获取后台的内容
    created() {
      bus.$on("storeContent", data => this.setContent(JSON.parse(data)));
    }
	}
</script>