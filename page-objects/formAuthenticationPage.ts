import { Page } from "@playwright/test";

export class FormAuthenticationPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Fills the username and password textboxes and clicks on the "Login" button
     * @param username - Username to enter
     * @param password - Password to enter
     */
    async loginWithUsernameAndPassword(username: string, password: string) {
        await this.page.getByRole('textbox', {name: 'Username'}).fill(username)
        await this.page.getByRole('textbox', {name: 'Password'}).fill(password)
        await this.page.getByRole('button', {name: 'Login'}).click()
    }
}