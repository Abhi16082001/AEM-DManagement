"use client"
import { useState,useEffect } from "react";
export default function Page() {
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
const [stf, setstf] = useState([])
const [vhcl, setvhcl] = useState([])
const [cntr, setcntr] = useState([])
const [tndr, settndr] = useState([])
const [skey, setskey] = useState("")
const [vkey, setvkey] = useState("")
const [ckey, setckey] = useState("")
const [tkey, settkey] = useState("")

const cvhcl = (e) => {
  
  setvkey(e.target.value);
};
const cstf = (e) => {
  
  setskey(e.target.value);
};
const ctndr = (e) => {
  
  settkey(e.target.value);
};
const ccntr = (e) => {
  
  setckey(e.target.value);
};
const fetchs = async () => {
  const response = await fetch("/api/alldata?dtyp=staff");
  let sjson = await response.json();
  setstf(sjson.result);
};

useEffect(() => {
   fetchs();
},[]);


const fetchc = async () => {
  const response = await fetch("/api/alldata?dtyp=contractor");
  let cjson = await response.json();
  setcntr(cjson.result);
};

useEffect(() => {
   fetchc();
},[]);



const fetchv = async () => {
  const response = await fetch("/api/alldata?dtyp=vehicle");
  let vjson = await response.json();
  setvhcl(vjson.result);
};

useEffect(() => {
   fetchv();
},[]);


const fetcht = async () => {
  const response = await fetch("/api/alldata?dtyp=tender");
  let tjson = await response.json();
  settndr(tjson.result);
};

useEffect(() => {
   fetcht();
},[]);



const onchange = (e) => {
    setdmodel({
      ...dmodel,
      [e.target.name]: e.target.value,
    })
    setckey("")
    setskey("")
    setvkey("")
    settkey("")
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
        setalert("")
        setallc(fc)
        setallv(fv)
        setallt(ft)
        setalls(fs)
        if(fc.length==0 && fs.length==0 && fv.length==0 && ft.length==0)
        {setalert("NO DETAILS TO SHOW !!")
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
        setalrt("Error in Fetching Details.");
      }
    } catch (error) {
      setalrt("Error in Fetching Details.");
      console.error('Error:', error);
    }
  };

   
 return (
  <>
<div className="flex-col justify-items-center space-y-2 p-1 ">
<p className="text-center bg-indigo-500 text-indigo-100 p-3 rounded-md w-full font-mono font-extrabold text-lg"> Daily Summary !!</p>
  <div className="w-full sm:w-3/5 border-2 border-indigo-500 p-2 rounded-md ">
<form onSubmit={fetchall} className="space-y-4">
<label htmlFor="from" className="block text-md font-semibold text-indigo-800">
      From:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={dmodel?.from || ""} required type="date" name="from" id="from" 
      onChange={onchange}       placeholder="Enter From Date"
      className=" w-full px-4 py-2 border border-indigo-500 bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"

    />

<label htmlFor="to" className="block text-md font-semibold text-indigo-800">
      To:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={dmodel?.to || ""} required type="date" name="to" id="to" 
      onChange={onchange}       placeholder="Enter to"
      className=" w-full px-4 py-2 border border-indigo-500 bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"

    />

    <label htmlFor="dtype" className="block text-md font-semibold text-indigo-800">
      Data Type:
    </label>
<select onChange={onchange} className="bg-indigo-300 w-full rounded-full p-2 border-2 border-indigo-400" name="dtype" id="dtype" value={dmodel?.dtype || ""}>
    <option value="">Choose Data type</option>
  <option value="staff">Staff</option>
  <option value="vehicle">Vehicle</option>
  <option value="contractor">Contractor</option>
  <option value="tender">Tender</option>
  <option value="All">All</option>
</select>

<button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full hover:bg-indigo-700 hover:text-indigo-50 ">
        Fetch Data</button>
</form>
</div>
<p className="text-center bg-indigo-500 text-indigo-100 p-3 rounded-md w-full font-mono font-extrabold text-lg">Details of Specific Day:</p>
<div className="container h-[90vh] overflow-y-scroll bg-blue-500 bg-opacity-50 space-y-2 w-full sm:w-11/12 p-2 py-4 rounded-md ">

{(dmodel?.dtype==="staff" || dmodel?.dtype==="All")?(<>



  {(alls.length!=0)?(<select  onChange={cstf}  name="sid" id="sid"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-800 bg-indigo-300 bg-opacity-5 text-indigo-800 font-semibold rounded-full "
       >
        <option value="">Select the Staff</option>
{stf.map((b) => (
    
    <option key={b.sid} value={`${b.sid}`}
      className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-indigo-300 rounded-md p-4 shadow-lg  hover:text-indigo-50 hover:bg-indigo-400 hover:cursor-pointer hover:opacity-80 container mx-auto'
       >{b.srole} : {b.name}
   </option>
  ))}
</select>):""}
 {alls.map((b) => (
    <div key={b._id}  className="flex flex-col space-y-1  md:space-y-2  text-sm lg:text-lg  bg-sky-200 rounded-lg p-1 text-sky-900 font-mono ">
{(b.sid===skey)?(<><div className="flex flex-col md:flex-row md:justify-between md:space-x-2">
<div   className="flex flex-row justify-center lg:px-2 bg-cyan-500 bg-opacity-40 rounded-lg text-teal-950 hover:cursor-pointer hover:bg-opacity-30">
{b.date} </div>
<div className="flex flex-row justify-center space-x-2   md:px-1 "> {b.amount}</div>


<div className="flex flex-row md:w-1/2 px-1 justify-center md:px-2 bg-red-200 bg-opacity-80 rounded-lg text-teal-900 hover:cursor-pointer hover:bg-opacity-60">{b.rmrk}

</div>
</div></>):(<></>)}

</div> 
      ))}
           {(salert&& dmodel?.dtype!="All") && (
    <div className="text-center mt-4 text-sky-200 font-semibold">
      {salert}
    </div>
  )}
      </>):""}
{(dmodel?.dtype==="vehicle"|| dmodel?.dtype==="All")?(<> 

  {(allv.length!=0)?(<select  onChange={cvhcl}  name="vno" id="vno"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-800 bg-indigo-300 bg-opacity-5 text-indigo-800 font-semibold rounded-full "
       >
        <option value="">Select the Vehicle</option>
{vhcl.map((b) => (
    
    <option key={b.vno} value={`${b.vno}`}
      className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-indigo-300 rounded-md p-4 shadow-lg  hover:text-indigo-50 hover:bg-indigo-400 hover:cursor-pointer hover:opacity-80 container mx-auto'
       >{b.vtype} : {b.vno}
   </option>
  ))}
</select>):""}

{allv.map((b) => (
        <div key={b._id} className= {" flex flex-col  lg:space-y-2  text-sm lg:text-lg  bg-teal-100 rounded-lg p-1 text-teal-800 font-mono "}>
       {(b.vno===vkey)?(<> <div className="flex flex-col md:flex-row md:justify-between md:space-x-2">
        <div  className="flex flex-row justify-center lg:px-2 bg-cyan-400 bg-opacity-40 rounded-lg text-teal-950 hover:cursor-pointer hover:bg-opacity-30">
        <p >{b.date}-{b.shft}</p> </div>
        <div className="flex flex-row justify-center space-x-2 border-b-2 md:border-b-0  md:px-1 border-teal-500"> <p> {b.sid}</p></div>
        <div className="flex flex-row justify-center border-b-2 md:border-b-0  md:px-1 border-teal-500"><p>{b.site}</p></div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-2 md:justify-between"><div className="flex flex-row justify-center space-x-1"><p>₹{b.rate}/{b.hrs?(<>h</>):(<>t</>)} -- {b.hrs?(<>{b.hrs} hrs</>):(<>{b.trip} trp</>)}</p></div>
        <div  className="flex flex-row md:w-3/4 px-1 justify-center md:px-2 bg-red-300 bg-opacity-80 rounded-lg text-teal-900 hover:cursor-pointer hover:bg-opacity-60">{b.rmrk}
        
        </div>
        </div></>):""}
        
        </div>
      ))}
           {(valert&& dmodel?.dtype!="All") && (
    <div className="text-center mt-4 text-teal-300 font-semibold">
      {valert}
    </div>
  )}
      </>):""}
{(dmodel?.dtype==="contractor" || dmodel?.dtype==="All")?(<> 

  {(allc.length!=0)?(<select  onChange={ccntr}  name="cid" id="cid"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-800 bg-indigo-300 bg-opacity-5 text-indigo-800 font-semibold rounded-full "
       >
        <option value="">Select the Contractor</option>
{cntr.map((b) => (
    
    <option key={b.cid} value={`${b.cid}`}
      className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-indigo-300 rounded-md p-4 shadow-lg  hover:text-indigo-50 hover:bg-indigo-400 hover:cursor-pointer hover:opacity-80 container mx-auto'
       >{b.cid} : {b.name}
   </option>
  ))}
</select>):""}

{allc.map((b) => (
      <div key={b._id} 
      className="  flex flex-col space-y-1 lg:space-y-2  text-sm lg:text-lg  bg-emerald-100 rounded-lg p-1 text-emerald-800 font-mono ">
       { (b.cid===ckey)? (<><div className="flex flex-col md:flex-row md:justify-between md:space-x-2">
      <div className="flex flex-row justify-center lg:px-2 bg-cyan-400 bg-opacity-40 rounded-lg text-teal-950 hover:cursor-pointer hover:bg-opacity-30">
        <p >{b.date}-{b.shft}</p> </div>
      <div className="flex flex-row justify-center space-x-2 border-b-2 md:border-b-0  md:px-1 border-emerald-500"> <p>{b.vno}</p></div>
      <div className="flex flex-row justify-center space-x-2 border-b-2 md:border-b-0  md:px-1 border-emerald-500"> <p> {b.sid}</p></div>
      <div className="flex flex-row justify-center border-b-2 md:border-b-0  md:px-1 border-emerald-500"><p>{b.site}</p></div>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-2 md:justify-between"><div className="flex flex-row justify-center space-x-1">₹{b.rate}/{b.hrs?(<>h</>):(<>t</>)} * {b.hrs?(<>{b.hrs}h</>):(<>{b.trip}t</>)} =₹{b.odtot}</div>
      <div  className=" flex flex-row md:w-3/4 px-1 justify-center md:px-2 bg-red-300 bg-opacity-80 rounded-lg text-teal-900 hover:cursor-pointer hover:bg-opacity-60">{b.rmrk}
      
      </div>
      </div></>):""}
     
      </div>
      ))}
          {(calert&& dmodel?.dtype!="All") && (
    <div className="text-center mt-4 text-emerald-200 font-semibold">
      {calert}
    </div>
  )}
      </>):""}
{(dmodel?.dtype==="tender" || dmodel?.dtype==="All")?(<> 


  {(allt.length!=0)?(<select  onChange={ctndr}  name="tid" id="tid"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-800 bg-indigo-300 bg-opacity-5 text-indigo-800 font-semibold rounded-full "
       >
        <option value="">Select the Tender</option>
{tndr.map((b) => (
    <option key={b.tid} value={`${b.tid}`}
      className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-indigo-300 rounded-md p-4 shadow-lg  hover:text-indigo-50 hover:bg-indigo-400 hover:cursor-pointer hover:opacity-80 container mx-auto'
       >{b.tid} : {b.name}
   </option>
  ))}
</select>):""}

{allt.map((b) => (
      <div key={b._id}  className= " flex flex-col space-y-1  lg:space-y-2  text-sm lg:text-lg  bg-violet-300 rounded-lg p-1 text-violet-800 font-mono ">
{(b.tid===tkey)?(<><div className="flex flex-col md:flex-row md:justify-between md:space-x-2">
<div   className="flex flex-row justify-center lg:px-2 bg-cyan-300 bg-opacity-40 rounded-lg text-teal-950 hover:cursor-pointer hover:bg-opacity-30">
<p >{b.date}-{b.shft}</p> </div>
<div className="flex flex-row justify-center space-x-2 border-b-2 md:border-b-0  md:px-1 border-violet-500"> <p>{b.vno}</p></div>
<div className="flex flex-row justify-center space-x-2 border-b-2 md:border-b-0  md:px-1 border-violet-500"> <p> {b.sid}</p></div>
<div className="flex flex-row justify-center border-b-2 md:border-b-0  md:px-1 border-violet-500"><p>{b.site}</p></div>
</div>
<div className="flex flex-col md:flex-row md:space-x-2 md:justify-between"><div className="flex flex-row justify-center space-x-1">₹{b.rate}/{b.hrs?(<>h</>):(<>t</>)} * {b.hrs?(<>{b.hrs}h</>):(<>{b.trip}t</>)} =₹{b.odtot}</div>
<div className="flex flex-row md:w-3/4 px-1 justify-center md:px-2 bg-red-200 bg-opacity-80 rounded-lg text-teal-900 hover:cursor-pointer hover:bg-opacity-60">{b.rmrk}
</div></div></>):""}

</div>
      ))}
         {(talert && dmodel?.dtype!="All") && (
    <div className="text-center mt-4 text-violet-300 font-semibold">
      {talert}
    </div>
  )}
      </>):""}

{alrt && (
    <div className="text-center mt-4 text-indigo-200 font-semibold">
      {alrt}
    </div>
  )}

{(alert&& dmodel?.dtype==="All") && (
    <div className="text-center mt-4 text-indigo-200 font-semibold">
      {alert}
    </div>
  )}

  </div>
</div>
  </>
 )
}

