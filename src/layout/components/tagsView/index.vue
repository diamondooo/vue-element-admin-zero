<template>
	<div class="tags-view-container" id="tags-view-container">
		<scroll-pane ref="scrollPane" class="tags-view-wrapper">
			<router-link
				v-for="tag in visitedViews"
				:key="tag.path"
				:to="{ path: tag.path, query: tag.query }"
				tag="span"
				class="tags-view-item"
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
		return {};
	},
	computed: {
		visitedViews() {
			return [];
			// return this.$store.state.tagsView.visitedViews;
		},
	},
	methods: {},
};
</script>
<style scoped lang="scss"></style>
