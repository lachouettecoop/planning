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
