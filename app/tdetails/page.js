"use client"
import { useState, useEffect,Suspense } from "react";
import { TbEditCircle } from "react-icons/tb";
import { useSearchParams } from "next/navigation";
import { RiDeleteBin5Line } from "react-icons/ri";
export default function Page() {
  const [eflag, seteflag] = useState(false)
const [tndr, settndr] = useState([])
const [vhcl, setvhcl] = useState([])
const [chck, setchck] = useState("")
const [tmodel, settmodel] = useState({})
const [alert, setalert] = useState("");
const [talert, settalert] = useState("Loading...")
const [td, settd] = useState(null)
const [dflag, setdflag] = useState(false)
const [dalert, setdalert] = useState("")
const [stf, setstf] = useState([])

const fetcht = async () => {
  const response = await fetch(`/api/tdetails?tid=${encodeURIComponent(td.tid)}`);
  let tjson = await response.json();
  settndr(tjson.at);
  settalert("");
  console.log(tndr)
  if (tjson.at.length === 0) settalert("No Details Added");
};

useEffect(() => {
  if(td){ fetcht();}
},[tmodel,td]);


const fetchs = async () => {
  const response = await fetch("/api/alldata?dtyp=staff");
  let sjson = await response.json();
  setstf(sjson.result);
};

useEffect(() => {
   fetchs();
},[]);

const fetchv = async () => {
  const response = await fetch("/api/alldata?dtyp=vehicle");
  let vjson = await response.json();
  setvhcl(vjson.result);
};

useEffect(() => {
   fetchv();
},[]);
    
      const onchange = (e) => {
        settmodel({
          ...tmodel,tid:td.tid,
          [e.target.name]: e.target.value,
        });
      };

      const handleupdate = async (e) => {
        setalert("Updating Details...")
        e.preventDefault();
        const co = {...tmodel }; 
        try{
          const response= await fetch('api/tdetails',{
            method:'PUT',
            headers:{ 'Content-Type':'application/json'},
            body: JSON.stringify(co)
          });
          if(response.ok){
            console.log("Details Updated Sucessfully ! ")
            setalert("Details Updated Successfully !!")
            seteflag(false);
           settmodel({})
          }
          else{
            console.log("Error Updating Details !!")
          }
        }
        catch(error){
      console.error('Error:',error);
        }
      }

      const handledel = async (mid) => {
        setdalert(`Deleting Data ...`)
        console.log(mid)
        console.log({mid})
        // console.log(JSON.stringify({ bid}))
        try {
            const response = await fetch('/api/tdetails', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mid} ), // Send the ID in the request body
            });
      
            const data = await response.json();
            if (!response.ok) {
              setdalert(data.message)
                throw new Error(data.message || 'Failed to delete the Data');
            }
      
            console.log(data.message); // Log success message
            setdalert(` Data deleted successfully.`)
            settmodel({})
        } catch (erro) {
            console.log('Error:', erro);
        }
      };

      const calrht = (mul,rte) => {

        const rate= parseFloat(rte);
        const mulpr= parseFloat(mul);
        const tot=rate*mulpr
        settmodel({
          ...tmodel,odtot:tot
        });}

      const deletet = async (bul,id) => {
        setdflag(bul);setchck(id);
      }
      const handledit = async (dtls) => {
        seteflag(true);
        settmodel(dtls)
      }
      const addtndr = async (e) => {
        e.preventDefault();
        setalert("Adding details...");
        const co = {  ...tmodel };
        try {
          const response = await fetch('/api/tdetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
          if (response.ok) {
            setalert("Details added Successfully!");
            settmodel({});
            settalert("");
          } else {
            setalert("Error in adding Details.");
          }
        } catch (error) {
          setalert("Error in adding Details.");
          console.error('Error:', error);
        }
      };
 return (
  <>

<Suspense fallback={<div>Loading...</div>}>
        <LoadParams setDbobj={settd} />

      </Suspense>
  All details of {td?(<>{td.tid}:{td.name} of {td.td}</>):"Loading..."} are here !!

  <div>
  {tndr.map((b) => (
        <div key={b._id}
            className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'>      
           <span  className="inline-block w-full sm:w-3/5">{b.odtot} -- {b.date} </span>  
       <div className="  flex justify-center gap-20  xs:justify-between xs:gap-8">   <button className= "   hover:bg-green-700 bg-green-200   p-2 rounded-full" onClick={() => handledit(b)}><TbEditCircle className="text-green-700 hover:text-green-200"  size={30}  /></button>
       { (dflag && chck===b._id)? (<><button onClick={() => handledel(b._id)} className="bg-red-500">Yes</button > <button onClick={() => deletet(false,b._id)} className="bg-green-500">No</button></>):(<><button className="hover:bg-red-700 bg-red-200     p-2 rounded-full " onClick={() => deletet(true,b._id)}><RiDeleteBin5Line className="text-red-700 hover:text-red-200"  size={30} /></button></>)}
          </div> </div>
      ))}</div>

{dalert && (
    <div className="text-center mt-4 text-red-300 font-semibold">
      {dalert}
    </div>
  )}

  {talert && (
    <div className="text-center mt-4 text-red-200 font-semibold">
      {talert}
    </div>
  )}

 
<div>Add Details:</div>
<form onSubmit={addtndr} className="space-y-4">

<label htmlFor="date" className="block text-md font-semibold text-green-500">
      Date:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.date || ""} required type="date" name="date" id="date"
      onChange={onchange}       placeholder="Enter date"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />

<label htmlFor="date" className="block text-md font-semibold text-green-500">
    Shift:
    </label>
  <select  onChange={onchange}  name="shft" id="shft" value={tmodel?.shft || ""}
       className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
       >
        <option value="">Select Shift</option>
  <option value="Day">Day</option>
  <option value="Night">Night</option>
</select>

<label htmlFor="vno" className="block text-md font-semibold text-green-500">
    Vehicle:
    </label>
<select  onChange={onchange}  name="vno" id="vno" value={tmodel?.vno || ""}
       className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
       >
        <option value="">Select the Vehicle</option>
{vhcl.map((b) => (
    
    <option key={b.vno} value={`${b.vtype}:${b.vno}`}
       className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'
       >{b.vtype} : {b.vno}
   </option>
  ))}
</select>
 
    
<label htmlFor="sid" className="block text-md font-semibold text-green-500">
    Driver/Operator Name:
    </label>
<select  onChange={onchange}  name="sid" id="sid" value={tmodel?.sid || ""}
       className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
       >
        <option value="">Select who drove Vehicle</option>
{stf.map((b) => (
    
    <option key={b.sid} value={`${b.sid}:${b.name}`}
       className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'
       >{b.srole} : {b.name}
   </option>
  ))}
</select>  


<label htmlFor="site" className="block text-md font-semibold text-green-500">
      Site Address:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.site || ""} required type="text" name="site" id="site"
      onChange={onchange}       placeholder="Enter Site address"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />


