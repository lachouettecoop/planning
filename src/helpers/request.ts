import HttpError from "standard-http-error"

export const post = async (path: string, body: BodyInit) => {
  const response = await fetch(`${process.env.REACT_APP_API}/${path}`, {
    method: "POST",
    body,
  })
  if (!response.ok) {
    throw new HttpError(response.status, response.statusText)
  }
  return response.json()
}
