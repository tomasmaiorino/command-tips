// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('login', function () {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function () {
    driver = await new Builder().forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless()).build()
    vars = {}
  })
  afterEach(async function () {
    await driver.quit();
  })
  it('login', async function () {
    await driver.get("http://localhost:3000/login")
    await driver.manage().window().setRect(1360, 371)
    await driver.findElement(By.id("email")).click()
    await driver.findElement(By.id("email")).sendKeys("tomasmaiorino4@gmail.com")
    await driver.findElement(By.id("pass")).sendKeys("{PASS}")
    await driver.findElement(By.css(".btn")).click()
    await driver.findElement(By.id("navbarDropdownMenuLink-4")).click()
    await driver.findElement(By.linkText("Log out")).click()
  })
})
