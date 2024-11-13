import { Locator, Page } from "@playwright/test";

export class ChallengingDOMPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Clicks on a chosen button the number of pretend times
     * @param button - button locator (e.g: [class=".button alert"])
     * @param numberOfTimes - number of times to perform the click
     */
    async clickButtonSeveralTimes(buttonLocator: string, numberOfTimes: number) {
        for (let i = 0; i < numberOfTimes; i++) {
            await this.page.locator(buttonLocator).click()
        }
    }

    /**
     * Delete the chosen row
     * @param rowNumber - row to delete
     */
    async deleteTableRow(rowNumber: number) {
        await this.page.locator('table tr').nth(rowNumber).locator('a[href="#delete"]').click()    
    }

    /**
     * Edit the chosen row
     * @param rowNumber - row to edit
     */
    async editTableRow(rowNumber: number) {
        await this.page.locator('table tr').nth(rowNumber).locator('a[href="#edit"]').click()
    }
}