<template>
	<div class="navbar">
		<hamburger class="hamburger-container" />
    <breadcrumb class="breadcrumb-container"></breadcrumb>
	</div>
</template>
<script>
import { Hamburger, Breadcrumb } from "./components";
export default {
	props: {},
	components: {
		Hamburger,
		Breadcrumb,
	},
	data() {
		return {};
	},
	methods: {},
};
</script>
<style scoped lang="scss">
.navbar {
	height: 50px;
	background-color: white;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container{
    float: left;
    height: 100%;
    line-height: 50px;
    padding: 0 15px;
    cursor: pointer;
  }
}
</style>
