const dataStatus = document.querySelector("#data-status");
const dataError = document.querySelector("#data-error");

const formatInteger = value => Math.round(value).toLocaleString("vi-VN");
const formatPercent = value => `${value.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`;
const formatRate = value => value.toLocaleString("vi-VN", { maximumFractionDigits: 1 });

function renderBarChart(element, entries, getValue, formatValue, emptyMessage, showYear = false) {
	/*
	 * Hàm dùng chung cho cả ba biểu đồ. getValue chọn chỉ số cần so sánh,
	 * formatValue biến con số thành nhãn đọc được. Trước khi vẽ, bỏ giá trị
	 * thiếu/không phải số, xếp từ lớn xuống nhỏ và chỉ lấy 10 quốc gia đầu.
	 */
	const sortedEntries = entries
		.filter(entry => Number.isFinite(getValue(entry)))
		.sort((first, second) => getValue(second) - getValue(first))
		.slice(0, 10);
	// Cột dài nhất là 100%; các cột còn lại biểu diễn tỷ lệ so với giá trị lớn nhất.
	const maximum = Math.max(...sortedEntries.map(getValue));

	// Xóa kết quả cũ trước khi vẽ lại để không bị lặp nếu hàm được gọi nhiều lần.
	element.replaceChildren();
	if (sortedEntries.length === 0) {
		const message = document.createElement("li");
		message.className = "empty-chart";
		message.textContent = emptyMessage;
		element.append(message);
		return;
	}

	sortedEntries.forEach(entry => {
		const value = getValue(entry);
		const row = document.createElement("li");
		const country = document.createElement("span");
		const track = document.createElement("span");
		const bar = document.createElement("span");
		const output = document.createElement("strong");

		// Tạo node bằng DOM và gán nội dung qua textContent để tên/giá trị được hiển thị như văn bản.
		row.className = "bar-row";
		country.className = "bar-country";
		country.textContent = entry.name;
		if (showYear && entry.mortalityYear) {
			const year = document.createElement("small");
			year.textContent = `Năm ${entry.mortalityYear}`;
			country.append(year);
		}
		track.className = "bar-track";
		track.setAttribute("aria-hidden", "true");
		bar.className = "bar-fill";
		// Bảo vệ trường hợp mọi giá trị đều bằng 0 để không tạo độ rộng NaN.
		bar.style.setProperty("--bar-width", `${maximum > 0 ? value / maximum * 100 : 0}%`);
		track.append(bar);
		output.className = "bar-value";
		output.textContent = formatValue(value);
		row.append(country, track, output);
		element.append(row);
	});
}

