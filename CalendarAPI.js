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
    constructor() {
        this.#apiKey = API_KEY;
        this.#holidaysUrl = HOLIDAYS_URL;
        this.#countriesUrl = COUNTRIES_URL;
        this.#baseUrl = BASE_URL;
        this.#isLoading = false;
        this.#abortController = null;
    }

    #getCountries = async () => {
        this.#isLoading = true;

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
            return await response.json();
        } catch (error) {
            throw new Error(error);
        } finally {
            this.#isLoading = false;
        }
    }

    #getHolidays = async (country, year) => {
        this.#isLoading = true;

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
            return await response.json();
        } catch (error) {
            throw new Error(error);
        } finally {
            this.#isLoading = false;
        }
    }
}

