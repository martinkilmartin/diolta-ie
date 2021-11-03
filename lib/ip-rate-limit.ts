import { initRateLimit, CountFn } from './rate-limit'
import getIP from './get-ip'
import { upstashRest } from './upstash'

export const ipRateLimit = initRateLimit((request) => ({
  id: `ip:${getIP(request)}`,
  count: increment,
  limit: 5,
  duration: 10,
}))

const increment: CountFn = async ({ key, duration }) => {
  const results = await upstashRest(
    [
      ['INCR', key],
      ['EXPIRE', key, duration],
    ],
    { pipeline: true }
  )
  return results[0].result
}
