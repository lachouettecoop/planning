import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

import { getStoredUser } from "src/providers/user"

const link = createHttpLink({
  uri: `${process.env.REACT_APP_API}/api/graphql`,
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
})

export default client
