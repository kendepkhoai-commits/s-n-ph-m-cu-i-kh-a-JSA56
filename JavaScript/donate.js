/**
 * Các chức năng cho biểu mẫu ủng hộ Water for Africa.
 */

// Các phần tử giao diện chính
const currencyVndBtn = document.querySelector("#curr-vnd"); // Nút chọn tiền Việt.
const currencyUsdBtn = document.querySelector("#curr-usd"); // Nút chọn đô la Mỹ.
const amountGrid = document.querySelector("#amount-grid"); // Nơi JavaScript tạo các mức tiền.
const customAmountWrapper = document.querySelector("#custom-amount-wrapper"); // Khung nhập tiền tùy chọn.
const customAmountInput = document.querySelector("#custom-amount-input"); // Ô nhập số tiền tùy chọn.
const customCurrSymbol = document.querySelector("#custom-curr-symbol"); // Ký hiệu tiền cạnh ô nhập.
const impactDescText = document.querySelector("#impact-desc-text"); // Nơi hiện tác động dự kiến.
const frequencyInputs = document.querySelectorAll('input[name="frequency"]'); // Hai lựa chọn một lần/hàng tháng.

// Biểu mẫu và thông tin người ủng hộ
const donationForm = document.querySelector("#donation-hub-form"); // Toàn bộ biểu mẫu quyên góp.
const donorFullname = document.querySelector("#donor-fullname"); // Ô họ tên người ủng hộ.
const donorEmail = document.querySelector("#donor-email"); // Ô email nhận biên lai.
const donorCity = document.querySelector("#donor-city"); // Ô tỉnh/thành phố tùy chọn.
const donorMessage = document.querySelector("#donor-message"); // Ô lời nhắn tùy chọn.
const donorAnonymous = document.querySelector("#donor-anonymous"); // Chọn ẩn tên trong danh sách.

// Tab và vùng nội dung thanh toán
const tabBtnCard = document.querySelector("#tab-btn-card"); // Nút chọn trả bằng thẻ.
const tabBtnBank = document.querySelector("#tab-btn-bank"); // Nút chọn chuyển khoản.
const tabContentCard = document.querySelector("#tab-content-card"); // Khung nhập dữ liệu thẻ.
const tabContentBank = document.querySelector("#tab-content-bank"); // Khung thông tin chuyển khoản.

// Thông tin và bản xem trước thẻ
const cardBankSelect = document.querySelector("#card-bank-select"); // Danh sách ngân hàng phát hành thẻ.
const cardNumberInput = document.querySelector("#card-number-input"); // Ô số thẻ.
const cardHolderInput = document.querySelector("#card-holder-input"); // Ô tên trên thẻ.
const cardExpiryInput = document.querySelector("#card-expiry-input"); // Ô ngày hết hạn.
const cardCvvInput = document.querySelector("#card-cvv-input"); // Ô mã bảo mật thẻ.
const detectedCardBrand = document.querySelector("#detected-card-brand"); // Nhãn thương hiệu thẻ nhận diện được.

const cardDisplayBank = document.querySelector("#card-display-bank"); // Tên ngân hàng trên thẻ mẫu.
const cardDisplayNumber = document.querySelector("#card-display-number"); // Số thẻ trên bản xem trước.
const cardDisplayName = document.querySelector("#card-display-name"); // Tên chủ thẻ trên bản xem trước.
const cardDisplayExpiry = document.querySelector("#card-display-expiry"); // Ngày hết hạn trên bản xem trước.
const cardDisplayBrand = document.querySelector("#card-display-brand"); // Thương hiệu trên bản xem trước.

// Thông tin chuyển khoản ngân hàng
const vietqrImage = document.querySelector("#vietqr-image"); // Ảnh QR được tạo từ đường dẫn VietQR.
const bankAccNum = document.querySelector("#bank-acc-num"); // Số tài khoản để sao chép.
const bankTransferAmount = document.querySelector("#bank-transfer-amount"); // Số tiền sẽ ghi trong QR.
const bankTransferMemo = document.querySelector("#bank-transfer-memo"); // Nội dung chuyển khoản ngẫu nhiên.
const btnCopyAcc = document.querySelector("#btn-copy-acc"); // Nút sao chép số tài khoản.
const btnCopyMemo = document.querySelector("#btn-copy-memo"); // Nút sao chép nội dung chuyển khoản.

// Nút xác nhận và phần tóm tắt khoản ủng hộ
const submitDonationBtn = document.querySelector("#submit-donation-btn"); // Nút xác nhận quyên góp.
const submitBtnText = document.querySelector("#submit-btn-text"); // Phần chữ trong nút xác nhận.
const summaryChosenAmount = document.querySelector("#summary-chosen-amount"); // Số tiền trong tóm tắt.
const summaryChosenFreq = document.querySelector("#summary-chosen-freq"); // Tần suất trong tóm tắt.
const summaryTotalDisplay = document.querySelector("#summary-total-display"); // Tổng tiền cuối cùng.

// Tiến độ quyên góp và danh sách người ủng hộ
const statRaised = document.querySelector("#stat-raised"); // Tổng tiền đã quyên góp.
const statTarget = document.querySelector("#stat-target"); // Mục tiêu quyên góp.
const statPercent = document.querySelector("#stat-percent"); // Phần trăm đã đạt mục tiêu.
const progressFill = document.querySelector("#progress-fill"); // Thanh màu thể hiện tiến độ.
const progressTrack = document.querySelector(".progress-track"); // Thanh tiến độ có thông tin cho trình đọc màn hình.
const donorsList = document.querySelector("#donors-list"); // Vùng chứa danh sách người ủng hộ.

// Hộp thoại biên lai
const receiptModalOverlay = document.querySelector("#receipt-modal-overlay"); // Toàn bộ lớp phủ biên lai.
const modalCloseBtn = document.querySelector("#modal-close-btn"); // Nút X đóng biên lai.
const btnCloseReceipt = document.querySelector("#btn-close-receipt"); // Nút đóng biên lai phía dưới.
const receiptCode = document.querySelector("#receipt-code"); // Mã giao dịch hiện trên biên lai.
const receiptDonorName = document.querySelector("#receipt-donor-name"); // Tên người ủng hộ trên biên lai.
const receiptDonorEmail = document.querySelector("#receipt-donor-email"); // Email trên biên lai.
const receiptAmount = document.querySelector("#receipt-amount"); // Khoản tiền trên biên lai.
const receiptFrequency = document.querySelector("#receipt-frequency"); // Tần suất trên biên lai.
const receiptPaymentMethod = document.querySelector("#receipt-payment-method"); // Cách thanh toán trên biên lai.
const receiptTimestamp = document.querySelector("#receipt-timestamp"); // Thời gian tạo biên lai.

// Nút điền dữ liệu thử và thông báo nhỏ
const btnFillTestData = document.querySelector("#btn-fill-test-data"); // Nút điền thông tin mẫu.
const toastNotice = document.querySelector("#toast-notice"); // Hộp thông báo nhỏ.
const toastMsg = document.querySelector("#toast-msg"); // Nội dung thông báo nhỏ.

