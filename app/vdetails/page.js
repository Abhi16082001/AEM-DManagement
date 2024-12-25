"use client"
import Link from "next/link";
import { FcHome } from "react-icons/fc";
import { FcSearch } from "react-icons/fc";
import { useSearchParams } from "next/navigation";
import { useState ,useEffect, Suspense,useRef} from "react"
import { TbEditCircle } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
export default function Page() {
  const cardRefs = useRef([]);
  const [selid, setselid] = useState(null)
  const [eflag, seteflag] = useState(false)
  const [sflag, setsflag] = useState(false)
  const [uflag, setuflag] = useState("")
    const [vd, setvd] = useState(null)
    const [chck, setchck] = useState("")
    const [vmodel, setvmodel] = useState({})
    const [alert, setalert] = useState("")
    const [vhcl, setvhcl] = useState([])
    const [valert, setvalert] = useState("Loading...")
    const [dflag, setdflag] = useState(false)
    const [dalert, setdalert] = useState("")
    const [stf, setstf] = useState([])

    const fetchv = async () => {
        const response = await fetch(`/api/vdetails?vno=${encodeURIComponent(vd.vno)}`);
        let vjson = await response.json();
        setvhcl(vjson.av);
        console.log(vhcl)
        setvalert("");
        if (vjson.av.length === 0) setvalert("No Details Added");
      };
    
      useEffect(() => {
        if(vd){ fetchv();}
      },[uflag,vd]);

      const fetchs = async () => {
        const response = await fetch("/api/alldata?dtyp=staff");
        let sjson = await response.json();
        setstf(sjson.result);
      };
      
      useEffect(() => {
         fetchs();
      },[]);


    const onchange = (e) => {
        setvmodel({
          ...vmodel,vno:vd.vno,
          [e.target.name]: e.target.value,
        });
      };

      const handleditf = async (bul,dtls) => {
        setuflag("")
        setvalert("")
        setalert("")
        setdalert("")
        setsflag(false)
        seteflag(bul)
        setvmodel(dtls)
      }


      const handlsrch = async (e,isfnd) => {
        e.preventDefault(); 
          setalert("Searching...");
          const co = { ...vmodel, dtype:"vehicle" };
          try {
            const response = await fetch(`/api/search?model=${encodeURIComponent(JSON.stringify(co))}`,{
              method: 'GET',
            });
      const data= await response.json()
            if (data.success) {
           setvhcl(data.sr)
           if(data.sr.length==0){setvalert("No Matches Found !!")
            setselid(null)
           }
           setTimeout(() => {
            const element = document.getElementById("re-renderpls");
            element?.scrollIntoView({ behavior: "smooth" });
          }, 0); 
           setselid(null)
               if(isfnd) {setselid(data.sr[data.sr.length - 1]._id)
                 setuflag("found")
               }
                 const element = document.getElementById("re-renderpls");
                 element?.scrollIntoView({ behavior: "smooth" });
              setalert("Search Successful !")
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
          fetchv();}
          useEffect(() => {
            if (selid !== null) {
          const index = vhcl.findIndex((item) => item._id === selid);
          console.log(index)
          if (index !== -1 && cardRefs.current[index]) {
            // Scroll to the matched card
            cardRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            setselid(null)
          }}
        }, [selid, vhcl]);

      const handlsflag = async (bul) => {
        setuflag("")
        setvalert("")
        setalert("")
        setdalert("")
        seteflag(false)
        setsflag(bul)
        setvmodel({})
        if(!bul){
          setuflag("srch")
          setvalert("Loading...")
        }
      }

      const handleupdate = async (e) => {
        setalert("Updating Details...")
        e.preventDefault();
        const co = {...vmodel }; 
        try{
          const response= await fetch('api/vdetails',{
            method:'PUT',
            headers:{ 'Content-Type':'application/json'},
            body: JSON.stringify(co)
          });
          if(response.ok){
            console.log("Details Updated Sucessfully ! ")
            setalert("Details Updated Successfully !!")
            seteflag(false)
           setvmodel({})
           setuflag("upd")
           setdalert("")
           setvalert("")
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
            const response = await fetch('/api/vdetails', {
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
            setalert("")
            setvalert("")
        } catch (erro) {
            console.log('Error:', erro);
        }
      };

      const deletev = async (bul,id) => {
        setuflag("")
        setvalert("")
        setalert("")
        setdalert("")
        setdflag(bul)
        setchck(id)
      }
     

    const adddetails = async (e) => {
        e.preventDefault();
        setalert("Adding Details...")
        setuflag("")
        const co = {  ...vmodel };
        try {
          const response = await fetch("/api/vdetails", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
          if (response.ok) {
            setalert("Details added Successfully!")
            setvmodel({})
            setvalert("")
            setdalert("")
            setuflag("add")
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
        <LoadParams setDbobj={setvd} />

      </Suspense>
      <div className="flex-col justify-items-center space-y-2 p-1 ">
      <div className="bg-blue-100 rounded-full w-full p-1 flex flex-row justify-evenly sm:justify-between sm:px-10 ">
  <button className="bg-blue-300 rounded-full p-2 hover:bg-blue-400" onClick={() => handlsflag(true)}>  <FcSearch size={30} />  </button>
  <Link className="bg-blue-300 rounded-full p-2 hover:bg-blue-400" href="/menu"><FcHome  size={30}/></Link>
 </div>


      <div className="bg-gradient-to-r from-indigo-600 to-purple-500 text-teal-100 w-full  text-sm lg:text-lg flex flex-col md:flex-row md:justify-evenly  font-serif font-semibold  p-2  rounded-md">
      <p> Vehicle No. : {vd?(<>{vd.vno} </>):"Loading..."} </p>
 <p>Vehicle Type: {vd?(<>{vd.vtype} </>):"Loading..."} </p></div>
  <div id="re-renderpls" className="container h-[75vh] bg-blue-700 p-2 rounded-lg bg-opacity-30 w-full lg:w-4/5 space-y-2 overflow-y-scroll">





{vhcl.map((b,index) => (
<div key={b._id} ref={(el) => (cardRefs.current[index] = el)} className= {`  transition ${
              selid === b._id
                ? 'bg-indigo-100 border-indigo-500'
                : ''
            }  flex flex-col  lg:space-y-2  text-sm lg:text-lg  bg-teal-100 rounded-lg p-1 text-teal-800 font-mono `}>
  <div className="flex flex-col md:flex-row md:justify-between md:space-x-2">
<div  onClick={() => handleditf(true,b)} className="flex flex-row justify-center lg:px-2 bg-cyan-400 bg-opacity-40 rounded-lg text-teal-950 hover:cursor-pointer hover:bg-opacity-30">
  <p >{b.date}-{b.shft}</p> </div>
<div className="flex flex-row justify-center space-x-2 border-b-2 md:border-b-0  md:px-1 border-teal-500"> <p> {b.sid}</p></div>
<div className="flex flex-row justify-center border-b-2 md:border-b-0  md:px-1 border-teal-500"><p>{b.site}</p></div>
</div>
<div className="flex flex-col md:flex-row md:space-x-2 md:justify-between"><div className="flex flex-row justify-center space-x-1"><p>₹{b.rate}/{b.hrs?(<>h</>):(<>t</>)} -- {b.hrs?(<>{b.hrs} hrs</>):(<>{b.trip} trp</>)}</p></div>
<div onClick={() => deletev(true,b._id)} className="flex flex-row md:w-3/4 px-1 justify-center md:px-2 bg-red-300 bg-opacity-80 rounded-lg text-teal-900 hover:cursor-pointer hover:bg-opacity-60">{b.rmrk}

</div>
</div>
{ (dflag && chck===b._id)? (<><div className="flex flex-row justify-evenly "><p className="text-red-700">Deletion ! Sure ?</p><button  onClick={() => handledel(b._id)} className="bg-red-500 px-1 md:px-10 rounded-full text-rose-100 hover:bg-opacity-80">Yes</button > <button onClick={() => deletev(false,b._id)} className="bg-indigo-500 text-rose-100 rounded-full px-2 md:px-10 hover:bg-opacity-80">No</button></div></>):(<></>)}
</div>
 ))}
      
   
      {dalert && (
    <div className="text-center mt-4 text-red-500 font-semibold">
      {dalert}
    </div>
  )}
  {valert && (
    <div className="text-center mt-4 text-teal-600 font-semibold">
      {valert}
    </div>
  )}
  </div>
<div className=" border-2 p-2 border-indigo-300 bg-indigo-200 rounded-md w-full sm:w-4/5">
<form onSubmit={adddetails} className="space-y-4">
<div  className="text-center text-sm lg:text-lg font-semibold font-mono bg-indigo-500 bg-opacity-50 p-2 rounded-lg  ">Add Details:</div>
    <label htmlFor="date" className="block text-md font-semibold text-indigo-900">
      Date:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={vmodel?.date || ""} required type="date" name="date" id="date"
      onChange={onchange}       placeholder="Enter Date"
      className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"

    />
   <label htmlFor="date" className="block text-md font-semibold text-indigo-900">
    Shift:
    </label>
  <select  onChange={onchange}  name="shft" id="shft" value={vmodel?.shft || ""}
       className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-300 bg-opacity-5 text-indigo-500 font-semibold rounded-full "
       >
        <option value="">Select Shift</option>
  <option value="D">Day</option>
  <option value="N">Night</option>
</select>

<label htmlFor="site" className="block text-md font-semibold text-indigo-900">
      Site Address:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={vmodel?.site || ""} required type="text" name="site" id="site"
      onChange={onchange}       placeholder="Enter Site address"
      className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"

    />

    
<label htmlFor="sid" className="block text-md font-semibold text-indigo-900">
    Driver/Operator Name:
    </label>
<select  onChange={onchange}  name="sid" id="sid" value={vmodel?.sid || ""}
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

    <label htmlFor="rate" className="block text-md font-semibold text-indigo-900">
      Rate:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={vmodel?.rate || ""} required type="text" name="rate" id="rate"
      onChange={onchange}       placeholder="Enter Rate"
      className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"

    />

    
  { vd?.vtype==="Hyva"? (<><label htmlFor="trip" className="block text-md font-semibold text-indigo-900">
      No. of Trips:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={vmodel?.trip || ""} required type="text" name="trip" id="trip"
      onChange={onchange}       placeholder="Enter trip"
      className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
    /></>):   (<><label htmlFor="hrs" className="block text-md font-semibold text-indigo-900">
      No. of Hours:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={vmodel?.hrs || ""} required type="text" name="hrs" id="hrs"
      onChange={onchange}       placeholder="Enter hours"
      className=" w-full px-4 py-2 border border-indigo-500  bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
    /></>)}
  
  <label htmlFor="rmrk" className="block text-md font-semibold text-indigo-900">
      Remarks:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={vmodel?.rmrk || ""} required type="text" name="rmrk" id="rmrk"
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
    const vobj = searchParams.get('vdtls');
    useEffect(() => {
      if (vobj) {
        const dvobj = vobj ? JSON.parse(decodeURIComponent(vobj)) : null;
        setDbobj(
          {...dvobj}
        );
      
      }}, [vobj, setDbobj]);
  
    return null;
  }