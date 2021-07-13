import Vue from "vue";
import Router from "vue-router";

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject)
		return originalPush.call(this, location, onResolve, onReject);
	return originalPush.call(this, location).catch((err) => {
		if (Router.isNavigationFailure(err)) {
			// resolve err
			return err;
		}
		// rethrow error
		return Promise.reject(err);
	});
};

Vue.use(Router);

// Layout
import Layout from "@/layout";

export const constantRoutes = [
	{
		path: "/login",
		component: () => import("@/views/login/index"),
	},
	{
		path: "/auth-redirect",
		component: () => import("@/views/login/auth-redirect"),
	},
	{
		path: "/",
		component: Layout,
		redirect: "/dashboard",
		children: [
			{
				path: "dashboard",
				component: () => import("@/views/dashboard/index"),
				name: "Dashboard",
			},
		],
	},
	{
		path: "/documentation",
		component: Layout,
		children: [
			{
				path: "index",
				component: () => import("@/views/documentation/index"),
				name: "Documentation",
			},
		],
	},
];
export const asyncRoutes = [];

const createRouter = () =>
	new Router({
		scrollBehavior: () => ({ y: 0 }),
		routes: constantRoutes,
	});

const router = createRouter();

export default router;
