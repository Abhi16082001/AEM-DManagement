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
      const cntr = database.collection('vehicle');
      // Query for a movie that has the title 'Back to the Future'
      // const query = { title: 'Back to the Future' };
      const query = {cid:id  };
      const nsa = await cntr.find(query).toArray();
      const  ac= nsa.sort((a, b) => new Date(b.date) - new Date(a.date));
 
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


      export async function DELETE(request) {
        // Replace the uri string with your connection string.
        
        
        // Parse the request body to get the ID or any unique identifier for deletion
        const cid = await request.json(); // Assuming the request body contains the ID to delete
    console.log("cid",cid.mid)
    const client = await getClient();
        try {
            const database = client.db('AnilEarthMover');
            const cntr = database.collection('contractor');
            // Perform the delete operation
          
            const result = await cntr.deleteOne({_id: new ObjectId(cid.mid)  });
    
            if (result.deletedCount === 1) {
                console.log(`Successfully deleted the contractor data`);
                return NextResponse.json({ message: `Contractor data deleted successfully.`, ok: true });
            } else {
                return NextResponse.json({ message: `No data found with ID: ${cid}.`, ok: false }, { status: 404 });
            }
         
        } catch (error) {
            console.error('Error deleting data:', error);
            return NextResponse.json({ message: 'Internal Server Error', ok: false }, { status: 500 });
        } finally {
            // Ensures that the client will close when you finish/error
            // await client.close();
        }
    }