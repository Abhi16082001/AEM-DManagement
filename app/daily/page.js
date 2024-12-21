"use client"
import { useState, useEffect,Suspense } from "react";
import { TbEditCircle } from "react-icons/tb";
import { useSearchParams } from "next/navigation";
import { RiDeleteBin5Line } from "react-icons/ri";
export default function Page() {
const [alld, setalld] = useState([])
const [alls, setalls] = useState([])
const [allv, setallv] = useState([])
const [allc, setallc] = useState([])
const [allt, setallt] = useState([])
const [alrt, setalrt] = useState("")
const [dmodel, setdmodel] = useState({})
const [alert, setalert] = useState("");
const [valert, setvalert] = useState("");
const [talert, settalert] = useState("");
const [calert, setcalert] = useState("");
const [salert, setsalert] = useState("");

 
const onchange = (e) => {
    setdmodel({
      ...dmodel,
      [e.target.name]: e.target.value,
    });
  };

const fetchall = async (e) => {
  e.preventDefault(); 
    setalrt("Loading...");
    const co = { ...dmodel };
    try {
      const response = await fetch(`/api/daily?dmodel=${encodeURIComponent(JSON.stringify(co))}`,{
        method: 'GET',
      });
const data= await response.json()
      if (data.success) {
        const fc = data.fc
        const ft = data.ft
        const fv = data.fv 
        const fs = data.fs
        setsalert("")
        settalert("")
        setvalert("")
        setcalert("")
        setalld([...fc,...ft,...fv,...fs])
        setallc(fc)
        setallv(fv)
        setallt(ft)
        setalls(fs)
        if(fc.length==0 && fs.length==0 && fv.length==0 && ft.length==0)
        {setalert("NO DETAILS TO SHOW !!")
          console.log(alld)
        }
        if(fs.length==0)
          {setsalert("NO STAFF DETAILS TO SHOW !!")
            console.log(fs)
          }
          if(fv.length==0)
            {setvalert("NO VEHICLE DETAILS TO SHOW !!")
              console.log(fv)
            }
            if(fc.length==0)
              {setcalert("NO CONTRACTOR DETAILS TO SHOW !!")
                console.log(fc)
              }
              if(ft.length==0)
                {settalert("NO TENDER DETAILS TO SHOW !!")
                  console.log(ft)
                }
        setalrt("")
      } else {
        setalert("Error in Fetching Details.");
      }
    } catch (error) {
      setalert("Error in Fetching Details.");
      console.error('Error:', error);
    }
  };

   
 return (
  <>

Daily Summary !!
<form onSubmit={fetchall} className="space-y-4">
<label htmlFor="date" className="block text-md font-semibold text-green-500">
      Date:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={dmodel?.date || ""} required type="date" name="date" id="date" 
      onChange={onchange}       placeholder="Enter Date"
      className=" w-full px-4 py-2 border border-green-500 bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
<select onChange={onchange} name="dtype" id="dtype" value={dmodel?.dtype || ""}>
    <option value="">Choose Data type</option>
  <option value="staff">Staff</option>
  <option value="vehicle">Vehicle</option>
  <option value="contractor">Contractor</option>
  <option value="tender">Tender</option>
  <option value="All">All</option>
</select>

<button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 ">
        Fetch Data</button>
</form>
 
{(dmodel?.dtype==="All")?(<> {alld.map((b) => (
        <div key={b._id}
            className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'>      
           <span  className="inline-block w-full sm:w-3/5"> {b.date} -- {b.rmrk} </span>  
         
       </div>
      ))}
        {alert && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {alert}
    </div>
  )}
      </>):""}
{(dmodel?.dtype==="staff")?(<> {alls.map((b) => (
        <div key={b._id}
            className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'>      
           <span  className="inline-block w-full sm:w-3/5"> {b.date} -- {b.rmrk} </span>  
      
       </div>
      ))}
           {salert && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {salert}
    </div>
  )}
      </>):""}
{(dmodel?.dtype==="vehicle")?(<> {allv.map((b) => (
        <div key={b._id}
            className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'>      
           <span  className="inline-block w-full sm:w-3/5"> {b.date} -- {b.rmrk} </span>  
      
       </div>
      ))}
           {valert && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {valert}
    </div>
  )}
      </>):""}
{(dmodel?.dtype==="contractor")?(<> {allc.map((b) => (
        <div key={b._id}
            className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'>      
           <span  className="inline-block w-full sm:w-3/5"> {b.date} -- {b.rmrk} </span>  
       
       </div>
      ))}
          {calert && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {calert}
    </div>
  )}
      </>):""}
{(dmodel?.dtype==="tender")?(<> {allt.map((b) => (
        <div key={b._id}
            className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'>      
           <span  className="inline-block w-full sm:w-3/5"> {b.date} -- {b.rmrk} </span>  
        
       </div>
      ))}
         {talert && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {talert}
    </div>
  )}
      </>):""}

{alrt && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {alrt}
    </div>
  )}

  </>
 )
}

