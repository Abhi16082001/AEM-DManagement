import { NextResponse } from "next/server";
import getClient from "@/lib/mongodb";

export async function GET(request) {
       
    console.log("I was here")
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('cid');
  
  // Replace the uri string with your connection string.
  const client = await getClient();
    try {
      const database = client.db('AnilEarthMover');
      const cntr = database.collection('contractor');
      // Query for a movie that has the title 'Back to the Future'
      // const query = { title: 'Back to the Future' };
      const query = {cid:id  };
      const ac = await cntr.find(query).toArray();
  console.log(ac)
      return NextResponse.json({success:true,ac})
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }



  export async function POST(request) {
    // Replace the uri string with your connection string.
    
    let cnt= await request.json()
    const client = await getClient();
      try {
        const database = client.db('AnilEarthMover');
        const cntr = database.collection('contractor');
        const newc = await cntr.insertOne(cnt);
      
        console.log(newc);
        return NextResponse.json({newc,ok:true})
      } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
      }
    }
  