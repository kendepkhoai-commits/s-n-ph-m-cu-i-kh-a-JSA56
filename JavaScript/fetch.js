// Mã ISO-3 giúp chỉ giữ quốc gia châu Phi và loại các dòng tổng hợp khu vực của API.
const africaCodes = new Set([ // Danh sách mã ISO-3 để chỉ lấy các quốc gia châu Phi.
    "DZA", "AGO", "BEN", "BWA", "BFA", "BDI", "CPV",
    "CMR", "CAF", "TCD", "COM", "COG", "COD", "CIV",
    "DJI", "EGY", "GNQ", "ERI", "SWZ", "ETH", "GAB",
    "GMB", "GHA", "GIN", "GNB", "KEN", "LSO", "LBR",
    "LBY", "MDG", "MWI", "MLI", "MRT", "MUS", "MAR",
    "MOZ", "NAM", "NER", "NGA", "RWA", "STP", "SEN",
    "SYC", "SLE", "SOM", "ZAF", "SSD", "SDN", "TZA",
    "TGO", "TUN", "UGA", "ZMB", "ZWE"
]);

// Mỗi đường dẫn chọn một chỉ số; date giới hạn năm, còn mrnev lấy năm mới nhất có dữ liệu.
const populationApi = // Đường dẫn API lấy dân số của năm 2024.
    "https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&date=2024:2024&per_page=300";
const waterApi = // Đường dẫn API lấy tỷ lệ tiếp cận nước uống cơ bản năm 2024.
    "https://api.worldbank.org/v2/country/all/indicator/SH.H2O.BASW.ZS?format=json&date=2024:2024&per_page=300";
const mortalityApi = // Đường dẫn API lấy số liệu tử vong mới nhất theo quốc gia.
    "https://api.worldbank.org/v2/country/all/indicator/SH.STA.WASH.P5?format=json&mrnev=1&per_page=300";

/**
 * Lấy một chỉ số từ API World Bank và chuẩn hóa kết quả thành danh sách quan sát.
 * API thường trả về mảng gồm hai phần: metadata phân trang ở payload[0] và
 * dữ liệu quốc gia ở payload[1]. Hàm báo lỗi nếu yêu cầu HTTP thất bại hoặc
 * cấu trúc JSON không giống định dạng API; danh sách rỗng được trả về khi
 * API hợp lệ nhưng không có quan sát.
 */
async function fetchIndicator(url) { // Tải một chỉ số từ API và trả về danh sách quốc gia.
    const response = await fetch(url); // Gửi yêu cầu HTTP đến địa chỉ API nhận vào.
    if (!response.ok) { // Kiểm tra máy chủ có trả về trạng thái thành công không.
        throw new Error("Không thể kết nối tới API của Ngân hàng Thế giới."); // Dừng và báo lỗi nếu gọi API thất bại.
    }

    const payload = await response.json(); // Đọc phần thân phản hồi và chuyển JSON thành dữ liệu JavaScript.
    if (!Array.isArray(payload) || !payload[0]) { // Kiểm tra phản hồi có đúng cấu trúc mảng của World Bank không.
        throw new Error("API của Ngân hàng Thế giới trả về dữ liệu không hợp lệ."); // Báo lỗi nếu JSON sai định dạng.
    }

    return payload[1] || []; // Phần tử thứ hai là dữ liệu; nếu rỗng thì trả về mảng rỗng.
}

