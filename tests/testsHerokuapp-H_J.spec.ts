import { test, expect, Page, Locator } from '@playwright/test';
import { faker } from  '@faker-js/faker';
import { PageManager } from '../page-objects/pageManager';
import fs from 'fs';

let pm: PageManager

test.beforeEach(async ({ page }) => {
  pm = new PageManager(page)
  await page.goto('/');
  await expect(page).toHaveTitle('The Internet');
});

test.describe('Horizontal Slide Page', () => {  
    test.beforeEach(async ({ page }) => {
      await pm.navigateTo().horizontalSlidePage()
      await expect(page).toHaveURL('/horizontal_slider')
    });
  
    test('Horizontal Slide Page - Mouse Slide', async ({ page }) => {
      const sliderLabel = page.locator('#range')
      const slider = page.getByRole('slider')
      const box = await slider.boundingBox()
      const x = box!.x
      const y = box!.y + box!.height / 2
      
      await page.mouse.move(x, y)
      await page.mouse.down()
      await page.mouse.move(x + box!.width/2, y)
      await page.mouse.up() 
      await expect(sliderLabel).toHaveText('2.5')
    }) 
    
    test('Horizontal Slide Page - Keyboard Slide', async ({ page }) => {
      const sliderLabel = page.locator('#range')
      // Get a random number of clicks to do
      const numberOfClicks = Math.floor(Math.random() * 5) + 1
      let valueToCheck = (numberOfClicks/2 + 2.5).toString()
  
      await pm.onHorizontalSlidePage().moveSliderWithKeyboard('right', numberOfClicks)
      await expect(sliderLabel).toHaveText(valueToCheck)
    
      await pm.onHorizontalSlidePage().moveSliderWithKeyboard('left', numberOfClicks, false)
      await expect(sliderLabel).toHaveText('2.5') 
    })
})
  
test('Hovers Page', async ({ page }) => {
    await pm.navigateTo().hoversPage()

    const users = ['user1', 'user2', 'user3']

    for (const user of users) {
        await page.locator('.figure', {hasText: `${user}`}).hover()
        await page.locator('.figcaption', {hasText: `${user}`}).locator('a').click()
        await expect(page).toHaveURL(`/users/${users.indexOf(user)+1}`)
        await page.goto('/hovers')
    }
});

test('Infinite Scroll Page', async ({ page }) => {
await pm.navigateTo().infiniteScrollPage()
await expect(page).toHaveURL('/infinite_scroll')

// Scroll to the bottom:
const scrollsToDo = 25;
let scrollCount = 0;
let previousDivCount = 0;

/* Every time the page reaches the end, a new div element with class "jscroll-added" is added
    To ensure the page is infinite, we use a while loop to continuously scroll down
    Then count the number of current div elements with "jscroll-added"
    Finally compare that value with the previous checked div count
*/
while (scrollCount < scrollsToDo) {
    await page.evaluate(() => window.scrollBy(0, 2000))
    await page.waitForTimeout(250);
    let currentDivCount = (await page.locator('.jscroll-added').all()).length
    expect(currentDivCount).toBeGreaterThan(previousDivCount)
    scrollCount ++;
    }  
}); 

test.describe('Inputs Page', () => {
    test.beforeEach(async ({ page }) => {
        await pm.navigateTo().inputsPage()
        await expect(page).toHaveURL('/inputs')
    });

    test('Inputs Page - Type input with keyboard', async ({ page }) => {
        const inputBoxLocator = page.locator('input')
        // Generate random integer between 0 and 1000
        const numberToType = (Math.floor(Math.random() * 1001)).toString();
        
        await inputBoxLocator.click()
        await inputBoxLocator.pressSequentially(numberToType)
        await expect(inputBoxLocator).toHaveValue(numberToType)
    });

    test('Inputs Page - Do input with arrow clicks', async ({ page }) => {
        const inputBoxLocator = page.locator('input')
        // Generate random integer between 0 and 100
        const numberToType = Math.floor(Math.random() * 101)
        const numberToSubtract = Math.floor(Math.random() * 101)

        pm.onInputsPage().performClicks(numberToType, 'ArrowUp')
        await expect(inputBoxLocator).toHaveValue(numberToType.toString())

        pm.onInputsPage().performClicks(numberToSubtract, 'ArrowDown')
        await expect(inputBoxLocator).toHaveValue((numberToType - numberToSubtract).toString())
    });

    test('Inputs Page - Scientific Notation', async ({ page }) => {
        const inputBoxLocator = page.locator('input')
        const numberToType = '1.2e2'
        
        await inputBoxLocator.click()
        await inputBoxLocator.pressSequentially(numberToType)
        await expect(inputBoxLocator).toHaveValue(numberToType)
    });

    test('Inputs Page - Input text', async ({ page }) => {
        const inputBoxLocator = page.locator('input')
        const textToType = 'I want pizza'
        
        await inputBoxLocator.click()
        await inputBoxLocator.pressSequentially(textToType)
        await expect(inputBoxLocator).toHaveValue('')
    });
});

