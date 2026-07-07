const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Jack Flow',
        username: 'jackflow',
        password: '345-987987'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {

    test('succeeds with correct credentials',
      async ({ page }) => {
        await loginWith(page, 'jackflow', '345-987987')
        await expect(page.getByText('Jack Flow logged in')).toBeVisible()
    })

    test('fails with wrong credentials',
      async ({page}) => {
        await loginWith(page, 'jackflow', 'wrongpassword')
        await expect(page.locator('.error')).toContainText('invalid username or password')
        await expect(page.getByText('Jack Flow logged in')).not.toBeVisible()
        await expect(page.getByRole('button', { name: 'login'})).toBeVisible()
    })
    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'jackflow', '345-987987')
      })
      test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await createBlog(page, 'New blog with Playwright', 'Test Author', 'https://example.com')
        await page.getByRole('button', { name: 'create' }).click()

        await expect(page.getByText('New blog with Playwright Test Author')).toBeVisible()
        //alternative solution with .locator()
        //await expect(page.getByRole('button', { name: 'view' }).locator('..').filter({ hasText: 'New blog with Playwright' })).toBeVisible()
      })
    })
  })
})