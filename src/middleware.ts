// middleware.js

import { NextRequest, NextResponse } from 'next/server';
import { toast } from './components/ui/use-toast';
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login';

  const sessionToken = request.cookies.get('token_stud')?.value || '';

  // TODO: instead of userdetails return teaminformation 
  if(isPublicPath && sessionToken){ // TODO: wtf IS THIS API
    const res = await fetch('https://proma-ai-uw7kj.ondigitalocean.app/userdetails/', {
      method: 'POST',
      headers: {
        Authorization: `Token ${sessionToken}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      // If a user session exists, redirect to the main page
      toast({
        title: 'Already Logged In',
        description: `Redirecting you back`,
      })
    return NextResponse.redirect(new URL('/', request.nextUrl));
    }
  }

  if(!isPublicPath && !sessionToken){
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
  
}

// Then apply the middleware
export const config = {
  matcher: ['/', '/login','/diary']
};
