<template>
	<div>
		<svg-icon icon-class="404"></svg-icon>
		<JsonView :json="jsonData"></JsonView>
		<router-view></router-view>
	</div>
</template>
<script>
import JsonView from "@/components/jsonView";
export default {
	components: {
		JsonView,
	},
	props: {},
	data() {
		return {
			jsonData: {
				a: 1,
				b: 2,
			},
		};
	},
	methods: {},
};
</script>
<style scoped lang="scss"></style>
