import type { User } from "src/types/model"

import { createContext, useContext, useState, FC, useEffect } from "react"

import { LOGGED_IN_USER } from "src/graphql/queries"
import apollo from "src/helpers/apollo"

export interface Auth {
  email: string
  token: string
  id: string
}

export interface IUserContext<IsAuthenticated extends boolean = false> {
  auth: IsAuthenticated extends true ? Auth : Auth | null
  user: User | null
  login: (auth: Auth) => void
  logout: () => void
}

const UserContext = createContext<IUserContext>({} as IUserContext)

const STORAGE_KEY = "user"

export const getStoredUser = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return null
  }
  return JSON.parse(stored) as Auth
}

export const UserProvider: FC = ({ children }) => {
  const [auth, setAuth] = useState<Auth | null>(getStoredUser)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (auth) {
      apollo
        .query<{ user: User }>({
          query: LOGGED_IN_USER,
          variables: { id: `api/users/${auth.id}` },
        })
        .then(({ data }) => {
          setUser(data.user)
        })
    }
  }, [auth])

  const login = (data: Auth) => {
    setAuth(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const logout = () => {
    setAuth(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return <UserContext.Provider value={{ auth, user, login, logout }}>{children}</UserContext.Provider>
}

export function useUser<IsAuthenticated extends boolean = false>() {
  return useContext(UserContext) as IUserContext<IsAuthenticated>
}
