import axios from "axios";
import { Message, MessageBox } from "element-ui";
import { getToken } from "@/utils/auth";
import store from "@/store";
const service = axios.create({
	// baseURL: process.env.VUE_APP_BASE_API,
	timeout: 5000,
});
service.interceptors.request.use(
	(config) => {
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
		let msg = response.data.message;
		// message相关
		let isShowNormalError = true;
		const hideNormalError = () => (isShowNormalError = false);
		setTimeout(() => {
			if (isShowNormalError) {
				Message.error(msg);
			}
		});

		// response:包括响应头和响应状态
		const res = response.data;
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
			return Promise.reject({ msg: res.message, hideNormalError }); //将hideNormalError返回，让其他函数改变isShowNormalError的值
		} else {
			return res;
		}
	},
	(error) => {
		console.log("error", { error });
		Message({
			message: error.message, //一般是"Request failed with status code 500"
			type: "error",
			duration: 5000,
		});
		return Promise.reject(error);
	}
);

export default service;
