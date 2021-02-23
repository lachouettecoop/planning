// TODO: report to tracker and show nicer message
export const handleError = (error: Error) => {
  console.error(error)
  alert(error.message)
}
