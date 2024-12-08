import { NextResponse } from "next/server";
import getClient from "@/lib/mongodb";

export async function GET(request) {
       
    console.log("I was here")
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('tid');
  
  // Replace the uri string with your connection string.
  const client = await getClient();
    try {
      const database = client.db('AnilEarthMover');
      const tndr = database.collection('tender');
      // Query for a movie that has the title 'Back to the Future'
      // const query = { title: 'Back to the Future' };
      const query = {tid:id  };
      const at = await tndr.find(query).toArray();
  console.log(at)
      return NextResponse.json({success:true,at})
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }



  export async function POST(request) {
    // Replace the uri string with your connection string.
    
    let tnd= await request.json()
    const client = await getClient();
      try {
        const database = client.db('AnilEarthMover');
        const tndr = database.collection('tender');
        const newt = await tndr.insertOne(tnd);
      
        console.log(newt);
        return NextResponse.json({newt,ok:true})
      } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
      }
    }
  