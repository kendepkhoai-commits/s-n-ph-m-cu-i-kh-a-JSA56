/**
 * Các chức năng cho biểu mẫu ủng hộ Water for Africa.
 */

// Các phần tử giao diện chính
const currencyVndBtn = document.querySelector("#curr-vnd");
const currencyUsdBtn = document.querySelector("#curr-usd");
const amountGrid = document.querySelector("#amount-grid");
const customAmountWrapper = document.querySelector("#custom-amount-wrapper");
const customAmountInput = document.querySelector("#custom-amount-input");
const customCurrSymbol = document.querySelector("#custom-curr-symbol");
const impactDescText = document.querySelector("#impact-desc-text");
const frequencyInputs = document.querySelectorAll('input[name="frequency"]');

// Biểu mẫu và thông tin người ủng hộ
const donationForm = document.querySelector("#donation-hub-form");
const donorFullname = document.querySelector("#donor-fullname");
const donorEmail = document.querySelector("#donor-email");
const donorPhone = document.querySelector("#donor-phone");
const donorCity = document.querySelector("#donor-city");
const donorMessage = document.querySelector("#donor-message");
const donorAnonymous = document.querySelector("#donor-anonymous");
const donorSubscribe = document.querySelector("#donor-subscribe");

// Tab và vùng nội dung thanh toán
const tabBtnCard = document.querySelector("#tab-btn-card");
const tabBtnBank = document.querySelector("#tab-btn-bank");
const tabContentCard = document.querySelector("#tab-content-card");
const tabContentBank = document.querySelector("#tab-content-bank");

// Thông tin và bản xem trước thẻ
const cardBankSelect = document.querySelector("#card-bank-select");
const cardNumberInput = document.querySelector("#card-number-input");
const cardHolderInput = document.querySelector("#card-holder-input");
const cardExpiryInput = document.querySelector("#card-expiry-input");
const cardCvvInput = document.querySelector("#card-cvv-input");
const detectedCardBrand = document.querySelector("#detected-card-brand");

const cardDisplayBank = document.querySelector("#card-display-bank");
const cardDisplayNumber = document.querySelector("#card-display-number");
const cardDisplayName = document.querySelector("#card-display-name");
const cardDisplayExpiry = document.querySelector("#card-display-expiry");
const cardDisplayBrand = document.querySelector("#card-display-brand");

// Thông tin chuyển khoản ngân hàng
const vietqrImage = document.querySelector("#vietqr-image");
const bankAccNum = document.querySelector("#bank-acc-num");
const bankTransferAmount = document.querySelector("#bank-transfer-amount");
const bankTransferMemo = document.querySelector("#bank-transfer-memo");
const btnCopyAcc = document.querySelector("#btn-copy-acc");
const btnCopyMemo = document.querySelector("#btn-copy-memo");
const senderBankName = document.querySelector("#sender-bank-name");
const senderAccName = document.querySelector("#sender-acc-name");

// Nút xác nhận và phần tóm tắt khoản ủng hộ
const submitDonationBtn = document.querySelector("#submit-donation-btn");
const submitBtnText = document.querySelector("#submit-btn-text");
const summaryChosenAmount = document.querySelector("#summary-chosen-amount");
const summaryChosenFreq = document.querySelector("#summary-chosen-freq");
const summaryTotalDisplay = document.querySelector("#summary-total-display");

// Tiến độ quyên góp và danh sách người ủng hộ
const statRaised = document.querySelector("#stat-raised");
const statTarget = document.querySelector("#stat-target");
const statPercent = document.querySelector("#stat-percent");
const progressFill = document.querySelector("#progress-fill");
const donorsList = document.querySelector("#donors-list");

// Hộp thoại biên lai
const receiptModalOverlay = document.querySelector("#receipt-modal-overlay");
const modalCloseBtn = document.querySelector("#modal-close-btn");
const btnPrintReceipt = document.querySelector("#btn-print-receipt");
const btnCloseReceipt = document.querySelector("#btn-close-receipt");
const receiptCode = document.querySelector("#receipt-code");
const receiptDonorName = document.querySelector("#receipt-donor-name");
const receiptDonorEmail = document.querySelector("#receipt-donor-email");
const receiptAmount = document.querySelector("#receipt-amount");
const receiptFrequency = document.querySelector("#receipt-frequency");
const receiptPaymentMethod = document.querySelector("#receipt-payment-method");
const receiptTimestamp = document.querySelector("#receipt-timestamp");

