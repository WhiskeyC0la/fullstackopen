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

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown',
    async ({ page }) => {
      await expectLoginFormToBeVisible(page)
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
        await createBlog(page, 'New blog with Playwright', 'Test Author', 'https://example.com')
      })

      test('a new blog can be created',
        async ({ page }) => {
          await expect(page.getByText('New blog with Playwright Test Author')).toBeVisible()
          //alternative solution with .locator()
          //await expect(page.getByRole('button', { name: 'view' }).locator('..').filter({ hasText: 'New blog with Playwright' })).toBeVisible()
      })

      test('can like the blog',
        async ({ page }) => {
          const blog = page.getByText('New blog with Playwright Test Author').locator('..')
          await blog.getByRole('button', { name: 'view' }).click()
          await expect(blog.getByRole('button', { name: 'hide' })).toBeVisible()
          await expect(blog.getByText('likes 0')).toBeVisible()
          await blog.getByRole('button', { name: 'like' }).click()
          await expect(blog.getByText('likes 1')).toBeVisible()
          await expect(page.locator('.success'))
            .toContainText('likes for "New blog with Playwright" by Test Author were successfully updated')
      })

      test('user can remove a blog',
        async ({ page }) => {
          const blog = page.getByText('New blog with Playwright Test Author').locator('..')
          await blog.getByRole('button', { name: 'view' }).click()
          page.on('dialog', dialog => dialog.accept())
          await blog.getByRole('button', { name: 'remove' }).click()
          await expect(page.locator('.success'))
            .toContainText('Blog "New blog with Playwright" by Test Author was successfully removed')
          await expect(blog).not.toBeVisible()
      })

      test('only the blog creator can see the remove button',
        async ({ page, request }) => {
          const newUser = {
            name: 'John Doe',
            username: 'secondOne',
            password: 'confidential'
          }
          const newBlog = {
            title: 'Another blog with Playwright',
            author: 'Test User',
            url: 'https://example.com'
          }
          await request.post('http://localhost:3003/api/users', {
            data: newUser
          })

          await page.getByRole('button', { name: 'logout' }).click()
          await expectLoginFormToBeVisible(page)
          await loginWith(page, newUser.username, newUser.password)
          await createBlog(page, newBlog.title, newBlog.author, newBlog.url)
          
          const blogByFirstUser = page.getByText('New blog with Playwright Test Author').locator('..')
          
          await blogByFirstUser.getByRole('button', { name: 'view' }).click()
          await expect(blogByFirstUser.getByRole('button', { name: 'remove' })).not.toBeVisible()
          
          const blogBySecondUser = page.getByText(`${newBlog.title} ${newBlog.author}`).locator('..')
          
          await blogBySecondUser.getByRole('button', { name: 'view' }).click()
          await expect(blogBySecondUser.getByRole('button', { name: 'remove' })).toBeVisible()
      })
    })
  })
})