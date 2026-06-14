const container = document.getElementById("countries");
const searchInput = document.getElementById("searchInput");
const regionSelect = document.getElementById("regionSelect");
const resultsCount = document.getElementById("resultsCount");
const darkModeToggle = document.getElementById("darkModeToggle");
let allCountries = [];

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = darkModeToggle.querySelector("i");
    const text = darkModeToggle.querySelector("span");

    if (document.body.classList.contains("dark-mode")) {
        icon.className = "fa-solid fa-sun";
        text.innerText = "Light Mode";
    } else {
        icon.className = "fa-regular fa-moon";
        text.innerText = "Dark Mode";
    }
});

async function loadCountries() {
    const url = "countries.json";
    container.innerHTML = `<div class="loader"><i class="fa-solid fa-spinner fa-spin"></i> Načítám data...</div>`;
    resultsCount.innerText = "";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        allCountries = await response.json();
        displayCountries(allCountries);

    } catch (error) {
        console.error(error);
        container.innerHTML = `<h2 style="grid-column: 1/-1; text-align: center;">Chyba při načítání dat.</h2>`;
    }
}

function displayCountries(countries) {
    let html = ``;
    resultsCount.innerText = `Nalezeno států: ${countries.length}`;

    if (countries.length === 0) {
        container.innerHTML = `<h2 style="grid-column: 1/-1; text-align: center;">Žádný stát nenalezen.</h2>`;
        return;
    }

    countries.forEach(country => {
        let pop = country.population ? country.population.toLocaleString() : 'N/A';
        let cap = (country.capital && country.capital.length > 0) ? country.capital[0] : 'N/A';
        let area = country.area ? country.area.toLocaleString() + ' km²' : 'N/A';

        let langs = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
        let curs = country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A';
        let zones = country.timezones ? country.timezones.slice(0, 2).join(', ') : 'N/A';

        html += `
            <div class="country-card">
                <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
                <div class="card-content">
                    <h2>${country.name.common}</h2>
                    <p><i class="fa-solid fa-users"></i> <strong>Population:</strong> ${pop}</p>
                    <p><i class="fa-solid fa-earth-americas"></i> <strong>Region:</strong> ${country.region}</p>
                    <p><i class="fa-solid fa-city"></i> <strong>Capital:</strong> ${cap}</p>
                    <p><i class="fa-solid fa-maximize"></i> <strong>Area:</strong> ${area}</p>
                    <p><i class="fa-solid fa-language"></i> <strong>Languages:</strong> ${langs}</p>
                    <p><i class="fa-solid fa-money-bill-wave"></i> <strong>Currencies:</strong> ${curs}</p>
                    <p><i class="fa-solid fa-clock"></i> <strong>Timezones:</strong> ${zones}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function filterData() {
    const searchTerm = searchInput.value.toLowerCase();
    const regionTerm = regionSelect.value;

    const filtered = allCountries.filter(country => {
        const nameMatches = country.name.common.toLowerCase().includes(searchTerm);
        const regionMatches = regionTerm === "all" || country.region === regionTerm;
        return nameMatches && regionMatches;
    });

    displayCountries(filtered);
}

searchInput.addEventListener("input", filterData);
regionSelect.addEventListener("change", filterData);

loadCountries();