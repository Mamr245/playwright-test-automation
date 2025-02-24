import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

let pm: PageManager

test.beforeEach(async ({ page }) => {
  pm = new PageManager(page)
  await page.goto('/');
  await expect(page).toHaveTitle('The Internet');
});

test('Disappearing Elements Page', async ({ page }) => {
  const elementsToCheck = ['Home','About','Contact Us','Portfolio','Gallery']
  await pm.navigateTo().disappearingElementsPage()

  for (let elementToCheck of elementsToCheck) {
    await expect(page.getByRole('link', {name: `${elementToCheck}`})).toBeVisible()
  }
});

test('Drag and Drop Page', async ({ page }) => {
  pm.navigateTo().dragAndDropPage()

  await expect(page.locator('#column-a')).toBeVisible()
  await expect(page.locator('#column-b')).toBeVisible()

  await page.locator('#column-a').dragTo(page.locator('#column-b'));
  await expect(page.locator('#columns .column').first()).toHaveText('B')

  await page.locator('#column-b').dragTo(page.locator('#column-a'));
  await expect(page.locator('#columns .column').first()).toHaveText('A')
});

test('Dropdown Page', async ({ page }) => {
  await pm.navigateTo().dropdownPage()

  await page.locator('#dropdown').selectOption({value: '1'})
  await expect(page.locator(':text("Option 1")')).toHaveAttribute('selected','selected')

  await page.locator('#dropdown').selectOption({value: '2'})
  await expect(page.locator(':text("Option 1")')).not.toHaveAttribute('selected','selected')
  await expect(page.locator(':text("Option 2")')).toHaveAttribute('selected','selected')
});

test.describe('Dynamic Content Page', () => {
  test.beforeEach(async ({ page }) => {
    await pm.navigateTo().dynamicContentPage()
    await expect(page).toHaveURL('/dynamic_content')
    await expect(page.locator('.example')).toContainText('This example demonstrates the ever-evolving nature of content by loading new text and images on each page refresh.')
  });

  test('Dynamic Content Page', async ({ page, baseURL }) => {
    // Validate that images are present
    const images = await page.locator('#content').locator('img').all()
    for (const image of images) {
      // console.log(baseURL)
      const imgSource = await image.getAttribute('src')  
      const response = await page.request.get(baseURL + imgSource!)
      expect(response.status()).toBe(200)
    }

    // Validate that image descriptions are present
    const descriptions = await page.locator('[class="large-10 columns"]').all()
    for (const description of descriptions) {
      expect(description).not.toBeEmpty()
      expect(description).not.toHaveText('')
    } 
  })

  test('Dynamic Content Page - Static Version', async ({ page, baseURL }) => {
    const descriptionLocator = page.locator('.example').locator('[class="large-10 columns"]')
    await page.getByRole('link', { name: 'click here'}).click()
    await expect(page).toHaveURL('/dynamic_content?with_content=static')

    // Get static images src attribute
    const firstImageSrc = await page.locator('#content').locator('img').first().getAttribute('src');
    const secondImageSrc = await page.locator('#content').locator('img').nth(1).getAttribute('src');

    // Validate that correct static descriptions are present
    await expect(descriptionLocator.first()).toContainText('Accusantium eius ut architecto neque vel voluptatem vel nam eos minus ullam dolores')
    await expect(descriptionLocator.nth(1)).toContainText('Omnis fugiat porro vero quas tempora quis eveniet ab officia cupiditate culpa repellat debitis itaque possimus odit dolorum et iste quibusdam quis dicta autem sint vel quo vel consequuntur dolorem nihil neque sunt aperiam blanditiis')
    
    // Reload page and verify that static content hasn't changed
    await page.reload();
    expect( await page.locator('#content').locator('img').first().getAttribute('src')).toEqual(firstImageSrc)
    expect( await page.locator('#content').locator('img').nth(1).getAttribute('src')).toEqual(secondImageSrc)

    await expect(descriptionLocator.first()).toContainText('Accusantium eius ut architecto neque vel voluptatem vel nam eos minus ullam dolores')
    await expect(descriptionLocator.nth(1)).toContainText('Omnis fugiat porro vero quas tempora quis eveniet ab officia cupiditate culpa repellat debitis itaque possimus odit dolorum et iste quibusdam quis dicta autem sint vel quo vel consequuntur dolorem nihil neque sunt aperiam blanditiis')

    // Validate that dynamic image and description is present
    await expect(page.locator('img').last()).toBeVisible()
    const imgSource = await page.locator('img').last().getAttribute('src')
    const response = await page.request.get(baseURL + imgSource!)
    expect(response.status()).toBe(200)
    await expect(descriptionLocator.last()).not.toHaveText('')
  })
});