// Nút điền dữ liệu thử và thông báo nhỏ
const btnFillTestData = document.querySelector("#btn-fill-test-data");
const toastNotice = document.querySelector("#toast-notice");
const toastMsg = document.querySelector("#toast-msg");

// ================= TRẠNG THÁI HIỆN TẠI =================
let currentCurrency = "VND"; // Đơn vị tiền tệ đang chọn
let selectedAmountValue = 500000; // Khoản ủng hộ mặc định theo VNĐ
let selectedFrequency = "once"; // Tần suất: một lần hoặc hàng tháng
let activePaymentTab = "card"; // Phương thức: thẻ hoặc chuyển khoản
let campaignTargetVND = 1200000000;
let campaignTargetUSD = 50000;

const PRESET_AMOUNTS_VND = [50000, 100000, 200000, 500000, 1000000, 2000000];
const PRESET_AMOUNTS_USD = [5, 10, 25, 50, 100, 250];

// Một số lượt ủng hộ mẫu để danh sách có nội dung ban đầu.
const SEED_DONORS = [
	{
		name: "Bác Lê Thị Mai",
		amount: "1.000.000 ₫",
		message: "Mong một giọt nước sạch đến được với các cháu nhỏ đang gặp hạn hán.",
		time: "8 phút trước",
		city: "Hà Nội"
	},
	{
		name: "Gia đình Tuấn Anh",
		amount: "500.000 ₫",
		message: "Góp chút sức lực nhỏ bé cùng Water for Africa giải cứu vùng đất cằn.",
		time: "24 phút trước",
		city: "TP. Hồ Chí Minh"
	},
	{
		name: "Trần Hoàng Đức",
		amount: "2.000.000 ₫",
		message: "Chung tay tài trợ khoan thêm giếng ngầm sâu 80m.",
		time: "1 giờ trước",
		city: "Đà Nẵng"
	},
	{
		name: "Nhà hảo tâm ẩn danh",
		amount: "200.000 ₫",
		message: "Thương chúc bà con kiên cường vượt qua mùa hạn gay gắt.",
		time: "3 giờ trước",
		city: "Cần Thơ"
	}
];

// ================= KHỞI TẠO TRANG =================
document.addEventListener("DOMContentLoaded", () => {
	// Chạy sau khi HTML đã sẵn sàng để các ID bên trên đều trỏ tới phần tử thật.
	initAccountPrefill();
	initDonationStorage();
	initCurrency(currentCurrency);
	setupEventListeners();
	generateTransferMemo();
	updateVietQR();
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
		const rawAccount = localStorage.getItem("waterAidAccount");
		if (rawAccount) {
			const account = JSON.parse(rawAccount);
			if (account && account.username) {
				donorFullname.value = account.username;
				cardHolderInput.value = removeVietnameseTones(account.username).toUpperCase();
				cardDisplayName.textContent = cardHolderInput.value;
			}
			if (account && account.email) {
				donorEmail.value = account.email;
			}
		}
	} catch (err) {
		console.warn("Could not read auth storage", err);
	}
}

// Khởi tạo tổng tiền và danh sách người ủng hộ trong localStorage.
function initDonationStorage() {
	/*
	 * Các lượt demo được lưu ở localStorage để còn tồn tại sau khi tải lại trang.
	 * Chỉ ghi số tiền/danh sách mẫu khi chưa có khóa tương ứng, không ghi đè
	 * dữ liệu người dùng đã tạo; sau đó vẽ danh sách và tiến độ hiện tại.
	 */
	if (!localStorage.getItem("wfa_total_raised_vnd")) {
		localStorage.setItem("wfa_total_raised_vnd", "842650000");
	}
	if (!localStorage.getItem("wfa_donors_list")) {
		localStorage.setItem("wfa_donors_list", JSON.stringify(SEED_DONORS));
	}
	renderDonorsList();
	renderCampaignProgress();
}

// ================= TIỀN TỆ VÀ MỨC ỦNG HỘ =================
function formatCurrency(amount, currency = currentCurrency) {
	// Dùng locale Việt Nam cho VNĐ và locale Mỹ cho USD để dấu phân cách dễ đọc.
	if (currency === "VND") {
		return Number(amount).toLocaleString("vi-VN") + " ₫";
	}
	return "$" + Number(amount).toLocaleString("en-US");
}