// ================= TRẠNG THÁI HIỆN TẠI =================
let currentCurrency = "VND"; // Đơn vị tiền tệ đang chọn
let selectedAmountValue = 500000; // Khoản ủng hộ mặc định theo VNĐ
let selectedFrequency = "once"; // Tần suất: một lần hoặc hàng tháng
let activePaymentTab = "card"; // Phương thức: thẻ hoặc chuyển khoản
let campaignTargetVND = 1200000000; // Mục tiêu chiến dịch tính theo VNĐ.
let campaignTargetUSD = 50000; // Mục tiêu tương ứng khi hiển thị bằng USD.

const PRESET_AMOUNTS_VND = [50000, 100000, 200000, 500000, 1000000, 2000000]; // Mức chọn sẵn bằng VNĐ.
const PRESET_AMOUNTS_USD = [5, 10, 25, 50, 100, 250]; // Mức chọn sẵn bằng USD.

// Một số lượt ủng hộ mẫu để danh sách có nội dung ban đầu.
const SEED_DONORS = [
	{
		name: "Bác Lê Thị Mai", // Tên mẫu hiển thị trong danh sách.
		amount: "1.000.000 ₫", // Khoản ủng hộ mẫu.
		message: "Mong một giọt nước sạch đến được với các cháu nhỏ đang gặp hạn hán.", // Lời nhắn mẫu.
		time: "8 phút trước", // Thời gian mẫu.
		city: "Hà Nội" // Địa điểm mẫu.
	},
	{
		name: "Gia đình Tuấn Anh", // Tên người ủng hộ mẫu thứ hai.
		amount: "500.000 ₫", // Số tiền của lượt mẫu.
		message: "Góp chút sức lực nhỏ bé cùng Water for Africa giải cứu vùng đất cằn.", // Lời nhắn mẫu.
		time: "24 phút trước", // Thời gian mẫu.
		city: "TP. Hồ Chí Minh" // Địa điểm mẫu.
	},
	{
		name: "Trần Hoàng Đức", // Tên người ủng hộ mẫu thứ ba.
		amount: "2.000.000 ₫", // Số tiền của lượt mẫu.
		message: "Chung tay tài trợ khoan thêm giếng ngầm sâu 80m.", // Lời nhắn mẫu.
		time: "1 giờ trước", // Thời gian mẫu.
		city: "Đà Nẵng" // Địa điểm mẫu.
	},
	{
		name: "Nhà hảo tâm ẩn danh", // Tên ẩn danh mẫu.
		amount: "200.000 ₫", // Số tiền của lượt mẫu.
		message: "Thương chúc bà con kiên cường vượt qua mùa hạn gay gắt.", // Lời nhắn mẫu.
		time: "3 giờ trước", // Thời gian mẫu.
		city: "Cần Thơ" // Địa điểm mẫu.
	}
];

// ================= KHỞI TẠO TRANG =================
document.addEventListener("DOMContentLoaded", () => {
	// Chạy sau khi HTML đã sẵn sàng để các ID bên trên đều trỏ tới phần tử thật.
	initAccountPrefill(); // Điền tên/email nếu tài khoản đã được lưu.
	initDonationStorage(); // Đọc hoặc tạo tổng tiền và danh sách mẫu.
	initCurrency(currentCurrency); // Dựng các mức tiền theo đơn vị mặc định.
	setupEventListeners(); // Gắn phím tắt đóng biên lai.
	generateTransferMemo(); // Tạo nội dung chuyển khoản riêng cho lượt này.
	updateVietQR(); // Tạo mã QR ban đầu theo số tiền đang chọn.
});

// Điền sẵn thông tin tài khoản nếu người dùng đã đăng nhập.
function initAccountPrefill() {
	/*
	 * Tài khoản đăng ký được lưu dưới dạng JSON trong localStorage. Đọc và parse
	 * để điền họ tên/email vào biểu mẫu; họ tên cũng được bỏ dấu, viết hoa để
	 * làm giá trị ban đầu cho trường tên trên thẻ. Nếu dữ liệu hỏng/bị chặn,
	 * chỉ ghi cảnh báo và vẫn cho phép nhập tay.
	 */
	try {
		const rawAccount = localStorage.getItem("waterAidAccount"); // Lấy chuỗi tài khoản đã đăng ký.
		if (rawAccount) { // Chỉ parse khi thực sự có tài khoản lưu.
			const account = JSON.parse(rawAccount); // Đổi chuỗi JSON thành object.
			if (account && account.username) { // Chỉ điền tên nếu dữ liệu có tên.
				donorFullname.value = account.username; // Điền tên vào trường người ủng hộ.
				cardHolderInput.value = removeVietnameseTones(account.username).toUpperCase(); // Chuyển tên thành dạng không dấu trên thẻ.
				cardDisplayName.textContent = cardHolderInput.value; // Đồng bộ bản xem trước thẻ.
			}
			if (account && account.email) { // Chỉ điền email nếu tài khoản có email.
				donorEmail.value = account.email; // Điền email vào biểu mẫu.
			}
		}
	} catch (err) {
		console.warn("Không thể đọc dữ liệu tài khoản đã lưu.", err); // Ghi cảnh báo nhưng vẫn cho nhập tay.
	}
}

// Khởi tạo tổng tiền và danh sách người ủng hộ trong localStorage.
function initDonationStorage() {
	/*
	 * Các lượt demo được lưu ở localStorage để còn tồn tại sau khi tải lại trang.
	 * Chỉ ghi số tiền/danh sách mẫu khi chưa có khóa tương ứng, không ghi đè
	 * dữ liệu người dùng đã tạo; sau đó vẽ danh sách và tiến độ hiện tại.
	 */
	if (!localStorage.getItem("wfa_total_raised_vnd")) { // Nếu chưa có tổng tiền thì tạo giá trị ban đầu.
		localStorage.setItem("wfa_total_raised_vnd", "842650000"); // Lưu tổng mẫu bằng chuỗi trong localStorage.
	}
	if (!localStorage.getItem("wfa_donors_list")) { // Nếu chưa có danh sách thì dùng dữ liệu mẫu.
		localStorage.setItem("wfa_donors_list", JSON.stringify(SEED_DONORS)); // Chuyển mảng mẫu thành JSON để lưu.
	}
	renderDonorsList(); // Hiện danh sách ủng hộ đã lưu.
	renderCampaignProgress(); // Hiện tổng tiền và tiến độ đã lưu.
}

// ================= TIỀN TỆ VÀ MỨC ỦNG HỘ =================
function formatCurrency(amount, currency = currentCurrency) {
	// Dùng locale Việt Nam cho VNĐ và locale Mỹ cho USD để dấu phân cách dễ đọc.
	if (currency === "VND") {
		return Number(amount).toLocaleString("vi-VN") + " ₫"; // Định dạng số theo kiểu Việt Nam và thêm ký hiệu đồng.
	}
	return "$" + Number(amount).toLocaleString("en-US"); // Định dạng theo kiểu Mỹ và thêm ký hiệu đô la.
}

