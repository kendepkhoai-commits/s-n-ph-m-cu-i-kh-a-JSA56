const registerForm = document.querySelector("#register-form");
const formMessage = document.querySelector("#form-message");

function showMessage(message, type = "error") {
	formMessage.textContent = message; // Đưa nội dung lỗi/thành công vào trang.
	formMessage.className = `message ${type}`; // Chọn màu theo loại thông báo.
}

registerForm.addEventListener("submit", (event) => {
	event.preventDefault(); // Tự kiểm tra form, không tải lại trang.

	const email = registerForm.email.value.trim(); // Bỏ khoảng trắng quanh email.
	const username = registerForm.username.value.trim(); // Bỏ khoảng trắng quanh tên.
	const password = registerForm.password.value; // Lấy mật khẩu người dùng nhập.
	const confirmPassword = registerForm["confirm-password"].value; // Lấy mật khẩu nhập lại.

	// Báo lỗi và dừng nếu thiếu thông tin bắt buộc.
	if (!email || !username || !password || !confirmPassword) {
		showMessage("Vui lòng nhập đầy đủ thông tin.");
		return;
	}
	// Chỉ chấp nhận email Gmail đúng định dạng.
	if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
		showMessage("Địa chỉ email phải có định dạng hợp lệ và kết thúc bằng @gmail.com.");
		return;
	}

	// Tìm ký tự không phải chữ, số hoặc khoảng trắng.
	const hasSpecialCharacter = /[^\p{L}\p{N}\s]/u.test(password);
	// Đếm theo ký tự Unicode để chữ có dấu không bị tính sai.
	const characterCount = [...password].length;
	// Mật khẩu phải dài hơn 8 ký tự và có ký tự đặc biệt.
	if (characterCount <= 8 || !hasSpecialCharacter) {
		showMessage("Mật khẩu cần trên 8 ký tự và có ít nhất 1 ký tự đặc biệt.");
		return;
	}
	// Hai ô mật khẩu phải giống nhau.
	if (password !== confirmPassword) {
		showMessage("Mật khẩu nhập lại chưa khớp.");
		return;
	}

	try {
		// Đây là bản demo lưu mật khẩu dạng rõ trong trình duyệt, không dùng cho xác thực thật.
		localStorage.setItem("waterAidAccount", JSON.stringify({ email, username, password }));
	} catch {
		showMessage("Không thể lưu tài khoản trên trình duyệt này.");
		return;
	}

	window.location.href = "login.html?registered=1"; // Mở trang đăng nhập sau khi lưu xong.
});