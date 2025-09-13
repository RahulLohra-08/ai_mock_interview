import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'
import { isAuthenticated } from '@/lib/auth.action'

const RootLayout = async ({ children } : { children: ReactNode}) => {

  const isUserAuthenticate = await isAuthenticated();  
  console.log("Is user authenticated (layout)?", isUserAuthenticate);

  if(!isUserAuthenticate) {
    redirect('/sign-in');
  }


  return (
    <div className='root-layout'>
      <nav>
        <Link href="/" className='flex items-center gap-2'>
          <Image src="/logo.svg" alt="Logo" width={38} height={32} />
          <h2 className='text-primary-100'>PreWise</h2>
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout