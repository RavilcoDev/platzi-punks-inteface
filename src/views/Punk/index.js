import { useState } from 'react'
import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast,
} from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import RequestAccess from '../../components/request-access'
import PunkCard from '../../components/punk-card'
import Loading from '../../components/loading'
import { usePlatziPunkData } from '../../hooks/usePlatziPunksData'
import { useParams } from 'react-router-dom'
import { usePlatziPunks } from '../../hooks/usePlatziPunks'
import useTruncatedAddress from '../../hooks/useTruncatedAddress'

export const Punk = () => {
  const { active, account, library } = useWeb3React()
  const { tokenId } = useParams()
  const { loading, punk, update } = usePlatziPunkData(tokenId)

  const toast = useToast()
  const platziPunks = usePlatziPunks()
  const [transfering, setTransfering] = useState(false)

  const transfer = () => {
    const address = prompt('A que cuenta sera enviada la NFT')
    const isAdrress = library.utils.isAddress(address)
    if (!isAdrress) {
      toast({
        title: 'Address is not valid',
        description: `${isAdrress} is not a ethereum Address`,
        status: 'error',
      })
    } else {
      setTransfering(true)
      platziPunks.methods
        .safeTransferFrom(punk.owner, address, punk.tokenId)
        .send({ from: account })
        .on('error', (error) => {
          setTransfering(false)
        })
        .on('transactionHash', (txHash) => {
          toast({
            title: 'Transaction sent',
            description: txHash,
            status: 'info',
          })
        })
        .on('receipt', () => {
          setTransfering(false)
          toast({
            title: 'Transacción confirmada',
            description: 'Nunca pares de aprender.',
            status: 'success',
          })
          update()
        })
    }
  }
  const truncatedAddress = useTruncatedAddress(punk.owner)

  if (!active) return <RequestAccess />

  if (loading) return <Loading />

  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: 'column', md: 'row' }}
    >
      <Stack>
        <PunkCard
          mx={{
            base: 'auto',
            md: 0,
          }}
          name={punk.name}
          image={punk.image}
        />
        <Button
          onClick={transfer}
          disabled={account !== punk.owner}
          colorScheme="green"
          isLoading={transfering}
        >
          {account !== punk.owner ? 'No eres el dueño' : 'Transferir'}
        </Button>
      </Stack>
      <Stack width="100%" spacing={5}>
        <Heading>{punk.name}</Heading>
        <Text fontSize="xl">{punk.description}</Text>
        <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme="green">
            {punk.dna}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme="green">
            {truncatedAddress}
          </Tag>
        </Text>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Atributo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(punk.attributes).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Tag>{value}</Tag>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  )
}
