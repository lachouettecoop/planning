import { createContext, useContext, useState, FC } from "react"

export interface AuthUser {
  email: string
  token: string
  id: string
}

export interface IUserContext {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
}

const UserContext = createContext<IUserContext>({} as IUserContext)

const STORAGE_KEY = "user"

export const getStoredUser = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return null
  }
  return JSON.parse(stored) as AuthUser
}

export const UserProvider: FC = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser)

  const login = (data: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setUser(data)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext) as IUserContext

export interface IAuthenticated extends IUserContext {
  user: AuthUser
}

export const useAuthenticatedUser = () => useContext(UserContext) as IAuthenticated
