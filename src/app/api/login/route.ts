import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest) {


      const data = await request.json();
    //   const token = data.token;
    
      cookies().set('token', data.token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
     
      return NextResponse.json({}, { status: 200 });
  }
export async function GET(request: NextRequest) {
      
    try {
      const val = request.cookies.get('token');
      if(val)
        return NextResponse.json({token: val}, { status: 200 });
      else
        return NextResponse.json({token: null}, { status: 400 });
    }
    catch(e){
        return NextResponse.json({token: null}, { status: 400 });
    }
  }
