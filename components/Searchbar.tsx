"use client"
import React, { FormEvent, useState } from 'react'

const isValidAmazonProductURL = ( url: string ) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;
    
    // check if hostname contains amazon.com or amazon.(countrycodes) e.x -> amazon.in
    if(
      hostname.includes('amazon.com') || 
      hostname.includes('amazon.') || 
      hostname.endsWith('amazon')
    ) {
      return true;
    }
    
  } catch(error) {
      return false;
  }
  return false;
}

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

   // since handling submits would be done from the client {using hooks}, we have to make this as use client site
  const handleSubmit = (event: FormEvent<HTMLFormElement> ) => {
    // since we using typescript, we need to specify the type of event happening too.
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);
    // alert(isValidLink ? 'valid' : 'invalid') manual check if its true/false.

    if(!isValidLink) return alert('you sure its from amazon :)?')

    // here we will add the loading state  
    try {
      setIsLoading(true);

      // scraping the product will be added here.
    } catch (error) {
      console.log(error);

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form 
      className='flex flex-wrap gap-4 mt-12'
      onSubmit={handleSubmit}
    >
      <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        // this just gonna keep track of our value, i.e , input within out state
        placeholder='link of product you want your hands on?' 
        className='searchbar-input'
      />

      <button 
        type='submit' 
        className='searchbar-btn'
        disabled={searchPrompt === ''}  
      >
        {isLoading ? 'on your way..' : 'look me up'}
      </button>

    </form>
  )
}

export default Searchbar