import { Page } from "@playwright/test";

export class InputsPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Performs a number of clicks of a certain key
     * @param clicksToDo - Number of clicks to perform
     * @param keyToPress - The key to press
     */
    async performClicks(clicksToDo: number, keyToPress: string) {
        for (let i = 0; i < clicksToDo; i++) {
            await this.page.keyboard.press(keyToPress)
         }
    }
}