function initCurrency(currency) {
	/*
	 * Đây là điểm khởi tạo đồng bộ khi đổi VNĐ/USD: cập nhật trạng thái nút,
	 * đơn vị và giới hạn ô nhập; dựng lại các lựa chọn; sau đó làm mới số tiền
	 * trong phần tóm tắt, QR và tiến độ. Giá trị mặc định được đặt lại theo
	 * đồng tiền mới để tránh giữ số tiền của đơn vị trước.
	 */
	currentCurrency = currency; // Ghi nhận đơn vị tiền tệ người dùng vừa chọn.
	const isVND = currency === "VND"; // Dùng biến này để áp dụng cấu hình VNĐ hoặc USD.

	currencyVndBtn.classList.toggle("active", isVND); // Làm nổi bật nút VNĐ khi đang chọn VNĐ.
	currencyVndBtn.setAttribute("aria-pressed", String(isVND)); // Báo trạng thái nút VNĐ cho trình đọc màn hình.
	currencyUsdBtn.classList.toggle("active", !isVND); // Làm nổi bật nút USD khi đang chọn USD.
	currencyUsdBtn.setAttribute("aria-pressed", String(!isVND)); // Báo trạng thái nút USD cho trình đọc màn hình.

	customCurrSymbol.textContent = isVND ? "₫" : "$"; // Đổi ký hiệu cạnh ô nhập.
	customAmountInput.min = isVND ? "10000" : "1"; // Đặt mức tiền tối thiểu theo đơn vị đang chọn.
	customAmountInput.step = isVND ? "10000" : "1"; // Đặt bước tăng/giảm cho ô nhập.
	customAmountInput.placeholder = isVND ? "Nhập số tiền (VD: 300000)" : "Nhập số tiền (VD: 35)"; // Hiện ví dụ phù hợp.
	customAmountWrapper.style.display = "none"; // Ẩn ô tùy chọn sau khi đơn vị tiền tệ thay đổi.
	customAmountInput.value = ""; // Không giữ số cũ theo đơn vị tiền tệ trước đó.
	document.querySelector("#error-custom-amount").classList.remove("visible");
	customAmountInput.classList.remove("is-invalid");

	// Đổi tiền tệ sẽ dựng lại các mức chọn và đặt lại khoản đóng góp mặc định tương ứng.
	const presets = isVND ? PRESET_AMOUNTS_VND : PRESET_AMOUNTS_USD; // Chọn các mức quyên góp có sẵn.
	selectedAmountValue = isVND ? 500000 : 25; // Đặt lại số tiền mặc định theo đơn vị vừa chọn.

	renderAmountPresets(presets); // Dựng lại các nút chọn mức tiền.
	updateAmountSelection(selectedAmountValue); // Đồng bộ tóm tắt, tác động và QR.
	renderCampaignProgress(); // Cập nhật mục tiêu theo đơn vị mới.
}

function renderAmountPresets(presets) {
	/*
	 * Các mức tiền là radio tạo bằng JavaScript để nhãn luôn theo đúng tiền tệ.
	 * Mỗi radio khi chọn sẽ cập nhật số tiền toàn trang; lựa chọn "Tùy chọn khác"
	 * hiện ô nhập riêng và dùng giá trị gợi ý nếu ô còn trống.
	 */
	amountGrid.innerHTML = ""; // Xóa các mức cũ trước khi dựng lại danh sách.
	presets.forEach((amt) => {
		const label = document.createElement("label"); // Tạo nhãn bấm được cho một mức tiền.
		label.className = "amount-btn-label"; // Gắn kiểu nút mức tiền.
		label.innerHTML = `
			<input type="radio" name="preset-amount" value="${amt}" ${amt === selectedAmountValue ? "checked" : ""}>
			<span>${formatCurrency(amt)}</span>
		`;
		label.querySelector("input").addEventListener("change", () => {
			customAmountWrapper.style.display = "none"; // Ẩn ô tiền tùy chỉnh khi chọn một mức có sẵn.
			updateAmountSelection(amt); // Cập nhật toàn bộ giao diện theo mức vừa chọn.
		});
		amountGrid.appendChild(label); // Thêm nút vừa tạo vào khu vực mức tiền.
	});

	// Tạo thêm lựa chọn để người dùng tự nhập số tiền.
	const customLabel = document.createElement("label"); // Tạo nút chọn nhập mức tiền riêng.
	customLabel.className = "amount-btn-label"; // Dùng chung kiểu hiển thị với các mức khác.
	customLabel.innerHTML = `
		<input type="radio" name="preset-amount" value="custom">
		<span>Tùy chọn khác</span>
	`;
	customLabel.querySelector("input").addEventListener("change", () => {
		customAmountWrapper.style.display = "block"; // Hiện trường nhập số tiền tùy chọn.
		customAmountInput.focus(); // Đưa con trỏ vào ô để nhập ngay.
		const val = Number(customAmountInput.value) || (currentCurrency === "VND" ? 300000 : 30); // Dùng giá trị đã nhập hoặc gợi ý mặc định.
		customAmountInput.value = val; // Hiện giá trị gợi ý trong ô nhập.
		updateAmountSelection(val); // Đồng bộ số tiền vừa nhập/gợi ý.
	});
	amountGrid.appendChild(customLabel); // Thêm lựa chọn tùy chỉnh vào danh sách.
}

function updateAmountSelection(amount) {
	/*
	 * Lưu một giá trị số duy nhất làm nguồn dữ liệu cho phần còn lại của trang.
	 * Từ giá trị này, cập nhật số tiền hiển thị, mô tả tác động và mã QR để các
	 * phần không bị lệch nhau khi chọn preset hoặc nhập số tiền tùy chọn.
	 */
	selectedAmountValue = Number(amount) || 0; // Chuẩn hóa đầu vào thành số; để 0 nếu chưa có giá trị hợp lệ.
	const formatted = formatCurrency(selectedAmountValue); // Tạo chuỗi tiền để dùng trong giao diện.

	// Đồng bộ số tiền trên phần tóm tắt, nút xác nhận và thông tin chuyển khoản.
	summaryChosenAmount.textContent = formatted; // Hiện khoản tiền đã chọn trong tóm tắt.
	summaryTotalDisplay.textContent = formatted; // Hiện lại khoản tiền ở dòng tổng cộng.
	submitBtnText.textContent = `XÁC NHẬN ỦNG HỘ ${formatted}`; // Đưa số tiền vào nút xác nhận.
	// VietQR chỉ nhận VNĐ, nên số USD được quy đổi theo tỷ giá quy ước của bản demo.
	bankTransferAmount.textContent = currentCurrency === "VND" ? formatted : `${formatted} (~${formatCurrency(selectedAmountValue * 25400, "VND")})`; // Hiện số tiền QR bằng VNĐ nếu đang chọn USD.

	// Cập nhật mô tả tác động tương ứng với khoản tiền.
	updateImpactText(selectedAmountValue, currentCurrency); // Viết lại mô tả tác động theo số tiền/đơn vị hiện tại.

	// Cập nhật mã QR với số tiền và nội dung chuyển khoản mới.
	updateVietQR(); // Đồng bộ mã QR theo số tiền và nội dung chuyển khoản mới.
}

