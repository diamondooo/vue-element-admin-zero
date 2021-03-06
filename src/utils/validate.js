/**
 * 验证用户名是否合法
 * @param {string} str 姓名
 * @returns {Boolean}
 */
export function validUsername(str) {
	const valid_map = ["admin", "editor"];
	return valid_map.indexOf(str.trim()) >= 0;
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
	return /^(https?:|mailto:|tel:)/.test(path);
}
