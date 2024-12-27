"use client"
import { FcHome } from "react-icons/fc";
import { FcSearch } from "react-icons/fc";
import { useState, useEffect,Suspense,useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
export default function Page() {
  const cardRefs = useRef([]);
  const [selid, setselid] = useState(null)
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
        setselid(null)
      }


      const handlsrch = async (e,isfnd) => {
        e.preventDefault(); 
          setalert("Searching...");
          const co = { ...smodel, dtype:"staff" };
          try {
            const response = await fetch(`/api/search?model=${encodeURIComponent(JSON.stringify(co))}`,{
              method: 'GET',
            });
      const data= await response.json()
            if (data.success) {
              if(!isfnd) { setstaff(data.sr); setalert("Search Successful !!")}
           if(data.sr.length==0){
            if(!isfnd){setsalert("No Matches Found !!")}
            setselid(null)
            setalert("No matches Found !!")
           }
          
           setselid(null)
               if(isfnd && data.sr.length!=0) {setselid(data.sr[data.sr.length - 1]._id)
                 setuflag("found")
                 setalert("Found it !!")
               }
                 const element = document.getElementById("re-renderpls");
                 element?.scrollIntoView({ behavior: "smooth" });
            
            } else {
              setalert("No such Record !!");
            }
          } catch (error) {
            setalert("Error in Searching !!");
            console.error('Error:', error);
          }
        };


        const handlefind = (e) => {
          handlsrch(e,true);
          // Find the index of the item with the matching _id
          fetchs();}
          useEffect(() => {
            if (selid !== null) {
          const index = staff.findIndex((item) => item._id === selid);
          console.log(index)
          if (index !== -1 && cardRefs.current[index]) {
            // Scroll to the matched card
            cardRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            setselid(null)
          }}
        }, [selid, staff]);

      const handlsflag = async (bul) => {
        setuflag("")
        setsalert("")
        setalert("")
        setdalert("")
        seteflag(false)
        setsflag(bul)
        setsmodel({})
        setselid(null)
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
      <div className="bg-blue-50 rounded-full w-full p-1 flex flex-row justify-evenly sm:justify-between sm:px-10 ">
  <button className="bg-blue-300 rounded-full p-2 hover:bg-blue-400" onClick={() => handlsflag(true)}>  <FcSearch size={30} />  </button>
  <Link className="bg-blue-300 rounded-full p-2 hover:bg-blue-400" href="/menu"><FcHome  size={30}/></Link>
 </div>
    

      <div className="bg-gradient-to-r from-indigo-600 to-purple-500 text-sky-100 w-full  text-sm lg:text-lg flex flex-col md:flex-row md:justify-between  font-serif font-semibold  p-2  rounded-md"><p> Staff ID: {sd?(<>{sd.sid} </>):"Loading..."} </p>
 
 <p>Staff Name: {sd?(<>{sd.name} </>):"Loading..."} </p>
 <p>Staff Role: {sd?(<>{sd.srole} </>):"Loading..."} </p></div>




      <div id="re-renderpls" className="container h-[75vh] bg-blue-700 p-2 rounded-lg bg-opacity-30 w-full lg:w-4/5 space-y-2 overflow-y-scroll">
{staff.map((b,index) => (
<div key={b._id} ref={(el) => (cardRefs.current[index] = el)} className={`  transition ${
              selid === b._id
                ? 'bg-white border-indigo-900 border-2'
                : 'bg-sky-200'
            }  flex flex-col space-y-1  md:space-y-2  text-sm lg:text-lg   rounded-lg p-1 text-sky-900 font-mono `}>
<div className="flex flex-col md:flex-row md:justify-between md:space-x-2">
<div  onClick={() => handleditf(true,b)} className="flex flex-row justify-center lg:px-2 bg-cyan-500 bg-opacity-40 rounded-lg text-teal-950 hover:cursor-pointer hover:bg-opacity-30">
  {b.date} </div>
<div className="flex flex-row justify-center space-x-2   md:px-1 "> {b.amount}</div>


<div onClick={() => deletes(true,b._id)} className="flex flex-row md:w-1/2 px-1 justify-center md:px-2 bg-red-200 bg-opacity-80 rounded-lg text-teal-900 hover:cursor-pointer hover:bg-opacity-60">{b.rmrk}

</div>
</div>
{ (dflag && chck===b._id)? (<><div className="flex flex-row justify-evenly "><p className="text-red-700">Deletion ! Sure ?</p><button  onClick={() => handledel(b._id)} className="bg-red-500 px-2 md:px-10 text-red-200 rounded-full hover:bg-opacity-80">Yes</button > <button onClick={() => deletes(false,b._id)} className="bg-indigo-500 text-indigo-200 rounded-full px-3 md:px-10 hover:bg-opacity-80">No</button></div></>):(<></>)}
</div>
 ))}

{dalert && (
    <div className="text-center mt-4 text-red-500 font-semibold">
      {dalert}
    </div>
  )}
  {salert && (
    <div className="text-center mt-4 text-sky-800 font-semibold">
      {salert}
    </div>
  )}
</div>
<div className=" border-2 p-2 border-indigo-300 bg-indigo-200 rounded-md w-full sm:w-4/5">
<form onSubmit={addstaff} className="space-y-4">
<div  className="text-center text-sm lg:text-lg font-semibold font-mono bg-indigo-500 bg-opacity-50 p-2 rounded-lg  ">Add Details:</div>
    <label htmlFor="date" className="block text-md font-semibold text-indigo-500">
      Date:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={smodel?.date || ""} required type="date" name="date" id="date" 
      onChange={onchange}       placeholder="Enter Date"
      className=" w-full px-4 py-2 border border-indigo-500 bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"

    />
    <label htmlFor="amount" className="block text-md font-semibold text-indigo-500">
      Amount:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={smodel?.amount || ""} required type="text" name="amount" id="amount"
      onChange={onchange}       placeholder="Enter amount"
      className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"

    />

<label htmlFor="rmrk" className="block text-md font-semibold text-indigo-500">
      Remarks:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={smodel?.rmrk || ""} required type="text" name="rmrk" id="rmrk"
      onChange={onchange}       placeholder="Enter any Remarks"
      className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"

    />
    
    {eflag? (<><div className="flex flex-col lg:flex-row "><button onClick={(e) => handleupdate(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full  hover:bg-indigo-700 hover:text-indigo-50 "
      >Update Data</button>
      
      <button onClick={(e) => handleditf(false,null)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full  hover:bg-indigo-700 hover:text-indigo-50 "
      >Cancel</button></div>
      
      </>):
    (<></>)}

{sflag? (<><div className="flex flex-col lg:flex-row "><button onClick={(e) => handlsrch(e,false)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full  hover:bg-indigo-700 hover:text-indigo-50 "
      >Search</button>
      <button onClick={(e) => handlefind(e)} 
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
    <div className="text-center mt-4 text-indigo-500 font-semibold">
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