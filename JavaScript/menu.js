const accountName = document.querySelector("#account-name");
const logoutButton = document.querySelector("#logout-button");
const averageElement = document.querySelector("#africa-average");
const countryCountElement = document.querySelector("#country-count");
const dataYearElement = document.querySelector("#data-year");
const countryList = document.querySelector("#country-list");
const dataStatus = document.querySelector("#data-status");

let isAuthenticated = false;
try {
	isAuthenticated = sessionStorage.getItem("waterAidAuthenticated") === "1";
} catch {
	// Nếu trình duyệt chặn sessionStorage, coi lượt truy cập là chưa đăng nhập.
}

let account;
try {
	account = JSON.parse(localStorage.getItem("waterAidAccount"));
} catch {
	account = null;
}

if (!isAuthenticated || !account || typeof account.username !== "string") {
	window.location.replace("login.html");
} else {
	accountName.textContent = account.username;
	loadWaterAccessData();
}

logoutButton.addEventListener("click", () => {
	try {
		sessionStorage.removeItem("waterAidAuthenticated");
	} finally {
		window.location.replace("login.html");
	}
});

async function loadWaterAccessData() {
	try {
		const countries = await window.getWaterAccessData();
		if (countries.length === 0) {
			throw new Error("Chưa có dữ liệu nước uống cho các quốc gia châu Phi.");
		}

		// Mỗi nước chỉ có một quan sát mới nhất; đây là trung bình không trọng số theo dân số.
		const average = countries.reduce((total, item) => total + item.value, 0) / countries.length;
		const years = countries.map(item => Number(item.date)).filter(Number.isFinite);
		averageElement.textContent = `${average.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`;
		countryCountElement.textContent = `${countries.length} quốc gia có dữ liệu`;
		dataYearElement.textContent = years.length ? `Năm mới nhất: ${Math.max(...years)}` : "Chưa rõ năm dữ liệu";
		dataStatus.textContent = "";

		countries
			.sort((first, second) => first.value - second.value)
			.slice(0, 5)
			.forEach(item => {
				const row = document.createElement("li");
				const country = document.createElement("span");
				const value = document.createElement("strong");
				country.textContent = item.country.value;
				value.textContent = `${item.value.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`;
				row.append(country, value);
				countryList.append(row);
			});
	} catch (error) {
		averageElement.textContent = "Chưa có dữ liệu";
		countryCountElement.textContent = "Không thể tải dữ liệu lúc này";
		dataStatus.textContent = error.message;
	}
}