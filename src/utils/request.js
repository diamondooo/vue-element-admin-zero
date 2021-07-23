import Vue from "vue";
import axios from "axios";
import { Message, MessageBox } from "element-ui";
import { getToken } from "@/utils/auth";
import store from "@/store";

axios({
	url: "/vue-element-admin/user/login",
	method: "post",
	data,
	settings: {
		//loading:true,//使用全屏loading
		loading: {
			lock: true,
			text: "Loading",
			spinner: "el-icon-loading",
			background: "rgba(0, 0, 0, 0.7)",
			target: ".login-container",
		},
		error: true, //让拦截器统一处理error
		cancelMultipleName: "login", //要防止重复请求
	},
});

const service = axios.create({
	timeout: 5000,
});
// 正在进行中的请求列表
let reqList = [];
/**
 * 阻止重复请求
 * @param {array} reqList - 请求缓存列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMessage - 请求中断时需要显示的错误信息
 */
const stopRepeatRequest = function(reqList, url, cancel, errorMessage) {
	const errorMsg = errorMessage || "";
	for (let i = 0; i < reqList.length; i++) {
		if (reqList[i] === url) {
			cancel(errorMsg);
			return;
		}
	}
	reqList.push(url);
};
/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const allowRequest = function(reqList, url) {
	for (let i = 0; i < reqList.length; i++) {
		if (reqList[i] === url) {
			reqList.splice(i, 1);
			break;
		}
	}
};
function handleLoading(loading) {
	if (loading) {
		if (loading === true) {
			return Vue.prototype.$loading({
				lock: true,
			});
		} else if (typeof loading === "object") {
			return Vue.prototype.$loading(loading);
		} else {
			return false;
		}
	} else {
		return false;
	}
}
function handleError(error) {
	if (error) {
		return function(msg) {
			Message({
				message: msg, //一般是"Request failed with status code 500"
				type: "error",
				duration: 5000,
			});
		};
	} else {
		return false;
	}
}
/* 
// 拦截器默认情况下是会统一处理loading和error的
{
	loading:true||obj,//true为全屏默认loading；obj为v-loading的参数，参考elementui，//loading一般不是每一个接口都用，默认为false比较好
	handleError：boolean,//true则在拦截器中默认处理，false则拦截器不处理错误,//处理错误每一个接口都需要，默认为true
}
*/
service.interceptors.request.use(
	(config) => {
		let settings = config.settings || {};
		config.loadingObj = handleLoading(
			typeof settings.loading === "undefined" ? false : settings.loading
		);
		config.errorObj = handleError(
			typeof settings.error === "boolean" ? settings.error : true
		);
		/* ********************防止重复请求相关********************** */
		let cancel;
		// 设置cancelToken对象
		if ((config.cancelMultipleName = settings.cancelMultipleName)) {
			config.cancelToken = new axios.CancelToken(function(c) {
				cancel = c;
			});
			// 阻止重复请求。当上个请求未完成时，相同的请求不会进行
			stopRepeatRequest(
				reqList,
				config.cancelMultipleName,
				cancel,
				`${config.url} 请求被中断`
			);
		}
		/* ***************************其他**************************** */

		if (store.getters.token) {
			config.headers["X-Token"] = getToken();
		}
		return config;
	},
	(error) => {
		console.log(error);
		return Promise.reject(error);
	}
);

// 和后端商量，将请求返回的数据的错误码放在response.data.code中，不要修改http响应头，不然又要在error回调中写一遍
service.interceptors.response.use(
	(response) => {
		console.log("response", response);
		// response:包括响应头和响应状态
		const res = response.data;
		// 如果有loading就关闭loading
		let loadingObj = response.config.loadingObj;
		if (loadingObj) {
			loadingObj.close();
		}
		// 如果要处理error就处理error
		let errorObj = response.config.errorObj;
		if (errorObj) {
			errorObj(res.message);
		}
		// 增加延迟，相同请求不得在短时间内重复发送
		setTimeout(() => {
			allowRequest(reqList, response.config.cancelMultipleName);
		}, 1000);
		if (res.code !== 200) {
			// 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
			if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
				// to re-login
				return MessageBox.confirm(
					"You have been logged out, you can cancel to stay on this page, or log in again",
					"Confirm logout",
					{
						confirmButtonText: "Re-Login",
						cancelButtonText: "Cancel",
						type: "warning",
					}
				).then(() => {
					store.dispatch("user/resetToken").then(() => {
						location.reload();
					});
				});
			}
			return Promise.reject(res); //将hideNormalError返回，让其他函数改变isShowNormalError的值
		} else {
			return res;
		}
	},
	(error) => {
		console.log("error", { error });
		// 取消的请求就不在页面中进行报错了
		if (axios.isCancel(error)) {
			console.log(error.message);
		} else {
			// 增加延迟，相同请求不得在短时间内重复发送
			setTimeout(() => {
				allowRequest(reqList, error.config.cancelMultipleName);
			}, 1000);
			Message({
				message: error.message, //一般是"Request failed with status code 500"
				type: "error",
				duration: 5000,
			});
		}
		return Promise.reject(error);
	}
);

export default service;