function initCurrency(currency) {
	/*
	 * Đây là điểm khởi tạo đồng bộ khi đổi VNĐ/USD: cập nhật trạng thái nút,
	 * đơn vị và giới hạn ô nhập; dựng lại các lựa chọn; sau đó làm mới số tiền
	 * trong phần tóm tắt, QR và tiến độ. Giá trị mặc định được đặt lại theo
	 * đồng tiền mới để tránh giữ số tiền của đơn vị trước.
	 */
	currentCurrency = currency;
	const isVND = currency === "VND";

	currencyVndBtn.classList.toggle("active", isVND);
	currencyVndBtn.setAttribute("aria-pressed", String(isVND));
	currencyUsdBtn.classList.toggle("active", !isVND);
	currencyUsdBtn.setAttribute("aria-pressed", String(!isVND));

	customCurrSymbol.textContent = isVND ? "₫" : "$";
	customAmountInput.min = isVND ? "10000" : "1";
	customAmountInput.step = isVND ? "10000" : "5";
	customAmountInput.placeholder = isVND ? "Nhập số tiền (VD: 300000)" : "Nhập số tiền (VD: 35)";

	// Đổi tiền tệ sẽ dựng lại các mức chọn và đặt lại khoản đóng góp mặc định tương ứng.
	const presets = isVND ? PRESET_AMOUNTS_VND : PRESET_AMOUNTS_USD;
	selectedAmountValue = isVND ? 500000 : 25;

	renderAmountPresets(presets);
	updateAmountSelection(selectedAmountValue);
	renderCampaignProgress();
}

function renderAmountPresets(presets) {
	/*
	 * Các mức tiền là radio tạo bằng JavaScript để nhãn luôn theo đúng tiền tệ.
	 * Mỗi radio khi chọn sẽ cập nhật số tiền toàn trang; lựa chọn "Tùy chọn khác"
	 * hiện ô nhập riêng và dùng giá trị gợi ý nếu ô còn trống.
	 */
	amountGrid.innerHTML = "";
	presets.forEach((amt) => {
		const label = document.createElement("label");
		label.className = "amount-btn-label";
		label.innerHTML = `
			<input type="radio" name="preset-amount" value="${amt}" ${amt === selectedAmountValue ? "checked" : ""}>
			<span>${formatCurrency(amt)}</span>
		`;
		label.querySelector("input").addEventListener("change", () => {
			customAmountWrapper.style.display = "none";
			updateAmountSelection(amt);
		});
		amountGrid.appendChild(label);
	});

	// Tạo thêm lựa chọn để người dùng tự nhập số tiền.
	const customLabel = document.createElement("label");
	customLabel.className = "amount-btn-label";
	customLabel.innerHTML = `
		<input type="radio" name="preset-amount" value="custom">
		<span>Tùy chọn khác</span>
	`;
	customLabel.querySelector("input").addEventListener("change", () => {
		customAmountWrapper.style.display = "block";
		customAmountInput.focus();
		const val = Number(customAmountInput.value) || (currentCurrency === "VND" ? 300000 : 30);
		customAmountInput.value = val;
		updateAmountSelection(val);
	});
	amountGrid.appendChild(customLabel);
}

function updateAmountSelection(amount) {
	/*
	 * Lưu một giá trị số duy nhất làm nguồn dữ liệu cho phần còn lại của trang.
	 * Từ giá trị này, cập nhật số tiền hiển thị, mô tả tác động và mã QR để các
	 * phần không bị lệch nhau khi chọn preset hoặc nhập số tiền tùy chọn.
	 */
	selectedAmountValue = Number(amount) || 0;
	const formatted = formatCurrency(selectedAmountValue);

	// Đồng bộ số tiền trên phần tóm tắt, nút xác nhận và thông tin chuyển khoản.
	summaryChosenAmount.textContent = formatted;
	summaryTotalDisplay.textContent = formatted;
	submitBtnText.textContent = `XÁC NHẬN ỦNG HỘ ${formatted}`;
	// VietQR chỉ nhận VNĐ, nên số USD được quy đổi theo tỷ giá quy ước của bản demo.
	bankTransferAmount.textContent = currentCurrency === "VND" ? formatted : `${formatted} (~${formatCurrency(selectedAmountValue * 25400, "VND")})`;

	// Cập nhật mô tả tác động tương ứng với khoản tiền.
	updateImpactText(selectedAmountValue, currentCurrency);

	// Cập nhật mã QR với số tiền và nội dung chuyển khoản mới.
	updateVietQR();
}

