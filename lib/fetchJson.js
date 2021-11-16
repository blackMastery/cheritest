// import fetch from 'node-fetch'

export default async function fetcher(...args) {

  // if (typeof window === 'undefined') return 

  // console.log('FETCHER  args', ...args)

    try {
      const response = await fetch(...args)
  
      // if the server replies, there's always some data in json
      // if there's a network error, it will throw at the previous line
      const data = await response.json()
  
      // console.log({data})
      if (response.ok) {

        return data
      }

  
      const error = new Error(response.statusText)
      error.response = response
      console.log('FETCHER ERR', error)
      error.data = data
      throw error
    } catch (error) {
      if (!error.data) {
        error.data = { message: error.message }
      }
      throw error
    }
  }