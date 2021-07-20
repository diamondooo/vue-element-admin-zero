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
				<sidebar-item
					v-for="route in permission_routes"
					:key="route.path"
					:item="route"
					:base-path="route.path"
				></sidebar-item>
			</el-menu>
		</el-scrollbar>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
	props: {},
	data() {
		return {};
	},
	computed: {
		...mapGetters(["permission_routes", "sidebar"]),
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
	.scrollbar-wrapper {
		overflow-x: hidden;
	}
	::v-deep {
		.el-menu {
			border-right: none;
		}
	}
}
</style>
