<template>
	<div>
		dashboard
		<div @click="clickRoute">documentation</div>
		<!-- <router-link to="/documentation" replace> documentation </router-link> -->
	</div>
</template>
<script>
export default {
	props: {},
	data() {
		return {};
	},
	methods: {
		clickRoute() {
			this.$router.replace({ name: "Documentation" });
		},
	},
};
</script>
<style scoped lang="scss"></style>
