const dataStatus = document.querySelector("#data-status"); // Tìm dòng thông báo trạng thái trên trang.
const dataError = document.querySelector("#data-error"); // Tìm vùng hiện thông báo lỗi tải dữ liệu.

const formatInteger = value => Math.round(value).toLocaleString("vi-VN"); // Làm tròn và thêm dấu phân cách kiểu Việt Nam.
const formatPercent = value => `${value.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`; // Hiện tỷ lệ tối đa 1 chữ số thập phân.
const formatRate = value => value.toLocaleString("vi-VN", { maximumFractionDigits: 1 }); // Định dạng tỷ lệ tử vong tối đa 1 chữ số thập phân.

function renderBarChart(element, entries, getValue, formatValue, emptyMessage, showYear = false) { // Tạo một biểu đồ cột từ danh sách quốc gia.
	/*
	 * Hàm dùng chung cho cả ba biểu đồ. getValue chọn chỉ số cần so sánh,
	 * formatValue biến con số thành nhãn đọc được. Trước khi vẽ, bỏ giá trị
	 * thiếu/không phải số, xếp từ lớn xuống nhỏ và chỉ lấy 10 quốc gia đầu.
	 */
	const sortedEntries = entries // Bắt đầu với các quốc gia đã nhận từ API.
		.filter(entry => Number.isFinite(getValue(entry))) // Bỏ các nước thiếu số liệu cho biểu đồ này.
		.sort((first, second) => getValue(second) - getValue(first)) // Xếp từ giá trị lớn đến nhỏ.
		.slice(0, 10); // Chỉ lấy 10 nước đứng đầu.
	// Cột dài nhất là 100%; các cột còn lại biểu diễn tỷ lệ so với giá trị lớn nhất.
	const maximum = Math.max(...sortedEntries.map(getValue)); // Tìm số lớn nhất để tính chiều dài từng cột.

	// Xóa kết quả cũ trước khi vẽ lại để không bị lặp nếu hàm được gọi nhiều lần.
	element.replaceChildren(); // Xóa biểu đồ cũ trước khi vẽ dữ liệu mới.
	if (sortedEntries.length === 0) { // Kiểm tra danh sách có số liệu để vẽ không.
		const message = document.createElement("li"); // Tạo một dòng thông báo trong danh sách.
		message.className = "empty-chart"; // Gắn kiểu chữ cho thông báo khi thiếu dữ liệu.
		message.textContent = emptyMessage; // Đưa nội dung giải thích vào dòng thông báo.
		element.append(message); // Đưa thông báo vào vùng biểu đồ trên HTML.
		return; // Dừng vì không có cột nào để tạo.
	}

	sortedEntries.forEach(entry => { // Tạo một hàng biểu đồ cho từng quốc gia trong top 10.
		const value = getValue(entry); // Lấy con số của quốc gia hiện tại.
		const row = document.createElement("li"); // Tạo hàng ngoài cùng của cột.
		const country = document.createElement("span"); // Tạo vùng tên nước.
		const track = document.createElement("span"); // Tạo đường nền của thanh.
		const bar = document.createElement("span"); // Tạo phần màu thể hiện giá trị.
		const output = document.createElement("strong"); // Tạo vùng hiện con số.

		// Tạo node bằng DOM và gán nội dung qua textContent để tên/giá trị được hiển thị như văn bản.
		row.className = "bar-row"; // Chọn bố cục một hàng cho quốc gia.
		country.className = "bar-country"; // Gắn kiểu chữ cho tên nước.
		country.textContent = entry.name; // Chèn tên nước nhận từ API.
		if (showYear && entry.mortalityYear) { // Chỉ hiện năm khi biểu đồ cần năm tử vong.
			const year = document.createElement("small"); // Tạo nhãn năm nhỏ bên dưới tên.
			year.textContent = `Năm ${entry.mortalityYear}`; // Chèn năm dữ liệu.
			country.append(year); // Đặt nhãn năm ngay sau tên nước.
		}
		track.className = "bar-track"; // Gắn kiểu cho đường nền của biểu đồ.
		track.setAttribute("aria-hidden", "true"); // Ẩn phần trang trí khỏi trình đọc màn hình.
		bar.className = "bar-fill"; // Gắn màu và kiểu cho phần cột.
		// Bảo vệ trường hợp mọi giá trị đều bằng 0 để không tạo độ rộng NaN.
		bar.style.setProperty("--bar-width", `${maximum > 0 ? value / maximum * 100 : 0}%`); // Đặt chiều rộng cột theo tỷ lệ giá trị.
		track.append(bar); // Đặt cột màu vào đường nền.
		output.className = "bar-value"; // Gắn kiểu chữ cho số liệu.
		output.textContent = formatValue(value); // Hiện số theo định dạng phần trăm/số người.
		row.append(country, track, output); // Ghép tên, thanh và giá trị vào một hàng.
		element.append(row); // Thêm hàng mới vào biểu đồ trên trang.
	}); // Lặp xong thì biểu đồ đã có tối đa 10 hàng.
}

