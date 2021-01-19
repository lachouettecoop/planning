import { useState } from "react"
import { gql } from "@apollo/client"
import { Button } from "@material-ui/core"

import apollo, { List } from "src/helpers/apollo"
import type { PIAF } from "src/types/model"

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

type Result = { piafs: List<PIAF> }

const HomePage = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result>()

  const handleTest = async () => {
    setLoading(true)
    try {
      const { data } = await apollo.query<Result>({ query: TEST_QUERY })
      setResult(data)
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
