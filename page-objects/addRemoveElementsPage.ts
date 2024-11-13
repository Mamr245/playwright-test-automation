import { Page } from "@playwright/test";

export class AddRemoveElementsPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Add elements on this page
     * @param numberOfElementsToAdd - Number of elements to add
     */
    async addElements(numberOfElementsToAdd: number) {
        for (let i = 0; i < numberOfElementsToAdd; i++) {
            await this.page.getByText('Add Element').click()
        }
    }

    /**
     * Remove elements from this page
     * @param numberOfElementsToRemove - Number of elements to remove
     */
    async removeElements(numberOfElementsToRemove: number) {
        for (let i = 0; i < numberOfElementsToRemove; i++) {
            await this.page.getByText('Delete').first().click()
        }
    }
}