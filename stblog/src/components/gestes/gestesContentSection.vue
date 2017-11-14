<template>
		  <div id="rightside">
            <div class="contentcontainer">
                <div class="headings">
                        <slot name="title"></slot>
                </div>
                <div class="contentbox ">                     
                         <slot name="content"></slot>   
                </div>
            </div>
        </div> 
</template>
<script>
	export default {
		name: "gestesContentSection",
		data() {
			return {
				meg:"ok"
			}
		}
	}
</script>