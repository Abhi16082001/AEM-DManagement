"use client" 
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FcSearch } from "react-icons/fc";
import { useState ,useEffect} from "react"
import { MdDeleteForever } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
export default function Page() {
    const [sflag, setsflag] = useState(false)
  const router = useRouter();
  const [uflag, setuflag] = useState("")
  const [sstr, setsstr] = useState("")
  const [dflag, setdflag] = useState(false)
  const [dalert, setdalert] = useState("")
  const [chck, setchck] = useState("")
  const [eflag, seteflag] = useState(false)
    const [cmodel, setcmodel] = useState({})
    const [alert, setalert] = useState("")
    const [cntr, setcntr] = useState([])
    const [calert, setcalert] = useState("Loading...")


    const fetchc = async () => {
        const response = await fetch("/api/alldata?dtyp=contractor");
        let cjson = await response.json();
        setcntr(cjson.result);
        console.log(cntr)
        setuflag("");
        setcalert("")
        if (cjson.result.length === 0) setcalert("No Contractor Added");
      };
    
      useEffect(() => {
         fetchc();
      },[uflag]);


      const handleditf = async () => {
        setcalert("")
        setalert("")
        setdalert("")
        seteflag(false)
        setcmodel({})
      }

    const onchange = (e) => {
        setcmodel({
          ...cmodel,
          [e.target.name]: e.target.value,
        });
      };

    
      const handlecdetails = (cd) => {
        const ecd = encodeURIComponent(JSON.stringify(cd));
        router.push(`/cdetails?cdtls=${ecd}`);
      };
      
      const deletec = async (bul,id) => {
        setcalert("")
        setalert("")
        setdalert("")
        setdflag(bul)
        setchck(id)
      }
      const handledit = async (dtls) => {
        setcalert("")
        setalert("")
        setdalert("")
        seteflag(true)
        setcmodel({...dtls,okey:dtls.cid})
      }
 

      const handleupdate = async (e) => {
        setalert("Updating Details...")
        e.preventDefault();
        const co = {...cmodel,pkey:"cid",dtype:"contractor" }; 
        try{
          const response= await fetch('api/alldata',{
            method:'PUT',
            headers:{ 'Content-Type':'application/json'},
            body: JSON.stringify(co)
          });
          const data= await response.json()
          if(response.ok){
            console.log("Details Updated Sucessfully ! ")
            setalert("Details Updated Successfully !!")
            setuflag("upd")
            setcalert("")
            setdalert("")
            seteflag(false)
           setcmodel({})
          }
          else{
            console.log("Error Updating Details !!")
            setalert(data.message)
          }
        }
        catch(error){
      console.log('Error:',error);
        }
      }

      const handledel = async (id) => {
        setdalert(`Deleting Data ...`)
        const co = {id:id,pkey:"cid",dtype:"contractor" }; 
        // console.log(JSON.stringify({ bid}))
        try {
            const response = await fetch('/api/alldata', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(co ), // Send the ID in the request body
            });
      
            const data = await response.json();
            console.log(response)
            console.log(data)
            if (!data.ok) {
              setdalert(data.message)
                console.log("Failed to Delete")
            }
      
            console.log(data.message); // Log success message
            setdalert(` Data deleted successfully.`)
            setuflag("del")
            setcalert("")
            setalert("")
            setcmodel({})
        } catch (erro) {
            console.log('Error:', erro);
        }
      };


      const handlsflag = async (bul) => {
        setcalert("")
        setcmodel({})
        setalert("")
        setdalert("")
        seteflag(false)
        setsflag(bul)
      setsstr("")
      }

      const onschange = (e) => {
        setsstr( e.target.value);
        console.log(sstr)
      };


    const addc = async (e) => {
        e.preventDefault();
        setalert("Adding Contractor...");
        const co = {  ...cmodel,dtyp:"contractor",pkey:"cid" };
        try {
          const response = await fetch("/api/alldata", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
const data= await response.json()
          if (response.ok) {
            setalert("Contractor added Successfully!")
            setcmodel({})
            setuflag("add")
            setdalert("")
            setcalert("")
          } else {
            setalert(data.message);
          }
        } catch (error) {
          setalert("Error in adding Contractor.");
          console.log('Error:', error);
        }
      };

 return (
  <>
  <div className="flex-col justify-items-center space-y-2 p-1 ">

  <div className="bg-blue-100 rounded-full w-full p-1 flex flex-row gap-2 justify-evenly sm:justify-between sm:px-10 ">
 {!sflag?( <button className="bg-blue-300 rounded-full p-2 hover:bg-blue-400" onClick={() => handlsflag(true)}>  <FcSearch size={30} />  </button>):""}
 { sflag?(<><input  className='w-full px-3 rounded-full'
 type="text" name="srch" id="srch" value={sstr? sstr :""} onChange={onschange} />
  <button className="hover:scale-110 transition-transform duration-300" onClick={() => handlsflag(false)}>  
  <img width="40" height="40" src="https://img.icons8.com/3d-plastilina/69/cancel--v1.png" alt="cancel--v1"/>  </button></>):""}
 </div>

 <div className="bg-gradient-to-r from-indigo-600 to-purple-500 w-11/12 sm:w-4/5  text-sm sm:text-lg  text-center font-serif font-semibold  p-2  rounded-md">All Contractors:</div>


<div className="container h-[75vh] bg-blue-500 p-2 rounded-lg bg-opacity-20 w-11/12 lg:w-4/5 space-y-2 overflow-y-scroll">
{calert && (
    <div className="text-center mt-4 text-indigo-200 font-semibold">
      {calert}
    </div>
  )}

  {cntr.map((b) => (
    
       <div key={b.cid}>
              {(!(sflag) || (b.cid.toLowerCase().includes(sstr.toLowerCase()) 
                         || b.name.toLowerCase().includes(sstr.toLowerCase())
                         || sstr==="") )?
              (<div className='space-y-2 sm:space-x-2 sm:space-y-3 flex flex-col sm:flex-row sm:justify-between text-lg font-semibold bg-gradient-to-r from-indigo-700 to-indigo-800 rounded-md p-3  shadow-lg  container mx-auto'>
                 <div onClick={() => handlecdetails(b)} className='bg-indigo-200 bg-opacity-60 text-indigo-950 hover:cursor-pointer hover:opacity-80 rounded-md py-3 px-5 w-full flex flex-col sm:flex-row sm:space-x-3'>
            <span className='border-indigo-700 sm:border-b-0 border-b-2 sm:w- sm:border-r-2 sm:px-4' >{b.cid} </span> <span>{b.name}</span></div>
       <div className="  flex flex-row sm:gap-8  justify-evenly">   <button className= "   hover:bg-blue-500 bg-blue-200   p-2 rounded-full" onClick={() => handledit(b)}><RiEditCircleFill  className="text-blue-500 hover:text-blue-200"  size={30}  /></button>
       { (dflag && chck===b.cid)?(<><button onClick={() => handledel(b.cid)} className="bg-red-500 hover:bg-opacity-50 rounded-full text-red-200 md:px-4 px-2">Yes</button > <button onClick={() => deletec(false,b.cid)} className="bg-green-500 hover:bg-opacity-50 text-green-200 rounded-full md:px-4 px-2">No</button></>):(<><button className="hover:bg-fuchsia-700 bg-fuchsia-200     p-2 rounded-full " onClick={() => deletec(true,b.cid)}><MdDeleteForever className="text-fuchsia-700 hover:text-fuchsia-200"  size={30} /></button></>)}
          </div></div>):"" }
          </div>
      ))}
{dalert && (
  <div className="text-center mt-4 text-red-500 font-semibold">
      {dalert}
    </div>
  )}
  </div>

<div className=" border-2 p-2 border-cyan-500 bg-cyan-100 bg-opacity-50 rounded-md w-full sm:w-4/5">
<form onSubmit={addc} className="space-y-4">
<div className="text-center text-sm lg:text-lg font-semibold font-mono bg-cyan-400 bg-opacity-50 p-2 rounded-lg  ">Add Details: </div>
    <label htmlFor="cid" className="block text-md font-semibold text-cyan-900">
      Contractor ID :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.cid || ""} required type="text" name="cid" id="cid"
      onChange={onchange}       placeholder="Create Contractor ID"
      className=" w-full px-4 py-2 border border-cyan-500  bg-cyan-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-600"

    />
    
    <label htmlFor="name" className="block text-md font-semibold text-cyan-900">
      Contractor Name :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.name || ""} required type="text" name="name" id="name"
      onChange={onchange}       placeholder="Enter Name"
      className=" w-full px-4 py-2 border border-cyan-500  bg-cyan-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-600"

    />

<label htmlFor="pbal" className="block text-md font-semibold text-cyan-900">
      Previous Balance :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.pbal || ""} required type="text" name="pbal" id="pbal"
      onChange={onchange}       placeholder="Enter Previous Balance"
      className=" w-full px-4 py-2 border border-cyan-500  bg-cyan-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-600"

    />
  
  {eflag? (<><button onClick={(e) => handleupdate(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-50 text-cyan-50 font-semibold rounded-full hover:bg-cyan-700 hover:text-cyan-50 "
      >Update Contractor</button>
      
      <button onClick={(e) => handleditf()} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-50 text-cyan-50 font-semibold rounded-full  hover:bg-cyan-700 hover:text-cyan-50 "
      >Cancel</button>
      
      </>):
    (<><button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-50 text-cyan-50 font-semibold rounded-full hover:bg-cyan-700 hover:text-cyan-50 "
    >
      Add Contractor
    </button></>)}
  </form>
  {alert && (
    <div className="text-center mt-4 text-cyan-800 font-semibold">
      {alert}
    </div>
  )}

</div>
</div>
  </>
 )
}
