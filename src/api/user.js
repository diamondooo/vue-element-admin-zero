import request from "@/utils/request";
export function login(data, settings) {
	return request({
		url: "/vue-element-admin/user/login",
		method: "post",
		data,
		settings,
	});
}

export function getInfo(token) {
	return request({
		url: "/vue-element-admin/user/info",
		method: "get",
		params: { token },
	});
}
