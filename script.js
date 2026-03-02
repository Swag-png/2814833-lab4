async function searchCountry(countryName) {
    const spinner = document.getElementById("loading-spinner");
    const errorMessage = document.getElementById("error-message");
    const borderContainer = document.getElementById("bordering-countries");
    const countryInfo = document.getElementById("country-info");

    try {
        // Show loading spinner
        spinner.classList.remove("hidden");

        // Clear previous results
        countryInfo.innerHTML = "";
        borderContainer.innerHTML = "";
        errorMessage.textContent = "";

        // Fetch main country
        const response = await fetch(
            `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`
        );

        if (!response.ok) {
            throw new Error("Country Not Found!");
        }

        const data = await response.json();
        const country = data[0];

        // Update main country DOM
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

        // Fetch bordering countries
        if (!country.borders) {
            borderContainer.innerHTML = "<p>No bordering countries.</p>";
        } else {
            const borderCountries = [];

            // Fetch each border country individually
            for (const code of country.borders) {
                const borderResponse = await fetch(
                    `https://restcountries.com/v3.1/alpha/${code}`
                );
                if (!borderResponse.ok) continue;

                const borderData = await borderResponse.json();
                borderCountries.push(borderData[0]);
            }

            // Update bordering countries section WITHOUT using divs
            borderContainer.innerHTML = borderCountries
                .map(border => `
                    <h4>${border.name.common}</h4>
                    <img src="${border.flags.svg}" width="100" alt="${border.name.common} flag">
                `)
                .join("");
        }

    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        // Hide loading spinner
        spinner.classList.add("hidden");
    }
}

// Event listener
document.getElementById("search-btn").addEventListener("click", () => {
    const country = document.getElementById("country-input").value;
    searchCountry(country);
});