function updateImpactText(amount, currency) {
	/*
	 * Chuyển khoản USD sang giá trị VNĐ quy ước để so với các ngưỡng tác động.
	 * Sau đó chọn một thông điệp phù hợp theo khoảng tiền. Đây là nội dung minh
	 * họa của giao diện; không phải cam kết định lượng từ giao dịch thật.
	 */
	// So sánh theo cùng một đơn vị (VNĐ) dù người dùng đang chọn hiển thị USD.
	const valInVnd = currency === "VND" ? amount : amount * 25400; // Quy đổi USD sang VNĐ theo tỷ giá minh họa.

	if (valInVnd < 100000) {
		impactDescText.innerHTML = `Khoản ủng hộ <strong>${formatCurrency(amount)}</strong> cung cấp <strong>10 bình nước tinh khiết khẩn cấp</strong> cho đồng bào đang chịu hạn cạn.`; // Hiện tác động ở mức dưới 100.000 VNĐ.
	} else if (valInVnd < 250000) {
		impactDescText.innerHTML = `Khoản ủng hộ <strong>${formatCurrency(amount)}</strong> trang bị <strong>2 bộ kit kiểm định nước và viên clo khử khuẩn</strong> phòng ngừa dịch bệnh mùa khô.`; // Hiện tác động ở mức dưới 250.000 VNĐ.
	} else if (valInVnd < 600000) {
		impactDescText.innerHTML = `Khoản ủng hộ <strong>${formatCurrency(amount)}</strong> tài trợ <strong>1 bồn trữ nước dã chiến 500 lít</strong> cho một hộ gia đình vùng khô cằn.`; // Hiện tác động ở mức dưới 600.000 VNĐ.
	} else if (valInVnd < 1500000) {
		impactDescText.innerHTML = `Khoản ủng hộ <strong>${formatCurrency(amount)}</strong> trang bị <strong>1 bộ máy lọc gốm nano kháng khuẩn</strong> tiêu chuẩn y tế, lọc nước nhiễm mặn thành nước uống được.`; // Hiện tác động ở mức dưới 1.500.000 VNĐ.
	} else if (valInVnd < 3000000) {
		impactDescText.innerHTML = `Khoản ủng hộ <strong>${formatCurrency(amount)}</strong> lắp đặt <strong>50 mét đường ống cấp nước ngầm</strong> trực tiếp về trạm y tế và trường học.`; // Hiện tác động ở mức dưới 3.000.000 VNĐ.
	} else {
		impactDescText.innerHTML = `Khoản đóng góp tuyệt vời <strong>${formatCurrency(amount)}</strong> tài trợ trực tiếp <strong>1 phần mũi khoan giếng tầng ngầm 80m</strong> đem lại nguồn nước vĩnh cửu.`; // Hiện tác động ở mức từ 3.000.000 VNĐ trở lên.
	}
}

// ================= TƯƠNG TÁC THẺ VÀ NGÂN HÀNG =================
function removeVietnameseTones(str) {
	// Tách dấu khỏi chữ, xóa dấu rồi đổi riêng "đ/Đ" vì ký tự này không tách dấu.
	return str.normalize("NFD") // Tách dấu tiếng Việt khỏi các ký tự gốc.
		.replace(/[\u0300-\u036f]/g, "") // Xóa các dấu thanh đã được tách ra.
		.replace(/đ/g, "d") // Đổi riêng chữ đ viết thường.
		.replace(/Đ/g, "D"); // Đổi riêng chữ Đ viết hoa.
}

function detectCardBrand(digits) {
	/*
	 * Dựa vào tiền tố để chọn nhãn thương hiệu cho bản xem trước. Việc này chỉ
	 * nhận diện giao diện; không kiểm tra thẻ còn hiệu lực hay thực hiện thanh toán.
	 */
	if (digits.startsWith("4")) return { brand: "VISA", name: "Thẻ Visa Quốc tế" }; // Đầu số 4 được nhận diện là Visa.
	if (/^(5[1-5]|2[2-7])/.test(digits)) return { brand: "MASTERCARD", name: "Thẻ Mastercard" }; // Kiểm tra các dải đầu số Mastercard.
	if (/^35/.test(digits)) return { brand: "JCB", name: "Thẻ Quốc tế JCB" }; // Nhận diện JCB theo đầu số 35.
	if (/^9704/.test(digits)) return { brand: "NAPAS", name: "Thẻ Nội địa Napas" }; // Nhận diện thẻ nội địa Napas.
	return { brand: "CARD", name: "Thẻ Thanh Toán" }; // Trả nhãn chung nếu chưa khớp đầu số đã biết.
}

function isValidCardNumber(digits) {
	// The Luhn checksum catches common entry mistakes; it does not authorize a card.
	let sum = 0;
	let shouldDouble = false;
	for (let index = digits.length - 1; index >= 0; index--) {
		let digit = Number(digits[index]);
		if (shouldDouble) {
			digit *= 2;
			if (digit > 9) digit -= 9;
		}
		sum += digit;
		shouldDouble = !shouldDouble;
	}
	return sum % 10 === 0;
}

cardNumberInput.addEventListener("input", (e) => {
	/*
	 * Khi người dùng gõ số thẻ: bỏ mọi ký tự không phải số, chỉ giữ tối đa
	 * 16 chữ số, rồi chèn khoảng trắng sau mỗi nhóm bốn số. Cùng dữ liệu đã
	 * chuẩn hóa được đưa lên bản xem trước và dùng để nhận diện thương hiệu.
	 */
	const raw = e.target.value.replace(/\D/g, "").slice(0, 16); // Xóa ký tự khác số và giới hạn 16 chữ số.
	const formatted = raw.replace(/(.{4})/g, "$1 ").trim(); // Chèn dấu cách sau mỗi nhóm bốn số.
	cardNumberInput.value = formatted; // Thay nội dung ô bằng số thẻ đã định dạng.

	// Hiển thị số thẻ đã định dạng trên bản xem trước.
	cardDisplayNumber.textContent = formatted || "•••• •••• •••• ••••"; // Hiện số thẻ đã nhập hoặc mặt nạ khi ô trống.

	// Nhận diện thương hiệu thẻ từ các chữ số đầu tiên.
	const info = detectCardBrand(raw); // Lấy tên và nhãn thương hiệu theo đầu số.
	cardDisplayBrand.textContent = info.brand; // Hiện thương hiệu trên thẻ xem trước.
	detectedCardBrand.textContent = raw.length >= 2 ? `[${info.name}]` : ""; // Chỉ hiện mô tả khi đã nhập đủ đầu số để nhận diện.
});

cardHolderInput.addEventListener("input", (e) => {
	// Tên trên bản xem trước được đồng bộ trực tiếp từ nội dung người dùng nhập.
	const cleanName = removeVietnameseTones(e.target.value).toUpperCase(); // Bỏ dấu và viết hoa tên chủ thẻ.
	cardHolderInput.value = cleanName; // Chuẩn hóa nội dung ngay trong ô nhập.
	cardDisplayName.textContent = cleanName || "NGUYEN VAN A"; // Đồng bộ tên vào thẻ xem trước.
});

cardExpiryInput.addEventListener("input", (e) => {
	// Chỉ giữ tối đa bốn chữ số và tự chèn dấu "/" sau hai chữ số tháng.
	let val = e.target.value.replace(/\D/g, "").slice(0, 4); // Giữ lại tối đa bốn chữ số tháng/năm.
	if (val.length >= 3) {
		val = val.slice(0, 2) + "/" + val.slice(2); // Chèn dấu phân cách sau phần tháng.
	}
	cardExpiryInput.value = val; // Hiện ngày hết hạn đã định dạng.
	cardDisplayExpiry.textContent = val || "12/28"; // Đồng bộ ngày trên thẻ mẫu.
});

