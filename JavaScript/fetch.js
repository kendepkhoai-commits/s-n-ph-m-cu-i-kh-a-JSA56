// ISO-3 là mã quốc gia 3 chữ cái (ví dụ KEN = Kenya); Set này dùng để lọc châu Phi.
const africaCodes = new Set([
    "DZA", "AGO", "BEN", "BWA", "BFA", "BDI", "CPV",
    "CMR", "CAF", "TCD", "COM", "COG", "COD", "CIV",
    "DJI", "EGY", "GNQ", "ERI", "SWZ", "ETH", "GAB",
    "GMB", "GHA", "GIN", "GNB", "KEN", "LSO", "LBR",
    "LBY", "MDG", "MWI", "MLI", "MRT", "MUS", "MAR",
    "MOZ", "NAM", "NER", "NGA", "RWA", "STP", "SEN",
    "SYC", "SLE", "SOM", "ZAF", "SSD", "SDN", "TZA",
    "TGO", "TUN", "UGA", "ZMB", "ZWE"
]);

// Mỗi URL chọn một chỉ số World Bank: dân số, tỷ lệ tiếp cận nước và tử vong.
// Dân số/nước cố định năm 2024 để so sánh cùng mốc; tử vong lấy năm mới nhất có dữ liệu.
// format=json yêu cầu JSON; per_page là số dòng tối đa mỗi trang; mrnev=1 chọn quan sát gần nhất.
const populationApi =
    "https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&date=2024:2024&per_page=300";
const waterApi =
    "https://api.worldbank.org/v2/country/all/indicator/SH.H2O.BASW.ZS?format=json&date=2024:2024&per_page=300";
const mortalityApi =
    "https://api.worldbank.org/v2/country/all/indicator/SH.STA.WASH.P5?format=json&mrnev=1&per_page=300";

// Gọi một trang API, giới hạn thời gian chờ và kiểm tra phản hồi trước khi dùng dữ liệu.
async function fetchWorldBankPage(url) {
    // AbortController cho phép hủy yêu cầu nếu máy chủ phản hồi quá lâu.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        // Truyền signal để fetch nhận biết yêu cầu có thể bị hủy bởi timeout.
        const response = await fetch(url, { signal: controller.signal });
        // fetch không tự báo lỗi với HTTP 404/500, nên phải kiểm tra response.ok.
        if (!response.ok) {
            throw new Error(`World Bank API trả về lỗi HTTP ${response.status}.`);
        }

        let payload;
        try {
            // Chuyển phần JSON trong phản hồi thành dữ liệu JavaScript.
            payload = await response.json();
        } catch {
            throw new Error("World Bank API trả về JSON không hợp lệ.");
        }

        // World Bank thường trả [metadata, danh_sách_quan_sát].
        // Kiểm tra cấu trúc trước khi đọc để tránh lỗi khi API trả dữ liệu khác dự kiến.
        if (!Array.isArray(payload) || !payload[0] || typeof payload[0] !== "object") {
            throw new Error("World Bank API trả về dữ liệu không đúng định dạng.");
        }

        const metadata = payload[0];
        // API có thể trả lỗi nghiệp vụ trong metadata dù HTTP vẫn thành công.
        const apiMessages = Array.isArray(metadata.message)
            ? metadata.message.map(message => message.value || message.id).filter(Boolean).join("; ")
            : metadata.message;
        if (apiMessages) {
            throw new Error(`World Bank API: ${apiMessages}`);
        }

        const observations = payload[1];
        // Không có dữ liệu hợp lệ có thể là null; nếu có thì phải là một mảng.
        if (observations !== null && observations !== undefined && !Array.isArray(observations)) {
            throw new Error("World Bank API trả về danh sách quan sát không hợp lệ.");
        }

        // Trả cả số trang và dữ liệu để fetchIndicator biết có cần tải tiếp không.
        const pageCount = Number(metadata.pages);
        return {
            pageCount: Number.isInteger(pageCount) && pageCount > 0 ? pageCount : 1,
            observations: observations || []
        };
    } catch (error) {
        // Đổi lỗi kỹ thuật phổ biến thành thông báo dễ hiểu; lỗi khác được giữ nguyên.
        if (error.name === "AbortError") {
            throw new Error("Kết nối World Bank API quá thời gian chờ. Vui lòng thử lại.");
        }
        if (error instanceof TypeError) {
            throw new Error("Không thể kết nối tới World Bank API. Vui lòng kiểm tra mạng.");
        }
        throw error;
    } finally {
        // Dọn bộ hẹn giờ dù thành công hay thất bại để không giữ timer thừa.
        clearTimeout(timeoutId);
    }
}

