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

async function fetchIndicator(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Không thể kết nối tới API của Ngân hàng Thế giới.");
    }

    const payload = await response.json();
    if (!Array.isArray(payload) || !payload[0]) {
        throw new Error("API của Ngân hàng Thế giới trả về dữ liệu không hợp lệ.");
    }

    return payload[1] || [];
}

async function getAfricanWaterStatistics() {
    const [populationData, waterData, mortalityData] = await Promise.all([
        fetchIndicator(populationApi),
        fetchIndicator(waterApi),
        fetchIndicator(mortalityApi)
    ]);

    const waterByCountry = new Map(waterData.map(item => [item.countryiso3code, item]));
    const mortalityByCountry = new Map(mortalityData.map(item => [item.countryiso3code, item]));

    const countries = populationData
        .filter(item => africaCodes.has(item.countryiso3code) && Number.isFinite(item.value))
        .map(population => {
            const water = waterByCountry.get(population.countryiso3code);
            const mortality = mortalityByCountry.get(population.countryiso3code);
            const waterAccess = Number.isFinite(water?.value) ? water.value : null;

            return {
                code: population.countryiso3code,
                name: population.country.value,
                population: population.value,
                populationYear: population.date,
                waterAccess,
                waterYear: water?.date || null,
                estimatedWithoutBasicWater: waterAccess === null
                    ? null
                    : population.value * (100 - waterAccess) / 100,
                mortalityRate: Number.isFinite(mortality?.value) ? mortality.value : null,
                mortalityYear: mortality?.date || null
            };
        });

    return countries;
}

window.getAfricanWaterStatistics = getAfricanWaterStatistics;