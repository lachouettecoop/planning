import { createContext, useContext, useState, FC } from "react"

import Dialog from "src/components/Dialog"

type Callback = (choice: boolean) => void

interface IDialogContext {
  openDialog: (message: string, title?: string, callback?: Callback) => void
  closeDialog: () => void
}

const DialogContext = createContext({} as IDialogContext)

export const DialogProvider: FC = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [callback, setCallback] = useState<Callback>()

  const openDialog = (newMessage: string, newTitle = "", newCallback?: Callback) => {
    setMessage(newMessage)
    setTitle(newTitle)
    setCallback(() => newCallback)
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
  }

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog open={open} handleClose={closeDialog} title={title} message={message} callback={callback} />
    </DialogContext.Provider>
  )
}

export const useDialog = () => useContext(DialogContext)
