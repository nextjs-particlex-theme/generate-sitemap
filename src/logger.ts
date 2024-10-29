import core from '@actions/core'

export function info(msg: string) {
  if (process.env.NODE_ENV === 'production') {
    core.info(msg)
  } else {
    console.log(msg)
  }
}

export function debug(msg: string) {
  if (process.env.NODE_ENV === 'production') {
    core.debug(msg)
  } else {
    console.debug(msg)
  }
}
