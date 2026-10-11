
const api = "https://api.worldbank.org/v2/country/all/indicator/SH.H2O.BASW.ZS?format=json&mrnev=1&per_page=300";

async function getData() {
    try {
        console.log("Dang goi API...");

        const response = await fetch(api);

        console.log("HTTP status:", response.status);

        const data = await response.json();

        console.log("Thong tin API:", data[0]);

        if (!data[1]) {
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
