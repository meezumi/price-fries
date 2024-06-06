'use client'

import { FormEvent, Fragment, useState } from 'react'
import { Description, Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import Image from 'next/image';
import { addUserEmailToProduct } from '@/lib/actions';

interface Props {
  productId: string
}

const Modal = ( { productId }: Props ) => {
  let [isOpen, setIsOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

    // e here is event, a form event, basically of the type htlmformevent
    
    e.preventDefault(); // so that submitting doesnt reload the page
    setIsSubmitting(true);

    // the entire function created in the actions
    await addUserEmailToProduct(productId, email);

    setIsSubmitting(false);
    setEmail("");
    closeModal();
    
  }

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);



  return (
    <>
      <button type='button' className='btn' onClick={openModal}> 
        Track
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border border-black rounded bg-white p-12">
            <DialogTitle className="font-extrabold">
              Stay updated with product pricing alerts right from your inbox!
            </DialogTitle>

            <Description>
              Never miss a bargain again with our timely alerts!
            </Description>

            <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
              <label htmlFor="email" className='text-sm font-bold text-gray-700'>
                Email address
              </label>

              <div className='dialog-input_container'>
                <Image 
                  src={"/assets/icons/mail.svg"}
                  alt="mail"
                  height={18}
                  width={18}
                />

                <input
                  required
                  type='email'
                  id='email'
                  placeholder='Enter your email here :)'
                  className='no-outline'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />  

              </div>

              <button 
                type='submit' 
                className='dialog-btn'
              >
                {isSubmitting ? 'Submitting..' : 'Track' }
              </button>

            </form>
          </DialogPanel>
        </div>
        </Dialog>
      </Transition>
      
    </>
  )
}

export default Modal