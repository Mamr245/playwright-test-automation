import { Page } from "@playwright/test";
import { LandingPage } from "./landingPage";
import { AddRemoveElementsPage } from "./addRemoveElementsPage";
import { FormAuthenticationPage } from "./formAuthenticationPage";
import { ChallengingDOMPage } from "./challengingDOMPage";
import { LargeAndDeepDOM } from "./largeAndDeepDOMPage";
import { JQueryUIMenusPage } from "./jQueryUIMenusPage";
import { JQueryUIPage } from "./jQueryUIPage";
import { HorizontalSlidePage } from "./horizontalSlidePage";
import { InputsPage } from "./inputsPage";

export class PageManager {

    private readonly page: Page
    private readonly landingPage: LandingPage
    private readonly addRemoveElementsPage: AddRemoveElementsPage
    private readonly formAuthenticationPage: FormAuthenticationPage
    private readonly challengingDOMPage: ChallengingDOMPage
    private readonly largeAndDeepDOMPage: LargeAndDeepDOM
    private readonly jQueryUIMenusPage: JQueryUIMenusPage
    private readonly jQueryUIPage: JQueryUIPage
    private readonly horizontalSlidePage: HorizontalSlidePage
    private readonly inputsPage: InputsPage

    constructor(page: Page) {
        this.page = page
        this.landingPage = new LandingPage(this.page)
        this.addRemoveElementsPage = new AddRemoveElementsPage(this.page)
        this.formAuthenticationPage = new FormAuthenticationPage(this.page)
        this.challengingDOMPage = new ChallengingDOMPage(this.page)
        this.largeAndDeepDOMPage = new LargeAndDeepDOM(this.page)
        this.jQueryUIMenusPage = new JQueryUIMenusPage(this.page)
        this.jQueryUIPage = new JQueryUIPage(this.page)
        this.horizontalSlidePage = new HorizontalSlidePage(this.page)
        this.inputsPage = new InputsPage(page)

    }

    navigateTo() {
        return this.landingPage
    }

    onAddRemoveElementsPage() {
        return this.addRemoveElementsPage
    }

    onFormAuthenticationPage() {
        return this.formAuthenticationPage
    }

    onChallengingDOMPage() {
        return this.challengingDOMPage
    }

    onLargeAndDeepDOMPage() {
        return this.largeAndDeepDOMPage
    }

    onJQueryUIMenusPage() {
        return this.jQueryUIMenusPage
    }

    onJQueryUIPage() {
        return this.jQueryUIPage
    }

    onHorizontalSlidePage() {
        return this.horizontalSlidePage
    }

    onInputsPage() {
        return this.inputsPage
    }
}