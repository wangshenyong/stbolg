<template>
	<div>	
        <div id="leftside">
            <div class="user" >
                <img src="/static/img/avatar.png" width="44" height="44" class="hoverimg" alt="Avatar" />
                <p>登录用户</p>
                <p class="username">Administrator</p>
                <p class="userbtn"><a href="#" title="">个人信息</a></p>
                <p class="userbtn"><a href="#" title="">登出</a></p>
            </div>
            <div class="notifications">
                <p class="notifycount">
                    <a href="" title="" class="notifypop">10</a>
                </p>
                <p>
                    <a href="" title="" class="notifypop">当前日期</a>
                </p>
                <p class="smltxt">{{new Date()}}</p>
            </div>
           <adminLeftNav></adminLeftNav>
        </div>
		<adminContent></adminContent>
	</div>
</template>
<script>
import adminContent from '@/components/admin/adminContent'
import adminLeftNav from '@/components/admin/adminLeftNav'
	export default {
		components: {adminContent,adminLeftNav},
		data() {
			return {
				mes:"k"
			}
		}
	}
</script>