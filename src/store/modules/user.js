import { login } from "@/api/user";
const state = {};
const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token;
	},
};
const actions = {
	login({ commit }, userInfo) {
		const { username, password } = userInfo;
		return new Promise((resolve, reject) => {
			login({ username: username.trim(), password })
				.then((response) => {
					const { data } = response;
					commit("SET_TOKEN", date.token);
					setToken(date.token);
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
	resetToken({ commit }) {
		return new Promise((resolve) => {});
	},
};
export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
