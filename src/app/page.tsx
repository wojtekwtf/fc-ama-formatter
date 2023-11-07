'use client'
import Link from "next/link"
import { useState } from "react"

export default function Home() {

  const [warpcastURL, setWarpcastURL] = useState("")

  // todo: warpcast url must match https://warpcast.com/dwr.eth/0xa04f0f2c format to proceed

  return (
    <div className="flex flex-col items-center py-12">
      <h2 className="text-2xl text-medium py-6">Farcaster ama formatter</h2>
      <h3 className="mb-2">Revious AMAs</h3>
      <ul className="flex flex-col mb-4">
        <li className="py-1 text-center">
          <Link href="/ama?url=https://warpcast.com/dwr.eth/0x390ae86a" className="underline">
            Vitalik Buterin
          </Link>
        </li>
        <li className="py-1 text-center">
          <Link href="/ama?url=https://warpcast.com/dwr.eth/0x7735946a" className="underline">
            Brian Armstrong
          </Link>
        </li>
        <li className="py-1 text-center">
          <Link href="/ama?url=https://warpcast.com/dwr.eth/0x87e91802" className="underline">
            Fred Wilson
          </Link>
        </li>
      </ul>
      <h3 className="text-lg mb-2">Create your own</h3>
      <div className="flex flex-row">
        <input
          value={warpcastURL}
          onChange={(e) => setWarpcastURL(e.target.value)}
          className="border rounded-md mr-2 px-2 focus:outline-none"
          placeholder="https://warpcast.com/dwr.eth/0x87e91802"
        />
        <Link
          href={`/ama/?url=${warpcastURL}`}
          className={`bg-purple-500 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded`}
        >
          Create
        </Link>
      </div>
    </div>
  )
}
