import { NextResponse } from "next/server";
import getClient from "@/lib/mongodb";

export async function GET(request) {
       
    console.log("I was here")
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('sid');
  
  // Replace the uri string with your connection string.
  const client = await getClient();
    try {
      const database = client.db('AnilEarthMover');
      const stff = database.collection('staff');
      // Query for a movie that has the title 'Back to the Future'
      // const query = { title: 'Back to the Future' };
      const query = {sid:id  };
      const as = await stff.find(query).toArray();
  console.log(as)
      return NextResponse.json({success:true,as})
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }



  export async function POST(request) {
    // Replace the uri string with your connection string.
    
    let stf= await request.json()
    const client = await getClient();
      try {
        const database = client.db('AnilEarthMover');
        const stff = database.collection('staff');
        const news = await stff.insertOne(stf);
      
        console.log(news);
        return NextResponse.json({news,ok:true})
      } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
      }
    }
  