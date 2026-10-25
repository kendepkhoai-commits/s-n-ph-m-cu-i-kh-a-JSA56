const loginForm = document.querySelector("#login-form");
const formMessage = document.querySelector("#form-message");

function showMessage(message, type = "error") {
	formMessage.textContent = message;
	formMessage.className = `message ${type}`;
}

// Dùng query string để báo đăng ký thành công sau khi trang được tải lại/chuyển trang.
if (new URLSearchParams(window.location.search).has("registered")) {
	showMessage("Đăng ký thành công. Hãy đăng nhập bằng tài khoản vừa tạo.", "success");
}

loginForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const email = loginForm.email.value.trim();
	const password = loginForm.password.value;
	if (!email || !password) {
		showMessage("Vui lòng nhập địa chỉ email và mật khẩu.");
		return;
	}

	// localStorage có thể bị trình duyệt chặn, nên cần xử lý lỗi trước khi đọc tài khoản.
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

	// Kiểm tra riêng JSON lỗi và dữ liệu sai cấu trúc để hiện thông báo phù hợp.
	let account;
	// Chỉ đánh dấu đăng nhập sau khi thông tin đã khớp và chuyển trang khi lưu phiên thành công.
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

	// Địa chỉ email không phân biệt chữ hoa/thường; mật khẩu phải khớp chính xác.
	if (email.toLowerCase() !== account.email.toLowerCase() || password !== account.password) {
		showMessage("Địa chỉ email hoặc mật khẩu không chính xác.");
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