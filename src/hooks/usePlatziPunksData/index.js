import { useState, useCallback, useEffect } from 'react'
import { usePlatziPunks } from '../usePlatziPunks'

const getPunkData = async ({ platziPunks, tokenId }) => {
  const [
    tokenURI,
    dna,
    owner,
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    platziPunks.methods.tokenURI(tokenId).call(),
    platziPunks.methods.tokenDNA(tokenId).call(),
    platziPunks.methods.ownerOf(tokenId).call(),
    platziPunks.methods.getAccessoriesType(tokenId).call(),
    platziPunks.methods.getAccessoriesType(tokenId).call(),
    platziPunks.methods.getClotheColor(tokenId).call(),
    platziPunks.methods.getClotheType(tokenId).call(),
    platziPunks.methods.getEyeType(tokenId).call(),
    platziPunks.methods.getEyebrowType(tokenId).call(),
    platziPunks.methods.getFacialHairColor(tokenId).call(),
    platziPunks.methods.getFacialHairType(tokenId).call(),
    platziPunks.methods.getHairColor(tokenId).call(),
    platziPunks.methods.getHatColor(tokenId).call(),
    platziPunks.methods.getGraphicType(tokenId).call(),
    platziPunks.methods.getMouthType(tokenId).call(),
    platziPunks.methods.getSkinColor(tokenId).call(),
    platziPunks.methods.getTopType(tokenId).call(),
  ])
  const responseMetadata = await fetch(tokenURI)

  const metadata = await responseMetadata.json()

  return {
    tokenId,
    attributes: {
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  }
}

// Plural
export const usePlatziPunksData = ({ owner } = {}) => {
  const [punks, setPunks] = useState([])
  const [loading, setLoading] = useState(false)
  const platziPunks = usePlatziPunks()

  const update = useCallback(async () => {
    if (platziPunks) {
      setLoading(true)

      let tokenIds
      if (owner) {
        const balanceOf = await platziPunks.methods.balanceOf(owner).call()
        const fooTokenIds = new Array(Number(balanceOf))
          .fill()
          .map((_, idx) =>
            platziPunks.methods.tokenOfOwnerByIndex(owner, idx).call()
          )
        tokenIds = await Promise.all(fooTokenIds)
      } else {
        const totalSupply = await platziPunks.methods.totalSupply().call()
        tokenIds = new Array(Number(totalSupply)).fill().map((_, idx) => idx)
      }

      const punksPromise = tokenIds.map(async (tokenId) =>
        getPunkData({ platziPunks, tokenId })
      )
      const tmpPunks = await Promise.all(punksPromise)
      setPunks(tmpPunks)
      setLoading(false)
    }
  }, [platziPunks, owner])

  useEffect(() => {
    update()
  }, [update])

  return {
    punks,
    loading,
    update,
  }
}

export const usePlatziPunkData = (tokenId = null) => {
  const [punk, setPunk] = useState({})
  const [loading, setLoading] = useState(true)
  const platziPunks = usePlatziPunks()

  const update = useCallback(async () => {
    if (platziPunks && tokenId != null) {
      setLoading(true)

      const tmpPunks = await getPunkData({ platziPunks, tokenId })
      setPunk(tmpPunks)
      setLoading(false)
    }
  }, [platziPunks, tokenId])

  useEffect(() => {
    update()
  }, [update])

  return {
    punk,
    loading,
    update,
  }
}
