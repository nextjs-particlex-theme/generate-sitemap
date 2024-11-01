import tryBindPage from '../../src/core/bind'
import inputs from '../../src/inputs'
import path from 'node:path'

test('Test home page bind', () => {
  const target = [`_post${path.sep}index.md`]
  const bound = tryBindPage(inputs.pagesPath, target)
  expect(bound.length).toBe(target.length)
  expect(bound[0].webPathname).toBe('index')
})

test('Test pages bind', () => {
  const target = ['hello.md']
  const bound = tryBindPage(inputs.pagesPath, target)
  expect(bound.length).toBe(target.length)
  expect(bound[0].webPathname).toBe('hello')
})