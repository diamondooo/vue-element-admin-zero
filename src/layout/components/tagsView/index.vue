<template>
	<div class="tags-view-container" id="tags-view-container">
		<scroll-pane ref="scrollPane" class="tags-view-wrapper">
			<router-link
				v-for="tag in visitedViews"
				:key="tag.path"
				:to="{ path: tag.path, query: tag.query }"
				tag="span"
				:class="{ active: isActive(tag) }"
				class="tags-view-item"
				@click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
			>
				{{ tag.title }}</router-link
			>
		</scroll-pane>
	</div>
</template>
<script>
import ScrollPane from "./ScrollPane.vue";
export default {
	components: {
		ScrollPane,
	},
	props: {},
	data() {
		return {
			affixTags: [],
		};
	},
	computed: {
		visitedViews() {
			return this.$store.state.tagsView.visitedViews;
		},
		routes() {
			return this.$store.state.permission.routes;
		},
	},
	watch: {
		$route: {
			handler() {
				this.addTags();
			},
			// immediate: true, //加上immediate,watch会在mouted和created之前执行
		},
	},
	created() {
		console.log("CREATED");
		this.initTags();
		this.addTags();
	},
	methods: {
		isActive(route) {
			return route.path === this.$route.path;
		},
		isAffix(tag) {
			return tag.meta && tag.meta.affix;
		},
		closeSelectedTag(view) {
			this.$store
				.dispatch("tagsView/delView", view)
				.then(({ visitedViews }) => {
					if (this.isActive(view)) {
						this.toLastView(visitedViews, view);
					}
				});
		},
		toLastView(visitedViews, view) {
			const latestView = visitedViews.slice(-1)[0];
			if (latestView) {
				this.$router.push(latestView.fullPath);
			} else {
				// now the default is to redirect to the home page if there is no tags-view,
				// you can adjust it according to your needs.
				if (view.name === "Dashboard") {
					// to reload home page
					this.$router.replace({ path: "/redirect" + view.fullPath });
				} else {
					this.$router.push("/");
				}
			}
		},
		filterAffixTags(routes) {
			let tags = [];
			routes.forEach((route) => {
				if (route.meta && route.meta.affix) {
					const tagPath = this.$router.resolve(route);
					// push不直接使用route，是为了去掉route.children等属性，简化结构
					tags.push({
						path: tagPath.route.path,
						fullPath: tagPath.route.fullPath,
						meta: { ...tagPath.route.meta },
						name: tagPath.route.name,
					});
				}
				if (route.children) {
					const tempTags = this.filterAffixTags(route.children);
					if (tempTags.length >= 1) {
						tags = [...tags, ...tempTags];
					}
				}
			});
			return tags;
		},
		// 只是将affixtag添加到visitedView中
		initTags() {
			const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
			for (const tag of affixTags) {
				// Must have tag name
				if (tag.name) {
					this.$store.dispatch("tagsView/addVisitedView", tag);
				}
			}
		},
		addTags() {
			const { name } = this.$route;
			if (name) {
				// 为什么这里传过去的是route本身的对象，而filterAffixTags传过去的是整理过的对象:因为this.$route已经被vue整理过了，上面已经有了fullPath,path,meta和name这些属性，已经和router.resolve(route原对象).route 的结果一致
				console.log(this.$route);
				this.$store.dispatch("tagsView/addView", this.$route);
			}
			return false;
		},
	},
};
</script>
<style scoped lang="scss">
.tags-view-container {
	height: 34px;
	width: 100%;
	background: #fff;
	border-bottom: 1px solid #d8dce5;
	box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
	.tags-view-wrapper {
		.tags-view-item {
			display: inline-block;
			position: relative;
			cursor: pointer;
			height: 26px;
			line-height: 26px;
			border: 1px solid #d8dce5;
			color: #495060;
			background: #fff;
			padding: 0 8px;
			font-size: 12px;
			margin-left: 5px;
			margin-top: 4px;
			&:first-of-type {
				margin-left: 15px;
			}
			&:last-of-type {
				margin-right: 15px;
			}
			&.active {
				background-color: #42b983;
				color: #fff;
				border-color: #42b983;
				&::before {
					content: "";
					background: #fff;
					display: inline-block;
					width: 8px;
					height: 8px;
					border-radius: 50%;
					position: relative;
					margin-right: 2px;
				}
			}
		}
	}
	.contextmenu {
		margin: 0;
		background: #fff;
		z-index: 3000;
		position: absolute;
		list-style-type: none;
		padding: 5px 0;
		border-radius: 4px;
		font-size: 12px;
		font-weight: 400;
		color: #333;
		box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
		li {
			margin: 0;
			padding: 7px 16px;
			cursor: pointer;
			&:hover {
				background: #eee;
			}
		}
	}
}
</style>
