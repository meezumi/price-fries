import React from 'react'
import Image from 'next/image'
import Searchbar from '@/components/Searchbar'
import HeroCarousel from '@/components/HeroCarousel'
import { getAllProducts } from '@/lib/actions'
import ProductCard from '@/components/ProductCard'

const Home = async () => {
  const allProducts = await getAllProducts();

  return ( 
    <>
    {/* empty react elements helps us to add more elements within it. */}
      <section className='px-6 md:px-20 py-24'> 
        <div className='flex max-xl:flex-col gap-16'>
          <div className='flex flex-col justify-center'>

            <p className='small-text'>
              Shop smart online, wait up and 
              <Image 
                src={"/assets/icons/arrow-right.svg"}
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>

            <h1 className='head-text'>
              Unshackle the Power of
              <span className='text-primary'> PriceFries</span>
            </h1>
            
            <p className='mt-6'>
              Powerful, self-serve product and growth analytics to help you convert, engage and retain more.
            </p>

            <Searchbar />

          </div>

          <HeroCarousel />

        </div>
      </section>

      <section className='trending-section'>
        <h2 className='section-text'>Trending</h2>

        {/* now we will be adding new real products, the user will be adding */}
        <div className='flex flex-wrap gap-x-8 gap-y-16'> 
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  )
}

export default Home 