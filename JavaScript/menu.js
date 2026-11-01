// ================= PHẦN TỬ GIAO DIỆN =================
// Gom các phần tử được dùng nhiều lần để các nhóm logic bên dưới thao tác
// đúng vào HTML tương ứng, thay vì phải tìm lại phần tử sau mỗi lần bấm.
const accountName = document.querySelector("#account-name");
const logoutButton = document.querySelector("#logout-button");
const navbarToggle = document.querySelector("#navbar-toggle");
const siteHeader = document.querySelector("#site-header");
const reasonImage = document.querySelector("#reason-image");
const reasonLabel = document.querySelector("#reason-label");
const reasonTitle = document.querySelector("#reason-title");
const reasonDescription = document.querySelector("#reason-description");
const reasonTabs = document.querySelectorAll(".reason-tab");

// ================= VỊ TRÍ NÚT THANH ĐIỀU HƯỚNG =================
function updateNavbarTogglePosition() {
	// Khi header ẩn, ghim nút gần mép trên; khi hiện, đặt nút sát mép dưới
	// của header để người dùng luôn tìm được nút bật/tắt.
	const isHidden = document.body.classList.contains("navbar-hidden");
	const top = isHidden ? 12 : siteHeader.getBoundingClientRect().bottom - 12;
	navbarToggle.style.top = `${Math.max(12, top)}px`;
}

// Tính vị trí ban đầu, sau đó tính lại khi kích thước/độ cuộn thay đổi.
updateNavbarTogglePosition();
window.addEventListener("resize", updateNavbarTogglePosition);
// passive cho biết callback không chặn thao tác cuộn của trình duyệt.
window.addEventListener("scroll", updateNavbarTogglePosition, { passive: true });
siteHeader.addEventListener("transitionend", event => {
	// Chỉ cập nhật sau chuyển động ẩn/hiện header, không phản ứng với transition khác.
	if (event.propertyName === "transform") {
		updateNavbarTogglePosition();
	}
});

// ================= ẨN / HIỆN THANH ĐIỀU HƯỚNG =================
navbarToggle.addEventListener("click", () => {
	// class trên body vừa điều khiển giao diện header, vừa là trạng thái
	// để tính lại vị trí nút sau khi người dùng bấm.
	const isHidden = document.body.classList.toggle("navbar-hidden");
	const label = isHidden ? "Hiện thanh điều hướng" : "Ẩn thanh điều hướng";

	// Đồng bộ thông tin hỗ trợ truy cập, tooltip và ký hiệu mũi tên
	// với trạng thái mới để cả người dùng bàn phím/trình đọc màn hình đều biết.
	navbarToggle.setAttribute("aria-expanded", String(!isHidden));
	navbarToggle.setAttribute("aria-label", label);
	navbarToggle.title = label;
	navbarToggle.querySelector("span").textContent = isHidden ? "⌄" : "⌃";
	updateNavbarTogglePosition();
});

// ================= NỘI DUNG CÁC MỤC "VÌ SAO LÀ NƯỚC?" =================
// Thông tin của từng lĩnh vực (ảnh, nhãn, tiêu đề, mô tả) được khai báo
// bằng data-* trên mỗi .reason-tab trong menu.html; vì vậy không cần viết
// một nhánh if riêng cho từng lĩnh vực ở đây.
reasonTabs.forEach(button => {
	button.addEventListener("click", () => {
		// "button" ở đây chính là nút người dùng vừa bấm; các lệnh bên dưới
		// đọc data-* từ nút này chứ không đọc nhầm dữ liệu của nút khác.

		// Đặt đúng một tab ở trạng thái đã chọn. aria-pressed giúp CSS biểu thị
		// tab đang bật và thông báo trạng thái đó cho công nghệ hỗ trợ.
		reasonTabs.forEach(tab => {
			tab.setAttribute("aria-pressed", String(tab === button)); // Nút vừa bấm thành "true", các nút còn lại thành "false".
		});

		// dataset là cách JavaScript đọc các thuộc tính data-* trong HTML:
		// data-image -> dataset.image, data-title -> dataset.title, v.v.
		reasonImage.src = button.dataset.image; // data-image: đổi ảnh lớn sang ảnh của lĩnh vực được chọn.
		reasonImage.alt = button.dataset.alt; // data-alt: đổi mô tả ảnh để nội dung hỗ trợ truy cập khớp ảnh mới.
		reasonLabel.textContent = button.dataset.label; // data-label: đổi nhãn nhỏ viết hoa phía trên tiêu đề.
		reasonTitle.textContent = button.dataset.title; // data-title: đổi tiêu đề của phần giải thích.
		reasonDescription.textContent = button.dataset.description; // data-description: đổi đoạn mô tả bên dưới tiêu đề.
	});
});

// ================= KIỂM TRA PHIÊN ĐĂNG NHẬP =================
// sessionStorage chỉ giữ trạng thái đăng nhập trong tab hiện tại.
// Nếu không đọc được storage, mặc định phiên này chưa đăng nhập.
let isAuthenticated = false;
try {
	isAuthenticated = sessionStorage.getItem("waterAidAuthenticated") === "1";
} catch {
	// Trình duyệt có thể chặn storage; biến mặc định false sẽ chuyển tới đăng nhập.
}

// Tài khoản được lưu riêng trong localStorage; JSON hỏng được xử lý như
// tài khoản không hợp lệ để trang không dừng giữa chừng vì lỗi parse.
let account;
try {
	account = JSON.parse(localStorage.getItem("waterAidAccount"));
} catch {
	account = null;
}

// Chỉ cho xem trang khi vừa có phiên đăng nhập, vừa có tên tài khoản dùng được.
if (!isAuthenticated || !account || typeof account.username !== "string") {
	window.location.replace("login.html");
} else {
	accountName.textContent = account.username;
}

// ================= ĐĂNG XUẤT =================
logoutButton.addEventListener("click", () => {
	// Xóa dấu phiên đăng nhập trước khi quay về trang đăng nhập;
	// finally bảo đảm điều hướng vẫn diễn ra nếu thao tác storage gặp lỗi.
	try {
		sessionStorage.removeItem("waterAidAuthenticated");
	} finally {
		window.location.replace("login.html");
	}
});
