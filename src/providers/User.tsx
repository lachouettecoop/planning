import { createContext, useContext, useState, FC } from "react"

export interface User {
  email: string
  token: string
}

export interface IUserContext {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const UserContext = createContext<IUserContext>({} as IUserContext)

const STORAGE_KEY = "user"

const init = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return null
  }
  return JSON.parse(stored) as User
}

export const UserProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(init)

  const login = (newUser: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext) as IUserContext

export interface IAuthenticated extends IUserContext {
  user: User
}

export const useAuthenticatedUser = () => useContext(UserContext) as IAuthenticated
