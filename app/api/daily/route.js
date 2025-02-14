import { NextResponse } from "next/server";
import getClient from "@/lib/mongodb";
export async function GET(request) {
       
  console.log("I was here")

  const { searchParams } = new URL(request.url);
  const dmdl = searchParams.get('dmodel');
  const dmodel = dmdl ? JSON.parse(decodeURIComponent(dmdl)) : null;
  console.log(dmodel)
    const frm=dmodel.from
    const to=dmodel.to
  // Replace the uri string with your connection string.
  const client = await getClient();
    try {
      const database = client.db('AnilEarthMover');
      const query = { date: {
        $gte: frm,
        $lte: to,
      } , };

      const vhcl = database.collection('vehicle');
      const fv = await vhcl.find(query).toArray();
      const stff = database.collection('staff');
      const fs = await stff.find(query).toArray();
      // Query for a movie that has the title 'Back to the Future'
      // const query = { title: 'Back to the Future' };
  console.log(fv,fs)
      return NextResponse.json({success:true,fv,fs})
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }



   export async function PUT(request) {
        // Replace the uri string with your connection string.
        
        let dtls= await request.json()
       const pwd=dtls.pwd
       const dtpe=dtls.dtype
        const client = await getClient();
          try {
            const database = client.db('AnilEarthMover');
            const collection = database.collection('alldata');
          
                const res=await collection.updateOne(
                  { dtype: dtpe},
                  { $set: { details: pwd } }
                );
          
            if (res.modifiedCount === 0 )  {
              return NextResponse.json({ ok: false, message: 'Password is same as before, NOT updated !' });
            }
            console.log("Updated sucessfully",res);
          return NextResponse.json({ ok: true, modifiedCount: res.modifiedCount });
          } 
          catch (error) {
            console.error("Failed to update the password:", error);
            return NextResponse.json({ ok: false, error: error.message });
          }
          finally {
            // Ensures that the client will close when you finish/error
            // await client.close();
          }
        }
  