cardBankSelect.addEventListener("change", (e) => { // Theo dõi khi đổi ngân hàng phát hành.
	cardDisplayBank.textContent = e.target.value.toUpperCase(); // Cập nhật tên ngân hàng lên thẻ xem trước.
});

// Cập nhật hình thức ủng hộ khi chọn một lần hoặc hàng tháng.
frequencyInputs.forEach((radio) => { // Gắn xử lý cho từng lựa chọn tần suất.
	radio.addEventListener("change", () => {
		// value="once"/"monthly" trong HTML là giá trị logic; phần tóm tắt dùng nhãn dễ đọc.
		selectedFrequency = radio.value; // Ghi nhận lựa chọn once hoặc monthly.
		summaryChosenFreq.textContent = selectedFrequency === "monthly" ? "Ủng hộ hàng tháng (Định kỳ)" : "Ủng hộ một lần"; // Hiện nhãn dễ hiểu trong tóm tắt.
	});
});

// Cập nhật tổng tiền khi người dùng sửa mức ủng hộ tùy chọn.
customAmountInput.addEventListener("input", (e) => { // Theo dõi thay đổi ở ô tiền tùy chọn.
	const val = Number(e.target.value) || 0; // Chuyển nội dung ô nhập thành số.
	updateAmountSelection(val); // Đồng bộ giao diện theo số tiền mới.
	document.querySelector("#error-custom-amount").classList.remove("visible");
	customAmountInput.classList.remove("is-invalid");
});

// ================= CHUYỂN ĐỔI PHƯƠNG THỨC THANH TOÁN =================
function setPaymentTab(method) {
	// Chọn nút và phần nội dung tương ứng với phương thức thanh toán.
	const isCard = method === "card"; // Xác định người dùng chọn thanh toán thẻ hay chuyển khoản.
	const activeButton = isCard ? tabBtnCard : tabBtnBank; // Chọn nút cần được đánh dấu đang hoạt động.
	const inactiveButton = isCard ? tabBtnBank : tabBtnCard; // Chọn nút còn lại để bỏ trạng thái hoạt động.
	const activeContent = isCard ? tabContentCard : tabContentBank; // Chọn nội dung cần hiển thị.
	const inactiveContent = isCard ? tabContentBank : tabContentCard; // Chọn nội dung cần ẩn.

	// Đồng bộ trạng thái của nút, trình đọc màn hình và nội dung đang hiện.
	activePaymentTab = method; // Lưu phương thức đang chọn để validateForm biết nhóm trường cần kiểm tra.
	activeButton.classList.add("active"); // Đánh dấu nút đang được chọn.
	activeButton.setAttribute("aria-selected", "true"); // Báo trạng thái đã chọn cho công nghệ hỗ trợ.
	inactiveButton.classList.remove("active"); // Bỏ đánh dấu nút không được chọn.
	inactiveButton.setAttribute("aria-selected", "false"); // Báo trạng thái chưa chọn.
	activeContent.style.display = "block"; // Hiện biểu mẫu của phương thức đang chọn.
	inactiveContent.style.display = "none"; // Ẩn biểu mẫu còn lại.

	// Tạo lại QR khi chọn chuyển khoản.
	if (!isCard) updateVietQR(); // Làm mới mã QR khi người dùng chuyển sang chuyển khoản.
}

	tabBtnCard.addEventListener("click", () => setPaymentTab("card")); // Chọn phương thức thẻ.
	tabBtnBank.addEventListener("click", () => setPaymentTab("bank")); // Chọn phương thức chuyển khoản.

// Chuyển đổi đơn vị tiền tệ.
currencyVndBtn.addEventListener("click", () => initCurrency("VND")); // Chuyển toàn bộ giao diện sang VNĐ.
currencyUsdBtn.addEventListener("click", () => initCurrency("USD")); // Chuyển toàn bộ giao diện sang USD.

// ================= MÃ VIETQR VÀ CHUYỂN KHOẢN =================
function generateTransferMemo() {
	const randomCode = Math.floor(1000 + Math.random() * 9000); // Tạo mã ngẫu nhiên gồm bốn chữ số.
	bankTransferMemo.textContent = `WFA HANHAN ${randomCode}`; // Hiện nội dung chuyển khoản gồm mã chiến dịch.
}

function updateVietQR() {
	const memo = bankTransferMemo.textContent; // Lấy mã chuyển khoản đang hiện trên trang.
	/*
	 * VietQR nhận amount bằng VNĐ. Nếu giao diện đang hiển thị USD, đổi sang
	 * VNĐ theo tỷ giá demo; addInfo phải mã hóa URL để khoảng trắng trong mã
	 * chuyển khoản không làm hỏng liên kết. Gán URL vào src sẽ yêu cầu tải ảnh QR.
	 */
	const amountVND = currentCurrency === "VND" ? selectedAmountValue : selectedAmountValue * 25400; // VietQR cần số tiền VNĐ, nên đổi nếu giao diện là USD.
	// Tạo liên kết VietQR cho tài khoản MB Bank và nội dung chuyển khoản hiện tại.
	const qrUrl = `https://api.vietqr.io/image/970422-999988886868-compact2.jpg?amount=${amountVND}&addInfo=${encodeURIComponent(memo)}&accountName=QUY%20CUU%20TRO%20HAN%20HAN%20WATER%20FOR%20AFRICA`;
	vietqrImage.src = qrUrl; // Đổi nguồn ảnh để trình duyệt tải mã QR tương ứng.
}

function copyText(text, successMessage, fallbackMessage) {
	if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
		showToast(fallbackMessage);
		return;
	}

	navigator.clipboard.writeText(text).then(() => {
		showToast(successMessage);
	}).catch((error) => {
		console.warn("Không thể sao chép vào clipboard.", error);
		showToast(fallbackMessage);
	});
}

btnCopyAcc.addEventListener("click", () => {
	copyText(
		bankAccNum.textContent,
		"Đã sao chép số tài khoản MB Bank: 999988886868!",
		"Số tài khoản: 999988886868"
	);
});

btnCopyMemo.addEventListener("click", () => {
	copyText(
		bankTransferMemo.textContent,
		`Đã sao chép nội dung chuyển khoản: ${bankTransferMemo.textContent}!`,
		bankTransferMemo.textContent
	);
});

