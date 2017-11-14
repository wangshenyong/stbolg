<template>
	<div>
		<adminHeader></adminHeader>
		<adminBody></adminBody>
		<adminFooter></adminFooter>	
	</div>
</template>
<script>
import adminHeader from '@/components/admin/adminHeader'
import adminBody from '@/components/admin/adminBody'
import adminFooter from '@/components/admin/adminFooter'
	export default {
		name: 'adminIndex',
		components: {
			adminHeader,
			adminBody,
			adminFooter
		},
		data() {
			return {
				mes:"k"
			}
		}
	}
</script>