import { createContext, useContext, useState, FC } from "react"

import InfoDialog from "src/components/InfoDialog"

interface IDialogContext {
  openDialog: (message: string, title?: string) => void
  closeDialog: () => void
}

const DialogContext = createContext({} as IDialogContext)

export const DialogProvider: FC = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")

  const openDialog = (newMessage: string, newTitle = "") => {
    setMessage(newMessage)
    setTitle(newTitle)
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
  }

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <InfoDialog open={open} handleClose={closeDialog} title={title} message={message}></InfoDialog>
    </DialogContext.Provider>
  )
}

export const useDialog = () => useContext(DialogContext)
