import { NextResponse } from "next/server";
import getClient from "@/lib/mongodb";

export async function GET(request) {
       
    console.log("I was here")
    const { searchParams } = new URL(request.url);
    const dtyp = searchParams.get('dtyp');
  
  // Replace the uri string with your connection string.
  const client = await getClient();
    try {
      const database = client.db('AnilEarthMover');
      const collection = database.collection('alldata');
      // Query for a movie that has the title 'Back to the Future'
      // const query = { title: 'Back to the Future' };
      const query = { dtype:dtyp };
      const nstf = await collection.findOne(query);

  const result=nstf.details
  console.log(result)
      return NextResponse.json({success:true,result})
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }



  export async function POST(request) {
    // Replace the uri string with your connection string.
    
    let dtls= await request.json()
    const { searchParams } = new URL(request.url);
    const dtyp = searchParams.get('dtyp');
    const client = await getClient();
      try {
        const database = client.db('AnilEarthMover');
        const collection = database.collection('alldata');

        const filter = { dtype: dtyp }; // Find the document with dtype "staff"
        const update = { $push: { details: dtls } }; // Push to details array

        const result = await collection.updateOne(filter, update);
        if (result.matchedCount === 0) {
            return NextResponse.json({ ok: false, message: "Document not found" }, { status: 404 });
        }
        return NextResponse.json({ ok: true, message: "Details updated successfully", result });
   
      } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
      }
    }
  


    export async function PUT(request) {
      // Replace the uri string with your connection string.
      
      let dtls= await request.json()
     const pkey=dtls.pkey
     const okey=dtls.okey
     const dtpe=dtls.dtype
     delete dtls.pkey;
     delete dtls.dtype;
     delete dtls.okey;
   console.log('pkey:',pkey)
      const client = await getClient();
        try {
          const database = client.db('AnilEarthMover');
          const collection = database.collection('alldata');
          // const rntrs = database.collection('renters');
       
          const filter = { dtype: dtpe}; // Find the document with dtype "staff"
          // const update = { $push: { details: dtls } }; // Push to details array
  
          const result = await collection.findOne(filter);
          console.log('result:',result)
          const epkey = await result.details.findIndex(item => item[pkey] === okey);

          if (epkey !== -1) {
            result.details[epkey] = { ...dtls  };
          } else {
                result.details.push(dtls );
              }

              const res=await collection.updateOne(
                { dtype: dtpe},
                { $set: { details: result.details } }
              );
         
          // const result2 = await rntrs.updateMany(
          //   { Bname: oldbname }, // Find the document by ID
          //   { $set: { Bname:bname } } // Assuming 'yourArrayField' is the field to update
          // ); add result2.modifiedcount ===0 in the just below if statement
          // if (result.modifiedCount === 0)  {
          //   return NextResponse.json({ ok: false, message: 'Not updated' });
          // }
          if (res.modifiedCount === 0)  {
            return NextResponse.json({ ok: false, message: 'Not updated' });
          }
          console.log("Updated sucessfully",res);
        return NextResponse.json({ ok: true, modifiedCount: res.modifiedCount });
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