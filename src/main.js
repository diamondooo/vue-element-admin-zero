import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store";

// 完整引入引入element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

// ~~~~引入icon
import "./icons";
// ~~~~引入permission权限控制
import "./router/permission.js";
// ~~~~引入error log

// 全局css
import "@/styles/index.scss";

// css reset
import "normalize.css/normalize.css";

//vue配置
Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
