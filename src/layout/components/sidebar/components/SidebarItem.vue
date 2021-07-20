<template>
	<!-- 显示在侧边栏的路由一定是layout的子路由，所以他的children一定要>=1 -->
	<div v-if="!item.hidden">
		<!-- 只显示一级菜单 -->
		<template v-if="hasOneShowingChild(item)">
			<!-- 要么是router跳转，要么是a链接跳转到外部链接 -->
			<el-menu-item
				:index="resolvePath(onlyOneChild.path)"
				@click.native="clickLink(item.path)"
			>
				<item :item="onlyOneChild"></item>
			</el-menu-item>
		</template>
		<!-- 显示二级菜单 -->
		<el-submenu
			v-else
			ref="subMenu"
			:index="resolvePath(item.path)"
			popper-append-to-body
		>
			<template slot="title">
				<item :item="item"></item>
			</template>
			<sidebar-item
				v-for="child in item.children"
				:key="child.path"
				:is-nest="true"
				:item="child"
				:base-path="resolvePath(child.path)"
				class="nest-menu"
			></sidebar-item>
		</el-submenu>
	</div>
</template>
<script>
import Item from "./Item";
import Link from "./Link";
export default {
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
		hasOneShowingChild(item) {
			if (item.alwaysShow) {
				return false;
			}
			let filter = item.children.reduce(
				(res, i) => {
					if (!i.hidden) {
						res.total++;
						res.target = i;
					}
					return res;
				},
				{ target: {}, total: 0 }
			);
			if (filter.total === 1 && filter.target.children) {
				this.onlyOneChild = filter.target;
				// 如果找到的这个子元素有children
				return true;
			} else {
				return false;
			}
		},
		clickLink(path) {},
	},
};
</script>
<style scoped lang="scss"></style>
