const donationForm = document.querySelector("#donation-form");
const amountOptions = document.querySelectorAll('input[name="amount"]');
const frequencyOptions = document.querySelectorAll('input[name="frequency"]');
const customAmountLabel = document.querySelector("#custom-amount-label");
const customAmountInput = document.querySelector("#custom-amount");
const donationError = document.querySelector("#donation-error");
const donationSummary = document.querySelector("#donation-summary");
const editDonationButton = document.querySelector("#edit-donation");
const paymentForm = document.querySelector("#payment-form");
const paymentError = document.querySelector("#payment-error");
const demoSuccess = document.querySelector("#demo-success");
const donorName = document.querySelector("#donor-name");
const donorEmail = document.querySelector("#donor-email");
const cardNumber = document.querySelector("#card-number");
const cardExpiry = document.querySelector("#card-expiry");
const cardCvc = document.querySelector("#card-cvc");
const fillTestDataButton = document.querySelector("#fill-test-data");

function resetPaymentDemo() {
	paymentForm.reset();
	paymentForm.hidden = false;
	demoSuccess.hidden = true;
	paymentError.hidden = true;
}

function updateCustomAmountVisibility() {
	const isCustom = document.querySelector('input[name="amount"]:checked')?.value === "custom";
	customAmountLabel.hidden = !isCustom;
	customAmountInput.hidden = !isCustom;
	customAmountInput.required = isCustom;
	if (isCustom) {
		customAmountInput.focus();
	}
	donationError.hidden = true;
	donationSummary.hidden = true;
	resetPaymentDemo();
}

amountOptions.forEach(option => option.addEventListener("change", updateCustomAmountVisibility));
frequencyOptions.forEach(option => option.addEventListener("change", () => {
	donationSummary.hidden = true;
	donationError.hidden = true;
	resetPaymentDemo();
}));

cardNumber.addEventListener("input", () => {
	const digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
	cardNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
});

fillTestDataButton.addEventListener("click", () => {
	donorName.value = "Người dùng thử";
	donorEmail.value = "demo@example.com";
	cardNumber.value = "4242 4242 4242 4242";
	cardExpiry.value = "12/30";
	cardCvc.value = "123";
	paymentError.hidden = true;
});

donationForm.addEventListener("submit", event => {
	event.preventDefault();
	const selectedAmount = document.querySelector('input[name="amount"]:checked')?.value;
	const amount = selectedAmount === "custom" ? Number(customAmountInput.value) : Number(selectedAmount);
	const frequency = document.querySelector('input[name="frequency"]:checked')?.value;

	if (!Number.isFinite(amount) || amount < 1 || amount > 1000000) {
		donationError.textContent = "Vui lòng chọn hoặc nhập số tiền từ 1 đến 1.000.000 USD.";
		donationError.hidden = false;
		if (selectedAmount === "custom") {
			customAmountInput.focus();
		}
		return;
	}
	if (frequency !== "once" && frequency !== "monthly") {
		donationError.textContent = "Vui lòng chọn hình thức ủng hộ.";
		donationError.hidden = false;
		return;
	}

	document.querySelector("#summary-amount").textContent = `${amount.toLocaleString("vi-VN")} USD`;
	document.querySelector("#summary-frequency").textContent = frequency === "monthly" ? "Ủng hộ hàng tháng" : "Ủng hộ một lần";
	donationError.hidden = true;
	donationSummary.hidden = false;
	resetPaymentDemo();
	donationSummary.focus();
});

paymentForm.addEventListener("submit", event => {
	event.preventDefault();
	const digits = cardNumber.value.replace(/\D/g, "");
	const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail.value.trim());

	if (!donorName.value.trim() || !isValidEmail) {
		paymentError.textContent = "Vui lòng nhập họ tên và địa chỉ email hợp lệ.";
		paymentError.hidden = false;
		return;
	}
	if (digits !== "4242424242424242" || cardExpiry.value.trim() !== "12/30" || cardCvc.value.trim() !== "123") {
		paymentError.textContent = "Đây chỉ là bản mô phỏng. Hãy dùng đúng bộ dữ liệu thử bên trên, không nhập thẻ thật.";
		paymentError.hidden = false;
		return;
	}

	paymentError.hidden = true;
	paymentForm.reset();
	paymentForm.hidden = true;
	demoSuccess.hidden = false;
	demoSuccess.focus();
});

editDonationButton.addEventListener("click", () => {
	donationSummary.hidden = true;
	resetPaymentDemo();
	donationForm.querySelector("button[type='submit']").focus();
});