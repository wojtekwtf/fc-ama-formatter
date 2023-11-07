'use client'
import { useEffect, useState } from "react"
import { useSearchParams } from 'next/navigation'

import { getProcessedCastContent, getTimeSinceTimestamp } from "@/utils/textUtils"

import axios, { all } from "axios"

export default function Home() {

  const searchParams = useSearchParams()
  const warpcastUrl = searchParams.get('url')

  const [loadingAmaAuthor, setLoadingAmaAuthor] = useState(false)
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
      setLoadingAmaAuthor(true)
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
          setLoadingAmaAuthor(false)
        })
    } else {
      // todo announce the error
    }
  }, [warpcastUrl])

  useEffect(() => {
    if (!hash) return
    setLoadingCasts(true)
    axios.get(`https://api.neynar.com/v1/farcaster/all-casts-in-thread?threadHash=${hash}`, { "headers": { "api_key": "NEYNAR_API_DOCS" } })
      .then((res) => {
        const allCasts = res.data.result.casts
        const questions = allCasts.filter((cast: any) => cast.parentHash === hash).sort((a: any, b: any) => {
          return b.reactions.count - a.reactions.count
        })

        questions.forEach((question: any) => {
          const newAnswer = allCasts.find((cast: any) => cast.parentHash === question.hash && cast.author.fid === amaFid)
          if (!!newAnswer) console.log("q ", question)
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
      .finally(() => {
        setLoadingCasts(false)
      })
  }, [hash])

  return (
    <div>
      <div className='max-w-screen-md mx-auto'>
        <div className="px-4 sm:px-6 lg:px-8 flex flex-col pb-4 border-b">
          {!loadingAmaAuthor && hash
            ?
            <div className="flex flex-row mt-4">
              <img src={amaAvatar} className="inline-block shrink-0 h-12 w-12 rounded-full bg-gray-100 mr-4 hover:cursor-pointer"></img>
              <div className="flex-grow">
                <div className='flex flex-row justify-between items-center'>
                  <div className='mb-1'>
                    <div className="font-bold text-lg">{amaDisplayName}</div>
                    <div className='flex flex-row items-center'>
                      <div className="text-gray-400 mr-2">@{amaUsername}</div>
                    </div>
                  </div>
                </div>
                <div className="mb-2 text-sm lg:text-md">{amaBio}</div>
                <div className="flex flex-row text-sm">
                  <span className="mr-4 text-gray-700"><span className="font-semibold text-black">{amaFollowingCount}</span> Following</span>
                  <span className="mr-4 text-gray-700"><span className="font-semibold text-black">{amaFollowerCount}</span> Followers</span>
                </div>
              </div>
            </div>
            :
            <div role="status" className='flex flex-row justify-center py-4'>
              <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin fill-gray-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          }
        </div>
        <div className="px-4 sm:px-6 lg:px-8 flex flex-col pb-4">
          {!loadingCasts
            ?
            questions.map((question, index) => (
              <div key={question.question.hash} className="py-4 border-b">
                <div className="flex flex-row mr-2">
                  <div className="mr-2 flex-shrink-0 flex flex-col items-center">
                    {!!question.question.author.pfp.url
                      ? <img src={question.question.author.pfp.url} className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100"></img>
                      :
                      <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                    }
                    <div className='flex-grow w-0.5 bg-gray-200 mt-1 mb-2'></div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-row text-sm mb-1">
                      <p className='font-semibold mr-1 hover:underline'>{question.question.author.displayName}</p>
                      <p className='text-gray-500 hover:underline'>@{question.question.author.username}</p>
                      <span className='text-gray-500 ml-1'>·</span>
                      <span className='text-gray-500 ml-1'>{getTimeSinceTimestamp(question.question.timestamp)}</span>
                    </div>
                    <div className='mb-2'>
                      <p className="text-sm text-gray-900 mb-2" dangerouslySetInnerHTML={{ __html: getProcessedCastContent(question.question.text, []) }}>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="mr-2 flex-shrink-0">
                    {!!question.answer.author.pfp.url
                      ? <img src={question.answer.author.pfp.url} className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100"></img>
                      :
                      <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                    }
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-row text-sm mb-1">
                      <p className='font-semibold mr-1 hover:underline'>{question.answer.author.displayName}</p>
                      <p className='text-gray-500 hover:underline'>@{question.answer.author.username}</p>
                      <span className='text-gray-500 ml-1'>·</span>
                      <span className='text-gray-500 ml-1'>{getTimeSinceTimestamp(question.answer.timestamp)}</span>
                    </div>
                    <div className='mb-2'>
                      <p className="text-sm text-gray-900 mb-2" dangerouslySetInnerHTML={{ __html: getProcessedCastContent(question.answer.text, []) }}>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
            :
            <div role="status" className='flex flex-row justify-center py-4'>
              <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin fill-gray-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
