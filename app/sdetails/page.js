"use client"
import { useState, useEffect,Suspense,useRef } from "react";
import { TbEditCircle } from "react-icons/tb";
import { useSearchParams } from "next/navigation";
import { RiDeleteBin5Line } from "react-icons/ri";
export default function Page() {
  const cardRefs = useRef([]);
  const [selectedId, setSelectedId] = useState(null);
  const [eflag, seteflag] = useState(false)
  const [sflag, setsflag] = useState(false)
const [uflag, setuflag] = useState("")
  const [chck, setchck] = useState("")
  const [dflag, setdflag] = useState(false)
  const [dalert, setdalert] = useState("")
const [staff, setstaff] = useState([])
const [smodel, setsmodel] = useState({})
const [alert, setalert] = useState("");
const [salert, setsalert] = useState("Loading...")
const [sd, setsd] = useState(null)

const fetchs = async () => {
  const response = await fetch(`/api/sdetails?sid=${encodeURIComponent(sd.sid)}`);
  let sjson = await response.json();
  setstaff(sjson.as);
  console.log(staff)
  setsalert("");
  if (sjson.as.length === 0) setsalert("No Details Added");
};

useEffect(() => {
  if(sd){ fetchs();}
},[uflag,sd]);

    
      const onchange = (e) => {
        setsmodel({
          ...smodel,sid:sd.sid,
          [e.target.name]: e.target.value,
        });
      };

      const handleditf = async (bul,dtls) => {
        setuflag("")
        setsalert("")
        setalert("")
        setdalert("")
        setsflag(false)
        seteflag(bul)
        setsmodel(dtls)
      }


      const handlsrch = async (e) => {
        e.preventDefault(); 
          setalert("Searching...");
          const co = { ...smodel, dtype:"staff" };
          try {
            const response = await fetch(`/api/search?model=${encodeURIComponent(JSON.stringify(co))}`,{
              method: 'GET',
            });
      const data= await response.json()
            if (data.success) {
           setstaff(data.sr)
           if(data.sr.length==0){setsalert("No Matches Found !!")
            setSelectedId(null)
           }
              setalert("Search Successful !")
            } else {
              setalert("No such Record !!");
            }
          } catch (error) {
            setalert("Error in Searching !!");
            console.error('Error:', error);
          }
        };

      const handlsflag = async (bul) => {
        setuflag("")
        setsalert("")
        setalert("")
        setdalert("")
        seteflag(false)
        setsflag(bul)
        setsmodel({})
        if(!bul){
          setuflag("srch")
          setsalert("Loading...")
        }
      }

      const handleupdate = async (e) => {
        setalert("Updating Details...")
        e.preventDefault();
        const co = {...smodel }; 
        try{
          const response= await fetch('api/sdetails',{
            method:'PUT',
            headers:{ 'Content-Type':'application/json'},
            body: JSON.stringify(co)
          });
          if(response.ok){
            console.log("Details Updated Sucessfully ! ")
            setalert("Details Updated Successfully !!")
            seteflag(false)
           setsmodel({})
           setuflag("upd")
          }
          else{
            console.log("Error Updating Details !!")
          }
        }
        catch(error){
      console.error('Error:',error);
        }
      }



      const deletes = async (bul,id) => {
        setuflag("")
        setsalert("")
        setalert("")
        setdalert("")
        setdflag(bul)
        setchck(id)
      }

      const handledel = async (mid) => {
        setdalert(`Deleting Data ...`)
        console.log(mid)
        console.log({mid})
        // console.log(JSON.stringify({ bid}))
        try {
            const response = await fetch('/api/sdetails', {
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
            setuflag("del")
        } catch (erro) {
            console.log('Error:', erro);
        }
      };

  
      const addstaff = async (e) => {
        e.preventDefault();
        setalert("Adding details...")
        setuflag("")
        const co = {  ...smodel };
        try {
          const response = await fetch('/api/sdetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
          if (response.ok) {
            setalert("Details added Successfully!")
            setsmodel({})
            setuflag("add")
            setsalert("")
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
        <LoadParams setDbobj={setsd} />

      </Suspense>
      <div className="flex-col justify-items-center space-y-2 p-1 ">

      <div>
  <button onClick={() => handlsflag(true)}>search</button>
 </div>

      <div className="bg-gradient-to-r from-indigo-400 to-purple-300 w-11/12 lg:w-4/5  text-sm lg:text-lg flex flex-col md:flex-row md:justify-between  font-serif font-semibold  p-2  rounded-md"><p> Staff ID: {sd?(<>{sd.sid} </>):"Loading..."} </p>
 
 <p>Staff Name: {sd?(<>{sd.name} </>):"Loading..."} </p>
 <p>Staff Role: {sd?(<>{sd.srole} </>):"Loading..."} </p></div>




      <div className="container h-[75vh] bg-blue-500 p-2 rounded-lg bg-opacity-20 w-11/12 lg:w-4/5 space-y-2 overflow-y-scroll">
{staff.map((b,index) => (
<div key={b._id} ref={(el) => (cardRefs.current[index] = el)} className={`  transition ${
              selectedId === b._id
                ? 'bg-green-100 border-green-500'
                : ''
            }  flex flex-col space-y-1  md:space-y-2  text-sm lg:text-lg  bg-cyan-700 rounded-lg p-1 text-teal-200 font-mono `}>
<div className="flex flex-col md:flex-row md:justify-between md:space-x-2">
<div  onClick={() => handleditf(true,b)} className="flex flex-row justify-center lg:px-2 bg-cyan-200 bg-opacity-40 rounded-lg text-teal-950 hover:cursor-pointer hover:bg-opacity-30">
  {b.date} </div>
<div className="flex flex-row justify-center space-x-2   md:px-1 "> {b.amount}</div>


<div onClick={() => deletes(true,b._id)} className="flex flex-row md:w-1/2 px-1 justify-center md:px-2 bg-red-200 bg-opacity-80 rounded-lg text-teal-900 hover:cursor-pointer hover:bg-opacity-60">{b.rmrk}

</div>
</div>
{ (dflag && chck===b._id)? (<><div className="flex flex-row justify-evenly "><p className="text-red-300">Deletion ! Sure ?</p><button  onClick={() => handledel(b._id)} className="bg-red-500 px-2 md:px-10  rounded-full hover:bg-opacity-80">Yes</button > <button onClick={() => deletes(false,b._id)} className="bg-indigo-500 rounded-full px-3 md:px-10 hover:bg-opacity-80">No</button></div></>):(<></>)}
</div>
 ))}

{dalert && (
    <div className="text-center mt-4 text-red-300 font-semibold">
      {dalert}
    </div>
  )}
  {salert && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {salert}
    </div>
  )}
</div>
<div className=" border-2 p-2 border-indigo-500 rounded-md w-full sm:w-4/5">
<form onSubmit={addstaff} className="space-y-4">
<div  className="text-center text-sm lg:text-lg font-semibold font-mono bg-indigo-500 bg-opacity-50 p-2 rounded-lg  ">Add Details:</div>
    <label htmlFor="date" className="block text-md font-semibold text-green-500">
      Date:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={smodel?.date || ""} required type="date" name="date" id="date" 
      onChange={onchange}       placeholder="Enter Date"
      className=" w-full px-4 py-2 border border-green-500 bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
    <label htmlFor="amount" className="block text-md font-semibold text-green-500">
      Amount:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={smodel?.amount || ""} required type="text" name="amount" id="amount"
      onChange={onchange}       placeholder="Enter amount"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />

<label htmlFor="rmrk" className="block text-md font-semibold text-green-500">
      Remarks:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={smodel?.rmrk || ""} required type="text" name="rmrk" id="rmrk"
      onChange={onchange}       placeholder="Enter any Remarks"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
    
    {eflag? (<><div className="flex flex-col lg:flex-row "><button onClick={(e) => handleupdate(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full  hover:bg-indigo-700 hover:text-indigo-50 "
      >Update Data</button>
      
      <button onClick={(e) => handleditf(false,null)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full  hover:bg-indigo-700 hover:text-indigo-50 "
      >Cancel</button></div>
      
      </>):
    (<></>)}

{sflag? (<><div className="flex flex-col lg:flex-row "><button onClick={(e) => handlsrch(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full  hover:bg-indigo-700 hover:text-indigo-50 "
      >Search</button>
      <button onClick={(e) => handleupdate(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full  hover:bg-indigo-700 hover:text-indigo-50 "
      >Find</button>
      <button onClick={(e) => handlsflag(false)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full  hover:bg-indigo-700 hover:text-indigo-50 "
      >Cancel</button></div>
      
      </>):
    (<></>)}

    {(eflag || sflag)? (<> </>):(<><button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full  hover:bg-indigo-700 hover:text-indigo-50 "
    >
      Add Data
    </button></>)}
  </form>
  {alert && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {alert}
    </div>
  )}
</div>
</div>
  </>
 )
}

function LoadParams({ setDbobj}) {

     
  const searchParams = useSearchParams();
  const sobj = searchParams.get('sdtls');
  useEffect(() => {
    if (sobj) {
      const dsobj = sobj ? JSON.parse(decodeURIComponent(sobj)) : null;
      setDbobj(
        {...dsobj}
      );
    
    }}, [sobj, setDbobj]);

  return null;
}