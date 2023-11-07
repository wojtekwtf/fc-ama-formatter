'use client'
import { useEffect, useState } from "react"
import { useSearchParams } from 'next/navigation'

import axios, { all } from "axios"

export default function Home() {

  const searchParams = useSearchParams()
  const warpcastUrl = searchParams.get('url')

  const [loadingCastDetails, setLoadingCastDetails] = useState(false)
  const [loadingCasts, setLoadingCasts] = useState(false)

  const [questions, setQuestions] = useState([])
  const [hash, setHash] = useState("")
  const [amaFid, setAmaFid] = useState("")
  const [amaUsername, setAmaUsername] = useState("")
  const [amaDisplayName, setAmaDisplayName] = useState("")
  const [amaAvatar, setAmaAvatar] = useState("")
  const [amaBio, setAmaBio] = useState("")
  const [amaFollowerCount, setAmaFollowerCount] = useState("")
  const [amaFollowingCount, setAmaFollowingCount] = useState("")

  useEffect(() => {
    // todo check if warpcast url is valid before
    if (warpcastUrl) {
      setLoadingCastDetails(true)
      axios.get(`https://api.neynar.com/v2/farcaster/cast?type=url&identifier=${warpcastUrl}`, { "headers": { "api_key": "NEYNAR_API_DOCS" } })
        .then((res) => {
          setHash(res.data.cast.hash)
          setAmaFid(res.data.cast.mentioned_profiles[0].fid)
          setAmaAvatar(res.data.cast.mentioned_profiles[0].pfp_url)
          setAmaBio(res.data.cast.mentioned_profiles[0].profile.bio.text)
          setAmaDisplayName(res.data.cast.mentioned_profiles[0].display_name)
          setAmaUsername(res.data.cast.mentioned_profiles[0].username)
          setAmaFollowerCount(res.data.cast.mentioned_profiles[0].follower_count)
          setAmaFollowingCount(res.data.cast.mentioned_profiles[0].following_count)
        })
        .catch((err) => {
          console.log(err)
          // todo announce the error
        })
        .finally(() => {
          setLoadingCastDetails(false)
        })
    } else {
      // todo announce the error
    }
  }, [warpcastUrl])

  useEffect(() => {
    if (!hash) return

    axios.get(`https://api.neynar.com/v1/farcaster/all-casts-in-thread?threadHash=${hash}`, { "headers": { "api_key": "NEYNAR_API_DOCS" } })
      .then((res) => {
        const allCasts = res.data.result.casts
        const questions = allCasts.filter((cast: any) => cast.parentHash === hash)


        questions.forEach((question: any) => {
          const newAnswer = allCasts.find((cast: any) => cast.parentHash === question.hash && cast.author.fid === amaFid)
          if (!!newAnswer) console.log("q ", question.text)
          if (!!newAnswer) console.log("a ", newAnswer.text)
          if (!!newAnswer) {
            setQuestions((prevQuestions) => [...prevQuestions, { question, answer: newAnswer }])
          }
        })
      })
      .catch((err) => {
        console.log(err)
        // todo announce the error
      })
  }, [hash])

  return (
    <div>
      {hash
        ?
        <div>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <img src={amaAvatar} className="w-24 h-24 rounded-full" />
              <p>{hash}</p>
              <p className="text-xl">{amaDisplayName}</p>
              <p className="text-sm">{amaUsername}</p>
              <p className="text-sm">{amaBio}</p>
              <p className="text-sm">{amaFollowerCount} followers</p>
              <p className="text-sm">{amaFollowingCount} following</p>
            </div>
          </div>
        </div>
        :
        <p>no hash</p>
      }
      {questions.map((question, index) => {
        return (
          <div key={index} className="flex flex-col">
            <p>{question.question.text}</p>
            <p>{question.answer.text}</p>
          </div>
        )
      }
      )}
    </div>
  )
}
