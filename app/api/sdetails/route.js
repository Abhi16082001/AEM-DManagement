import { NextResponse } from "next/server";
import getClient from "@/lib/mongodb";
import { ObjectId } from 'mongodb';
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
  

    export async function PUT(request) {
      // Replace the uri string with your connection string.
      
      let sdtls= await request.json()
      const id=sdtls._id
delete sdtls._id;
   
      const client = await getClient();
        try {
          const database = client.db('AnilEarthMover');
          const stff = database.collection('staff');
          // const rntrs = database.collection('renters');
          const result = await stff.updateOne(
            { _id:new ObjectId(id), sid:sdtls.sid }, // Find the document by ID
            { $set: {...sdtls} } // Assuming 'yourArrayField' is the field to update
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