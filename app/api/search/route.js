import { NextResponse } from "next/server";
import getClient from "@/lib/mongodb";
export async function GET(request) {
       
  console.log("I was here")

  const { searchParams } = new URL(request.url);
  const mdl = searchParams.get('model');
  const dmdl = mdl ? JSON.parse(decodeURIComponent(mdl)) : null;
  console.log(dmdl)
    const dtpe=dmdl.dtype
    delete dmdl.dtype;
  // Replace the uri string with your connection string.
  const client = await getClient();
    try {
      const database = client.db('AnilEarthMover');
      let query = {};

      // Dynamically construct the query by checking each field
      Object.keys(dmdl).forEach((key) => {
        if (dmdl[key]) {
          query[key] = dmdl[key];
        }
      });
      console.log(query)
      const cntr = database.collection(`${dtpe}`);
      const sr = await cntr.find(query).toArray();
     
      // Query for a movie that has the title 'Back to the Future'
      // const query = { title: 'Back to the Future' };
  console.log(sr)
      return NextResponse.json({success:true,sr})
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }