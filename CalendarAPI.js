import {
    BASE_URL,
    HOLIDAYS_URL,
    COUNTRIES_URL,
    API_KEY
} from './constants.js';

export class CalendarAPI {
    #apiKey
    #holidaysUrl
    #countriesUrl
    #isLoading
    #abortController
    #baseUrl
    #selectedCountry
    #selectedYear
    #isCountriesListLoaded
    #holidays
    #pageContainer

    constructor() {
        this.#apiKey = API_KEY;
        this.#holidaysUrl = HOLIDAYS_URL;
        this.#countriesUrl = COUNTRIES_URL;
        this.#baseUrl = BASE_URL;
        this.#isLoading = false;
        this.#abortController = null;
        this.#selectedCountry = document.querySelector('.selectedCountry');
        this.#selectedYear = document.querySelector('.selectedYear');
        this.#holidays = document.querySelector('.holidays');
        this.#isCountriesListLoaded = false;
        this.#pageContainer = document.querySelector('.holidaysTab');

        if (this.#holidays) {
            this.#holidays.addEventListener('click', async () => {
                    if (!this.#isCountriesListLoaded) {
                        await this.#returnCountriesToUser();
                        await this.#fillYearsDropDown();
                        this.#isCountriesListLoaded = true;
                    }
                }
            )
        }
        this.#selectedCountry.addEventListener('change', this.#showHolidaysTable);
        this.#selectedYear.addEventListener('change', this.#showHolidaysTable);
        this.#pageContainer.addEventListener('change', this.#verifyCountrySelection.bind(this));
        this.#verifyCountrySelection();
    }

    #getCountries = async () => {
        this.#isLoading = true;
        let data;

        const abortController = new AbortController();
        if (this.#abortController) {
            this.#abortController.abort();
        }

        const signal = await abortController.signal;
        this.#abortController = abortController;

        try {
            const response = await fetch(`${this.#baseUrl}/${this.#countriesUrl}?api_key=${this.#apiKey}`, {
                signal
            });
            if (response.ok) {
                data = await response.json();
                console.log(data);
                return data.response.countries;
            } else {
                if (response.status === 404) throw new Error('404, Not Found');
                if (response.status === 500) throw new Error('500, Internal Server Error');
                throw new Error(response.status);
            }
        } catch (error) {
            alert(`Упс, не вдалося отримати список країн.`);
            throw new Error(error);
        } finally {
            this.#isLoading = false;
        }
    }

    #fillCountriesDropDown = async (countries) => {
        countries.forEach(country => {
            const countryOption = document.createElement('option');
            countryOption.value = country['iso-3166'];
            countryOption.text = country['country_name'];
            this.#selectedCountry.appendChild(countryOption);
        })
    }

    #returnCountriesToUser = async () => {
        const countries = await this.#getCountries();
        await this.#fillCountriesDropDown(countries);
    }

    #fillYearsDropDown = async () => {
            for (let year = 2001; year <= 2049; year += 1) {
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const yearOption = document.createElement('option');
                yearOption.value = year.toString();
                yearOption.text = year.toString();
                this.#selectedYear.appendChild(yearOption);
                if (year === currentYear) {
                   yearOption.selected = true;
                }
            }
    }

    #getHolidays = async () => {
        this.#isLoading = true;
        let country = this.#selectedCountry.value;
        let year = this.#selectedYear.value;
        let data;

        const abortController = new AbortController();
        if (this.#abortController) {
            this.#abortController.abort();
        }

        const signal = await abortController.signal;
        this.#abortController = abortController;

        try {
            const response = await fetch(`${this.#baseUrl}/${this.#holidaysUrl}?api_key=${this.#apiKey}&country=${country}&year=${year}`, {
                signal
            });
            if (response.ok) {
                data = await response.json();
                console.log(data);
                return data.response.holidays;
            } else {
                if (response.status === 404) throw new Error('404, Not Found');
                if (response.status === 500) throw new Error('500, Internal Server Error');
                throw new Error(response.status);
            }
        } catch (error) {
            alert(`Упс, не вдалося отримати список свят.`);
            throw new Error(error);
        } finally {
            this.#isLoading = false;
        }
    }

    #formatDate(date) {
        const regex = /^(\d{4}-\d{2}-\d{2})/;
        const match = date.match(regex);
        return match ? match[1] : date;
    }

    #renderHolidaysTable = async (holidays) => {
        if (this.#selectedCountry.value !== 'default' && this.#selectedYear.value !== null) {
            let resultsTable = document.querySelector(".holidaysTable").getElementsByTagName("tbody")[0];
            resultsTable.innerHTML = '';
            holidays.forEach(holiday => {
                let tableRow = resultsTable.insertRow(0);
                tableRow.insertCell(0).innerHTML = holiday['name'];
                tableRow.insertCell(1).innerHTML = this.#formatDate(holiday.date['iso']);
            })
        }
    }

    #showHolidaysTable = async () => {
        let holidays = await this.#getHolidays();
        await this.#renderHolidaysTable(holidays);
    }

    #verifyCountrySelection() {
            let selectedCountry = this.#selectedCountry.value;
            let yearDropDown = this.#selectedYear;

            if (selectedCountry === 'default') {
                return yearDropDown.disabled = true;
            } else {
                return yearDropDown.disabled = false;
            }
    }
}
