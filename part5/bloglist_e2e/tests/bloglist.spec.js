const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

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
    await expect(page.getByRole('button', {name: 'login'})).toBeVisible()
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
  })
})