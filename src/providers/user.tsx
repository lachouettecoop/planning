import type { User } from "src/types/model"

import { createContext, useContext, useState, FC, useEffect } from "react"
import Bugsnag from "@bugsnag/js"

import { LOGGED_IN_USER } from "src/graphql/queriesUser"
import apollo from "src/helpers/apollo"
import { formatName } from "src/helpers/user"

export interface Auth {
  email: string
  token: string
  id: number
}

export interface IUserContext<IsAuthenticated extends boolean = false> {
  auth: IsAuthenticated extends true ? Auth : Auth | null
  user: User | null
  login: (auth: Auth) => void
  logout: () => void
  refetchUser: () => void
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

  useEffect(() => {
    if (user) {
      Bugsnag.setUser(user.id, user.email, formatName(user))
    } else {
      Bugsnag.setUser()
    }
  }, [user])

  const login = (data: Auth) => {
    setAuth(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const logout = () => {
    setAuth(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const refetchUser = () => {
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
  }

  return <UserContext.Provider value={{ auth, user, login, logout, refetchUser }}>{children}</UserContext.Provider>
}

export function useUser<IsAuthenticated extends boolean = false>() {
  return useContext(UserContext) as IUserContext<IsAuthenticated>
}
