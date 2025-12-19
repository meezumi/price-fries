"use client"
import { scrapAndStoreProduct } from '@/lib/actions';
import React, { FormEvent, useState } from 'react'
import { Spinner } from './Loaders'

const isValidAmazonProductURL = ( url: string ) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;
    
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement> ) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if(!isValidLink) {
      setError('Please enter a valid Amazon product link');
      return;
    }

    try {
      setIsLoading(true);
      await scrapAndStoreProduct(searchPrompt);
      setSuccess('Product added successfully!');
      setSearchPrompt("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form 
        className='flex flex-wrap gap-4 mt-12'
        onSubmit={handleSubmit}
      >
        <input 
          type="text"
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          placeholder='link of the amazon product you want your hands on?' 
          className='searchbar-input'
        />

        <button 
          type='submit' 
          className='searchbar-btn'
          disabled={searchPrompt === '' || isLoading}  
        >
          {isLoading ? (
            <>
              <div className="inline-block mr-2">
                <div className="spinner-small" />
              </div>
              on your way..
            </>
          ) : (
            'look me up'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded fade-in text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-3 p-3 bg-green-100 border border-green-400 text-green-700 rounded fade-in text-sm">
          {success}
        </div>
      )}
    </div>
  )
}

export default Searchbar