function updateImpactText(amount, currency) {
	/*
	 * Chuyển khoản USD sang giá trị VNĐ quy ước để so với các ngưỡng tác động.
	 * Sau đó chọn một thông điệp phù hợp theo khoảng tiền. Đây là nội dung minh
	 * họa của giao diện; không phải cam kết định lượng từ giao dịch thật.
	 */
	// So sánh theo cùng một đơn vị (VNĐ) dù người dùng đang chọn hiển thị USD.
	const valInVnd = currency === "VND" ? amount : amount * 25400;

	if (valInVnd < 100000) {
		impactDescText.innerHTML = `Khoản ủng hộ <strong>${formatCurrency(amount)}</strong> cung cấp <strong>10 bình nước tinh khiết khẩn cấp</strong> cho đồng bào đang chịu hạn cạn.`;
	} else if (valInVnd < 250000) {
		impactDescText.innerHTML = `Khoản ủng hộ <strong>${formatCurrency(amount)}</strong> trang bị <strong>2 bộ kit kiểm định nước và viên clo khử khuẩn</strong> phòng ngừa dịch bệnh mùa khô.`;
	} else if (valInVnd < 600000) {
		impactDescText.innerHTML = `Khoản ủng hộ <strong>${formatCurrency(amount)}</strong> tài trợ <strong>1 bồn trữ nước dã chiến 500 lít</strong> cho một hộ gia đình vùng khô cằn.`;
	} else if (valInVnd < 1500000) {
		impactDescText.innerHTML = `Khoản ủng hộ <strong>${formatCurrency(amount)}</strong> trang bị <strong>1 bộ máy lọc gốm nano kháng khuẩn</strong> tiêu chuẩn y tế, lọc nước nhiễm mặn thành nước uống được.`;
	} else if (valInVnd < 3000000) {
		impactDescText.innerHTML = `Khoản ủng hộ <strong>${formatCurrency(amount)}</strong> lắp đặt <strong>50 mét đường ống cấp nước ngầm</strong> trực tiếp về trạm y tế và trường học.`;
	} else {
		impactDescText.innerHTML = `Khoản đóng góp tuyệt vời <strong>${formatCurrency(amount)}</strong> tài trợ trực tiếp <strong>1 phần mũi khoan giếng tầng ngầm 80m</strong> đem lại nguồn nước vĩnh cửu.`;
	}
}

// ================= TƯƠNG TÁC THẺ VÀ NGÂN HÀNG =================
function removeVietnameseTones(str) {
	/*
	 * Đổi các chữ cái tiếng Việt có dấu (cả chữ thường và chữ hoa) sang chữ
	 * Latin không dấu, giữ nguyên các ký tự khác. Hàm được dùng để hiển thị
	 * tên chủ thẻ theo dạng không dấu.
	 */
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
	str = str.replace(/đ/g, "d");
	str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
	str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
	str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
	str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
	str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
	str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
	str = str.replace(/Đ/g, "D");
	return str;
}

function detectCardBrand(digits) {
	/*
	 * Dựa vào tiền tố để chọn nhãn thương hiệu cho bản xem trước. Việc này chỉ
	 * nhận diện giao diện; không kiểm tra thẻ còn hiệu lực hay thực hiện thanh toán.
	 */
	if (digits.startsWith("4")) return { brand: "VISA", name: "Thẻ Visa Quốc tế" };
	if (/^(5[1-5]|2[2-7])/.test(digits)) return { brand: "MASTERCARD", name: "Thẻ Mastercard" };
	if (/^35/.test(digits)) return { brand: "JCB", name: "Thẻ Quốc tế JCB" };
	if (/^9704/.test(digits)) return { brand: "NAPAS", name: "Thẻ Nội địa Napas" };
	return { brand: "CARD", name: "Thẻ Thanh Toán" };
}

cardNumberInput.addEventListener("input", (e) => {
	/*
	 * Khi người dùng gõ số thẻ: bỏ mọi ký tự không phải số, chỉ giữ tối đa
	 * 16 chữ số, rồi chèn khoảng trắng sau mỗi nhóm bốn số. Cùng dữ liệu đã
	 * chuẩn hóa được đưa lên bản xem trước và dùng để nhận diện thương hiệu.
	 */
	const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
	const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
	cardNumberInput.value = formatted;

	// Hiển thị số thẻ đã định dạng trên bản xem trước.
	cardDisplayNumber.textContent = formatted || "•••• •••• •••• ••••";

	// Nhận diện thương hiệu thẻ từ các chữ số đầu tiên.
	const info = detectCardBrand(raw);
	cardDisplayBrand.textContent = info.brand;
	detectedCardBrand.textContent = raw.length >= 2 ? `[${info.name}]` : "";
});

