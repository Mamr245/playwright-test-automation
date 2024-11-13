import { Page } from "@playwright/test";

export class HorizontalSlidePage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * Moves slider to left or right with keyboard presses 
     * @param sideToSlide - defines if slider goes to the left or to the right
     * @param numberOfclicks - defines how many clicks to perform
     * @param clickOnSlider - (OPTIONAL) determines if playwright should perform a click on the slider before setting the value
     */
    async moveSliderWithKeyboard(sideToSlide: string, numberOfclicks: number, clickOnSlider?: boolean) {
        if (clickOnSlider != false) {
            await this.page.getByRole('slider').click()
        }
        if (sideToSlide.toLowerCase() == 'left') {
            for (let i = 0; i < numberOfclicks; i++) {
                await this.page.keyboard.press('ArrowLeft')
            }
        }
        else {
            for (let i = 0; i < numberOfclicks; i++) {
                await this.page.keyboard.press('ArrowRight')
            }
        }
    }

        /**
     * Moves slider to left or right 
     * @param sideToSlide - defines if slider goes to the left or to the right
     * @param numberOfclicks - defines how many clicks to perform
     */
        async moveSliderWithMouse(sideToSlide: string, numberOfclicks: number) { 
            const slider = this.page.getByRole('slider')
            const box = await slider.boundingBox()
            const x = box.x
            const y = box.y + box.height / 2
            
            await this.page.mouse.move(x, y)
            await this.page.mouse.down()
            await this.page.mouse.move(x, y)

            
        }      
}