// ================= ĐIỀN NHANH DỮ LIỆU KIỂM THỬ =================
btnFillTestData.addEventListener("click", () => { // Bắt đầu điền các trường với dữ liệu thử.
	donorFullname.value = "Nguyễn Minh Quang"; // Điền tên kiểm thử.
	donorEmail.value = "quang.nguyen@testmail.com"; // Điền email kiểm thử.
	donorCity.value = "TP. Hồ Chí Minh"; // Điền địa điểm kiểm thử.
	donorMessage.value = "Thương chúc bà con và các em nhỏ vùng hạn hán sớm đón nhận những dòng nước mát lành!"; // Điền lời nhắn kiểm thử.

	// Điền thông tin thẻ mẫu để kiểm tra nhanh biểu mẫu.
	cardNumberInput.value = "4242 4242 4242 4242"; // Điền số thẻ mẫu, không dùng cho giao dịch thật.
	cardDisplayNumber.textContent = "4242 4242 4242 4242"; // Hiện số thẻ mẫu trên bản xem trước.
	cardHolderInput.value = "NGUYEN MINH QUANG"; // Điền tên chủ thẻ mẫu.
	cardDisplayName.textContent = "NGUYEN MINH QUANG"; // Đồng bộ tên lên bản xem trước.
	cardExpiryInput.value = "12/29"; // Điền hạn dùng mẫu.
	cardDisplayExpiry.textContent = "12/29"; // Đồng bộ hạn dùng lên bản xem trước.
	cardCvvInput.value = "888"; // Điền CVV mẫu.
	cardBankSelect.value = "Vietcombank"; // Chọn ngân hàng mẫu.
	cardDisplayBank.textContent = "VIETCOMBANK"; // Đồng bộ ngân hàng lên bản xem trước.
	detectedCardBrand.textContent = "[Thẻ Visa Quốc tế]"; // Hiện nhãn thương hiệu đã nhận diện.
	cardDisplayBrand.textContent = "VISA"; // Hiện thương hiệu trên thẻ mẫu.

	clearErrors(); // Xóa cảnh báo cũ sau khi đã điền mẫu.
	showToast("✨ Đã điền đầy đủ dữ liệu mẫu chuẩn cho bạn!"); // Báo đã điền dữ liệu.
});

// ================= KIỂM TRA VÀ GỬI BIỂU MẪU =================
function clearErrors() {
	document.querySelectorAll(".form-error-msg").forEach((el) => el.classList.remove("visible")); // Ẩn các thông báo lỗi hiện tại.
	document.querySelectorAll(".form-input").forEach((el) => el.classList.remove("is-invalid")); // Bỏ viền báo lỗi trên các ô nhập.
}

function validateForm() {
	/*
	 * Hàm kiểm tra trả về true/false và đồng thời cập nhật giao diện lỗi.
	 * Tên/email luôn bắt buộc; chỉ các trường thẻ mới bắt buộc khi tab thẻ đang
	 * hoạt động, vì chuyển khoản không cần nhập số thẻ/CVV.
	 */
	clearErrors(); // Bắt đầu kiểm tra từ trạng thái không có lỗi cũ.
	let isValid = true; // Giả định hợp lệ, đổi thành false nếu phát hiện trường sai.
	const customAmountSelected = amountGrid.querySelector('input[name="preset-amount"]:checked')?.value === "custom";
	const amountMin = currentCurrency === "VND" ? 10000 : 1;
	const amountStep = currentCurrency === "VND" ? 10000 : 1;
	const isAmountValid = Number.isFinite(selectedAmountValue)
		&& selectedAmountValue >= amountMin
		&& (!customAmountSelected || Number.isInteger((selectedAmountValue - amountMin) / amountStep));

	if (!isAmountValid) {
		document.querySelector("#error-custom-amount").classList.add("visible");
		customAmountInput.classList.add("is-invalid");
		isValid = false;
	} else if (customAmountSelected) {
		customAmountInput.classList.remove("is-invalid");
	}

	// Họ tên là trường bắt buộc.
	if (!donorFullname.value.trim()) {
		document.querySelector("#error-fullname").classList.add("visible"); // Hiện hướng dẫn nhập tên.
		donorFullname.classList.add("is-invalid"); // Đánh dấu ô tên bị lỗi.
		isValid = false; // Ghi nhận biểu mẫu chưa hợp lệ.
	}

	// Kiểm tra email theo định dạng cơ bản.
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Mẫu kiểm tra email cơ bản có tên, @ và tên miền.
	if (!emailRegex.test(donorEmail.value.trim())) {
		document.querySelector("#error-email").classList.add("visible"); // Hiện hướng dẫn email sai.
		donorEmail.classList.add("is-invalid"); // Đánh dấu ô email bị lỗi.
		isValid = false; // Ghi nhận biểu mẫu chưa hợp lệ.
	}

	// Chỉ kiểm tra thông tin thẻ khi người dùng chọn thanh toán bằng thẻ.
	if (activePaymentTab === "card") {
		const rawDigits = cardNumberInput.value.replace(/\D/g, ""); // Bỏ khoảng trắng để chỉ đếm chữ số thẻ.
		if (rawDigits.length !== 16 || !isValidCardNumber(rawDigits)) {
			document.querySelector("#error-card-number").classList.add("visible"); // Hiện lỗi số thẻ.
			cardNumberInput.classList.add("is-invalid"); // Đánh dấu ô số thẻ bị lỗi.
			isValid = false; // Ghi nhận biểu mẫu chưa hợp lệ.
		}

		if (!cardHolderInput.value.trim()) {
			document.querySelector("#error-card-holder").classList.add("visible"); // Hiện lỗi tên chủ thẻ.
			cardHolderInput.classList.add("is-invalid"); // Đánh dấu ô tên chủ thẻ bị lỗi.
			isValid = false; // Ghi nhận biểu mẫu chưa hợp lệ.
		}

		// Ngày hết hạn phải có dạng tháng/năm và tháng từ 1 đến 12.
		const expiryMatch = cardExpiryInput.value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
		const currentDate = new Date();
		const expiryMonth = expiryMatch ? Number(expiryMatch[1]) : 0;
		const expiryYear = expiryMatch ? Number(expiryMatch[2]) : 0;
		const currentYear = currentDate.getFullYear() % 100;
		const isExpiryValid = expiryMatch
			&& (expiryYear > currentYear || (expiryYear === currentYear && expiryMonth >= currentDate.getMonth() + 1));
		if (!isExpiryValid) {
			document.querySelector("#error-card-expiry").classList.add("visible"); // Hiện lỗi ngày hết hạn.
			cardExpiryInput.classList.add("is-invalid"); // Đánh dấu ô ngày hết hạn bị lỗi.
			isValid = false; // Ghi nhận biểu mẫu chưa hợp lệ.
		}

		// Mã CVV/CVC gồm 3 hoặc 4 chữ số.
		const cvvVal = cardCvvInput.value.trim(); // Đọc CVV đã bỏ khoảng trắng đầu/cuối.
		if (!/^\d{3,4}$/.test(cvvVal)) {
			document.querySelector("#error-card-cvv").classList.add("visible"); // Hiện lỗi CVV.
			cardCvvInput.classList.add("is-invalid"); // Đánh dấu ô CVV bị lỗi.
			isValid = false; // Ghi nhận biểu mẫu chưa hợp lệ.
		}
	}

	return isValid; // Cho biết có thể tiếp tục xử lý biểu mẫu hay không.
}

