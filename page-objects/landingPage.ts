import { Page } from "@playwright/test";

export class LandingPage {

    private readonly page: Page
    
    constructor(page: Page) {
        this.page = page
    }

    async abTestingPage() {
        await this.page.getByText('A/B Testing').click()
    }

    async addRemoveElementsPage() {
        await this.page.getByText('Add/Remove Elements').click()
    }

    async checkboxesPage() {
        await this.page.getByText('Checkboxes').click()
    }

    async dropdownPage() {
        await this.page.getByText('Dropdown').click()
    }

    async formAuthenticationPage() {
        await this.page.getByText('Form Authentication').click()
    }

    async typosPage() {
        await this.page.getByText('Typos').click()
    }

    async conxtextMenuPage() {
        await this.page.getByText('Context Menu').click()
    }

    async hoversPage() {
        await this.page.getByText('Hovers').click()
    }
 
    async challengingDOMPage() {
        await this.page.getByText('Challenging DOM').click()
    }

    async basicAuthPage() {
        await this.page.getByText('Basic Auth').click()
    }

    async largeAndDeepDOMPage() {
        await this.page.getByText('Large & Deep DOM').click()
    }

    async statusCodesPage() {
        await this.page.getByText('Status Codes').click()
    }

    async multipleWindowsPage() {
        await this.page.getByText('Multiple Windows').click()
    }

    async floatingMenuPage() {
        await this.page.getByText('Floating Menu').click()
    }

    async entryAdPage() {
        await this.page.getByText('Entry Ad').click()
    }
    async dragAndDropPage() {
        await this.page.getByText('Drag and Drop').click()
    }

    async notificationMessagePage() {
        await this.page.getByText('Notification Messages').click()
    }

    async javaScriptAlertsPage() {
        await this.page.getByText('JavaScript Alerts').click()
    }

    async keyPressesPage() {
        await this.page.getByText('Key Presses').click()
    }

    async brokenImagesPage() {
        await this.page.getByText('Broken Images').click()
    }

    async jQueryUIMenusPage() {
        await this.page.getByText('JQuery UI Menus').click()
    }
    
    async fileDownloadPage() {
        await this.page.locator('[href="/download"]').click()
    } 
    
    async dynamicControlsPage() {
        await this.page.getByText('Dynamic Controls').click()
    } 
    
    async slowResourcesPage() {
        await this.page.getByText('Slow Resources').click()
    } 

    async disappearingElementsPage() {
        await this.page.getByText('Disappearing Elements').click()
    } 

    async redirectLinkPage() {
        await this.page.getByText('Redirect Link').click()
    } 

    async fileUploadPage() {
        await this.page.getByText('File Upload').click()
    } 

    async exitIntentPage() {
        await this.page.getByText('Exit Intent').click()
    } 

    async infiniteScrollPage() {
        await this.page.getByText('Infinite Scroll').click()
    } 

    async dynamicContentPage() {
        await this.page.getByText('Dynamic Content').click()
    } 

    async forgotPasswordPage() {
        await this.page.getByText('Forgot Password').click()
    }
    
    async dynamicLoadingPage() {
        await this.page.getByText('Dynamic Loading').click()
    } 

    async horizontalSlidePage() {
        await this.page.getByText('Horizontal Slide').click()
    } 

    async shiftingContentPage() {
        await this.page.getByText('Shifting Content').click()
    } 

    async shadowDOMPage() {
        await this.page.getByText('Shadow DOM').click()
    }
    
    async inputsPage() {
        await this.page.getByText('Inputs').click()
    } 
}