async function renderInformation() {
	try {
		/*
		 * fetch.js cung cấp window.getAfricanWaterStatistics(). Kết quả là
		 * danh sách object theo quốc gia; từ đó tách riêng các chỉ số có dữ liệu
		 * để thiếu số liệu ở một chỉ số không làm sai các phép tính còn lại.
		 */
		const countries = await window.getAfricanWaterStatistics();
		const waterCountries = countries.filter(country => country.waterAccess !== null);
		// Cộng ước tính của từng quốc gia; đây là ước tính từ dân số và phần trăm, không phải số đếm trực tiếp.
		const populationWithoutWater = waterCountries
			.filter(country => country.estimatedWithoutBasicWater !== null)
			.reduce((total, country) => total + country.estimatedWithoutBasicWater, 0);
		const mortalityCountries = countries.filter(country => country.mortalityRate !== null);
		/*
		 * reduce giữ lại quốc gia đứng đầu khi duyệt danh sách. waterAccess là
		 * tỷ lệ đã tiếp cận, vì vậy tỷ lệ chưa tiếp cận cao nhất tương ứng với
		 * waterAccess thấp nhất; hai chỉ số khác lấy giá trị lớn nhất.
		 */
		const highestRateCountry = waterCountries.reduce((highest, country) =>
			!highest || country.waterAccess < highest.waterAccess ? country : highest, null);
		const highestCountCountry = waterCountries.reduce((highest, country) =>
			!highest || country.estimatedWithoutBasicWater > highest.estimatedWithoutBasicWater ? country : highest, null);
		const highestMortalityCountry = mortalityCountries.reduce((highest, country) =>
			!highest || country.mortalityRate > highest.mortalityRate ? country : highest, null);

		// Không thể dựng đầy đủ trang nếu một trong hai nhóm chỉ số chính không có dữ liệu.
		if (!waterCountries.length || !mortalityCountries.length) {
			throw new Error("Chưa có đủ dữ liệu để tạo các biểu đồ.");
		}

		/*
		 * Kết nối dữ liệu với HTML bằng ID: mỗi querySelector tìm đúng chỗ đặt
		 * số liệu; textContent thay nội dung "Đang tải" ban đầu bằng kết quả.
		 */
		document.querySelector("#summary-total").textContent = `≈ ${formatInteger(populationWithoutWater)}`;
		document.querySelector("#summary-coverage").textContent = `Người ước tính · năm 2024 · ${waterCountries.length} quốc gia`;
		document.querySelector("#summary-highest-rate").textContent = formatPercent(100 - highestRateCountry.waterAccess);
		document.querySelector("#summary-highest-rate-country").textContent = highestRateCountry.name;
		document.querySelector("#summary-highest-count").textContent = formatInteger(highestCountCountry.estimatedWithoutBasicWater);
		document.querySelector("#summary-highest-count-country").textContent = highestCountCountry.name;
		document.querySelector("#summary-highest-mortality").textContent = `${formatRate(highestMortalityCountry.mortalityRate)} / 100.000`;
		document.querySelector("#summary-highest-mortality-country").textContent = `${highestMortalityCountry.name} · ${highestMortalityCountry.mortalityYear}`;

		/*
		 * Mỗi lời gọi truyền vào: nơi chứa biểu đồ, tập quốc gia, cách lấy giá trị,
		 * cách định dạng nhãn và thông báo khi rỗng. Biểu đồ tiếp cận dùng 100 - %
		 * tiếp cận; biểu đồ dân số dùng số người ước tính; tử vong dùng số ca/100.000.
		 */
		renderBarChart(
			document.querySelector("#access-chart"),
			waterCountries,
			country => 100 - country.waterAccess,
			formatPercent,
			"Chưa có dữ liệu tỷ lệ tiếp cận nước."
		);
		renderBarChart(
			document.querySelector("#population-chart"),
			waterCountries,
			country => country.estimatedWithoutBasicWater,
			value => formatInteger(value),
			"Chưa có dữ liệu dân số và nước uống để ước tính."
		);
		renderBarChart(
			document.querySelector("#mortality-chart"),
			mortalityCountries,
			country => country.mortalityRate,
			value => `${formatRate(value)} / 100.000`,
			"Chưa có dữ liệu tử vong liên quan đến dịch vụ nước và vệ sinh không an toàn.",
			true
		);

		// Các câu diễn giải bên dưới được tạo từ cùng dữ liệu để phần nhận xét luôn khớp biểu đồ.
		document.querySelector("#insight-population").textContent =
			`Ước tính có khoảng ${formatInteger(populationWithoutWater)} người tại ${waterCountries.length} quốc gia chưa tiếp cận dịch vụ nước uống cơ bản trong năm 2024.`;
		document.querySelector("#insight-rate").textContent =
			`${highestRateCountry.name} có tỷ lệ chưa tiếp cận cao nhất (${formatPercent(100 - highestRateCountry.waterAccess)}); ${highestCountCountry.name} có số người chưa tiếp cận ước tính cao nhất (${formatInteger(highestCountCountry.estimatedWithoutBasicWater)} người).`;
		document.querySelector("#insight-mortality").textContent =
			`${highestMortalityCountry.name} có tỷ lệ tử vong liên quan đến dịch vụ nước và vệ sinh không an toàn cao nhất trong dữ liệu hiện có: ${formatRate(highestMortalityCountry.mortalityRate)} ca trên 100.000 dân vào năm ${highestMortalityCountry.mortalityYear}.`;
		document.querySelector("#access-year").textContent = "2024";
		document.querySelector("#population-year").textContent = "2024";
		dataStatus.textContent = `Đã tải dữ liệu cho ${countries.length} quốc gia. Nước uống và dân số: năm 2024; tử vong liên quan nước và vệ sinh: năm mới nhất theo từng nước.`;
	} catch (error) {
		// Hiển thị lỗi ngay trên trang thay vì để các ô thống kê trông như đã tải thành công.
		dataStatus.textContent = "Không thể tải dữ liệu.";
		dataError.hidden = false;
		dataError.textContent = error.message;
	}
}

renderInformation();