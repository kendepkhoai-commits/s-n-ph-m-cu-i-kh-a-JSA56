const loginForm = document.querySelector("#login-form");
const formMessage = document.querySelector("#form-message");

function showMessage(message, type = "error") {
	formMessage.textContent = message; // Hiện thông báo ngay dưới biểu mẫu.
	formMessage.className = `message ${type}`; // Dùng kiểu success hoặc error trong CSS.
}

// Dùng query string để báo đăng ký thành công sau khi trang được tải lại/chuyển trang.
if (new URLSearchParams(window.location.search).has("registered")) {
	showMessage("Đăng ký thành công. Hãy đăng nhập bằng tài khoản vừa tạo.", "success");
}

loginForm.addEventListener("submit", (event) => {
	event.preventDefault(); // Tự kiểm tra thông tin, không tải lại trang.

	const email = loginForm.email.value.trim(); // Bỏ khoảng trắng quanh email.
	const password = loginForm.password.value; // Mật khẩu phải khớp chính xác.
	// Báo lỗi nếu thiếu email hoặc mật khẩu.
	if (!email || !password) {
		showMessage("Vui lòng nhập địa chỉ email và mật khẩu.");
		return;
	}

	// localStorage có thể bị trình duyệt chặn, nên cần xử lý lỗi trước khi đọc tài khoản.
	let savedAccount;
	try {
		savedAccount = localStorage.getItem("waterAidAccount"); // Đọc tài khoản đã đăng ký.
	} catch {
		showMessage("Không thể đọc dữ liệu tài khoản trên trình duyệt này.");
		return;
	}

	if (!savedAccount) {
		showMessage("Chưa tìm thấy tài khoản. Vui lòng đăng ký trước.");
		return;
	}

	// Chuyển chuỗi JSON thành object để so sánh thông tin đăng nhập.
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

	// Email không phân biệt hoa/thường; mật khẩu phải giống hoàn toàn.
	if (email.toLowerCase() !== account.email.toLowerCase() || password !== account.password) {
		showMessage("Địa chỉ email hoặc mật khẩu không chính xác.");
		return;
	}

	try {
		// Lưu cờ phiên để menu biết người dùng đã đăng nhập.
		sessionStorage.setItem("waterAidAuthenticated", "1");
	} catch {
		showMessage("Không thể tạo phiên đăng nhập trên trình duyệt này.");
		return;
	}

	window.location.href = "menu.html"; // Đăng nhập thành công thì mở trang menu.
});