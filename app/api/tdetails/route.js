import { NextResponse } from "next/server";
import getClient from "@/lib/mongodb";
import { ObjectId } from 'mongodb';
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
  

    export async function PUT(request) {
      // Replace the uri string with your connection string.
      
      let tdtls= await request.json()
      const id=tdtls._id
delete tdtls._id;
   
      const client = await getClient();
        try {
          const database = client.db('AnilEarthMover');
          const tndr = database.collection('tender');
          // const rntrs = database.collection('renters');
          const result = await tndr.updateOne(
            { _id:new ObjectId(id), tid:tdtls.tid }, // Find the document by ID
            { $set: {...tdtls} } // Assuming 'yourArrayField' is the field to update
          );
          // const result2 = await rntrs.updateMany(
          //   { Bname: oldbname }, // Find the document by ID
          //   { $set: { Bname:bname } } // Assuming 'yourArrayField' is the field to update
          // ); add result2.modifiedcount ===0 in the just below if statement
          if (result.modifiedCount === 0)  {
            return NextResponse.json({ ok: false, message: 'Not updated' });
          }
    
          console.log("Updated sucessfully",result);
        return NextResponse.json({ ok: true, modifiedCount: result.modifiedCount });
        } 
        catch (error) {
          console.error("Failed to update the document:", error);
          return NextResponse.json({ ok: false, error: error.message });
        }
        finally {
          // Ensures that the client will close when you finish/error
          // await client.close();
        }
      }