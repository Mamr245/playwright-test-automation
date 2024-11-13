import { test, expect } from '@playwright/test';
import { faker } from  '@faker-js/faker';
import { PageManager } from '../page-objects/pageManager';
import fs from 'fs';

let pm: PageManager

test.beforeEach(async ({ page }) => {
  pm = new PageManager(page)
  await page.goto('/');
  await expect(page).toHaveTitle('The Internet');
});

test('Key Presses Page', async ({ page }) => {
  pm.navigateTo().keyPressesPage()

  const randomWord = faker.word.words(1)
  const textbox = page.locator('#target')
  for (const letter of randomWord) {
    await textbox.pressSequentially(letter)
    await expect(page.locator('#result')).toHaveText(`You entered: ${letter.toUpperCase()}`)
  };
});

test.describe('Large & Deep DOM Page', () => {
  test('Large & Deep DOM Page - Validate sibling', async ({ page }) => {
    await pm.navigateTo().largeAndDeepDOMPage()
    
    // Validate sibling from "Siblings" section
    const siblingToGet = await pm.onLargeAndDeepDOMPage().defineSiblingToGet()
    const obtainedSibling = await pm.onLargeAndDeepDOMPage().getSibling(siblingToGet)
    expect(siblingToGet).toEqual(obtainedSibling)
  })

  test('Large & Deep DOM Page - Validate table', async ({ page }) => {
    await pm.navigateTo().largeAndDeepDOMPage()

    // Validate value from table
    const siblingToGetFromTable = await pm.onLargeAndDeepDOMPage().defineSiblingToGet('forTable')
    const obtainedSiblingFromTable = await pm.onLargeAndDeepDOMPage().getValueFromTable(siblingToGetFromTable)
    expect(siblingToGetFromTable).toEqual(obtainedSiblingFromTable)    
  })
});

test('Multiple Windows Page', async ({ page, context }) => {
  pm.navigateTo().multipleWindowsPage()
  
  // Open new tab
  const pagePromise = context.waitForEvent('page');
  await page.getByRole('link', { name: 'Click Here'}).click()
  const newPage = await pagePromise;

  // Validate new tab and close it
  await expect(newPage).toHaveURL('/windows/new')
  await expect(newPage.getByText('New Window')).toBeVisible()
  await newPage.close()

  // Validate the right tab has been closed
  const openPages = context.pages();
  expect(openPages.length).toEqual(1)
  await expect(openPages[0].getByText('Opening a new window')).toBeVisible()
});

test('Notification Message Page', async ({ page }) => {
  pm.navigateTo().notificationMessagePage()

  const notificationLocator = page.locator('#flash')
  for (let i = 0; i < 3; i++) {
    notificationLocator.click()
    await expect(notificationLocator).toHaveText(/(Action successful|Action unsuccesful, please try again)/);
    await page.getByRole('link', { name: 'Click here'}).click()
  }
});

test('Redirect Link Page', async ({ page }) => {
  await pm.navigateTo().redirectLinkPage()
  await expect(page.locator('.example')).toContainText('This is separate from directly returning a redirection status code')

  await page.getByRole('link', {name: 'here'}).click()
  await expect(page).toHaveURL('/status_codes')
});

test('Typos Page', async ({ page }) => {
  await pm.navigateTo().typosPage()

  await expect(page.locator(':text("Typos")')).toBeVisible()

  const expectedFirstSentence = "This example demonstrates a typo being introduced. It does it randomly on each page load."
  const expectedSecondSentence = "Sometimes you'll see a typo, other times you won't."
  const firstSentence =  page.locator('p').first()
  const secondSentence = page.locator('p').last()

  await expect(firstSentence).toHaveText(expectedFirstSentence)
  await expect(secondSentence).toHaveText(expectedSecondSentence)
});

test.describe('Secure File Download Page', () => {
  test('Secure File Download Page - Download File', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'admin'
      }
    });
    const page = await context.newPage();
    await page.goto('/download_secure');
    
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('link', { name: 'LambdaTest.txt'}).click()
    const download = await downloadPromise

    const filePath = `./downloads/${download.suggestedFilename()}`
    await download.saveAs(filePath)

    expect(fs.existsSync(filePath)).toBeTruthy()
    fs.unlinkSync(filePath)
    expect(fs.existsSync(filePath)).toBeFalsy()
  });


  test('Secure File Download Page - Invalid Username', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: {
        username: 'invalidUsername',
        password: 'admin'
      }
    });
    const page = await context.newPage();
    await page.goto('/download_secure');
    await expect(page.locator('body')).toContainText('Not authorized');
  });

  test('Secure File Download Page - Invalid Password', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'invalidPassword'
      }
    });
    const page = await context.newPage();
    await page.goto('/download_secure');
    await expect(page.locator('body')).toContainText('Not authorized');
  });
});

test('Shadow DOM Page', async ({ page }) => {
  await pm.navigateTo().shadowDOMPage()
  await expect(page).toHaveURL('/shadowdom')

  await expect(page.locator('span[slot="my-text"]')).toHaveText("Let's have some different text!")
  await expect(page.locator('li').first()).toHaveText("Let's have some different text!")
  await expect(page.locator('li').last()).toHaveText("In a list!")
})

test.only('Shifting Content Page - List', async ({ page }) => {
  const itemsToValidate = [
    'Et numquam et aliquam.',
    'Important Information You\'re Looking For', 
    'Vel aliquid dolores veniam enim nesciunt libero quaerat.',
    'Sed deleniti blanditiis odio laudantium.', 
    'Nesciunt autem eum odit fuga tempora deleniti.']

  await pm.navigateTo().shiftingContentPage()
  await expect(page).toHaveURL('/shifting_content')

  await page.getByRole('link' , { name: 'Example 3: List'}).click()
  await expect(page).toHaveURL('/shifting_content/list')
  const listItems = await page.locator('[class="large-6 columns large-centered"]').textContent()

  for (const itemToValidate of itemsToValidate) {
    expect(listItems).toContain(itemToValidate)
  }
});

test('Slow Resources Page', async ({ page }) => {
  test.setTimeout(60000);

  await pm.navigateTo().slowResourcesPage()
  await expect(page).toHaveURL('/slow')
  
  const responsePromise = page.waitForResponse(`/slow_external`)
  const response = await responsePromise;
  expect(response.status()).toBe(200)
  
});

test.describe('Status Codes Page', () => {
  test.beforeEach(async ({ page }) => {
    await pm.navigateTo().statusCodesPage()
    await expect(page).toHaveURL('/status_codes')
  });

  test('Status Codes Page - "Here" hyperlink', async ({ page }) => {
    await page.getByRole('link', {name: 'here'}).click()
    await expect(page).toHaveURL('http://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml')
  })

  const statusCodesToTest = ['200','301','404','500']
  statusCodesToTest.forEach((statusCodeToTest) => {
    test(`Status Codes Page - Status code ${statusCodeToTest}`, async ({ page }) => {
      const responsePromise = page.waitForResponse(`/status_codes/${statusCodeToTest}`)
      await page.getByRole('link', {name: statusCodeToTest}).click()
      await expect(page).toHaveURL(`/status_codes/${statusCodeToTest}`)
  
      const response = await responsePromise;
      expect(response.status()).toEqual(parseInt(statusCodeToTest))
    });
  });
});
