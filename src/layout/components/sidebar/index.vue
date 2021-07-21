<template>
	<div class="sidebar-container">
		<el-scrollbar wrap-class="scrollbar-wrapper">
			<el-menu
				:default-active="activeMenu"
				class="el-menu-vertical-demo"
				background-color="#304156"
				text-color="#ffffff"
				mode="vertical"
			>
				<sidebar-item
					v-for="route in permission_routes"
					:key="route.name"
					:item="route"
					:base-path="route.path"
				></sidebar-item>
			</el-menu>
		</el-scrollbar>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
import { SidebarItem } from "./components";
export default {
	components: {
		SidebarItem,
	},
	props: {},
	data() {
		return {};
	},
	computed: {
		...mapGetters(["permission_routes", "sidebar"]),
		activeMenu() {
			let route = this.$route;
			return route.fullPath;
		},
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

	::v-deep {
		.el-menu {
			border-right: none;
		}
		.el-scrollbar {
			height: 100%;
		}
		.scrollbar-wrapper {
			overflow-x: hidden !important;
		}
	}
}
</style>