/**
 * Lấy đủ các trang của một chỉ số. `per_page=300` thường đủ cho API này,
 * nhưng vẫn đọc metadata để không bỏ sót kết quả nếu dữ liệu vượt giới hạn.
 */
async function fetchIndicator(url) {
    // Tạo URL mới để thêm tham số phân trang mà không sửa chuỗi URL gốc.
    const firstPageUrl = new URL(url);
    firstPageUrl.searchParams.set("per_page", "300");
    firstPageUrl.searchParams.set("page", "1");

    // Luôn lấy trang đầu trước vì metadata ở đây cho biết tổng số trang.
    const firstPage = await fetchWorldBankPage(firstPageUrl);
    if (firstPage.pageCount === 1) {
        return firstPage.observations;
    }

    // Trang đầu cho biết tổng số trang; gọi các trang còn lại song song để tiết kiệm thời gian.
    const remainingPages = await Promise.all(
        Array.from({ length: firstPage.pageCount - 1 }, (_, index) => {
            const pageUrl = new URL(firstPageUrl);
            // Trang đầu đã lấy rồi; index bắt đầu từ 0 nên cộng 2 để ra trang kế tiếp.
            pageUrl.searchParams.set("page", String(index + 2));
            return fetchWorldBankPage(pageUrl);
        })
    );

    // Ghép quan sát trang đầu với các trang còn lại thành một danh sách duy nhất.
    return [
        ...firstPage.observations,
        ...remainingPages.flatMap(page => page.observations)
    ];
}

async function getAfricanWaterStatistics() {
    // Ba yêu cầu độc lập nên gọi song song; chờ đủ dữ liệu rồi mới ghép và tính thống kê.
    const [populationData, waterData, mortalityData] = await Promise.all([
        fetchIndicator(populationApi),
        fetchIndicator(waterApi),
        fetchIndicator(mortalityApi)
    ]);

    // Dùng mã ISO-3 làm khóa để ghép đúng dữ liệu giữa các API, không phụ thuộc tên nước.
    // Ví dụ: waterByCountry.get("KEN") trả về dòng dữ liệu nước của Kenya.
    const waterByCountry = new Map(waterData.map(item => [item.countryiso3code, item]));
    const mortalityByCountry = new Map(mortalityData.map(item => [item.countryiso3code, item]));

    return populationData
        .filter(item =>
            // Bỏ vùng/tổng hợp, dân số thiếu (NaN) và giá trị âm không hợp lệ.
            africaCodes.has(item.countryiso3code)
            && Number.isFinite(item.value)
            && item.value >= 0
        )
        .map(population => {
            // Tìm dữ liệu tương ứng; nếu mã không có ở API phụ, kết quả sẽ là undefined.
            const water = waterByCountry.get(population.countryiso3code);
            const mortality = mortalityByCountry.get(population.countryiso3code);
            // API có thể thiếu value (null), nên chỉ chấp nhận số hợp lệ và trong phạm vi hợp lý.
            const hasValidWaterRate =
                Number.isFinite(water?.value) && water.value >= 0 && water.value <= 100;
            const waterAccess = hasValidWaterRate ? water.value : null;
            const hasValidMortalityRate =
                Number.isFinite(mortality?.value) && mortality.value >= 0;

            // Chuẩn hóa các API thành một object thống nhất để information.js dễ dùng.
            return {
                code: population.countryiso3code,
                name: population.country.value,
                population: population.value,
                populationYear: population.date,
                waterAccess,
                waterYear: water?.date || null,
                // Thiếu tỷ lệ nước thì giữ null, không hiểu nhầm là 0% tiếp cận.
                estimatedWithoutBasicWater: waterAccess === null
                    ? null
                    : population.value * (100 - waterAccess) / 100,
                mortalityRate: hasValidMortalityRate ? mortality.value : null,
                mortalityYear: mortality?.date || null
            };
        });
}

// Cho information.js truy cập hàm qua window vì hai tệp được nạp bằng script riêng.
window.getAfricanWaterStatistics = getAfricanWaterStatistics;
