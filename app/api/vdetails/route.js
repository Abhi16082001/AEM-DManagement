import { NextResponse } from "next/server";
import getClient from "@/lib/mongodb";
import { ObjectId } from 'mongodb';
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
  

    export async function PUT(request) {
      // Replace the uri string with your connection string.
      
      let vdtls= await request.json()
      const id=vdtls._id
delete vdtls._id;
   
      const client = await getClient();
        try {
          const database = client.db('AnilEarthMover');
          const vhcl = database.collection('vehicle');
          // const rntrs = database.collection('renters');
          const result = await vhcl.updateOne(
            { _id:new ObjectId(id), vno:vdtls.vno }, // Find the document by ID
            { $set: {...vdtls} } // Assuming 'yourArrayField' is the field to update
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