import router from "./index.js";
import store from "@/store";
import { Message } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // progress bar style
import getPageTitle from "@/utils/getPageTitle";
import { getToken } from "@/utils/auth";

const whiteList = ["/login", "/auth-redirect"];

router.beforeEach(async (to, from, next) => {
	console.log(to.path);
	// 进度条开始
	NProgress.start();
	// 设置页面title
	console.log("执行次数");
	document.title = getPageTitle(to.meta.title);
	const hasToken = getToken();
	if (hasToken) {
		if (to.path === "/login") {
			next({ path: "/" });
		} else {
			const hasRoles = store.getters.roles && store.getters.roles.length > 0;
			console.log(hasRoles, "hasRoles");
			if (hasRoles) {
				next();
			} else {
				try {
					const { roles } = await store.dispatch("user/getInfo");
					const accessRoutes = await store.dispatch(
						"permission/generateRoutes",
						roles
					);
					router.addRoutes(accessRoutes);
					// hack method to ensure that addRoutes is complete
					// set the replace: true, so the navigation will not leave a history record
					next({ ...to });
					// next();
				} catch (error) {
					// remove token and go to login page to re-login
					await store.dispatch("user/resetToken");
					Message.error(error || "Has Error");
					console.log("出错");
					next(`/login?redirect=${to.path}`);
					NProgress.done();
				}
			}
		}
	} else {
		if (whiteList.indexOf(to.path) !== -1) {
			next();
		} else {
			next(`/login?redirect=${to.path}`);
		}
	}
});

router.afterEach(() => {
	// 进度条结束
	NProgress.done();
});
