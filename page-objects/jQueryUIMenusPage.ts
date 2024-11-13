import { Page } from "@playwright/test";

export class JQueryUIMenusPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Clicks "Back To JQuery UI" and changes page
     */
    async clickOnBackToJQueryUIPage() {
        await this.page.getByRole('link', { name: 'Enabled'}).hover()
        await this.page.getByText('Back to JQuery UI').click()
    }

    /**
     * Downloads the choosen file
     * @param fileToDownload - indicates which file to download 
     */
    async downloadFile(fileToDownload: string) {
        const downloadPromise = this.page.waitForEvent('download');
        await this.page.getByRole('link', { name: 'Enabled'}).hover()
        await this.page.getByRole('link', { name: 'Downloads'}).hover() 
        await this.page.getByRole('link', { name: fileToDownload}).click()
        const download = await downloadPromise

        const filePath = `./downloads/${download.suggestedFilename()}`
        await download.saveAs(filePath)

        return filePath
    }
}