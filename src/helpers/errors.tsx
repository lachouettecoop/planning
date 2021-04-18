import React, { ErrorInfo, FC } from "react"
import Bugsnag from "@bugsnag/js"
import BugsnagPluginReact from "@bugsnag/plugin-react"
import styled from "@emotion/styled/macro"

const apiKey = process.env.REACT_APP_BUGSNAG_KEY

if (apiKey) {
  Bugsnag.start({
    apiKey,
    releaseStage: process.env.NODE_ENV,
    enabledReleaseStages: ["production"],
    appVersion: process.env.REACT_APP_COMMIT,
    metadata: {
      deployDate: new Date().toString(),
      deployAuthor: process.env.REACT_APP_AUTHOR,
    },
    plugins: [new BugsnagPluginReact()],
  })
}

// TODO: show nicer message
export const handleError = (error: Error) => {
  console.error(error)
  alert(error.message)
  if (apiKey) {
    Bugsnag.notify(error)
  }
}

const Boundary = apiKey ? Bugsnag.getPlugin("react")?.createErrorBoundary(React) : null

const Container = styled.div`
  padding: 2em;
  h1 {
    color: #e10f14;
  }
  code {
    display: block;
    margin-top: 8em;
    color: #aaa;
  }
`

// https://github.com/bugsnag/bugsnag-js/blob/next/packages/plugin-react/types/bugsnag-plugin-react.d.ts
interface FallbackProps {
  error: Error
  info: ErrorInfo
  clearError: () => void
}

const Fallback = ({ error }: FallbackProps) => (
  <Container>
    <h1>
      <span aria-hidden>🐞</span>
      <br />
      Une erreur est survenue
    </h1>
    <h2>Essayez de recharger la page</h2>
    <code>{String(error)}</code>
  </Container>
)

export const ErrorBoundary: FC = ({ children }) =>
  Boundary ? <Boundary FallbackComponent={Fallback}>{children}</Boundary> : <>{children}</>
