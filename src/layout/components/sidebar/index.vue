<template>
	<div class="sidebar-container">
		<el-scrollbar wrap-class="scrollbar-wrapper">
			<el-menu
				default-active="2"
				class="el-menu-vertical-demo"
				background-color="#304156"
				text-color="#ffffff"
				@open="handleOpen"
				@close="handleClose"
			>
				<!-- <el-submenu index="1">
						<template slot="title">选项4</template>
						<el-menu-item index="1-4-1">选项1</el-menu-item>
				</el-submenu> -->
				<el-menu-item index="2">
					<i class="el-icon-menu"></i>
					<span slot="title">导航二</span>
				</el-menu-item>
				
			</el-menu>
		</el-scrollbar>
	</div>
</template>
<script>
export default {
	props: {},
	data() {
		return {};
	},
	methods: {
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		},
	},
};
</script>
<style scoped lang="scss">
.sidebar-container {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	width: 210px;
  background-color: #304156;
  .scrollbar-wrapper{
    overflow-x: hidden;
  }
	::v-deep {
		.el-menu {
			border-right: none;
		}
	}
}
</style>