<label htmlFor="rate" className="block text-md font-semibold text-green-500">
      Rate:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.rate || ""} required type="text" name="rate" id="rate"
      onChange={onchange}       placeholder="Enter Rate"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />

{ (typeof (tmodel?.vno) === "string" && tmodel.vno.match(/^Hyva/))?  (<><label htmlFor="trip" className="block text-md font-semibold text-green-500">
      No. of Trips:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.trip || ""} required type="text" name="trip" id="trip"
      onChange={onchange}       placeholder="Enter trip"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"
    />
    
    <span htmlFor="odtot" className="block text-md font-semibold text-green-500"
      onClick={() => calrht(tmodel.trip,tmodel.rate)}>
     Calculate Rate * Trips:
    </span>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.odtot || ""} required type="text" name="odtot" id="odtot"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"
    />
    
    </>):   (<><label htmlFor="hrs" className="block text-md font-semibold text-green-500">
      No. of Hours:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.hrs || ""} required type="text" name="hrs" id="hrs"
      onChange={onchange}       placeholder="Enter hours"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"
    />
    <span htmlFor="odtot" className="block text-md font-semibold text-green-500"
      onClick={() => calrht(tmodel.hrs,tmodel.rate)}>
     Calculate Rate * Hours:
    </span>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.odtot || ""} required type="text" name="odtot" id="odtot"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"
    />
    
    </>)}


<label htmlFor="rmrk" className="block text-md font-semibold text-green-500">
      Remarks:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.rmrk || ""} required type="text" name="rmrk" id="rmrk"
      onChange={onchange}       placeholder="Enter any Remarks"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />

    {eflag? (<><button onClick={(e) => handleupdate(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
      >Update Data</button></>):
    (<><button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
    >
      Add Data
    </button></>)}
  </form>
  {alert && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {alert}
    </div>
  )}

  </>
 )
}

function LoadParams({ setDbobj}) {

     
  const searchParams = useSearchParams();
  const tobj = searchParams.get('tdtls');
  useEffect(() => {
    if (tobj) {
      const dtobj = tobj ? JSON.parse(decodeURIComponent(tobj)) : null;
      setDbobj(
        {...dtobj}
      );
    
    }}, [tobj, setDbobj]);

  return null;
}