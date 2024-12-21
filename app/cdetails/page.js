"use client"
import { useState, useEffect,Suspense,useRef } from "react";
import { useSearchParams } from "next/navigation";
export default function Home() {
  const cardRefs = useRef([]);
  const [selectedId, setSelectedId] = useState(null)
  const [selid, setselid] = useState(null)
const [eflag, seteflag] = useState(false)
const [sflag, setsflag] = useState(false)
const [uflag, setuflag] = useState("")
const [vhcl, setvhcl] = useState([])
const [cntr, setcntr] = useState([])
const [chck, setchck] = useState("")
const [cmodel, setcmodel] = useState({})
const [alert, setalert] = useState("");
const [calert, setcalert] = useState("Loading...")
const [cd, setcd] = useState(null)
const [dflag, setdflag] = useState(false)
const [dalert, setdalert] = useState("")
const [stf, setstf] = useState([])

const fetchc = async () => {
  console.log('I am in fetchc',cd)
  const response = await fetch(`/api/cdetails?cid=${encodeURIComponent(cd.cid)}`);
  let cjson = await response.json();
  setcntr(cjson.ac);
  console.log(cntr)
  setcalert("");
  if (cjson.ac.length === 0) setcalert("No Details Added");
};

useEffect(() => {
  if(cd){ fetchc();}
},[cd,uflag,selid]);

  
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
        setcmodel({
          ...cmodel,cid:cd.cid,
          [e.target.name]: e.target.value,
        });
      };

      const calrht = (mul,rte) => {

        const rate= parseFloat(rte);
        const mulpr= parseFloat(mul);
        const tot=rate*mulpr
        setcmodel({
          ...cmodel,odtot:tot.toString()
        });}


        const handlsrch = async (e,isfnd) => {
          e.preventDefault(); 
        
            setalert("Searching...");
            const co = { ...cmodel, dtype:"contractor" };
            try {
              const response = await fetch(`/api/search?model=${encodeURIComponent(JSON.stringify(co))}`,{
                method: 'GET',
              });
        const data= await response.json()
              if (data.success) {
             setcntr(data.sr)
             setselid(null)
              if(data.sr.length==0){setcalert("No Matches Found !!")
              setselid(null)
              }
              if(isfnd) {setselid(data.sr[data.sr.length - 1]._id)}
                setalert("Search Successful !")
                setcalert("")
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
            fetchc();}
            useEffect(() => {
              if (selid !== null) {
            const index = cntr.findIndex((item) => item._id === selid);
            console.log(index)
            if (index !== -1 && cardRefs.current[index]) {
              // Scroll to the matched card
              cardRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              setselid(null)
            }}
            else{
              setcntr(cntr)
            }
          }, [selid, cntr]);
          


      const handledel = async (mid) => {
        setdalert(`Deleting Data ...`)
        setcalert("")
        setalert("")
        console.log(mid)
        console.log({mid})
        // console.log(JSON.stringify({ bid}))
        try {
            const response = await fetch('/api/cdetails', {
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
            seteflag(false)
            setuflag("del")
        } catch (erro) {
            console.log('Error:', erro);
        }
      };

      const deletec = async (bul,id) => {
        setuflag("")
        setcalert("")
        setalert("")
        setdalert("")
        setdflag(bul)
        setchck(id); 
      }
      const handleupdate = async (e) => {
        setalert("Updating Details...")
    
        setcalert("")
        setdalert("")
      
        e.preventDefault();
        const co = {...cmodel }; 
        try{
          const response= await fetch('api/cdetails',{
            method:'PUT',
            headers:{ 'Content-Type':'application/json'},
            body: JSON.stringify(co)
          });
          if(response.ok){
            console.log("Details Updated Sucessfully ! ")
            setalert("Details Updated Successfully !!")
            setuflag("upd")
            seteflag(false)
            setcmodel({})
            
          }
          else{
            console.log("Error Updating Details !!")
          }
        }
        catch(error){
      console.error('Error:',error);
        }
      }
      const handleditf = async (bul,dtls) => {
        setuflag("")
        setcalert("")
        setalert("")
        setdalert("")
        setsflag(false)
        seteflag(bul)
        setcmodel(dtls)
      }

      const handlsflag = async (bul) => {
        setuflag("")
        setcalert("")
        setalert("")
        setdalert("")
        seteflag(false)
        setsflag(bul)
        setcmodel({})
        if(!bul){
          setuflag("srch")
          setcalert("Loading...")
          setselid(null)
        }
      }

      const addcntr = async (e) => {
        e.preventDefault();
        setuflag("")
        setalert("Adding details...")
        setcalert("")
        setdalert("")
        const co = {  ...cmodel };
        try {
          const response = await fetch('/api/cdetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
          if (response.ok) {
            setalert("Details added Successfully!")
            setuflag("add")
            setcalert("")
            setcmodel({})
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
        <LoadParams setDbobj={setcd} />

      </Suspense>
  <div className="flex-col justify-items-center space-y-2 p-1 ">
  <div>
  <button  onClick={() => handlsflag(true)}>search</button>
 </div>
 <div className="bg-gradient-to-r from-indigo-400 to-purple-300 w-11/12 lg:w-4/5  text-sm lg:text-lg flex flex-col md:flex-row md:justify-between  font-serif font-semibold  p-2  rounded-md">
 <p> Contractor ID: {cd?(<>{cd.cid} </>):"Loading..."} </p>
 <p>Ctr/C's Name: {cd?(<>{cd.name} </>):"Loading..."} </p>
 <p>Previous Balance: {cd?(<>{cd.pbal} </>):"Loading..."} </p>
 </div>
 

<div className="container h-[75vh] bg-blue-500 p-2 rounded-lg bg-opacity-20 w-11/12 lg:w-4/5 space-y-2 overflow-y-scroll">
{cntr.map((b,index) => (
<div key={b._id} ref={(el) => (cardRefs.current[index] = el)}
className={`  transition ${
              selid === b._id
                ? 'bg-green-100 border-green-500'
                : ''
            }   flex flex-col space-y-1 lg:space-y-2  text-sm lg:text-lg  bg-cyan-700 rounded-lg p-1 text-teal-200 font-mono `}>
  <div className="flex flex-col md:flex-row md:justify-between md:space-x-2">
<div  onClick={() => handleditf(true,b)} className="flex flex-row justify-center lg:px-2 bg-cyan-200 bg-opacity-40 rounded-lg text-teal-950 hover:cursor-pointer hover:bg-opacity-30">
  <p >{b.date}-{b.shft}</p> </div>
<div className="flex flex-row justify-center space-x-2 border-b-2 md:border-b-0  md:px-1 border-teal-500"> <p>{b.vno}</p></div>
<div className="flex flex-row justify-center space-x-2 border-b-2 md:border-b-0  md:px-1 border-teal-500"> <p> {b.sid}</p></div>
<div className="flex flex-row justify-center border-b-2 md:border-b-0  md:px-1 border-teal-500"><p>{b.site}</p></div>
</div>
<div className="flex flex-col md:flex-row md:space-x-2 md:justify-between"><div className="flex flex-row justify-center space-x-1">₹{b.rate}/{b.hrs?(<>h</>):(<>t</>)} * {b.hrs?(<>{b.hrs}h</>):(<>{b.trip}t</>)} =₹{b.odtot}</div>
<div onClick={() => deletec(true,b._id)} className=" flex flex-row md:w-3/4 px-1 justify-center md:px-2 bg-red-200 bg-opacity-80 rounded-lg text-teal-900 hover:cursor-pointer hover:bg-opacity-60">{b.rmrk}

</div>
</div>
{ (dflag && chck===b._id)? (<><div className="flex flex-row justify-evenly "><p className="text-red-300">Deletion ! Sure ?</p><button  onClick={() => handledel(b._id)} className="bg-red-500 px-2 md:px-10 rounded-full hover:bg-opacity-80">Yes</button > <button onClick={() => deletec(false,b._id)} className="bg-indigo-500 rounded-full px-3 md:px-10 hover:bg-opacity-80">No</button></div></>):(<></>)}
</div>
 ))}

{dalert && (
    <div className="text-center mt-4 text-red-300 font-semibold">
      {dalert}
    </div>
  )}
  {calert && (
    <div className="text-center mt-4 text-red-200 font-semibold">
      {calert}
    </div>
  )}
</div>
 <div className=" border-2 p-2 border-indigo-500 rounded-md w-full sm:w-4/5">
<form onSubmit={addcntr} className="   space-y-3">
<div className="text-center text-sm lg:text-lg font-semibold font-mono bg-indigo-500 bg-opacity-50 p-2 rounded-lg  ">Add Details: </div>

<label htmlFor="date" className="block text-md font-semibold text-indigo-500">
      Date:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.date || ""} required type="date" name="date" id="date"
      onChange={onchange}       placeholder="Enter date"
     className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"

    />

<label htmlFor="date" className="block text-md font-semibold text-indigo-500">
    Shift:
    </label>
  <select  onChange={onchange}  name="shft" id="shft" value={cmodel?.shft || ""}
      className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
       >
        <option value="">Select Shift</option>
  <option value="D">Day</option>
  <option value="N">Night</option>
</select>

<label htmlFor="vno" className="block text-md font-semibold text-indigo-500">
    Vehicle:
    </label>
<select  onChange={onchange}  name="vno" id="vno" value={cmodel?.vno || ""}
       className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
       >
        <option value="">Select the Vehicle</option>
{vhcl.map((b) => (
    
    <option key={b.vno} value={b.vtype==="Hyva"?`H:${b.vno}`:(b.vtype==="JCB"?`J:${b.vno}`:`P:${b.vno}`)}
       className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-indigo-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'
       >{b.vtype} : {b.vno}
   </option>
  ))}
</select>
 
    
<label htmlFor="sid" className="block text-md font-semibold text-indigo-500">
    Driver/Operator Name:
    </label>
<select  onChange={onchange}  name="sid" id="sid" value={cmodel?.sid || ""}
       className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
       >
        <option value="">Select who drove Vehicle</option>
{stf.map((b) => (
    
    <option key={b.sid} value={`${b.sid}:${b.name}`}
       className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
       >{b.srole} : {b.name}
   </option>
  ))}
</select> 


<label htmlFor="site" className="block text-md font-semibold text-indigo-500">
      Site Address:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.site || ""} required type="text" name="site" id="site"
      onChange={onchange}       placeholder="Enter Site address"
      className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"

    />


<label htmlFor="rate" className="block text-md font-semibold text-indigo-500">
      Rate:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.rate || ""} required type="text" name="rate" id="rate"
      onChange={onchange}       placeholder="Enter Rate"
      className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"

    />

{ (typeof (cmodel?.vno) === "string" && cmodel.vno.match(/^H/))?  (<><label htmlFor="trip" className="block text-md font-semibold text-indigo-500">
      No. of Trips:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.trip || ""} required type="text" name="trip" id="trip"
      onChange={onchange}       placeholder="Enter trip"
      className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
    />
    
    <span htmlFor="odtot" className="block text-md font-semibold text-center p-2 rounded-lg bg-indigo-300 bg-opacity-80 border-indigo-600   text-indigo-500 hover:cursor-pointer hover:bg-indigo-400 hover:text-indigo-100"
      onClick={() => calrht(cmodel.trip,cmodel.rate)}>
     Calculate Rate * Trips:
    </span>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.odtot || ""} required type="text" name="odtot" id="odtot"
      onChange={onchange} 
     className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
    />
    
    </>):   (<><label htmlFor="hrs" className="block text-md font-semibold text-indigo-500">
      No. of Hours:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.hrs || ""} required type="text" name="hrs" id="hrs"
      onChange={onchange}       placeholder="Enter hours"
      className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
    />
    <span htmlFor="odtot" className="block text-md font-semibold text-center p-2 rounded-lg bg-indigo-300 bg-opacity-80 border-indigo-600   text-indigo-500 hover:cursor-pointer hover:bg-indigo-400 hover:text-indigo-100"
      onClick={() => calrht(cmodel.hrs,cmodel.rate)}>
     Calculate Rate * Hours:
    </span>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.odtot || ""} required type="text" name="odtot" id="odtot" onChange={onchange} 
      className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
    />
    
    </>)}


<label htmlFor="rmrk" className="block text-md font-semibold text-indigo-500">
      Remarks:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.rmrk || ""} required type="text" name="rmrk" id="rmrk"
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
    <div className="text-center mt-4 text-indigo-200 font-semibold">
      {alert}
    </div>
  )}</div>
</div>
  </>
 )
}

function LoadParams({ setDbobj}) {

     
  const searchParams = useSearchParams();
  const cobj = searchParams.get('cdtls');
  useEffect(() => {
    if (cobj) {
      const dcobj = cobj ? JSON.parse(decodeURIComponent(cobj)) : null;
      setDbobj(
        {...dcobj}
      );
    
    }}, [cobj, setDbobj]);

  return null;
}