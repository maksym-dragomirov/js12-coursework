export class DateCalculation {
    #startDate;
    #endDate;
    #daysRangePreset;
    #dayType;
    #unitType;
    #dateDifferenceContainer;
    #calculateResultsBtn;
    #generalResult;

    constructor() {
        this.#startDate = document.querySelector('.startDate');
        this.#endDate = document.querySelector('.endDate');
        this.#daysRangePreset = document.querySelector('.daysRangePreset');
        this.#dayType = document.querySelector('.dayType');
        this.#unitType = document.querySelector('.unitType');
        this.#dateDifferenceContainer = document.querySelector('.dateDifference');
        this.#calculateResultsBtn = document.querySelector('.calculateResults');
        this.#generalResult = document.querySelector('.dateResult');

        this.#startDate.addEventListener('change', this.#setStartDateCalculation.bind(this));
        this.#endDate.addEventListener('change', this.#setEndDateCalculation.bind(this));
        this.#daysRangePreset.addEventListener('change', this.#setDaysRangePreset.bind(this));
        this.#dayType.addEventListener('change', this.#calculateDayType.bind(this));
        this.#unitType.addEventListener('change', this.#calculateUnitType.bind(this));
        this.#calculateResultsBtn.addEventListener('click', () => {
            this.#calculateDateDifference.bind(this);
            this.#saveDateInLocalStorage();
        });
        this.#dateDifferenceContainer.addEventListener('change', this.#verifyFormCompletion.bind(this));

        this.#verifyFormCompletion();
        this.#loadDateFromLocalStorage();
    }

    #setStartDateCalculation() {
        let startDate = this.#startDate.value;
        this.#endDate.min = startDate;
        return startDate;
    }

    #setEndDateCalculation() {
        let endDate = this.#endDate.value;
        this.#startDate.max = endDate;
        return endDate;
    }

    #formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    #setDaysRangePreset() {
        let dayRangePreset = parseInt(this.#daysRangePreset.value);
        if (!isNaN(dayRangePreset)) {
            let startDate = new Date(this.#startDate.value);
            if (isNaN(startDate.getTime())) {
                alert('Будь ласка оберіть початкову дату');
                this.#daysRangePreset.value = 'default';
                return;
            }
            let endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + dayRangePreset);
            this.#endDate.value = this.#formatDate(endDate);
        }
    }

    #calculateWorkingDays(startDate, endDate) {
        let calculatedWorkingDays = 0;
        for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            let day = currentDate.getDay();
            if (day !== 0 && day !== 6) {
                calculatedWorkingDays++;
            }
        }
        return calculatedWorkingDays;
    }

    #calculateWeekendDays(startDate, endDate) {
        let calculatedWeekendDays = 0;
        for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            let day = currentDate.getDay();
            if (day === 0 || day === 6) {
                calculatedWeekendDays++;
            }
        }
        return calculatedWeekendDays;
    }

    #calculateDayType() {
        const startDate = new Date(this.#startDate.value);
        const endDate = new Date(this.#endDate.value);
        const dayType = this.#dayType.value;
        const dayDifference = endDate - startDate
        let dayTypeResult;

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            alert('Будь ласка оберіть початкову та кінцеву дату');
            return this.#dayType.value = 'default';
        }

        switch (dayType) {
            case 'allDays':
                dayTypeResult = dayDifference / (1000 * 60 * 60 * 24) + 1;
                break;
            case 'workingDays':
                dayTypeResult = this.#calculateWorkingDays(startDate, endDate);
                break;
            case 'weekendDays':
                dayTypeResult = this.#calculateWeekendDays(startDate, endDate);
                break;
            default:
                alert('Неправильний тип дня.')
        }

        return dayTypeResult;
    }

    #calculateUnitType() {
        const dayTypeResult = this.#calculateDayType();
        const unitType = this.#unitType.value;
        let unitTypeResult;

        if (isNaN(dayTypeResult)) {
            return this.#unitType.value = 'default';
        }

        switch (unitType) {
            case 'days':
                unitTypeResult = dayTypeResult;
                break;
            case 'hours':
                unitTypeResult = dayTypeResult * 24;
                break;
            case 'minutes':
                unitTypeResult = dayTypeResult * 24 * 60;
                break;
            case 'seconds':
                unitTypeResult = dayTypeResult * 24 * 60 * 60;
                break;
            default:
                alert('Неправильний тип одиниці вимірювання.')
        }

        return unitTypeResult;
    }

    #calculateDateDifference() {
        const startDate = new Date(this.#startDate.value);
        const endDate = new Date(this.#endDate.value);
        const unitType = this.#unitType.value;
        const unitTypeResult = this.#calculateUnitType();

        let unitTypeText;
        if (unitType === 'days') {
            unitTypeText = 'днів';
        } else if (unitType === 'hours') {
            unitTypeText = 'годин';
        } else if (unitType === 'minutes') {
            unitTypeText = 'хвилин';
        } else {
            unitTypeText = 'секунд';
        }

        this.#generalResult.textContent = `Результат обрахунку: ${unitTypeResult} ${unitTypeText}`;

        let resultsTable = document.querySelector(".resultsTable").getElementsByTagName("tbody")[0];
        let tableRow = resultsTable.insertRow(0);
        tableRow.insertCell(0).innerHTML = this.#formatDate(startDate);
        tableRow.insertCell(1).innerHTML = this.#formatDate(endDate);
        tableRow.insertCell(2).innerHTML = `${unitTypeResult} ${unitTypeText}`;

        if (resultsTable.rows.length > 10) {
            resultsTable.deleteRow(10);
        }

        return {
            startDate: this.#formatDate(startDate),
            endDate: this.#formatDate(endDate),
            unitType: unitType,
            unitTypeResult: unitTypeResult
        };
    }

    #verifyFormCompletion() {
        const dayType = this.#dayType.value;
        const unitType = this.#unitType.value;

        if (dayType !== 'default' && unitType !== 'default') {
            this.#calculateResultsBtn.disabled = false;
            this.#calculateResultsBtn.classList.add('enabled');

        } else {
            this.#calculateResultsBtn.disabled = true;
            this.#calculateResultsBtn.classList.add('disabled');
        }
    }

    #saveDateInLocalStorage() {
        const dates = this.#calculateDateDifference();
        if (dates) {
            const date = localStorage.getItem('date') !== null
                ? JSON.parse(localStorage.getItem('date')) : [];
            date.push(dates);
            if (date.length > 10) {
                date.shift();
            }
            localStorage.setItem('date', JSON.stringify(date));
        }
    }

    #loadDateFromLocalStorage() {
        const dates = localStorage.getItem('date') !== null
            ? JSON.parse(localStorage.getItem('date')) : [];

        let resultsTable = document.querySelector(".resultsTable").getElementsByTagName("tbody")[0];

        dates.reverse();
        dates.forEach(date => {
            let unitTypeText;
            if (date.unitType === 'days') {
                unitTypeText = 'днів';
            } else if (date.unitType === 'hours') {
                unitTypeText = 'годин';
            } else if (date.unitType === 'minutes') {
                unitTypeText = 'хвилин';
            } else {
                unitTypeText = 'секунд';
            }

            let tableRow = resultsTable.insertRow();
            tableRow.insertCell(0).innerHTML = date.startDate;
            tableRow.insertCell(1).innerHTML = date.endDate;
            tableRow.insertCell(2).innerHTML = `${date.unitTypeResult} ${unitTypeText}`;
        })
    }
}
