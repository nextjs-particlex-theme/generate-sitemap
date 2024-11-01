import core from '@actions/core'

export function info(msg: string) {
  if (process.env.NODE_ENV === 'test') {
    return
  }
  if (process.env.NODE_ENV === 'production') {
    core.info(msg)
  } else {
    console.log(msg)
  }
}

export function debug(msg: string) {
  if (process.env.NODE_ENV === 'test') {
    return
  }
  if (process.env.NODE_ENV === 'production') {
    core.debug(msg)
  } else {
    console.debug(msg)
  }
}


export function warn(msg: string) {
  if (process.env.NODE_ENV === 'test') {
    return
  }
  if (process.env.NODE_ENV === 'production') {
    core.warning(msg)
  } else {
    console.warn(msg)
  }
}

export function isDebug() {
  if (process.env.NODE_ENV === 'production') {
    return core.isDebug()
  } else {
    return true
  }
}