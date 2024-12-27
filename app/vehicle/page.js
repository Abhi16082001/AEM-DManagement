"use client"
import { useRouter } from 'next/navigation';
import { useState ,useEffect} from "react"
import { MdDeleteForever } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
export default function Page() {
  const router = useRouter();
  const [uflag, setuflag] = useState("")
  const [dflag, setdflag] = useState(false)
  const [dalert, setdalert] = useState("")
  const [chck, setchck] = useState("")
  const [eflag, seteflag] = useState(false)
    const [vtpe, setvtpe] = useState("All")
    const [vmodel, setvmodel] = useState({})
    const [alert, setalert] = useState("")
    const [vhcl, setvhcl] = useState([])
    const [valert, setvalert] = useState("")
 

    const fetchv = async () => {
        const response = await fetch("/api/alldata?dtyp=vehicle");
        let vjson = await response.json();
        console.log(vjson)
        if (vjson.result.length === 0) setvalert("No Vehicle Added");
        setuflag("");
        setvalert("")
        setvhcl(vjson.result);
        console.log(vhcl)
      };
    
      useEffect(() => {
         fetchv();
      },[vtpe,uflag]);

 
      const handleditf = async () => {
        setvalert("")
        setalert("")
        setdalert("")
        seteflag(false)
        setvmodel({})
      }

    const onchange = (e) => {
        setvmodel({
          ...vmodel,
          [e.target.name]: e.target.value,
        });
      };


      const cvhcl = (e) => {
        setvalert("Loading...")
        setvtpe(e.target.value);
      };

      const handlevdetails = (vd) => {
        const evd = encodeURIComponent(JSON.stringify(vd));
        router.push(`/vdetails?vdtls=${evd}`);
      };
      
      const deletev = async (bul,id) => {
        setvalert("")
        setalert("")
        setdalert("")
        setdflag(bul)
        setchck(id)
      }
      const handledit = async (dtls) => {
        setvalert("")
        setalert("")
        setdalert("")
        seteflag(true)
        setvmodel({...dtls,okey:dtls.vno})
      }


      const handleupdate = async (e) => {
        setalert("Updating Details...")
        e.preventDefault();
        const co = {...vmodel,pkey:"vno",dtype:"vehicle" }; 
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
            seteflag(false)
            setuflag("upd")
            setvalert("")
            setdalert("")
           setvmodel({})
          }
          else{
            console.log("Error Updating Details !!")
            setalert(data.message)
          }
        }
        catch(error){
      console.error('Error:',error);
        }
      }

      const handledel = async (id) => {
        setdalert(`Deleting Data ...`)
        const co = {id:id,pkey:"vno",dtype:"vehicle" }; 
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
                throw new Error(data.message || 'Failed to delete the Data');
            }
      
            console.log(data.message); // Log success message
            setdalert(` Data deleted successfully.`)
            setuflag("del")
            setvalert("")
            setalert("")
            setvmodel({})
        } catch (erro) {
            console.log('Error:', erro);
        }
      };

    const addv = async (e) => {
        e.preventDefault();
        setalert("Adding Vehicle...");
        const co = {  ...vmodel,dtyp:"vehicle",pkey:"vno" };
        try {
          const response = await fetch("/api/alldata", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
const data= await response.json()
          if (response.ok) {
            setalert("Vehicle added Successfully!");
            setvmodel({})
            setuflag("add")
            setvalert("")
            setdalert("")
          } else {
            setalert(data.message);
          }
        } catch (error) {
          setalert("Error in adding Vehicle.");
          console.error('Error:', error);
        }
      };

 return (
  <>
  <div className="flex-col justify-items-center space-y-2 p-1 ">
  <div className="bg-gradient-to-r from-indigo-600 to-purple-300 w-11/12 lg:w-4/5  text-sm sm:text-lg flex flex-col sm:flex-row sm:justify-center sm:gap-8  font-serif font-semibold  p-2  rounded-md">
  <p className='text-center'>Menu for Vehicles !! </p>
  <select className='rounded-full sm:p-1 p-2 bg-indigo-200' onChange={cvhcl} name="vtype" id="vtype">
    
  <option value="All">All</option>
  <option value="JCB">JCB</option>
  <option value="Hyva">Hyva</option>
  <option value="Poclain">Poclain</option>
</select>

</div>
<div className="container h-[75vh] bg-blue-500 p-2 rounded-lg bg-opacity-20 w-11/12 lg:w-4/5 space-y-2 overflow-y-scroll">
{valert && (
    <div className="text-center mt-4 text-teal-300 font-semibold">
      {valert}
    </div>
  )}
  {vhcl.map((b) => (
    
        <div key={b.vno}>
             
           {(b.vtype===vtpe || vtpe==="All")?(<><div
          className='space-y-2 sm:space-x-2 sm:space-y-3 flex flex-col sm:flex-row sm:justify-between  text-lg font-semibold bg-gradient-to-r from-teal-700 to-teal-800 rounded-md  p-3  shadow-lg  container mx-auto'
           ><div onClick={() => handlevdetails(b)} className='bg-teal-300 bg-opacity-80 text-teal-950 hover:cursor-pointer hover:opacity-80 rounded-md py-3 px-5 w-full flex flex-col sm:flex-row sm:space-x-3'>
            <span className='border-teal-950 sm:border-b-0 border-b-2  sm:border-r-2 sm:px-4'  >{b.vtype} </span><span> {b.vno}</span></div>
       <div className="  flex flex-row sm:gap-8  justify-evenly">   <button className= "   hover:bg-blue-500 bg-blue-200   p-2 rounded-full" onClick={() => handledit(b)}><RiEditCircleFill  className="text-blue-500 hover:text-blue-200"  size={30}  /></button>
       { (dflag && chck===b.vno)? (<><button onClick={() => handledel(b.vno)} className="bg-red-500 hover:bg-opacity-50 text-red-200 rounded-full md:px-4 px-2">Yes</button > <button onClick={() => deletev(false,b.vno)} className="bg-green-500 hover:bg-opacity-50 text-green-200 rounded-full md:px-4 px-2">No</button></>):(<><button className="hover:bg-fuchsia-700 bg-fuchsia-200     p-2 rounded-full " onClick={() => deletev(true,b.vno)}><MdDeleteForever  className="text-fuchsia-700 hover:text-fuchsia-200"  size={30} /></button></>)}
          </div> </div></>):"" }</div>
      ))}

{dalert && (
  <div className="text-center mt-4 text-red-500 font-semibold">
      {dalert}
    </div>
  )}
  </div>

  <div className=" border-2 p-2 border-cyan-500 bg-cyan-100 bg-opacity-50 rounded-md w-full sm:w-4/5">
<form onSubmit={addv} className="space-y-4">
<div className="text-center text-sm lg:text-lg font-semibold font-mono bg-cyan-400 bg-opacity-50 p-2 rounded-lg  ">Add Details: </div>
    <label htmlFor="vno" className="block text-md font-semibold text-cyan-900">
      Vehicle No.:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={vmodel?.vno || ""} required type="text" name="vno" id="vno"
      onChange={onchange}       placeholder="Enter vno"
      className=" w-full px-4 py-2 border border-cyan-500  bg-cyan-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-600"

    />
    <label htmlFor="vno" className="block text-md font-semibold text-cyan-900">
      Vehicle Type:
    </label>
    <select  onChange={onchange}  name="vtype" id="vtype" value={vmodel?.vtype || ""}
       className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-5 text-cyan-500 font-semibold rounded-full hover:bg-cyan-700 hover:text-cyan-50 "
       >
        <option value="">Select the Vehicle Type</option>
  <option value="JCB">JCB</option>
  <option value="Hyva">Hyva</option>
  <option value="Poclain">Poclain</option>
</select>
{eflag? (<><button onClick={(e) => handleupdate(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-50 text-cyan-50 font-semibold rounded-full hover:bg-cyan-700 hover:text-cyan-50 "
      >Update Vehicle</button>
      
      <button onClick={(e) => handleditf()} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-50 text-cyan-50 font-semibold rounded-full  hover:bg-cyan-700 hover:text-cyan-50 "
      >Cancel</button>
      </>):
    (<><button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-50 text-cyan-50 font-semibold rounded-full hover:bg-cyan-700 hover:text-cyan-50 "
    >
      Add Vehicle
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
