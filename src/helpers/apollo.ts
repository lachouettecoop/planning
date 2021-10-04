import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

import { getStoredUser } from "src/providers/user"

const API_URL = process.env.REACT_APP_API

if (!API_URL) {
  throw new Error("You must compile the app with a REACT_APP_API environment variable - see example.env")
}

export const TEST = API_URL.includes("test")

const link = createHttpLink({
  uri: `${API_URL}/api/graphql`,
})

const authLink = setContext((_, previous) => {
  const user = getStoredUser()
  if (!user) {
    return previous
  }
  return {
    ...previous,
    headers: {
      ...previous.headers,
      "X-Auth-Token": user.token,
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "network-only",
    },
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
})

export default client

export const getId = (id?: string | number) => {
  if (typeof id === "number") {
    return id
  }
  if (typeof id === "string") {
    const matches = id.match(/api\/\w+\/(\d+)/)
    if (matches) {
      return Number(matches[1])
    }
  }
  return null
}
