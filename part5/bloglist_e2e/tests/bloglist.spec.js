const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, expectLoginFormToBeVisible } = require('./helper')

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

    await page.goto('/')
  })

  describe('Login', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: /login/i }).click()
      await expectLoginFormToBeVisible(page)
    })
    test('succeeds with correct credentials',
      async ({ page }) => {
        await loginWith(page, 'jackflow', '345-987987')
        await expect(page).toHaveURL('/')
        await expect(page.getByText('Jack Flow logged in')).toBeVisible()
    })

    test('fails with wrong credentials',
      async ({page}) => {
        await loginWith(page, 'jackflow', 'wrongpassword')
        await expect(page.getByTestId('notification')).toContainText('invalid username or password')
        await expect(page.getByText('Jack Flow logged in')).not.toBeVisible()
        await expect(page).toHaveURL('/login')
    })
  })

  describe('When logged in', () => {
    const blogTitle = 'New blog with Playwright'
    const blogAuthor = 'Test Author'
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: /login/i }).click()
      await expectLoginFormToBeVisible(page)
      await loginWith(page, 'jackflow', '345-987987')
      await expect(page).toHaveURL('/')
    })

    test('a new blog can be created',
      async ({ page }) => {
        await page.getByRole('link', { name: /new blog/i }).click()
        await expect(page).toHaveURL('/create')
        await createBlog(page, blogTitle, blogAuthor, 'https://example.com')
        await expect(page).toHaveURL('/')
        await expect(page.getByTestId('notification'))
          .toContainText(`a new blog "${blogTitle}" by ${blogAuthor} added`)
        await expect(page.getByRole('link', { name: `${blogTitle} by ${blogAuthor}` })).toBeVisible()
    })

    describe('Interaction with the blog', () => {
      beforeEach(async({ page }) => {
        await page.getByRole('link', { name: /new blog/i }).click()
        await expect(page).toHaveURL('/create')
        await createBlog(page, blogTitle, blogAuthor, 'https://example.com')
        await expect(page).toHaveURL('/')
      })

      test('logged user can like the blog',
        async ({ page }) => {
          await page.getByRole('link', { name: `${blogTitle} by ${blogAuthor}` }).click()
          await expect(page.getByText('0 likes')).toBeVisible()
          await page.getByRole('button', { name: 'like' }).click()
          await expect(page.getByText('1 likes')).toBeVisible()
          await expect(page.getByTestId('notification'))
            .toContainText('likes for "New blog with Playwright" by Test Author were successfully updated')
      })

      test('logged blog owner can remove a blog',
        async ({ page }) => {
          await page.getByRole('link', { name: `${blogTitle} by ${blogAuthor}` }).click()
          await expect(page.getByRole('button', { name: /remove/i })).toBeVisible()
          page.on('dialog', dialog => dialog.accept())
          await page.getByRole('button', { name: /remove/i }).click()
          await expect(page).toHaveURL('/')
          await expect(page.getByTestId('notification'))
            .toContainText('Blog "New blog with Playwright" by Test Author was successfully removed')
          await expect(page.getByRole('link', { name: `${blogTitle} by ${blogAuthor}` })).toHaveCount(0)
      })
    })
  })  
})