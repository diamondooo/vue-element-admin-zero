<template>
	<div class="app-wrapper">
		<sidebar></sidebar>
		<div class="main-container">
			<div class="header">
				<navbar></navbar>
				<tags-view></tags-view>
			</div>
			<app-main></app-main>
		</div>
	</div>
</template>
<script>
import { Sidebar, AppMain, TagsView,Navbar } from "./components";
export default {
	props: {},
	components: {
		Sidebar,
		AppMain,
		TagsView,
    Navbar
	},
	data() {
		return {};
	},
	methods: {},
};
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.app-wrapper {
	width: 100%;
  height: 100%;
	.main-container{
		margin-left: $sidebarWidth;
		height: 100%;
		width: calc(100% - $sidebarWidth);
	}
}
</style>
