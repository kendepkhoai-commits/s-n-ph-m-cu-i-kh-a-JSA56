const loginForm = document.querySelector("#login-form");
const formMessage = document.querySelector("#form-message");

function showMessage(message, type = "error") {
	formMessage.textContent = message;
	formMessage.className = `message ${type}`;
}

if (new URLSearchParams(window.location.search).has("registered")) {
	showMessage("Đăng ký thành công. Hãy đăng nhập bằng tài khoản vừa tạo.", "success");
}

loginForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const email = loginForm.email.value.trim();
	const password = loginForm.password.value;
	if (!email || !password) {
		showMessage("Vui lòng nhập email và mật khẩu.");
		return;
	}

	let savedAccount;
	try {
		savedAccount = localStorage.getItem("waterAidAccount");
	} catch {
		showMessage("Không thể đọc dữ liệu tài khoản trên trình duyệt này.");
		return;
	}

	if (!savedAccount) {
		showMessage("Chưa tìm thấy tài khoản. Vui lòng đăng ký trước.");
		return;
	}

	let account;
	try {
		account = JSON.parse(savedAccount);
	} catch {
		showMessage("Dữ liệu tài khoản bị lỗi. Vui lòng đăng ký lại.");
		return;
	}

	if (!account || typeof account.email !== "string" || typeof account.password !== "string") {
		showMessage("Dữ liệu tài khoản không hợp lệ. Vui lòng đăng ký lại.");
		return;
	}

	// Email casing is insignificant, but passwords must match exactly.
	if (email.toLowerCase() !== account.email.toLowerCase() || password !== account.password) {
		showMessage("Email hoặc mật khẩu không chính xác.");
		return;
	}

	try {
		sessionStorage.setItem("waterAidAuthenticated", "1");
	} catch {
		showMessage("Không thể tạo phiên đăng nhập trên trình duyệt này.");
		return;
	}

	window.location.href = "menu.html";
});