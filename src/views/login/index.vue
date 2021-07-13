<template>
	<div class="login-container">
		<el-form
			:model="loginForm"
			status-icon
			:rules="loginRules"
			ref="loginForm"
			class="login-form"
		>
			<el-form-item prop="username">
				<el-input
					type="text"
					v-model="loginForm.username"
					autocomplete="on"
					placeholder="用户名"
				></el-input>
			</el-form-item>
			<el-tooltip
				v-model="capsTooltip"
				content="Caps lock is On"
				placement="right"
				manual
			>
				<el-form-item prop="password">
					<el-input
						:key="passwordType"
						ref="password"
						v-model="loginForm.password"
						:type="passwordType"
						placeholder="密码"
						autocomplete="on"
						@keypress.native="checkCapslock"
						@blur="capsTooltip = false"
						@keyup.enter.native="handleLogin"
					/>
				</el-form-item>
			</el-tooltip>
			<el-button
				@click.native="handleLogin"
				type="primary"
				style="width:100%"
				:loading="loading"
				>登录</el-button
			>
		</el-form>
	</div>
</template>
<script>
/* 
页面交互说明：
密码输入框获取焦点时，如果键盘的大写锁开启，就显示tooltip提示，失去焦点时，提示消失
*/
import { validUsername } from "@/utils/validate";
export default {
	props: {},
	data() {
		const validateUsername = (rule, value, callback) => {
			// console.log(rule, "rule-name");
			if (!validUsername(value)) {
				callback(new Error("请输入正确的用户名"));
			} else {
				callback();
			}
		};
		const validatePassword = (rule, value, callback) => {
			// console.log(rule, "rule-passwprd");
			if (value.length < 6) {
				callback(new Error("密码的长度不得少于6位"));
			} else {
				callback();
			}
		};
		return {
			loading: false,
			capsTooltip: false,
			passwordType: "password",
			loginForm: {
				username: "admin",
				password: "111111",
			},
			loginRules: {
				username: [
					{
						required: true,
						trigger: "blur",
						validator: validateUsername,
					},
				],
				password: [
					{
						required: true,
						trigger: "blur",
						validator: validatePassword,
					},
				],
			},
			redirect: undefined,
			otherQuery: {},
		};
	},
	watch: {
		$route: {
			handler(route) {
				const query = route.query;
				if (query) {
					this.redirect = query.redirect;
					this.otherQuery = this.getOtherQuery(query);
				}
			},
			immediate: true,
		},
	},
	methods: {
		// 键盘输入时检查大写锁是否打开，检查规则：没按着shift，还输入了大写，或者按着shift还输入了小写，就判断为Caps Lock是打开的。(按组合键比如sift+a或两次触发这个函数,但是顺序是a然后是shift)
		checkCapslock(e) {
			let code = e.keycode || e.which;
			let shiftKey = e.shiftKey;
			// console.log(e);
			if (
				(!shiftKey && code >= 65 && code <= 90) || //没有按shift但是输入了大写
				(shiftKey && code >= 97 && code <= 122) //按了shift但是输入了小写
			) {
				this.capsTooltip = true;
			} else {
				this.capsTooltip = false;
			}
		},
		handleLogin() {
			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					this.loading = true;
					this.$store
						.dispatch("user/login", this.loginForm)
						.then(() => {
							this.$router.push({
								path: this.redirect || "/",
								query: this.otherQuery,
							});
							this.loading = false;
						})
						.catch(() => {
							this.loading = false;
						});
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		},
		getOtherQuery(query) {
			return Object.keys(query).reduce((acc, cur) => {
				if (cur !== "redirect") {
					acc[cur] = query[cur];
				}
				return acc;
			}, {});
		},
	},
};
</script>
<style scoped lang="scss">
$bg: #2d3a4b;
$light_gray: #fff;
.login-container {
	height: 100%;
	width: 100%;
	background-color: $bg;
	::v-deep .el-input {
		input {
			background: transparent;
			border: none;
			color: $light_gray;
		}
	}
	::v-deep .el-form-item {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		color: #454545;
	}
	.login-form {
		width: 520px;
		padding: 160px 35px 0;
		margin: 0 auto;
	}
}
</style>
