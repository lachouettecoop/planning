import { useState } from "react"
import { gql } from "@apollo/client"
import { Button } from "@material-ui/core"

import apollo from "src/helpers/apollo"

const TEST_QUERY = gql`
  query {
    piafs {
      edges {
        node {
          role {
            libelle
          }
          piaffeur {
            username
          }
          creneau {
            date
            creneauGenerique {
              jour
              frequence
            }
          }
          visible
        }
      }
    }
  }
`

const HomePage = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState()

  const handleTest = async () => {
    setLoading(true)
    try {
      const response = await apollo.query({ query: TEST_QUERY })
      setResult(response.data)
    } catch (error) {
      alert(error)
    }
    setLoading(false)
  }

  return (
    <>
      <Button onClick={handleTest} disabled={loading} variant="contained" color="primary">
        Test GraphQL
      </Button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </>
  )
}

export default HomePage
