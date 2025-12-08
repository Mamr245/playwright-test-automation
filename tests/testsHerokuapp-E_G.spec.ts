import { test, expect, Page, Locator } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import fs from 'fs';

let pm: PageManager

test.beforeEach(async ({ page }) => {
  pm = new PageManager(page)
  await page.goto('/');
  await expect(page).toHaveTitle('The Internet');
});

test('Entry Ad Page', async ({ page }) => {
    pm.navigateTo().entryAdPage()

    await expect(page).toHaveURL('/entry_ad')
    await expect(page.getByText('This is a modal window')).toBeVisible()
    await page.locator('.modal-footer :text("Close")').click()
    await expect(page.getByText('This is a modal window')).not.toBeVisible()
});

test.skip('Exit Intent Page', async ({ page }) => {
  const popUpLocator = page.locator('.modal')
  await expect(popUpLocator).not.toBeVisible()

  await pm.navigateTo().exitIntentPage()
  await page.locator('html').click()
  await page.locator('html').dispatchEvent('mouseleave')
  await expect(popUpLocator).toBeVisible() 

  await expect(page.locator('.modal-title')).toHaveText('This is a modal window')
  await expect(page.locator('.modal-body')).toHaveText("It's commonly used to encourage a user to take an action (e.g., give their e-mail address to sign up for something).")
  await page.locator('.modal-footer').locator('p', {hasText: 'Close'}).click()
  await expect(popUpLocator).not.toBeVisible()
});

// File Downloader Page
const filesToDownload = ['LambdaTest.txt','some-file.txt','random_data.txt','file.json','selenium-snapshot.png']
filesToDownload.forEach((fileToDownload) => {
test.skip(`File Download Page - "${fileToDownload}"`, async ({ page }) => {
    // Go "File Downloader" Page
    await pm.navigateTo().fileDownloadPage()
    
    // Download file
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('link', { name: fileToDownload, exact: true}).click()
    const download = await downloadPromise
    const downloadedFile = `./downloads/${download.suggestedFilename()}`
    await download.saveAs(downloadedFile)

    // Validate file exists
    expect(fs.existsSync(downloadedFile)).toBeTruthy()

    // Delete file and validate it doesn't exist anymore
    fs.unlinkSync(downloadedFile)
    expect(fs.existsSync(downloadedFile)).toBeFalsy()
});
});

test.describe('File Upload Page', () => {
  const dragAndDropFile = async (
    page: Page,
    selector: string,
    filePath: string,
    fileName: string,
    fileType = ''
  ) => {
    const buffer = fs.readFileSync(filePath).toString('base64');
  
    const dataTransfer = await page.evaluateHandle(
      async ({ bufferData, localFileName, localFileType }) => {
        const dt = new DataTransfer();
  
        const blobData = await fetch(bufferData).then((res) => res.blob());
  
        const file = new File([blobData], localFileName, { type: localFileType });
        dt.items.add(file);
        return dt;
      },
      {
        bufferData: `data:application/octet-stream;base64,${buffer}`,
        localFileName: fileName,
        localFileType: fileType,
      }
    );
  
    await page.dispatchEvent(selector, 'drop', { dataTransfer });
  };
  
  test.beforeEach(async ({ page }) => {
    await pm.navigateTo().fileUploadPage()
  });

  test('File Upload Page - "Choose File" Button', async ({ page }) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('#file-upload').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('./upload/samplePDF.pdf');
    await page.getByRole('button', {name: 'Upload'}).click()

    await expect(page.locator('#uploaded-files')).toBeVisible()
    await expect(page.locator('#uploaded-files')).toContainText('samplePDF.pdf')
  });

  test('File Upload Page - Dashed Red Square', async ({ page }) => {
    await dragAndDropFile(page, "#drag-drop-upload", "./upload/samplePDF.pdf", "samplePDF")
    await expect(page.locator('#drag-drop-upload')).toContainText('samplePDF')
    await expect(page.locator('#drag-drop-upload')).toContainText('✔')
  });
});

// Floating Menu Page
const optionsToTest = ['Home','News','Contact','About']
optionsToTest.forEach((optionToTest) => {
test(`Floating Menu Page - "${optionToTest}" Option`, async ({ page }) => {
    pm.navigateTo().floatingMenuPage()

    const locator = page.locator('a', {hasText: `${optionToTest}`})

    await expect(locator).toBeInViewport()
    await page.locator('#page-footer').scrollIntoViewIfNeeded()
    await expect(locator).toBeInViewport()

    await locator.click()
    await expect(page).toHaveURL(`/floating_menu#${optionToTest.toLowerCase()}`)
});
});

test.skip('Forgot Password Page', async ({ page }) => {
  const email = "test@test.com"
  await pm.navigateTo().forgotPasswordPage()

  const responsePromise = page.waitForResponse("/forgot_password")
  await page.getByRole('textbox', { name: 'E-mail'}).fill(email)
  await page.getByRole('button', {name : 'Retrieve password'}).click()
  const response = await responsePromise;
  expect(response.status()).toEqual(200)
});

test.describe('Form Authentication Page', () => {
test.beforeEach(async ({ page }) => {
    await pm.navigateTo().formAuthenticationPage()
    await expect(page.getByRole('button', {name: 'Login'})).toBeVisible()
});

test('Login - Valid Credentials', async ({ page }) => {
    const pm = new PageManager(page)
    pm.onFormAuthenticationPage().loginWithUsernameAndPassword('tomsmith','SuperSecretPassword!')

    await expect(page.locator('#flash')).toContainText('You logged into a secure area!')
    await page.locator('i').getByText('Logout').click()
    await expect(page.getByRole('button', {name: 'Login'})).toBeVisible()
})

test('Login - Missing Username', async ({ page }) => {
    const pm = new PageManager(page)
    pm.onFormAuthenticationPage().loginWithUsernameAndPassword('','SuperSecretPassword!')
    await expect(page.locator('#flash')).toContainText('Your username is invalid!')
})

test('Login - Missing Passoword', async ({ page }) => {
    const pm = new PageManager(page)
    pm.onFormAuthenticationPage().loginWithUsernameAndPassword('tomsmith','')
    await expect(page.locator('#flash')).toContainText('Your password is invalid!')
})

test('Login - No Credentials', async ({ page }) => {
    const pm = new PageManager(page)
    pm.onFormAuthenticationPage().loginWithUsernameAndPassword('','')
    await expect(page.locator('#flash')).toContainText('Your username is invalid!')
})

test('Login - Invalid Credentials', async ({ page }) => {
    const pm = new PageManager(page)
    pm.onFormAuthenticationPage().loginWithUsernameAndPassword('invalidUsername','invalidPassword')
    await expect(page.locator('#flash')).toContainText('Your username is invalid!')
})
});

