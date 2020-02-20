/* eslint-env jest */
/* global jasmine */
import {
  nextBuild,
  findPort,
  nextStart,
  killApp,
  waitFor,
} from 'next-test-utils'
import webdriver from 'next-webdriver'
import { join } from 'path'

const appDir = join(__dirname, '../')
let appPort
let app
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 1

describe('Production Usage', () => {
  beforeAll(async () => {
    await nextBuild(appDir)
    appPort = await findPort()
    app = await nextStart(appDir, appPort)
  })
  afterAll(() => killApp(app))

  it('should navigate forward and back correctly', async () => {
    const browser = await webdriver(appPort, '/')
    await browser.eval('window.beforeNav = true')
    await browser.elementByCss('#to-another').click()
    // waitForElement doesn't seem to work properly in safari 10
    await waitFor(2000)
    expect(await browser.eval('window.beforeNav')).toBe(true)
    await browser.elementByCss('#to-index').click()
    await waitFor(2000)
    expect(await browser.eval('window.beforeNav')).toBe(true)
  })
})