async function renderInformation() { // Lấy số liệu rồi đưa vào các vùng HTML.
	try { // Bắt lỗi API hoặc lỗi xử lý để hiện thông báo rõ ràng.
		/*
		 * fetch.js cung cấp window.getAfricanWaterStatistics(). Kết quả là
		 * danh sách object theo quốc gia; từ đó tách riêng các chỉ số có dữ liệu
		 * để thiếu số liệu ở một chỉ số không làm sai các phép tính còn lại.
		 */
		const countries = await window.getAfricanWaterStatistics(); // Gọi fetch.js và chờ danh sách quốc gia.
		const waterCountries = countries.filter(country => country.waterAccess !== null); // Chỉ giữ các nước có số liệu nước.
		// Cộng ước tính của từng quốc gia; đây là ước tính từ dân số và phần trăm, không phải số đếm trực tiếp.
		const populationWithoutWater = waterCountries // Tạo tổng ước tính từ danh sách nước có dữ liệu.
			.filter(country => country.estimatedWithoutBasicWater !== null) // Bỏ nước không đủ dữ liệu để tính.
			.reduce((total, country) => total + country.estimatedWithoutBasicWater, 0); // Cộng ước tính của từng nước.
		const mortalityCountries = countries.filter(country => country.mortalityRate !== null); // Chỉ giữ nước có dữ liệu tử vong.
		/*
		 * reduce giữ lại quốc gia đứng đầu khi duyệt danh sách. waterAccess là
		 * tỷ lệ đã tiếp cận, vì vậy tỷ lệ chưa tiếp cận cao nhất tương ứng với
		 * waterAccess thấp nhất; hai chỉ số khác lấy giá trị lớn nhất.
		 */
		const highestRateCountry = waterCountries.reduce((highest, country) => // Tìm nước có tỷ lệ tiếp cận thấp nhất.
			!highest || country.waterAccess < highest.waterAccess ? country : highest, null); // Tỷ lệ thấp nhất nghĩa là thiếu tiếp cận cao nhất.
		const highestCountCountry = waterCountries.reduce((highest, country) => // Tìm nước có số người chưa tiếp cận cao nhất.
			!highest || country.estimatedWithoutBasicWater > highest.estimatedWithoutBasicWater ? country : highest, null); // Giữ nước có ước tính lớn nhất.
		const highestMortalityCountry = mortalityCountries.reduce((highest, country) => // Tìm nước có tỷ lệ tử vong cao nhất.
			!highest || country.mortalityRate > highest.mortalityRate ? country : highest, null); // Giữ nước có tỷ lệ lớn nhất.

		// Không thể dựng đầy đủ trang nếu một trong hai nhóm chỉ số chính không có dữ liệu.
		if (!waterCountries.length || !mortalityCountries.length) { // Kiểm tra có dữ liệu để tạo đủ biểu đồ.
			throw new Error("Chưa có đủ dữ liệu để tạo các biểu đồ."); // Chuyển sang catch nếu thiếu dữ liệu chính.
		}

		/*
		 * Kết nối dữ liệu với HTML bằng ID: mỗi querySelector tìm đúng chỗ đặt
		 * số liệu; textContent thay nội dung "Đang tải" ban đầu bằng kết quả.
		 */
		document.querySelector("#summary-total").textContent = `≈ ${formatInteger(populationWithoutWater)}`; // Đưa tổng ước tính vào ô tổng quan.
		document.querySelector("#summary-coverage").textContent = `Người ước tính · năm 2024 · ${waterCountries.length} quốc gia`; // Hiện năm và số nước có dữ liệu.
		document.querySelector("#summary-highest-rate").textContent = formatPercent(100 - highestRateCountry.waterAccess); // Đổi tỷ lệ tiếp cận thấp thành tỷ lệ thiếu tiếp cận.
		document.querySelector("#summary-highest-rate-country").textContent = highestRateCountry.name; // Hiện tên nước có tỷ lệ thiếu cao nhất.
		document.querySelector("#summary-highest-count").textContent = formatInteger(highestCountCountry.estimatedWithoutBasicWater); // Hiện số người ước tính lớn nhất.
		document.querySelector("#summary-highest-count-country").textContent = highestCountCountry.name; // Hiện tên nước có số người đó.
		document.querySelector("#summary-highest-mortality").textContent = `${formatRate(highestMortalityCountry.mortalityRate)} / 100.000`; // Hiện tử vong trên 100.000 dân.
		document.querySelector("#summary-highest-mortality-country").textContent = `${highestMortalityCountry.name} · ${highestMortalityCountry.mortalityYear}`; // Hiện nước và năm tương ứng.

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