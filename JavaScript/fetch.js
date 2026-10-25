// Mã ISO-3 giúp chỉ giữ quốc gia châu Phi và loại các dòng tổng hợp khu vực của API.
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

const populationApi =
    "https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&date=2024:2024&per_page=300";
const waterApi =
    "https://api.worldbank.org/v2/country/all/indicator/SH.H2O.BASW.ZS?format=json&date=2024:2024&per_page=300";
const mortalityApi =
    "https://api.worldbank.org/v2/country/all/indicator/SH.STA.WASH.P5?format=json&mrnev=1&per_page=300";

/**
 * Lấy một chỉ số từ API World Bank và chuẩn hóa kết quả thành danh sách quan sát.
 * API thường trả về mảng gồm hai phần: metadata phân trang ở payload[0] và
 * dữ liệu quốc gia ở payload[1]. Hàm báo lỗi nếu yêu cầu HTTP thất bại hoặc
 * cấu trúc JSON không giống định dạng API; danh sách rỗng được trả về khi
 * API hợp lệ nhưng không có quan sát.
 */
async function fetchIndicator(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Không thể kết nối tới API của Ngân hàng Thế giới.");
    }

    const payload = await response.json();
    if (!Array.isArray(payload) || !payload[0]) {
        throw new Error("API của Ngân hàng Thế giới trả về dữ liệu không hợp lệ.");
    }

    // API trả metadata ở phần tử đầu và danh sách quan sát ở phần tử thứ hai.
    return payload[1] || [];
}

async function getAfricanWaterStatistics() {
    /*
     * 1. Gọi ba endpoint: dân số và tỷ lệ nước sạch của năm 2024, cùng tỷ lệ
     *    tử vong gần nhất mà World Bank có cho từng quốc gia.
     * 2. Promise.all chờ tất cả yêu cầu cùng hoàn tất; nếu một yêu cầu lỗi,
     *    toàn bộ thao tác lỗi để trang không hiển thị thống kê thiếu một chỉ số.
     */
    const [populationData, waterData, mortalityData] = await Promise.all([
        fetchIndicator(populationApi),
        fetchIndicator(waterApi),
        fetchIndicator(mortalityApi)
    ]);

    /*
     * Dữ liệu ba endpoint được trả về thành các mảng riêng. Chuyển hai mảng
     * phụ thành Map theo mã ISO-3 để tìm tỷ lệ nước/tử vong tương ứng với
     * mỗi dòng dân số nhanh và nhất quán, thay vì ghép theo tên quốc gia.
     */
    const waterByCountry = new Map(waterData.map(item => [item.countryiso3code, item]));
    const mortalityByCountry = new Map(mortalityData.map(item => [item.countryiso3code, item]));

    /*
     * Dân số làm danh sách gốc: chỉ giữ quốc gia châu Phi có số dân dạng số,
     * rồi ghép dữ liệu nước và tử vong theo mã quốc gia. Giá trị null có nghĩa
     * là API chưa có dữ liệu, không phải tỷ lệ/số ca bằng 0.
     */
    const countries = populationData
        .filter(item => africaCodes.has(item.countryiso3code) && Number.isFinite(item.value))
        .map(population => {
            const water = waterByCountry.get(population.countryiso3code);
            const mortality = mortalityByCountry.get(population.countryiso3code);
            // null giữ rõ trạng thái thiếu dữ liệu để không biến dữ liệu thiếu thành 0%.
            const waterAccess = Number.isFinite(water?.value) ? water.value : null;

            return {
                code: population.countryiso3code,
                name: population.country.value,
                population: population.value,
                populationYear: population.date,
                waterAccess,
                waterYear: water?.date || null,
                /*
                 * Ước tính người chưa tiếp cận = dân số × (100 - % tiếp cận) / 100.
                 * Không tính nếu thiếu tỷ lệ nước; dùng năm dân số 2024 và tỷ lệ
                 * nước 2024 do endpoint đã giới hạn năm ở tham số date.
                 */
                estimatedWithoutBasicWater: waterAccess === null
                    ? null
                    : population.value * (100 - waterAccess) / 100,
                mortalityRate: Number.isFinite(mortality?.value) ? mortality.value : null,
                mortalityYear: mortality?.date || null
            };
        });

    return countries;
}

// Đưa hàm ra window để information.js có thể gọi sau khi fetch.js được tải.
window.getAfricanWaterStatistics = getAfricanWaterStatistics;