async function getAfricanWaterStatistics() { // Lấy, ghép và tính dữ liệu cho trang information.
    /*
     * 1. Gọi ba endpoint: dân số và tỷ lệ nước sạch của năm 2024, cùng tỷ lệ
     *    tử vong gần nhất mà World Bank có cho từng quốc gia.
     * 2. Promise.all chờ tất cả yêu cầu cùng hoàn tất; nếu một yêu cầu lỗi,
     *    toàn bộ thao tác lỗi để trang không hiển thị thống kê thiếu một chỉ số.
     */
    const [populationData, waterData, mortalityData] = await Promise.all([ // Chờ cả ba API trả dữ liệu.
        fetchIndicator(populationApi), // Lấy dân số năm 2024.
        fetchIndicator(waterApi), // Lấy tỷ lệ tiếp cận nước năm 2024.
        fetchIndicator(mortalityApi) // Lấy tỷ lệ tử vong mới nhất.
    ]); // Promise.all giúp ba yêu cầu chạy cùng lúc thay vì chờ lần lượt.

    /*
     * Dữ liệu ba endpoint được trả về thành các mảng riêng. Chuyển hai mảng
     * phụ thành Map theo mã ISO-3 để tìm tỷ lệ nước/tử vong tương ứng với
     * mỗi dòng dân số nhanh và nhất quán, thay vì ghép theo tên quốc gia.
     */
    const waterByCountry = new Map(waterData.map(item => [item.countryiso3code, item])); // Tạo tra cứu tỷ lệ nước bằng mã quốc gia.
    const mortalityByCountry = new Map(mortalityData.map(item => [item.countryiso3code, item])); // Tạo tra cứu tử vong bằng mã quốc gia.

    /*
     * Dân số làm danh sách gốc: chỉ giữ quốc gia châu Phi có số dân dạng số,
     * rồi ghép dữ liệu nước và tử vong theo mã quốc gia. Giá trị null có nghĩa
     * là API chưa có dữ liệu, không phải tỷ lệ/số ca bằng 0.
     */
    const countries = populationData // Dùng danh sách dân số làm danh sách quốc gia chính.
        .filter(item => africaCodes.has(item.countryiso3code) && Number.isFinite(item.value)) // Chỉ giữ nước châu Phi có dân số hợp lệ.
        .map(population => { // Xử lý từng nước để ghép đủ ba loại dữ liệu.
            const water = waterByCountry.get(population.countryiso3code); // Tìm tỷ lệ nước cùng mã ISO-3.
            const mortality = mortalityByCountry.get(population.countryiso3code); // Tìm số liệu tử vong cùng mã ISO-3.
            // null giữ rõ trạng thái thiếu dữ liệu để không biến dữ liệu thiếu thành 0%.
            const waterAccess = Number.isFinite(water?.value) ? water.value : null; // Lưu null nếu API chưa có tỷ lệ nước.

            return { // Chuẩn hóa dữ liệu của một nước thành object dễ dùng ở trang HTML.
                code: population.countryiso3code, // Mã ISO-3 dùng để nhận diện nước.
                name: population.country.value, // Tên nước để hiển thị.
                population: population.value, // Dân số lấy từ API.
                populationYear: population.date, // Năm của số liệu dân số.
                waterAccess, // Phần trăm dân số có nước uống cơ bản.
                waterYear: water?.date || null, // Năm của số liệu nước, hoặc null nếu thiếu.
                /*
                 * Ước tính người chưa tiếp cận = dân số × (100 - % tiếp cận) / 100.
                 * Không tính nếu thiếu tỷ lệ nước; dùng năm dân số 2024 và tỷ lệ
                 * nước 2024 do endpoint đã giới hạn năm ở tham số date.
                 */
                estimatedWithoutBasicWater: waterAccess === null // Không ước tính nếu thiếu tỷ lệ nước.
                    ? null // null nghĩa là chưa đủ dữ liệu để tính.
                    : population.value * (100 - waterAccess) / 100, // Dân số nhân phần trăm chưa tiếp cận.
                mortalityRate: Number.isFinite(mortality?.value) ? mortality.value : null, // Tỷ lệ tử vong hoặc null.
                mortalityYear: mortality?.date || null // Năm tử vong tương ứng hoặc null.
            }; // Kết thúc object chuẩn hóa của một quốc gia.
        }); // Kết thúc việc xử lý toàn bộ danh sách quốc gia.

    return countries; // Trả danh sách đã lọc và ghép cho information.js.
}

window.getAfricanWaterStatistics = getAfricanWaterStatistics; // Cho phép file information.js gọi hàm này.