import React, { useCallback, useState } from 'react'
// Components
import Loading from '../../components/loading'
import RequiestAccess from '../../components/request-access'
import PunksCard from '../../components/punk-card'
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react'
// Hooks
import { useWeb3React } from '@web3-react/core'
import { usePlatziPunksData } from '../../hooks/usePlatziPunksData'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SearchIcon } from '@chakra-ui/icons'

const Punks = () => {
  const { search } = useLocation()
  const [address, setAddress] = useState(
    new URLSearchParams(search).get('address')
  )
  const [submitted, setSubmitted] = useState(true)
  const [validAddress, setValidAddress] = useState(true)
  const navigate = useNavigate()
  const { active, library } = useWeb3React()
  const { loading, punks } = usePlatziPunksData({
    owner: submitted && validAddress ? address : null,
  })

  const submit = useCallback(
    (ev) => {
      ev.preventDefault()

      const isAddress = library.utils.isAddress(address)
      setValidAddress(isAddress)
      if (!isAddress) {
        navigate('/punks')
      } else {
        navigate(`/punks?address=${address}`)
      }
      setSubmitted(true)
    },
    [address, library?.utils, navigate]
  )
  const handleAddressChange = (ev) => {
    setAddress(ev.target.value)
    setSubmitted(false)
  }

  if (!active) return <RequiestAccess />

  return (
    <>
      <form onSubmit={submit}>
        <FormControl>
          <InputGroup mb={3}>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              isInvalid={false}
              value={address ?? ''}
              onChange={handleAddressChange}
              placeholder="Buscar por dirección"
            />
            <InputRightElement width="5.5rem">
              <Button type="submit" h="1.75rem" size="sm">
                Buscar
              </Button>
            </InputRightElement>
          </InputGroup>
          {submitted && !validAddress && (
            <FormHelperText>Dirección inválida</FormHelperText>
          )}
        </FormControl>
      </form>
      {loading ? (
        <Loading />
      ) : (
        <Grid templateColumns="repeat(auto-fill,minmax(250px,1fr))" gap={6}>
          {punks.map(({ name, image, tokenId }) => (
            <Link key={tokenId} to={`/punk/${tokenId}`}>
              <PunksCard image={image} name={name} />
            </Link>
          ))}
        </Grid>
      )}
    </>
  )
}

export { Punks }
