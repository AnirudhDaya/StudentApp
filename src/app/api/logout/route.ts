import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
      
    try {
      const val = request.cookies.get('token');
      if(val)
        {
            request.cookies.delete('token');
            return NextResponse.json({ status: 200 });
        }
      else
        return NextResponse.json({ status: 400 });
    }
    catch(e){
        return NextResponse.json({ status: 400 });
    }
  }