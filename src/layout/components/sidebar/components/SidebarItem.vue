<template>
	<!-- 显示在侧边栏的路由一定是layout的子路由，所以他的children一定要>=1 -->
	<div v-if="!item.hidden" class="sidebarItem">
		<!-- 只显示一级菜单 -->
		<template v-if="hasOneShowingChild(item)">
			<!-- 要么是router跳转，要么是a链接跳转到外部链接 -->
			<el-menu-item
				:index="resolvePath(onlyOneChild)"
				@click.native="clickLink(onlyOneChild)"
			>
				<item :item="onlyOneChild"></item>
			</el-menu-item>
		</template>
		<!-- 显示二级菜单 -->
		<el-submenu
			v-else
			ref="subMenu"
			:index="resolvePath(item)"
			popper-append-to-body
		>
			<template slot="title">
				<item :item="item"></item>
			</template>
			<sidebar-item
				v-for="child in item.children"
				:key="child.name"
				:item="child"
				class="nest-menu"
			></sidebar-item>
		</el-submenu>
	</div>
</template>
<script>
import Item from "./Item";
import Link from "./Link";
import { isExternal } from "@/utils/validate";
export default {
	name: "SidebarItem",
	components: {
		Item,
		Link,
	},
	props: {
		item: {
			type: Object,
			required: true,
		},
		isNest: {
			type: Boolean,
			default: false,
		},
		basePath: {
			type: String,
			default: "",
		},
	},
	data() {
		return {};
	},
	methods: {
		// 什么情况下只显示一个一级菜单（在该元素不是hidden的情况下）：
		/**
		 * 参考router.js的路由规则
		 * 1.当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
		 * 2.只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
		 * 3.若你想不管路由下面的 children 声明的个数都显示你的根路由
		 * 4.你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
		 */
		// 可以搞简单点，这个函数只是判断当前路由是否只有一个可显示的子路由，如果是就将其显示为一级路由，其他的套娃形式先不考虑
		// 要判断的太多了，先设置前提：1.如果属性有alwaysShow，那么它一定至少有一个child，2.不会在child中设置hidden，一般在顶级父元素中设置hidden，例如404，或者是profile。
		// 要进行区别的属性：1.设置了alwaysshow，但是他只有一个child，那么也按sub-menu的结构进行展示，4.如果children的长度为1，而且又没有设置alwaysshow，那么就将其扁平化为一级菜单，3.如果没有children，就显示为一级菜单
		// 能进行这个函数的item都不是hidden，所以不用再判别hidden
		hasOneShowingChild(item) {
			if (item.alwaysShow) {
				return false;
			}
			if (!item.children) {
				this.onlyOneChild = item;
				return true;
			} else if (item.children.length === 1) {
				this.onlyOneChild = item.children[0];
				return true;
			} else {
				return false;
			}
		},
		clickLink(route) {
			let { isExternal, path } = this.testPath(route);
			if (isExternal) {
				window.open(path);
			} else {
				this.$router.push(path);
			}
		},
		testPath(route) {
			let routePath = route.path;
			if (isExternal(routePath)) {
				return {
					isExternal: true,
					path: routePath,
				};
			}
			let res = this.$router.resolve(route);
			// console.log(res);
			// res.href是没有进行重定向的路径，res.route.fullPath是重定向后的路径
			return {
				isExternal: false,
				path: res.route.fullPath, //通过router.push可以正确跳转的路径
				href: res.href, //href的值携带#号，例如#/nested
			};
		},
		resolvePath(route) {
			let result = this.testPath(route);
			return result.href.split("#")[1];
		},
	},
};
</script>
<style scoped lang="scss">
.sidebarItem {
	::v-deep .el-submenu {
		ul.el-menu {
			.el-submenu__title {
				background-color: #1f2d3d !important;
			}
			.el-menu-item {
				background-color: #1f2d3d !important;
			}
		}
	}
}
</style>
