
const api = "https://api.worldbank.org/v2/country/all/indicator/SH.H2O.BASW.ZS?format=json&mrnev=1&per_page=300";

async function getData() {
    try {
        console.log("Dang goi API...");

        const response = await fetch(api);

        console.log("HTTP status:", response.status);
        if (!response.ok) {
            throw new Error(`API trả về HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log("Thong tin API:", data[0]);

        // The World Bank API returns metadata and records as a two-item array.
        if (!Array.isArray(data) || !Array.isArray(data[1]) || data[1].length === 0) {
            console.log("API khong tra ve danh sach du lieu.");
            return;
        }

        const validData = data[1].filter(
            item => item.value !== null
        );

        console.log("So ban ghi co du lieu:", validData.length);
        console.log("5 ban ghi dau tien:", validData.slice(0, 5));

    } catch (error) {
        console.log("LOI:", error.message);
    }
}

getData();
