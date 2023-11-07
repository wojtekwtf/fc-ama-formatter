'use client'
import Link from "next/link"
import { useState } from "react"

export default function Home() {

  const [warpcastURL, setWarpcastURL] = useState("")

  // todo: warpcast url must match https://warpcast.com/dwr.eth/0xa04f0f2c format to proceed

  return (
    <div>
      <h2>Farcaster ama formatter</h2>
      <h3>Revious AMAs</h3>
      <ul className="flex flex-col">
        <li>
          <Link href="#" className="underline">
            Vitalik Buterin
          </Link>
        </li>
        <li>
          <Link href="#" className="underline">
            Brian Armstrong
          </Link>
        </li>
        <li>
          <Link href="#" className="underline">
            Fred Wilson
          </Link>
        </li>
      </ul>
      <h3>Create your own</h3>
      <input
        value={warpcastURL}
        onChange={(e) => setWarpcastURL(e.target.value)}
        className=""
        placeholder="https://warpcast.com/dwr.eth/0xa04f0f2c"
      />
      <Link
        href={`/ama/?url=${warpcastURL}`}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
      >
        Create
      </Link>
    </div>
  )
}
