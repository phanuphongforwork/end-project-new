import qs from 'query-string'

export const queryStringStringify = (obj) => {
  return qs.stringify(obj, {
    encode: false
  })
}
