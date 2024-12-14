import { NextResponse } from "next/server";
import getClient from "@/lib/mongodb";
export async function GET(request) {
       
  console.log("I was here")

  const { searchParams } = new URL(request.url);
  const dmdl = searchParams.get('dmodel');
  const dmodel = dmdl ? JSON.parse(decodeURIComponent(dmdl)) : null;
  console.log(dmodel)
    const dte=dmodel.date
  console.log(dte)
  // Replace the uri string with your connection string.
  const client = await getClient();
    try {
      const database = client.db('AnilEarthMover');
      const query = {date:dte  };
      const cntr = database.collection('contractor');
      const fc = await cntr.find(query).toArray();
      const tndr = database.collection('tender');
      const ft = await tndr.find(query).toArray();
      const vhcl = database.collection('vehicle');
      const fv = await vhcl.find(query).toArray();
      const stff = database.collection('staff');
      const fs = await stff.find(query).toArray();
      // Query for a movie that has the title 'Back to the Future'
      // const query = { title: 'Back to the Future' };
  console.log(fc,ft,fv,fs)
      return NextResponse.json({success:true,fc,ft,fv,fs})
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }