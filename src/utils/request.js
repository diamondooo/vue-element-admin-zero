import axios from "axios";
import { Message, MessageBox } from "element-ui";
import { getToken } from "@/utils/auth";
import store from "@/store";
const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API,
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
		// 什么情况下会进入这个错误处理函数
		console.log(error);
		return Promise.reject(error);
	}
);

service.interceptors.response.use(
	(response) => {
		// response:包括响应头和响应状态
		const res = response.data;
		if (res.code !== 20000) {
			Message({
				message: res.massage || "Request Error!",
				type: "error",
				duration: 5000,
			});
			// 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
			if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
				// to re-login
				MessageBox.confirm(
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
			return Promise.reject(new Error(res.message || "Error"));
		} else {
			return res;
		}
	},
	(error) => {
		console.log("err" + error);
		Message({
			message: error.message,
			type: "error",
			duration: 5000,
		});
		return Promise.reject(error);
	}
);
