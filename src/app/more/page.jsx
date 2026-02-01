import GetMytoken from '@/lib/GetuserToken'
import React from 'react'

export default async function page() {

    const token= await GetMytoken()
    console.log("token",token)
  return (
    <div>
      test token
    </div>
  )
}
