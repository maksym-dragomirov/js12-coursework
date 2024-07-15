import { READY_STATE_INTERACTIVE, READY_STATE_COMPLETE } from './constants.js';
import { CalendarAPI } from './CalendarAPI.js';
import { DateCalculation } from './DateCalculation.js';
import { BasePage } from './BasePage.js';


(() => {
    const readyState = document.readyState;
    if (readyState === READY_STATE_COMPLETE || readyState === READY_STATE_INTERACTIVE) {
        new DateCalculation();
        new CalendarAPI();
        new BasePage();
    } else {
        window.addEventListener('DOMContentLoaded', (event) => {
            event.preventDefault();
            new DateCalculation();
            new CalendarAPI();
            new BasePage();
        })
    }
})();