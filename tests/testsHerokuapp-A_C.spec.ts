import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

let pm: PageManager

test.beforeEach(async ({ page }) => {
  pm = new PageManager(page)
  await page.goto('/');
  await expect(page).toHaveTitle('The Internet');
});

test('A/B Testing Page', async ({ page }) => {
   await pm.navigateTo().abTestingPage()

   const title = page.locator('h3', {hasText: "A/B Test Variation 1"})
   expect(title).toBeVisible

   const descriptionText = "Also known as split testing. This is a way in which businesses are able to simultaneously test and learn different versions of a page to see which text and/or functionality works best towards a desired outcome (e.g. a user action such as a click-through)."
   const description = page.locator('p', {hasText: "Also known as split testing"})
   await expect(description).toHaveText(descriptionText)
});

test('Add/Remove Elements Page', async ({ page }) => {
  await pm.navigateTo().addRemoveElementsPage()
  expect(page.getByText('Add Element')).toBeVisible()

  await pm.onAddRemoveElementsPage().addElements(3)
  await pm.onAddRemoveElementsPage().removeElements(1)
  var numberOfDeleteButtons = (await page.getByRole('button',{name: 'Delete'}).all()).length
  expect(numberOfDeleteButtons).toEqual(2)

  await pm.onAddRemoveElementsPage().removeElements(2)
  numberOfDeleteButtons = (await page.getByRole('button',{name: 'Delete'}).all()).length
  expect(numberOfDeleteButtons).toEqual(0)
});

// Basic Auth Page
const users = [
  {username: 'admin', password: 'admin', description: 'Valid Credentials', validationText: 'Congratulations! You must have the proper credentials.'},
  {username: 'invalidUsername', password: 'admin', description: 'Invalid Username', validationText: 'Not authorized'},
  {username: 'admin', password: 'invalidPassword', description: 'Invalid Password', validationText: 'Not authorized'}
]
users.forEach((user) => {
  test(`Basic Auth Page - ${user.description}`, async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: {
        username: user.username,
        password: user.password
      }
    });
    const page = await context.newPage();
    await page.goto('/basic_auth');
    await expect(page.locator('body')).toContainText(user.validationText);
  });
});

test.fail('Broken Images Page @brokenFeatures', async ({ page }) => {
  await pm.navigateTo().brokenImagesPage()
  const images = await page.locator('#content').locator('img').all()

  for (const image of images) {
    const imgSource = await image.getAttribute('src')
    const response = await page.request.get(`/${imgSource}`)
    expect(response.status()).toBe(200)
  }
});

test.describe('Challenging DOM Page', () => {
  test('Challenging DOM Page - Blue button', async ({ page }) => {
    await pm.navigateTo().challengingDOMPage()

    // Click on blue button
    await pm.onChallengingDOMPage().clickButtonSeveralTimes('[class="button"]', 3)
  })

  test('Challenging DOM Page - Red button', async ({ page }) => {
    //// const pm = new PageManager(page)
    await pm.navigateTo().challengingDOMPage()

    // Click on red button
    await pm.onChallengingDOMPage().clickButtonSeveralTimes('[class="button alert"]', 3)
  })

  test('Challenging DOM Page - Green button', async ({ page }) => {
    await pm.navigateTo().challengingDOMPage()

    // Click on green button
    await pm.onChallengingDOMPage().clickButtonSeveralTimes('[class="button success"]', 3)
  })

  test('Challenging DOM Page - Canvas', async ({ page }) => {
    await pm.navigateTo().challengingDOMPage()

    const canvas =  page.locator('#canvas')
    await expect(canvas).toBeInViewport()
  })
  
  test('Challenging DOM Page - Edit Table', async ({ page }) => {
    await pm.navigateTo().challengingDOMPage()

    await pm.onChallengingDOMPage().editTableRow(3)
    await expect(page).toHaveURL('/challenging_dom#edit')

    await pm.onChallengingDOMPage().deleteTableRow(7)
    await expect(page).toHaveURL('/challenging_dom#delete')
  })
});

test('Checkboxes Page', async ({ page }) => {
  await pm.navigateTo().checkboxesPage()

  const checkbox1 = page.getByRole('checkbox').first()
  const checkbox2 = page.getByRole('checkbox').last()

  await checkbox1.check()
  await checkbox2.check()

  expect(checkbox1).toBeChecked()
  expect(checkbox2).toBeChecked()

  await checkbox1.uncheck()
  await checkbox2.uncheck()

  expect(checkbox1).not.toBeChecked()
  expect(checkbox2).not.toBeChecked()
});

test('Context Menu Page', async ({ page }) => {
  await pm.navigateTo().conxtextMenuPage()

  const contextMenu = page.locator('#hot-spot') 
  await contextMenu.scrollIntoViewIfNeeded()

  const box = await contextMenu.boundingBox()
  const x = box!.x + box!.width/2
  const y = box!.y + box!.height/2
  await page.mouse.move(x ,y)
  await page.mouse.click(x,y, {button: "right"})
});


























