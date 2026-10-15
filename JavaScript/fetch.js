
const api = "https://api.worldbank.org/v2/country/all/indicator/SH.H2O.BASW.ZS?format=json&mrnev=1&per_page=300";
const countriesApi = "https://api.worldbank.org/v2/country?format=json&per_page=400";

async function getWaterAccessData() {
    const [indicatorResponse, countriesResponse] = await Promise.all([fetch(api), fetch(countriesApi)]);
    if (!indicatorResponse.ok || !countriesResponse.ok) {
        throw new Error("Không thể kết nối với World Bank API.");
    }

    const [indicatorPayload, countriesPayload] = await Promise.all([
        indicatorResponse.json(),
        countriesResponse.json()
    ]);
    if (!Array.isArray(indicatorPayload?.[1]) || !Array.isArray(countriesPayload?.[1])) {
        throw new Error("World Bank API không trả về dữ liệu hợp lệ.");
    }

    // Vùng MEA của World Bank còn gồm Trung Đông; chỉ nhận các mã quốc gia Bắc Phi cần thiết.
    const northAfricanCountries = new Set(["DZA", "EGY", "LBY", "MAR", "SDN", "TUN"]);
    // Bản ghi chỉ số thiếu thông tin vùng, nên ghép bằng mã ISO3 với danh mục quốc gia.
    const africanCountryCodes = new Set(countriesPayload[1]
        .filter(country => country.region?.id === "SSF" ||
            (country.region?.id === "MEA" && northAfricanCountries.has(country.id)))
        .map(country => country.id));

    return indicatorPayload[1].filter(item =>
        typeof item.value === "number" &&
        typeof item.country?.value === "string" &&
        africanCountryCodes.has(item.countryiso3code)
    );
}

window.getWaterAccessData = getWaterAccessData;
