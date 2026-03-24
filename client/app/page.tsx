"use client";
import  { useState } from 'react'

const page = () => {
  const [longURL, setLongUrl] = useState("") 
  const [shortURL, setShortUrl] = useState("")
  const [generateShortUrl, setGeneratedShortUrl] = useState("")
  const [retrieveLongUrl, setRetrievedLongUrl] = useState("")
  const [error, setError] = useState("")


  // two fucntions which are going to be our two api calls
  const handleGenerateShortUrl = async() => {
    try {
      const response = await fetch("http://localhost:3001/shorten" , {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          "originalURL" : longURL
        }),
      })

      const data = await response.json();
      console.log(data)
      if(response.ok) {
        setGeneratedShortUrl(data.data)
      }

      else {
        setError("not generated");
      }


    } catch (error) {
      console.log(error)
      setError: (error)
    }
  }

  const handleRetrieveLongUrl = async () => {
    try {
      const response = await fetch(`http://localhost:3001/${shortURL}`)
      const data = await response.json();
      if(response.ok) {
        setRetrievedLongUrl(data.data);
      }

      else{
        setError("couldnt fetch")
      }

    } catch (error) {
      console.log(error)
      setError: (error)
    }
  }


  return (
    <div className='min-h-screen bg-amber-950 flex flex-col items-center justify-center p-4'>
      <h1 className='text-3xl font-bold pb-8 font-serif'>Welcome to MegaMicro URL</h1>

      {/* Generate a new short URL*/ }

      <div className='w-full max-w-md bg-amber-100 rounded-lg p-6 mb-6'>
        <h2 className='text-xl font-semibold mb-4 text-black'>Generate Short URL</h2>

        <input type="text"
               placeholder='Enter Long URL'
               value={longURL}
               onChange={(e) => setLongUrl((e.target as HTMLInputElement).value)}
               className='w-full bg-amber-950 p-3 rounded-lg text-amber-50 mb-3'/>
        
        <button onClick={handleGenerateShortUrl}
                className='w-full bg-blue-950 rounded-lg hover:bg-blue-400 text-white py-1.5'>Generate Short URL
        </button>

        {generateShortUrl} && (
          <p className='mt-4 text-cyan-950'>
            Short URL: <a href={`/${generateShortUrl}`} target="_blank"> {generateShortUrl} </a>
          </p>
        )

      </div>

        {/*Retrieve long URL */}

        <div className='w-full max-w-md bg-amber-100 rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4 text-black'>Get your long URL back</h2>

          <input type="text"
               placeholder='Enter Short URL'
               value={shortURL}
               onChange={(e) => setShortUrl((e.target as HTMLInputElement).value)}
               className='w-full bg-amber-950 p-3 rounded-lg text-amber-50 mb-3'/>
        
        <button onClick={handleRetrieveLongUrl}
                className='w-full bg-amber-500 rounded-lg hover:bg-amber-300 text-white py-1.5'>Get Long URL
        </button>

        {retrieveLongUrl} && (
          <p className='mt-4 text-cyan-950'>
            Long URL: <a href={`/${retrieveLongUrl}`} target="_blank"> {retrieveLongUrl} </a>
          </p>
        )

        </div>

    </div>
  )
}

export default page 
