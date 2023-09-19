import { createClient } from "next-sanity"

import { apiVersion, dataset, projectId, useCdn } from "../env"

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  token:
    "skmaRw67BvBT9R9g38YN65MipRJXMgCWGpcf31Xqv6cCUhmPbKce1OZaNeDLoDsSqtiaNJRnI9IF68bmXJnpVlpD5l9eOoz0wjiqUVXGhWZD4T53JMyRIOS6SRNjA5vjd9jSmGiCNiW1yj5EzydJJFtUy3VkI2JKCPNXq2BinlgULslbQNlI",
})