donationForm.addEventListener("submit", (e) => { // Xử lý việc gửi biểu mẫu quyên góp.
	/*
	 * Chặn tải lại trang, gọi kiểm tra tùy chỉnh trước. Nếu có lỗi thì dừng tại
	 * đây; nếu hợp lệ thì khóa nút trong lúc mô phỏng xử lý rồi gọi hàm ghi nhận.
	 */
	e.preventDefault(); // Ngăn trình duyệt tải lại trang khi gửi form.

	if (!validateForm()) {
		showToast("⚠️ Vui lòng kiểm tra lại các trường thông tin cần thiết!"); // Báo người dùng sửa các trường sai.
		return; // Không ghi nhận quyên góp khi dữ liệu chưa hợp lệ.
	}

	// Khóa nút gửi trong lúc mô phỏng xử lý giao dịch.
	submitDonationBtn.disabled = true; // Chặn bấm gửi nhiều lần trong lúc chờ.
	const originalBtnText = submitBtnText.textContent; // Giữ lại nội dung nút để khôi phục sau.
	submitBtnText.textContent = "Đang ghi nhận mô phỏng..."; // Không ám chỉ đang kết nối cổng thanh toán thật.

	// Bản demo chờ ngắn rồi mới ghi nhận giao dịch.
	setTimeout(() => {
		submitDonationBtn.disabled = false; // Cho phép gửi lại sau khi mô phỏng kết thúc.
		submitBtnText.textContent = originalBtnText; // Khôi phục nội dung nút ban đầu.

		// Ghi nhận khoản ủng hộ và hiện biên lai.
		handleSuccessfulDonation(); // Ghi nhận khoản demo và hiển thị biên lai.
	}, 1200); // Chờ 1,2 giây để mô phỏng thao tác xử lý.
});

function handleSuccessfulDonation() {
	/*
	 * Luồng sau khi biểu mẫu hợp lệ: tạo thông tin giao dịch, cập nhật tổng tiền
	 * và danh sách trong localStorage, vẽ lại giao diện, rồi điền/mở biên lai.
	 * Trong phiên bản này đây là mô phỏng phía trình duyệt, chưa gửi tiền tới
	 * cổng thanh toán hay máy chủ thật.
	 */
	const isAnonymous = donorAnonymous.checked; // Đọc lựa chọn ẩn danh.
	const displayName = isAnonymous ? "Nhà hảo tâm ẩn danh" : donorFullname.value.trim(); // Chọn tên công khai hoặc nhãn ẩn danh.
	const email = donorEmail.value.trim(); // Lấy email đã bỏ khoảng trắng thừa.
	const formattedAmt = formatCurrency(selectedAmountValue); // Định dạng tiền để lưu và in biên lai.
	const code = "WFA-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000); // Tạo mã tham chiếu mẫu.

	// Tạo mô tả phương thức thanh toán để ghi lên biên lai.
	let methodLabel = ""; // Chuỗi mô tả phương thức thanh toán cho biên lai.
	if (activePaymentTab === "card") {
		const last4 = cardNumberInput.value.replace(/\D/g, "").slice(-4) || "4242"; // Chỉ lấy bốn số cuối để không hiện toàn bộ số thẻ.
		methodLabel = `Thẻ ${cardDisplayBrand.textContent} (•••• ${last4}) - ${cardBankSelect.value}`; // Tạo nhãn thanh toán bằng thẻ.
	} else {
		methodLabel = `Chuyển khoản MB Bank (${bankTransferMemo.textContent})`; // Tạo nhãn chuyển khoản kèm nội dung giao dịch.
	}

	// Cộng khoản mới vào tổng tiền quyên góp đã lưu.
	// Mọi khoản quyên góp được cộng vào tổng VNĐ; USD đổi sang VNĐ theo tỷ giá demo.
	const currentTotalVnd = Number(localStorage.getItem("wfa_total_raised_vnd")) || 842650000; // Đọc tổng hiện có hoặc dùng tổng khởi tạo.
	const addedVnd = currentCurrency === "VND" ? selectedAmountValue : selectedAmountValue * 25400; // Quy đổi khoản mới sang VNĐ nếu đang dùng USD.
	const newTotalVnd = currentTotalVnd + addedVnd; // Tính tổng mới sau khi cộng khoản đóng góp.
	localStorage.setItem("wfa_total_raised_vnd", String(newTotalVnd)); // Lưu tổng mới dưới dạng chuỗi.

	// Thêm người ủng hộ mới lên đầu danh sách gần đây.
	const currentDonors = readDonorsList(); // Đọc danh sách cũ hoặc dùng danh sách mẫu nếu dữ liệu đã lưu bị lỗi.
	const newDonorItem = { // Tạo bản ghi mới cho danh sách người ủng hộ.
		name: displayName, // Lưu tên đã xử lý theo lựa chọn ẩn danh.
		amount: formattedAmt, // Lưu khoản ủng hộ đã định dạng.
		message: donorMessage.value.trim() || "Cầu chúc đồng bào vùng hạn sớm vượt qua khó khăn!", // Dùng lời nhắn mặc định nếu bỏ trống.
		time: "Vừa xong", // Đánh dấu lượt ủng hộ mới nhất.
		city: donorCity.value.trim() || "Việt Nam", // Dùng Việt Nam nếu không nhập địa điểm.
		isNew: true // Cho phép CSS đánh dấu lượt vừa thêm.
	};
	currentDonors.unshift(newDonorItem); // Đưa người mới lên đầu danh sách.
	currentDonors.splice(10); // Chỉ lưu tối đa số lượt mà giao diện hiển thị.
	localStorage.setItem("wfa_donors_list", JSON.stringify(currentDonors)); // Chuyển danh sách thành JSON để lưu.

	// Vẽ lại danh sách người ủng hộ và thanh tiến độ.
	renderDonorsList(); // Vẽ lại danh sách có người vừa thêm.
	renderCampaignProgress(); // Tính lại tổng tiền và thanh tiến độ.

	// Điền thông tin giao dịch vào biên lai rồi mở hộp thoại.
	receiptCode.textContent = code; // Hiện mã giao dịch.
	receiptDonorName.textContent = displayName; // Hiện tên/nhãn ẩn danh.
	receiptDonorEmail.textContent = email; // Hiện email nhận biên lai.
	receiptAmount.textContent = formattedAmt; // Hiện số tiền đã ủng hộ.
	receiptFrequency.textContent = selectedFrequency === "monthly" ? "Ủng hộ hàng tháng" : "Ủng hộ một lần"; // Hiện tần suất đã chọn.
	receiptPaymentMethod.textContent = methodLabel; // Hiện cách thanh toán đã chọn.

	const now = new Date(); // Lấy thời điểm tạo biên lai hiện tại.
	receiptTimestamp.textContent = now.toLocaleString("vi-VN", {
		hour: "2-digit", // Hiện giờ bằng hai chữ số.
		minute: "2-digit", // Hiện phút bằng hai chữ số.
		second: "2-digit", // Hiện giây bằng hai chữ số.
		day: "2-digit", // Hiện ngày bằng hai chữ số.
		month: "2-digit", // Hiện tháng bằng hai chữ số.
		year: "numeric" // Hiện năm đầy đủ.
	}); // Định dạng thời gian theo quy ước tiếng Việt.

	receiptModalOverlay.classList.add("active"); // Hiện hộp thoại biên lai.

	// Tạo mã chuyển khoản mới cho lượt ủng hộ tiếp theo.
	generateTransferMemo(); // Sinh nội dung mới cho lượt chuyển khoản kế tiếp.
}

