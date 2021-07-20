<template>
	<div>
		<!-- icon -->
		<template v-if="item.meta.icon.includes('el-icon')">
			<i :class="[item.meta.icon, 'sub-el-icon']" />
		</template>
		<template v-else>
			<svg-icon :icon-class="item.meta.icon"></svg-icon>
		</template>
		<!-- title -->
		<span>
			{{ item.meta.title }}
		</span>
	</div>
</template>
<script>
export default {
	props: {
		item: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {};
	},
	methods: {},
};
</script>
<style scoped lang="scss"></style>
