import { Page } from "@playwright/test";

export class JQueryUIPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Clicks on "Menu" and changes page
     */
    async clickOnMenuHypertext() {
        await this.page.getByRole('link', { name: 'menu'}).click()
    }

    /**
     * Clicks on "JQuery UI" and changes page
     */
    async clickOnJQueryUIHypertext() {
        await this.page.getByRole('link', { name: 'JQuery UI'}).click()
    }
}