cardHolderInput.addEventListener("input", (e) => {
	// Tên trên bản xem trước được đồng bộ trực tiếp từ nội dung người dùng nhập.
	const cleanName = removeVietnameseTones(e.target.value).toUpperCase();
	cardHolderInput.value = cleanName;
	cardDisplayName.textContent = cleanName || "NGUYEN VAN A";
});

cardExpiryInput.addEventListener("input", (e) => {
	// Chỉ giữ tối đa bốn chữ số và tự chèn dấu "/" sau hai chữ số tháng.
	let val = e.target.value.replace(/\D/g, "").slice(0, 4);
	if (val.length >= 3) {
		val = val.slice(0, 2) + "/" + val.slice(2);
	}
	cardExpiryInput.value = val;
	cardDisplayExpiry.textContent = val || "12/28";
});

cardBankSelect.addEventListener("change", (e) => {
	cardDisplayBank.textContent = e.target.value.toUpperCase();
});

// Cập nhật hình thức ủng hộ khi chọn một lần hoặc hàng tháng.
frequencyInputs.forEach((radio) => {
	radio.addEventListener("change", () => {
		// value="once"/"monthly" trong HTML là giá trị logic; phần tóm tắt dùng nhãn dễ đọc.
		selectedFrequency = radio.value;
		summaryChosenFreq.textContent = selectedFrequency === "monthly" ? "Ủng hộ hàng tháng (Định kỳ)" : "Ủng hộ một lần";
	});
});

// Cập nhật tổng tiền khi người dùng sửa mức ủng hộ tùy chọn.
customAmountInput.addEventListener("input", (e) => {
	const val = Number(e.target.value) || 0;
	updateAmountSelection(val);
});

// ================= CHUYỂN ĐỔI PHƯƠNG THỨC THANH TOÁN =================
tabBtnCard.addEventListener("click", () => {
	// Đồng bộ cả trạng thái truy cập (aria-selected) lẫn phần nội dung đang hiển thị.
	activePaymentTab = "card";
	tabBtnCard.classList.add("active");
	tabBtnCard.setAttribute("aria-selected", "true");
	tabBtnBank.classList.remove("active");
	tabBtnBank.setAttribute("aria-selected", "false");
	tabContentCard.style.display = "block";
	tabContentBank.style.display = "none";
});

tabBtnBank.addEventListener("click", () => {
	// Đổi sang chuyển khoản thì ẩn trường thẻ và làm mới QR theo số tiền hiện tại.
	activePaymentTab = "bank";
	tabBtnBank.classList.add("active");
	tabBtnBank.setAttribute("aria-selected", "true");
	tabBtnCard.classList.remove("active");
	tabBtnCard.setAttribute("aria-selected", "false");
	tabContentCard.style.display = "none";
	tabContentBank.style.display = "block";
	updateVietQR();
});

// Chuyển đổi đơn vị tiền tệ.
currencyVndBtn.addEventListener("click", () => initCurrency("VND"));
currencyUsdBtn.addEventListener("click", () => initCurrency("USD"));

// ================= MÃ VIETQR VÀ CHUYỂN KHOẢN =================
function generateTransferMemo() {
	const randomCode = Math.floor(1000 + Math.random() * 9000);
	bankTransferMemo.textContent = `WFA HANHAN ${randomCode}`;
}

function updateVietQR() {
	const memo = bankTransferMemo.textContent;
	/*
	 * VietQR nhận amount bằng VNĐ. Nếu giao diện đang hiển thị USD, đổi sang
	 * VNĐ theo tỷ giá demo; addInfo phải mã hóa URL để khoảng trắng trong mã
	 * chuyển khoản không làm hỏng liên kết. Gán URL vào src sẽ yêu cầu tải ảnh QR.
	 */
	const amountVND = currentCurrency === "VND" ? selectedAmountValue : selectedAmountValue * 25400;
	// Tạo liên kết VietQR cho tài khoản MB Bank và nội dung chuyển khoản hiện tại.
	const qrUrl = `https://api.vietqr.io/image/970422-999988886868-compact2.jpg?amount=${amountVND}&addInfo=${encodeURIComponent(memo)}&accountName=QUY%20CUU%20TRO%20HAN%20HAN%20WATER%20FOR%20AFRICA`;
	vietqrImage.src = qrUrl;
}

