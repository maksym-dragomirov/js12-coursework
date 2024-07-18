export class BasePage {
    #tabsContainer
    #tabsList
    #tabsContent

    constructor() {
        this.#tabsContainer = document.querySelector('.tabs');
        this.#tabsList = document.querySelectorAll('.tabLink');
        this.#tabsContent = document.querySelectorAll('.tabContent');

        this.#tabsContainer.addEventListener('click', this.#tabSwitch.bind(this));

        this.#initializeTabs();
    }

    #initializeTabs() {
        if (this.#tabsList.length > 0 && this.#tabsContent.length > 0) {
            this.#tabsContent[0].classList.remove('hiddenTab');
            for (let i = 1; i < this.#tabsContent.length; i++) {
                this.#tabsContent[i].classList.add('hiddenTab');
            }
        }
    }

    #tabSwitch = (event) => {
        if (event.target.classList.contains('tabLink')) {
            this.#tabsContent.forEach(content => {
                content.classList.add('hiddenTab');
            });

            const tabName = event.target.getAttribute('data-test');
            document.getElementById(tabName).classList.remove('hiddenTab');
        }
    }
}