test.describe('JavaScript Alerts Page', () => {
    test.beforeEach(async ({ page }) => {
        await pm.navigateTo().javaScriptAlertsPage()
        await expect(page.locator('.example')).toContainText('JavaScript Alerts')
    });

    test('JavaScript Alerts Page - JS Alert', async ({ page }) => {
        await page.getByRole('button', { name: 'Click for JS Alert'}).click()
        await expect(page.locator('#result')).toHaveText('You successfully clicked an alert')
    })

    test('JavaScript Alerts Page - JS Confirm - "OK" Button', async ({ page }) => {
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'Click for JS Confirm'}).click()
        await expect(page.locator('#result')).toHaveText('You clicked: Ok')
    })

    test('JavaScript Alerts Page - JS Confirm - "Cancel" Button', async ({ page }) => {
        await page.getByRole('button', { name: 'Click for JS Confirm'}).click()
        await expect(page.locator('#result')).toHaveText('You clicked: Cancel')
    })

    test('JavaScript Alerts Page - JS Prompt', async ({ page }) => {
        const randomWord = faker.word.words(1)
        page.on('dialog', dialog => dialog.accept(randomWord));
        await page.getByRole('button', { name: 'Click for JS Prompt'}).click()
        await expect(page.locator('#result')).toHaveText(`You entered: ${randomWord}`)
    })
});

test.describe('JQuery UI Menus Page', () => {
    test.beforeEach(async ({ page }) => {
        await pm.navigateTo().jQueryUIMenusPage()
        await expect(page).toHaveURL('/jqueryui/menu')
    });

    test('JQuery UI Menus Page - "JQuery UI Menus" hypertext', async ({ page }) => {
        await page.getByRole('link', { name: 'JQuery UI Menus'}).click()
        await expect(page).toHaveURL('https://api.jqueryui.com/menu/')
    })

    test('JQuery UI Menus Page - "Back to JQuery UI" Button', async ({ page }) => {
        await pm.onJQueryUIMenusPage().clickOnBackToJQueryUIPage()
        await expect(page).toHaveURL('/jqueryui')

        await pm.onJQueryUIPage().clickOnMenuHypertext()
        await expect(page).toHaveURL('/jqueryui/menu')
    })

    test('JQuery UI Menus Page - "JQuery UI" hypertext', async ({ page }) => {
        await pm.onJQueryUIMenusPage().clickOnBackToJQueryUIPage()
        await expect(page).toHaveURL('/jqueryui')

        await pm.onJQueryUIPage().clickOnJQueryUIHypertext()
        await expect(page).toHaveURL('https://jqueryui.com/')
    })

    test('JQuery UI Menus Page - JQuery Menus - Download PDF', async ({ page }) => {
        const downloadedFile = await pm.onJQueryUIMenusPage().downloadFile('PDF')

        expect(fs.existsSync(downloadedFile)).toBeTruthy()
        fs.unlinkSync(downloadedFile)
        expect(fs.existsSync(downloadedFile)).toBeFalsy()
    })

    test('JQuery UI Menus Page - JQuery Menus - Download CSV', async ({ page }) => {
        const downloadedFile = await pm.onJQueryUIMenusPage().downloadFile('CSV')
        
        expect(fs.existsSync(downloadedFile)).toBeTruthy()
        fs.unlinkSync(downloadedFile)
        expect(fs.existsSync(downloadedFile)).toBeFalsy()
    })

    test('JQuery UI Menus Page - JQuery Menus - Download Excel', async ({ page }) => {
        const downloadedFile = await pm.onJQueryUIMenusPage().downloadFile('Excel')
        
        expect(fs.existsSync(downloadedFile)).toBeTruthy()
        fs.unlinkSync(downloadedFile)
        expect(fs.existsSync(downloadedFile)).toBeFalsy()
    })
});