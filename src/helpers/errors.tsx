import React, { ErrorInfo, FC } from "react"
import Bugsnag from "@bugsnag/js"
import BugsnagPluginReact from "@bugsnag/plugin-react"
import styled from "@emotion/styled/macro"
import { Typography } from "@material-ui/core"

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
  padding: 1rem;
  h2 {
    color: #e53935;
    margin: 1rem 0;
  }
  code {
    display: block;
    margin-top: 3rem;
    color: #aaa;
  }
`

// https://github.com/bugsnag/bugsnag-js/blob/next/packages/plugin-react/types/bugsnag-plugin-react.d.ts
interface FallbackProps {
  error: Error
  info?: ErrorInfo
  clearError?: () => void
}

export const ErrorBlock = ({ error }: FallbackProps) => (
  <Container>
    <Typography variant="h2">
      <span aria-hidden>🐞</span>
      <br />
      Une erreur est survenue
    </Typography>
    <Typography>Essayez de recharger la page</Typography>
    <code>{String(error)}</code>
  </Container>
)

const Text = styled.p`
  color: #e53935;
`

interface MessageProps {
  error: Error
}

export const ErrorMessage = ({ error }: MessageProps) => <Text>Erreur : {error.message}</Text>

export const ErrorBoundary: FC = ({ children }) =>
  Boundary ? <Boundary FallbackComponent={ErrorBlock}>{children}</Boundary> : <>{children}</>
