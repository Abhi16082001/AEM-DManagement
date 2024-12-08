import { NextResponse } from "next/server";
import getClient from "@/lib/mongodb";

export async function GET(request) {
        
    console.log("I was here")
    const { searchParams } = new URL(request.url);
    const vn = searchParams.get('vno');
  
  // Replace the uri string with your connection string.
  const client = await getClient();
    try {
      const database = client.db('AnilEarthMover');
      const vhcl= database.collection('vehicle');
      // Query for a movie that has the title 'Back to the Future'
      // const query = { title: 'Back to the Future' };
      const query = { vno:vn };
      const av = await vhcl.find(query).toArray();
  console.log(av)
      return NextResponse.json({success:true,av})
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }



  export async function POST(request) {
    // Replace the uri string with your connection string.
    
    let vhc= await request.json()
    const client = await getClient();
      try {
        const database = client.db('AnilEarthMover');
        const vhcl = database.collection('vehicle');
        const newv = await vhcl.insertOne(vhc);
      
        console.log(newv);
        return NextResponse.json({newv,ok:true})
      } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
      }
    }
  