btnCopyAcc.addEventListener("click", () => {
	navigator.clipboard.writeText(bankAccNum.textContent).then(() => {
		showToast("Đã sao chép số tài khoản MB Bank: 999988886868!");
	}).catch(() => {
		showToast("Số tài khoản: 999988886868");
	});
});

btnCopyMemo.addEventListener("click", () => {
	navigator.clipboard.writeText(bankTransferMemo.textContent).then(() => {
		showToast(`Đã sao chép nội dung chuyển khoản: ${bankTransferMemo.textContent}!`);
	}).catch(() => {
		showToast(bankTransferMemo.textContent);
	});
});

// ================= ĐIỀN NHANH DỮ LIỆU KIỂM THỬ =================
btnFillTestData.addEventListener("click", () => {
	donorFullname.value = "Nguyễn Minh Quang";
	donorEmail.value = "quang.nguyen@testmail.com";
	donorPhone.value = "0987 654 321";
	donorCity.value = "TP. Hồ Chí Minh";
	donorMessage.value = "Thương chúc bà con và các em nhỏ vùng hạn hán sớm đón nhận những dòng nước mát lành!";

	// Điền thông tin thẻ mẫu để kiểm tra nhanh biểu mẫu.
	cardNumberInput.value = "4242 4242 4242 4242";
	cardDisplayNumber.textContent = "4242 4242 4242 4242";
	cardHolderInput.value = "NGUYEN MINH QUANG";
	cardDisplayName.textContent = "NGUYEN MINH QUANG";
	cardExpiryInput.value = "12/29";
	cardDisplayExpiry.textContent = "12/29";
	cardCvvInput.value = "888";
	cardBankSelect.value = "Vietcombank";
	cardDisplayBank.textContent = "VIETCOMBANK";
	detectedCardBrand.textContent = "[Thẻ Visa Quốc tế]";
	cardDisplayBrand.textContent = "VISA";

	// Điền thông tin người chuyển khoản mẫu.
	senderBankName.value = "Vietcombank";
	senderAccName.value = "NGUYEN MINH QUANG";

	clearErrors();
	showToast("✨ Đã điền đầy đủ dữ liệu mẫu chuẩn cho bạn!");
});

// ================= KIỂM TRA VÀ GỬI BIỂU MẪU =================
function clearErrors() {
	document.querySelectorAll(".form-error-msg").forEach((el) => el.classList.remove("visible"));
	document.querySelectorAll(".form-input").forEach((el) => el.classList.remove("is-invalid"));
}

function validateForm() {
	/*
	 * Hàm kiểm tra trả về true/false và đồng thời cập nhật giao diện lỗi.
	 * Tên/email luôn bắt buộc; chỉ các trường thẻ mới bắt buộc khi tab thẻ đang
	 * hoạt động, vì chuyển khoản không cần nhập số thẻ/CVV.
	 */
	clearErrors();
	let isValid = true;

	// Họ tên là trường bắt buộc.
	if (!donorFullname.value.trim()) {
		document.querySelector("#error-fullname").classList.add("visible");
		donorFullname.classList.add("is-invalid");
		isValid = false;
	}

	// Kiểm tra email theo định dạng cơ bản.
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(donorEmail.value.trim())) {
		document.querySelector("#error-email").classList.add("visible");
		donorEmail.classList.add("is-invalid");
		isValid = false;
	}

	// Chỉ kiểm tra thông tin thẻ khi người dùng chọn thanh toán bằng thẻ.
	if (activePaymentTab === "card") {
		const rawDigits = cardNumberInput.value.replace(/\D/g, "");
		if (rawDigits.length !== 16) {
			document.querySelector("#error-card-number").classList.add("visible");
			cardNumberInput.classList.add("is-invalid");
			isValid = false;
		}

		if (!cardHolderInput.value.trim()) {
			document.querySelector("#error-card-holder").classList.add("visible");
			cardHolderInput.classList.add("is-invalid");
			isValid = false;
		}

		// Ngày hết hạn phải có dạng tháng/năm và tháng từ 1 đến 12.
		const expiryParts = cardExpiryInput.value.split("/");
		if (expiryParts.length !== 2 || Number(expiryParts[0]) < 1 || Number(expiryParts[0]) > 12) {
			document.querySelector("#error-card-expiry").classList.add("visible");
			cardExpiryInput.classList.add("is-invalid");
			isValid = false;
		}

		// Mã CVV/CVC gồm 3 hoặc 4 chữ số.
		const cvvVal = cardCvvInput.value.trim();
		if (cvvVal.length < 3 || cvvVal.length > 4) {
			document.querySelector("#error-card-cvv").classList.add("visible");
			cardCvvInput.classList.add("is-invalid");
			isValid = false;
		}
	}

	return isValid;
}

