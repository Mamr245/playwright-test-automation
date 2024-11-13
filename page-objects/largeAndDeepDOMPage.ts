import { Page } from "@playwright/test";

export class LargeAndDeepDOM {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Looks for the desired sibling
     * @param siblingToGet - sibling to get
     */
    async getSibling(siblingToGet: string) {
        return await this.page.locator(`[id="sibling-${siblingToGet}"]`).textContent()
    }

    /**
     * Looks for the desired value from table
     * @param valueToGet - value to get from table
     */
    async getValueFromTable(valueToGet: string) {
        const rowNumber = valueToGet.split('.')[0]
        const columnNumber = valueToGet.split('.')[1]
        return await this.page.locator('[id="large-table"]').locator(`[class="row-${rowNumber}"]`).locator(`[class="column-${columnNumber}"]`).textContent()
    }


    /**
     * Defines a random value to be used in the tests
     * @param forWhere - if passed as "forTable", gets data to validate the page's table 
     */
    async defineSiblingToGet(forWhere = 'outsideSiblings') {     
        if (forWhere != 'forTable') {
            const firstValue = this.getRandomInt(1, 50).toString()
            const secondValue = this.getRandomInt(1, 4).toString()
            const siblingToGet = firstValue.concat('.', secondValue)
            return siblingToGet 
        }
        const firstValue = this.getRandomInt(1, 50).toString()
        const secondValue = this.getRandomInt(1, 50).toString()
        const siblingToGetFromTable = firstValue.concat('.', secondValue)
        return siblingToGetFromTable 
    }

    // Returns a random integer between a selected interval
    private getRandomInt(min: number, max: number) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }
}