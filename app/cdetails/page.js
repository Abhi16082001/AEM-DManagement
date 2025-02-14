"use client"
import Link from "next/link";
import { FcHome } from "react-icons/fc";
import { FcSearch } from "react-icons/fc";
import { useState, useEffect,Suspense,useRef } from "react";
import { useSearchParams } from "next/navigation";
export default function Page() {
  const cardRefs = useRef([]);
  const [selid, setselid] = useState(null)
const [uflag, setuflag] = useState("")
const [vhcl, setvhcl] = useState([])
const [cntr, setcntr] = useState([])
const [cmodel, setcmodel] = useState({})
const [alert, setalert] = useState("");
const [calert, setcalert] = useState("Loading...")
const [cd, setcd] = useState(null)
const [stf, setstf] = useState([])
const [sflag, setsflag] = useState(false)

const fetchc = async () => {
  console.log('I am in fetchc',cd)
  const response = await fetch(`/api/cdetails?cid=${encodeURIComponent(cd.cid)}`);
  let cjson = await response.json();
  setcntr(cjson.ac);
  console.log(cntr)
  setcalert("");
  if (cjson.ac.length === 0) setcalert("No Details Added");
};

const fetchs = async () => {
  const response = await fetch("/api/alldata?dtyp=staff");
  let sjson = await response.json();
  setstf(sjson.result);
};


const fetchv = async () => {
  const response = await fetch("/api/alldata?dtyp=vehicle");
  let vjson = await response.json();
  setvhcl(vjson.result);
};

useEffect(() => {
  if(cd){ fetchc();
    fetchv();
    fetchs();
  }
},[cd,uflag]);

  




const onchange = (e) => {
  setcmodel({
    ...cmodel,
    [e.target.name]: e.target.value,
  });
};



   

     


        const handlsrch = async (e,isfnd) => {
          e.preventDefault(); 
        
            setalert("Searching...");
            const co = { ...cmodel, cid:cd.cid, dtype:"vehicle" };
            try {
              const response = await fetch(`/api/search?model=${encodeURIComponent(JSON.stringify(co))}`,{
                method: 'GET',
              });
        const data= await response.json()
              if (data.success) {
             if(!isfnd) {setcntr(data.sr) ; setalert("Search Successful !!")}
             if(data.sr.length==0){setcalert("No Matches Found !!")
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
          }, [selid, cntr]);
          
          const handlsflag = async (bul) => {
            setuflag("")
            setcalert("")
            setalert("")
            setsflag(bul)
            setcmodel({})
            setselid(null)
            if(!bul){
              setuflag("srch")
              setcalert("Loading...")
            }
          }

   

    
   

   

  
 return (
  <>
  <Suspense fallback={<div>Loading...</div>}>
        <LoadParams setDbobj={setcd} />

      </Suspense>
  <div className="flex-col justify-items-center space-y-2 p-1 ">
  <div className="bg-blue-100 rounded-full w-full p-1 flex flex-row justify-evenly sm:justify-between sm:px-10 ">
   <button className="bg-blue-300 rounded-full p-2 hover:bg-blue-400" onClick={() => handlsflag(true)}>  <FcSearch size={30} />  </button>
  <Link className="bg-blue-300 rounded-full p-2 hover:bg-blue-400" href="/menu"><FcHome  size={30}/></Link>
 </div>
 <div className="bg-gradient-to-r from-indigo-600 to-purple-500 text-indigo-100 w-full text-sm lg:text-lg flex flex-col md:flex-row md:justify-between  font-serif font-semibold  p-2  rounded-md">
 <p> Contractor ID: {cd?(<>{cd.cid} </>):"Loading..."} </p>
 <p>Ctr/C Name: {cd?(<>{cd.name} </>):"Loading..."} </p>
 <p>Previous Balance: {cd?(<>{cd.pbal} </>):"Loading..."} </p>
 </div>
 

<div id="re-renderpls" className="container h-[75vh] bg-blue-700 p-2 rounded-lg bg-opacity-30 w-full lg:w-4/5 space-y-2 overflow-y-scroll">


               {cntr.map((b,index) => (
<div key={b._id} ref={(el) => (cardRefs.current[index] = el)}
className={`  transition ${
              selid === b._id
                ? 'bg-white border-indigo-900 border-2'
                : ' bg-indigo-100 '
            }   flex flex-col space-y-1 lg:space-y-2  text-sm lg:text-lg rounded-lg p-1 text-indigo-800 font-mono `}>
  <div className="flex flex-col md:flex-row md:justify-between md:space-x-2">
<div className="flex flex-row justify-center lg:px-2 bg-cyan-400 bg-opacity-40 rounded-lg text-teal-950 hover:cursor-pointer hover:bg-opacity-30">
  <p >{b.date}-{b.shft}</p> </div>
<div className="flex flex-row justify-center space-x-2 border-b-2 md:border-b-0  md:px-1 border-indigo-500"> <p>{b.vno}</p></div>
<div className="flex flex-row justify-center space-x-2 border-b-2 md:border-b-0  md:px-1 border-indigo-500"> <p> {b.sid}</p></div>
<div className="flex flex-row justify-center border-b-2 md:border-b-0  md:px-1 border-indigo-500"><p>{b.site}</p></div>
</div>
<div className="flex flex-col md:flex-row md:space-x-2 md:justify-between"><div className="flex flex-row justify-center space-x-1">{b.hrs?(<>{b.hrs} Hrs</>):(<>{b.trip} trp</>)} at ₹{b.rate}/{b.hrs?(<>h</>):(<>t</>)}   </div>
<div  className=" flex flex-row md:w-3/4 px-1 justify-center md:px-2 bg-red-300 bg-opacity-80 rounded-lg text-teal-900 hover:cursor-pointer hover:bg-opacity-60">{b.rmrk}

</div>
</div>

</div>
 ))}
             


  {calert && (
    <div className="text-center mt-4 text-indigo-200 font-semibold">
      {calert}
    </div>
  )}
</div>
{sflag?(
 <div className=" border-2 p-2 border-indigo-300 bg-indigo-200 rounded-md w-full sm:w-4/5">
<form className="   space-y-3">
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
     className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-300 bg-opacity-5 text-indigo-500 font-semibold rounded-full "
       >
        <option value="">Select Shift</option>
  <option value="D">Day</option>
  <option value="N">Night</option>
</select>

<label htmlFor="vno" className="block text-md font-semibold text-indigo-500">
    Vehicle:
    </label>
<select  onChange={onchange}  name="vno" id="vno" value={cmodel?.vno || ""}
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-300 bg-opacity-5 text-indigo-500 font-semibold rounded-full "
       >
        <option value="">Select the Vehicle</option>
{vhcl.map((b) => (
    
    <option key={b.vno} value={b.vtype==="Hyva"?`H:${b.vno}`:(b.vtype==="JCB"?`J:${b.vno}`:`P:${b.vno}`)}
      className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-indigo-300 rounded-md p-4 shadow-lg  hover:text-indigo-50 hover:bg-indigo-400 hover:cursor-pointer hover:opacity-80 container mx-auto'
       >{b.vtype} : {b.vno}
   </option>
  ))}
</select>
 
    
<label htmlFor="sid" className="block text-md font-semibold text-indigo-500">
    Driver/Operator Name:
    </label>
<select  onChange={onchange}  name="sid" id="sid" value={cmodel?.sid || ""}
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-300 bg-opacity-5 text-indigo-500 font-semibold rounded-full "
       >
        <option value="">Select who drove Vehicle</option>
{stf.map((b) => (
    
    <option key={b.sid} value={`${b.sid}:${b.name}`}
      className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-indigo-300 rounded-md p-4 shadow-lg  hover:text-indigo-50 hover:bg-indigo-400 hover:cursor-pointer hover:opacity-80 container mx-auto'
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
  
    
    </>):   (<><label htmlFor="hrs" className="block text-md font-semibold text-indigo-500">
      No. of Hours:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.hrs || ""} required type="text" name="hrs" id="hrs"
      onChange={onchange}       placeholder="Enter hours"
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

    

<div className="flex flex-col lg:flex-row "><button onClick={(e) => handlsrch(e,false)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full  hover:bg-indigo-700 hover:text-indigo-50 "
      >Search</button>
      <button onClick={(e) => handlefind(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full  hover:bg-indigo-700 hover:text-indigo-50 "
      >Find</button>
      <button onClick={(e) => handlsflag(false)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full  hover:bg-indigo-700 hover:text-indigo-50 "
      >Cancel</button>
</div>
      
      

  




  </form>
  {alert && (
    <div className="text-center mt-4 text-indigo-500 font-semibold">
      {alert}
    </div>
  )}
  </div>):(<></>)
}
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