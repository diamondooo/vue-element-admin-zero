import router from "./index.js";
import NProgress from "nprogress";
import getPageTitle from "@/utils/getPageTitle";
import { getToken } from "@/utils/auth";

const whiteList=['/login','/auth-redirect'];

router.beforeEach(async (to, from, next) => {
  console.log(to.path);
  // debugger;
	// 进度条开始
	NProgress.start();
	// 设置页面title
	document.title = getPageTitle(to.meta.title);
	const hasToken = getToken();
	if (hasToken) {
		if (to.path === "/login") {
			next({ path: "/" });
		} else {
		}
	}else{
    if(whiteList.indexOf(to.path)!==-1){
      next();
    }else{
      next(`/login?redirect=${to.path}`)
    }
  }
	// next();
});

router.afterEach(() => {
	// 进度条结束
	NProgress.done();
});
