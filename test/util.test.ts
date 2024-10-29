import fs from 'node:fs'
import { commitAndPush } from '../src/util'
import os from 'node:os'
import { execSync, spawnSync } from 'node:child_process'

test('Test commitAndPush', () => {
  let hash: string | undefined
  if (os.type() === 'Windows_NT') {
    // local test.
    hash = execSync('git rev-parse HEAD').toString('utf8').trim()
  }
  const file = './temp.txt'
  fs.writeFileSync(file, '', { encoding: 'utf8' })
  commitAndPush(file, './')
  if (hash) {
    // rollback
    spawnSync('git', ['reset', hash, '--soft'], { stdio: 'inherit' })
  }
  fs.rmSync(file)
})