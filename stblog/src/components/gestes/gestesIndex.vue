<template>
	<div>
		<gestesHeader></gestesHeader>
		<gestesBody></gestesBody>
		<gestesFooter></gestesFooter>	
	</div>
</template>
<script>
import gestesHeader from '@/components/gestes/gestesHeader'
import gestesBody from '@/components/gestes/gestesBody'
import gestesFooter from '@/components/gestes/gestesFooter'
	export default {
		name: 'gestesIndex',
		components: {
			gestesHeader,
			gestesBody,
			gestesFooter
		},
		data() {
			return {
				mes:"k"
			}
		}
	}
</script>