test.describe('Dynamic Controls Page', () => {
  test.beforeEach(async ({ page }) => {
    await pm.navigateTo().dynamicControlsPage()
  });

  test('Dynamic Controls Page - Checkbox', async ({ page }) => {
    const checkbox = page.getByRole('checkbox')
    await expect(checkbox).not.toBeChecked()

    await checkbox.check()
    await expect(checkbox).toBeChecked()
  })

  test('Dynamic Controls Page - Remove/Add Checkbox', async ({ page }) => {
    const checkbox = page.getByRole('checkbox')
    const messageLocator = '#message'
    // Remove checkbox
    await page.getByRole('button', { name: 'Remove'}).click()
    await page.waitForSelector(messageLocator)
    await expect(checkbox).not.toBeVisible()
    await expect(page.locator(messageLocator)).toHaveText("It's gone!")

    // Remove checkbox
    await page.getByRole('button', { name: 'Add'}).click()
    await page.waitForSelector(messageLocator)
    await expect(checkbox).toBeVisible()
    await expect(page.locator(messageLocator)).toHaveText("It's back!")
  })

  test('Dynamic Controls Page - Textbox', async ({ page }) => {
    const textbox = page.locator('#input-example input')
    const messageLocator = '#message'
    
    await expect(textbox).toBeDisabled();
    // Activate textbox
    await page.getByRole('button', { name: 'Enable'}).click()
    await page.waitForSelector(messageLocator)
    await expect(textbox).toBeEnabled();
    await expect(page.locator(messageLocator)).toHaveText("It's enabled!")

    // Activate textbox
    await page.getByRole('button', { name: 'Disable'}).click()
    await page.waitForSelector(messageLocator)
    await expect(textbox).toBeDisabled();
    await expect(page.locator(messageLocator)).toHaveText("It's disabled!")
  })
});

test.describe('Dynamic Loading Page', () => {
  test.beforeEach(async ({ page }) => {
    await pm.navigateTo().dynamicLoadingPage()
    await expect(page).toHaveURL('/dynamic_loading')
  });

  test('Dynamic Loading Page - Hidden Element', async ({ page }) => {
    const helloWorldLocator = page.locator('#finish')
    const startButton = page.getByRole('button', { name: 'Start'})
    await page.getByRole('link', { name : 'Example 1: Element on page that is hidden'}).click()
    await expect(page).toHaveURL('/dynamic_loading/1')

    // Validate that element is present but hidden
    await expect(helloWorldLocator).not.toBeVisible()
    await expect(helloWorldLocator).not.toBeInViewport()
    expect(await helloWorldLocator.getAttribute('style')).toBe('display:none')


    await startButton.click()
    // Validate that element is present and visible
    await expect(startButton).not.toBeInViewport()
    const slowExpect = expect.configure({ timeout: 10000 });
    await slowExpect(helloWorldLocator).toBeInViewport()
    await expect(helloWorldLocator).toHaveText('Hello World!')
  })

  test('Dynamic Loading Page - Loaded Element', async ({ page }) => {
    const helloWorldLocator = page.locator('#finish')
    const startButton = page.getByRole('button', { name: 'Start'})
    await page.getByRole('link', { name : 'Example 2: Element rendered after the fact'}).click()
    await expect(page).toHaveURL('/dynamic_loading/2')

    // Validate that element is present but hidden
    await expect(helloWorldLocator).not.toBeVisible()

    await startButton.click()
    // Validate that element is present and visible
    await expect(startButton).not.toBeInViewport()
    const slowExpect = expect.configure({ timeout: 10000 });
    await slowExpect(helloWorldLocator).toBeInViewport()
    await expect(helloWorldLocator).toHaveText('Hello World!')
  })
});
