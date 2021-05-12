import HttpError from "standard-http-error"

import { getStoredUser } from "src/providers/user"

export const post = async (path: string, body: BodyInit, headers?: HeadersInit) => {
  const response = await fetch(`${process.env.REACT_APP_API}/${path}`, {
    method: "POST",
    body,
    headers,
  })
  if (!response.ok) {
    throw new HttpError(response.status, response.statusText)
  }
  return response.json()
}

export const getParams = (search: string) => {
  const params: Record<string, string> = {}
  search
    .substr(1)
    .split("&")
    .forEach((part) => {
      if (part) {
        const tuple = part.split("=")
        if (tuple.length === 2) {
          params[tuple[0]] = decodeURIComponent(tuple[1])
        }
      }
    })
  return params
}

// TODO: use email templates and just pass a template ID with variables
export const sendEmail = (recipient: string, subject: string, message: string) => {
  const user = getStoredUser()

  if (!user) {
    throw new Error("You must be authenticated to trigger the sending of an email")
  }

  const headers = {
    "X-Auth-Token": user.token,
  }

  const data = new FormData()
  data.append("sujet", subject)
  data.append("email", recipient)
  data.append("corps", message)

  return post("dist_api/send_email", data, headers)
}