donationForm.addEventListener("submit", (e) => {
	/*
	 * Chặn tải lại trang, gọi kiểm tra tùy chỉnh trước. Nếu có lỗi thì dừng tại
	 * đây; nếu hợp lệ thì khóa nút trong lúc mô phỏng xử lý rồi gọi hàm ghi nhận.
	 */
	e.preventDefault();

	if (!validateForm()) {
		showToast("⚠️ Vui lòng kiểm tra lại các trường thông tin cần thiết!");
		return;
	}

	// Khóa nút gửi trong lúc mô phỏng xử lý giao dịch.
	submitDonationBtn.disabled = true;
	const originalBtnText = submitBtnText.textContent;
	submitBtnText.innerHTML = `<span>⏳</span> Đang kết nối bảo mật 256-Bit SSL...`;

	// Bản demo chờ ngắn rồi mới ghi nhận giao dịch.
	setTimeout(() => {
		submitDonationBtn.disabled = false;
		submitBtnText.textContent = originalBtnText;

		// Ghi nhận khoản ủng hộ và hiện biên lai.
		handleSuccessfulDonation();
	}, 1200);
});

function handleSuccessfulDonation() {
	/*
	 * Luồng sau khi biểu mẫu hợp lệ: tạo thông tin giao dịch, cập nhật tổng tiền
	 * và danh sách trong localStorage, vẽ lại giao diện, rồi điền/mở biên lai.
	 * Trong phiên bản này đây là mô phỏng phía trình duyệt, chưa gửi tiền tới
	 * cổng thanh toán hay máy chủ thật.
	 */
	const isAnonymous = donorAnonymous.checked;
	const displayName = isAnonymous ? "Nhà hảo tâm ẩn danh" : donorFullname.value.trim();
	const email = donorEmail.value.trim();
	const formattedAmt = formatCurrency(selectedAmountValue);
	const code = "WFA-2026-" + Math.floor(10000 + Math.random() * 90000);

	// Tạo mô tả phương thức thanh toán để ghi lên biên lai.
	let methodLabel = "";
	if (activePaymentTab === "card") {
		const last4 = cardNumberInput.value.replace(/\D/g, "").slice(-4) || "4242";
		methodLabel = `Thẻ ${cardDisplayBrand.textContent} (•••• ${last4}) - ${cardBankSelect.value}`;
	} else {
		methodLabel = `Chuyển khoản MB Bank (${bankTransferMemo.textContent})`;
	}

	// Cộng khoản mới vào tổng tiền quyên góp đã lưu.
	// Mọi khoản quyên góp được cộng vào tổng VNĐ; USD đổi sang VNĐ theo tỷ giá demo.
	const currentTotalVnd = Number(localStorage.getItem("wfa_total_raised_vnd")) || 842650000;
	const addedVnd = currentCurrency === "VND" ? selectedAmountValue : selectedAmountValue * 25400;
	const newTotalVnd = currentTotalVnd + addedVnd;
	localStorage.setItem("wfa_total_raised_vnd", String(newTotalVnd));

	// Thêm người ủng hộ mới lên đầu danh sách gần đây.
	const currentDonors = JSON.parse(localStorage.getItem("wfa_donors_list")) || [];
	const newDonorItem = {
		name: displayName,
		amount: formattedAmt,
		message: donorMessage.value.trim() || "Cầu chúc đồng bào vùng hạn sớm vượt qua khó khăn!",
		time: "Vừa xong",
		city: donorCity.value.trim() || "Việt Nam",
		isNew: true
	};
	currentDonors.unshift(newDonorItem);
	localStorage.setItem("wfa_donors_list", JSON.stringify(currentDonors));

	// Vẽ lại danh sách người ủng hộ và thanh tiến độ.
	renderDonorsList();
	renderCampaignProgress();

	// Điền thông tin giao dịch vào biên lai rồi mở hộp thoại.
	receiptCode.textContent = code;
	receiptDonorName.textContent = displayName;
	receiptDonorEmail.textContent = email;
	receiptAmount.textContent = formattedAmt;
	receiptFrequency.textContent = selectedFrequency === "monthly" ? "Ủng hộ hàng tháng" : "Ủng hộ một lần";
	receiptPaymentMethod.textContent = methodLabel;

	const now = new Date();
	receiptTimestamp.textContent = now.toLocaleString("vi-VN", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	});

	receiptModalOverlay.classList.add("active");

	// Tạo mã chuyển khoản mới cho lượt ủng hộ tiếp theo.
	generateTransferMemo();
}

