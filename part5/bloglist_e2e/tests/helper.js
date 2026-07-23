const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const expectLoginFormToBeVisible = async (page) => {
  await expect(page.getByText('Log in to application')).toBeVisible()
  await expect(page.getByLabel('username')).toBeVisible()
  await expect(page.getByLabel('password')).toBeVisible()
  await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
}

module.exports = { loginWith, createBlog, expectLoginFormToBeVisible }