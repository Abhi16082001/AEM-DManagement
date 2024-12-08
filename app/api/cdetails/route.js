import { NextResponse } from "next/server";
import getClient from "@/lib/mongodb";
import { ObjectId } from 'mongodb';
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
  

    export async function PUT(request) {
      // Replace the uri string with your connection string.
      
      let cdtls= await request.json()
      const id=cdtls._id
delete cdtls._id;
   
      const client = await getClient();
        try {
          const database = client.db('AnilEarthMover');
          const cntr = database.collection('contractor');
          // const rntrs = database.collection('renters');
          const result = await cntr.updateOne(
            { _id:new ObjectId(id), cid:cdtls.cid }, // Find the document by ID
            { $set: {...cdtls} } // Assuming 'yourArrayField' is the field to update
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