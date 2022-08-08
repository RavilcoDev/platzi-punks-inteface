import { Spinner, Center } from '@chakra-ui/react'
import React from 'react'

const Loading = () => {
  return (
    <>
      <Center my={20}>
        <Spinner />
      </Center>
    </>
  )
}

export default Loading
