import React from 'react'
// Components
import Loading from '../../components/loading'
import RequiestAccess from '../../components/request-access'
import PunksCard from '../../components/punk-card'
import { Grid } from '@chakra-ui/react'
// Hooks
import { useWeb3React } from '@web3-react/core'
import { usePlatziPunksData } from '../../hooks/usePlatziPunksData'
import { Link } from 'react-router-dom'

const Punks = () => {
  const { active } = useWeb3React()
  const { loading, punks } = usePlatziPunksData()

  if (!active) <RequiestAccess />
  return loading ? (
    <Loading />
  ) : (
    <Grid templateColumns="repeat(auto-fill,minmax(250px,1fr))" gap={6}>
      {punks.map(({ name, image, tokenId }) => (
        <Link key={tokenId} to={`/punk/${tokenId}`}>
          <PunksCard image={image} name={name} />
        </Link>
      ))}
    </Grid>
  )
}

export { Punks }