// ================= HIỂN THỊ TIẾN ĐỘ VÀ DANH SÁCH ỦNG HỘ =================
function renderCampaignProgress() {
	/*
	 * Đọc tổng tiền đang lưu bằng VNĐ, tính phần trăm so với mục tiêu và đổi
	 * cách hiển thị nếu đang chọn USD. Độ rộng thanh được giới hạn ở 100%;
	 * phần trăm này dựa trên tổng gốc VNĐ.
	 */
	const totalVnd = Number(localStorage.getItem("wfa_total_raised_vnd")) || 842650000; // Đọc tổng tiền quyên góp lưu theo VNĐ hoặc dùng số ban đầu.
	const targetVnd = campaignTargetVND; // Mục tiêu gốc của chiến dịch luôn được lưu bằng VNĐ.
	// Giới hạn thanh tiến độ ở 100%, kể cả khi tổng quyên góp vượt mục tiêu.
	const percent = Math.min(100, ((totalVnd / targetVnd) * 100)).toFixed(1); // Tính phần trăm và chặn thanh ở tối đa 100%.

	if (currentCurrency === "VND") {
		statRaised.textContent = totalVnd.toLocaleString("vi-VN") + " ₫"; // Hiện tổng tiền theo định dạng VNĐ.
		statTarget.textContent = targetVnd.toLocaleString("vi-VN") + " ₫"; // Hiện mục tiêu theo định dạng VNĐ.
	} else {
		const totalUsd = Math.round(totalVnd / 25400); // Đổi tổng VNĐ sang USD theo tỷ giá minh họa.
		statRaised.textContent = "$" + totalUsd.toLocaleString("en-US"); // Hiện tổng tiền theo định dạng USD.
		statTarget.textContent = "$" + campaignTargetUSD.toLocaleString("en-US"); // Hiện mục tiêu USD.
	}

	statPercent.textContent = percent + "%"; // Hiện phần trăm tiến độ.
	progressFill.style.width = percent + "%"; // Đặt chiều dài thanh theo tỷ lệ.
	progressTrack.setAttribute("aria-valuenow", percent); // Đồng bộ tiến độ cho công nghệ hỗ trợ.
}

function readDonorsList() {
	const storedDonors = localStorage.getItem("wfa_donors_list");
	if (!storedDonors) return [...SEED_DONORS];

	try {
		const donors = JSON.parse(storedDonors);
		if (!Array.isArray(donors)) {
			throw new TypeError("Danh sách người ủng hộ phải là một mảng.");
		}
		// Normalize saved values before rendering or adding another donation.
		return donors
			.filter((donor) => donor && typeof donor === "object")
			.map((donor) => ({
				name: typeof donor.name === "string" ? donor.name : "Nhà hảo tâm",
				amount: typeof donor.amount === "string" ? donor.amount : "",
				message: typeof donor.message === "string" ? donor.message : "",
				time: typeof donor.time === "string" ? donor.time : "",
				city: typeof donor.city === "string" ? donor.city : "",
				isNew: donor.isNew === true
			}));
	} catch (error) {
		console.warn("Không thể đọc danh sách người ủng hộ đã lưu.", error);
		return [...SEED_DONORS];
	}
}

function renderDonorsList() {
	/*
	 * Đọc danh sách đã lưu (hoặc dùng danh sách mẫu), xóa nội dung cũ rồi dựng
	 * tối đa 10 lượt gần nhất. Mỗi mục gồm tên/viết tắt, số tiền, lời nhắn,
	 * thời gian và địa điểm.
	 */
	const donors = readDonorsList(); // Đọc danh sách đã lưu, dùng dữ liệu mẫu nếu dữ liệu lưu bị lỗi.
	donorsList.innerHTML = ""; // Xóa các mục cũ trước khi vẽ lại.

	// Chỉ hiển thị 10 lượt gần nhất để danh sách không kéo dài quá mức.
	donors.slice(0, 10).forEach((donor) => {
		const item = document.createElement("div"); // Tạo khung cho một lượt ủng hộ.
		item.className = `donor-item ${donor.isNew ? "highlight-new" : ""}`; // Tô nổi bật khoản mới nếu có.

		const initials = donor.name === "Nhà hảo tâm ẩn danh" ? "★" : donor.name.split(" ").map(w => w[0]).join("").slice(-2); // Tạo biểu tượng ẩn danh hoặc chữ cái đầu tên.

		const avatar = document.createElement("div");
		avatar.className = "donor-avatar";
		avatar.textContent = initials;

		const details = document.createElement("div");
		details.className = "donor-details";

		const nameRow = document.createElement("div");
		nameRow.className = "donor-name-row";

		const name = document.createElement("span");
		name.className = "donor-name";
		name.title = donor.name;
		name.textContent = donor.name;

		const amount = document.createElement("span");
		amount.className = "donor-amount";
		amount.textContent = donor.amount;
		nameRow.append(name, amount);

		details.appendChild(nameRow);
		if (donor.message) {
			const message = document.createElement("div");
			message.className = "donor-message";
			message.textContent = `"${donor.message}"`;
			details.appendChild(message);
		}

		const time = document.createElement("div");
		time.className = "donor-time";
		time.textContent = `${donor.time} · ${donor.city || "Hảo tâm"}`;
		details.appendChild(time);

		item.append(avatar, details);
		donorsList.appendChild(item); // Thêm lượt vừa dựng vào danh sách trên trang.
	});
}

// ================= SỰ KIỆN BIÊN LAI VÀ THÔNG BÁO =================
function closeModal() {
	receiptModalOverlay.classList.remove("active"); // Ẩn hộp thoại biên lai.
}

modalCloseBtn.addEventListener("click", closeModal); // Nút X đóng biên lai.
btnCloseReceipt.addEventListener("click", closeModal); // Nút phía dưới cũng đóng biên lai.

receiptModalOverlay.addEventListener("click", (e) => { // Theo dõi thao tác bấm lên lớp phủ.
	if (e.target === receiptModalOverlay) {
		closeModal(); // Chỉ đóng nếu bấm vùng nền bên ngoài hộp thoại.
	}
});

let toastTimeout; // Lưu bộ hẹn giờ để có thể hủy thông báo cũ.
function showToast(message) {
	// Hủy bộ hẹn giờ cũ để thông báo mới không bị ẩn sớm bởi lần hiển thị trước.
	clearTimeout(toastTimeout); // Hủy lần đếm ngược trước nếu có.
	toastMsg.textContent = message; // Thay nội dung hộp thông báo.
	toastNotice.classList.add("show"); // Hiện hộp thông báo.
	toastTimeout = setTimeout(() => {
		toastNotice.classList.remove("show"); // Ẩn thông báo khi hết thời gian.
	}, 2800); // Giữ thông báo gần ba giây.
}

function setupEventListeners() {
	// Cho phép đóng biên lai bằng phím Escape.
	document.addEventListener("keydown", (e) => { // Lắng nghe phím tắt khi trang đang mở.
		if (e.key === "Escape" && receiptModalOverlay.classList.contains("active")) {
			closeModal(); // Đóng biên lai nếu phím Escape được nhấn khi hộp thoại đang mở.
		}
	});
}