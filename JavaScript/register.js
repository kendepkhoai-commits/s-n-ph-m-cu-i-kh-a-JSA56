const registerForm = document.querySelector("#register-form");
const formMessage = document.querySelector("#form-message");

function showMessage(message, type = "error") {
	formMessage.textContent = message;
	formMessage.className = `message ${type}`;
}

registerForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const email = registerForm.email.value.trim();
	const username = registerForm.username.value.trim();
	const password = registerForm.password.value;
	const confirmPassword = registerForm["confirm-password"].value;

	if (!email || !username || !password || !confirmPassword) {
		showMessage("Vui lòng nhập đầy đủ thông tin.");
		return;
	}
	if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
		showMessage("Địa chỉ email phải có định dạng hợp lệ và kết thúc bằng @gmail.com.");
		return;
	}

	// Nhóm Unicode cho phép phân biệt chữ/số ở mọi ngôn ngữ với ký tự đặc biệt.
	const hasSpecialCharacter = /[^\p{L}\p{N}\s]/u.test(password);
	// Duyệt theo code point để ký tự Unicode ghép được đếm như một ký tự hiển thị.
	const characterCount = [...password].length;
	if (characterCount <= 8 || !hasSpecialCharacter) {
		showMessage("Mật khẩu cần trên 8 ký tự và có ít nhất 1 ký tự đặc biệt.");
		return;
	}
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

	window.location.href = "login.html?registered=1";
});