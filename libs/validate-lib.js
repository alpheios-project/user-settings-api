
export function validateKeyValue(key,value) {
  // only string data is allowed
  if (typeof value !== 'string') {
    console.error(`Invalid data type ${typeof value}`)
    return false
  }
  const [domain, version, name, group] = key.split('__', 4)
  // domain, version and name are required
  if (! (domain && version && name)) {
    console.error(`Invalid key ${key}`)
    return false
  }
  if (! process.env.VALID_DOMAINS.split(',').includes(domain)) {
    console.error(`Invalid domain ${domain}`)
    return false
  }
  return true
}

