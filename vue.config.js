module.exports = {
	devServer: {
		port: 9001,
		open: true,
		before: require("./mock/mock-server.js"),
	},
};
