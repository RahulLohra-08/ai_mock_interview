import React, { ReactNode } from 'react'
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth.action';

const AuthLayout = async ({ children } : { children: ReactNode }) => {

   const isUserAuthenticate = await isAuthenticated();  
   
    if(isUserAuthenticate) {
       redirect('/');
    }
  
  return (
    <div className='auth-layout'>{children}</div>
  )
}

export default AuthLayout