// ================= HIỂN THỊ TIẾN ĐỘ VÀ DANH SÁCH ỦNG HỘ =================
function renderCampaignProgress() {
	/*
	 * Đọc tổng tiền đang lưu bằng VNĐ, tính phần trăm so với mục tiêu và đổi
	 * cách hiển thị nếu đang chọn USD. Độ rộng thanh được giới hạn ở 100%;
	 * phần trăm này dựa trên tổng gốc VNĐ.
	 */
	const totalVnd = Number(localStorage.getItem("wfa_total_raised_vnd")) || 842650000;
	const targetVnd = campaignTargetVND;
	// Giới hạn thanh tiến độ ở 100%, kể cả khi tổng quyên góp vượt mục tiêu.
	const percent = Math.min(100, ((totalVnd / targetVnd) * 100)).toFixed(1);

	if (currentCurrency === "VND") {
		statRaised.textContent = totalVnd.toLocaleString("vi-VN") + " ₫";
		statTarget.textContent = targetVnd.toLocaleString("vi-VN") + " ₫";
	} else {
		const totalUsd = Math.round(totalVnd / 25400);
		statRaised.textContent = "$" + totalUsd.toLocaleString("en-US");
		statTarget.textContent = "$" + campaignTargetUSD.toLocaleString("en-US");
	}

	statPercent.textContent = percent + "%";
	progressFill.style.width = percent + "%";
}

function renderDonorsList() {
	/*
	 * Đọc danh sách đã lưu (hoặc dùng danh sách mẫu), xóa nội dung cũ rồi dựng
	 * tối đa 10 lượt gần nhất. Mỗi mục gồm tên/viết tắt, số tiền, lời nhắn,
	 * thời gian và địa điểm.
	 */
	const donors = JSON.parse(localStorage.getItem("wfa_donors_list")) || SEED_DONORS;
	donorsList.innerHTML = "";

	// Chỉ hiển thị 10 lượt gần nhất để danh sách không kéo dài quá mức.
	donors.slice(0, 10).forEach((donor) => {
		const item = document.createElement("div");
		item.className = `donor-item ${donor.isNew ? "highlight-new" : ""}`;

		const initials = donor.name === "Nhà hảo tâm ẩn danh" ? "★" : donor.name.split(" ").map(w => w[0]).join("").slice(-2);

		item.innerHTML = `
			<div class="donor-avatar">${initials}</div>
			<div class="donor-details">
				<div class="donor-name-row">
					<span class="donor-name" title="${donor.name}">${donor.name}</span>
					<span class="donor-amount">${donor.amount}</span>
				</div>
				${donor.message ? `<div class="donor-message">"${donor.message}"</div>` : ""}
				<div class="donor-time">${donor.time} · ${donor.city || "Hảo tâm"}</div>
			</div>
		`;
		donorsList.appendChild(item);
	});
}

// ================= SỰ KIỆN BIÊN LAI VÀ THÔNG BÁO =================
function closeModal() {
	receiptModalOverlay.classList.remove("active");
}

modalCloseBtn.addEventListener("click", closeModal);
btnCloseReceipt.addEventListener("click", closeModal);

receiptModalOverlay.addEventListener("click", (e) => {
	if (e.target === receiptModalOverlay) {
		closeModal();
	}
});

btnPrintReceipt.addEventListener("click", () => {
	window.print();
});

let toastTimeout;
function showToast(message) {
	// Hủy bộ hẹn giờ cũ để thông báo mới không bị ẩn sớm bởi lần hiển thị trước.
	clearTimeout(toastTimeout);
	toastMsg.textContent = message;
	toastNotice.classList.add("show");
	toastTimeout = setTimeout(() => {
		toastNotice.classList.remove("show");
	}, 2800);
}

function setupEventListeners() {
	// Cho phép đóng biên lai bằng phím Escape.
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && receiptModalOverlay.classList.contains("active")) {
			closeModal();
		}
	});
}