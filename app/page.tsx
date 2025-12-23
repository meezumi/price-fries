import React from 'react'
import Image from 'next/image'
import { Suspense } from 'react'
import Searchbar from '@/components/Searchbar'
import HeroCarousel from '@/components/HeroCarousel'
import { getAllProducts } from '@/lib/actions'
import ProductCard from '@/components/ProductCard'
import { Pagination } from '@/components/Pagination'
import { SkeletonGrid } from '@/components/Loaders'
import { PAGINATION } from '@/lib/constants'
import SortBar from '@/components/SortBar'

interface HomeProps {
  searchParams: { page?: string; sort?: string }
}

const ProductsList = async ({ page, sort }: { page: number; sort: string }) => {
  const result = await getAllProducts(page, PAGINATION.DEFAULT_LIMIT, sort as any);
  
  if (!result) {
    return <div>Failed to load products</div>;
  }

  const { products, pagination } = result;

  return (
    <>
      {products && products.length > 0 ? (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8'> 
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination 
            currentPage={pagination.page}
            totalPages={pagination.pages}
            baseUrl="/products"
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products tracked yet. Add one to get started!</p>
        </div>
      )}
    </>
  );
};

const Home = async ({ searchParams }: HomeProps) => {
  const page = parseInt(searchParams?.page || '1', 10);
  const sort = searchParams?.sort || 'newest';

  return ( 
    <>
      <section className='px-6 md:px-20 py-24'> 
        <div className='flex max-xl:flex-col gap-16'>
          <div className='flex flex-col justify-center'>
            <p className='small-text'>
              Shop smart online, wait up and
            </p>

            <h1 className='head-text'>
              Unshackle the Power of
              <span className='text-teal-500'> PriceFries</span>
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
        <SortBar />
        
        <Suspense fallback={<SkeletonGrid />}>
          <ProductsList page={page} sort={sort} />
        </Suspense>
      </section>
    </>
  )
}

export default Home 