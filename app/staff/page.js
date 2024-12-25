"use client"
import { useRouter } from 'next/navigation';
import { useState ,useEffect} from "react"
import { TbEditCircle } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
import { RiDeleteBin5Line } from "react-icons/ri";
export default function Page() {
  const router = useRouter();
  const [uflag, setuflag] = useState("")
  const [dflag, setdflag] = useState(false)
  const [chck, setchck] = useState("")
  const [dalert, setdalert] = useState("")
  const [eflag, seteflag] = useState(false)
    const [srle, setsrle] = useState("")
    const [smodel, setsmodel] = useState({})
    const [alert, setalert] = useState("")
    const [stf, setstf] = useState([])
    const [salert, setsalert] = useState("")


    const fetchs = async () => {
        const response = await fetch("/api/alldata?dtyp=staff");
        let sjson = await response.json();
        if (sjson.result.length === 0) setsalert("No Staff Added");
        setuflag("");
        setsalert("")
        setstf(sjson.result);
        console.log(stf)
      };
    
      useEffect(() => {
         fetchs();
      },[srle,uflag]);


    const onchange = (e) => {
        setsmodel({
          ...smodel,
          [e.target.name]: e.target.value,
        });
      };

      const cstf = (e) => {
        setsalert("Loading...")
        setsrle(e.target.value);
      };

      const handlesdetails = (sd) => {
        const esd = encodeURIComponent(JSON.stringify(sd));
        router.push(`/sdetails?sdtls=${esd}`);
      };
      
      const deletes = async (bul,id) => {
        setdalert("")
            setsalert("")
            setalert("")
        setdflag(bul)
        setchck(id)
      }

      const handledel = async (id) => {
        setdalert(`Deleting Data ...`)
        const co = {id:id,pkey:"sid",dtype:"staff" }; 
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
            setsmodel({})
            setalert("")
            setsalert("")
            setuflag("del")
        } catch (erro) {
            console.log('Error:', erro);
        }
      };

      const handledit = async (dtls) => {
        setdalert("")
            setsalert("")
            setalert("")
        seteflag(true)
        setsmodel({...dtls,okey:dtls.sid})
      }
 
      const handleditf = async () => {
        setsalert("")
        setalert("")
        setdalert("")
        seteflag(false)
        setsmodel({})
      }


      const handleupdate = async (e) => {
        setalert("Updating Details...")
        e.preventDefault();
        const co = {...smodel,pkey:"sid",dtype:"staff" }; 
        try{
          const response= await fetch('api/alldata',{
            method:'PUT',
            headers:{ 'Content-Type':'application/json'},
            body: JSON.stringify(co)
          });
          console.log(response)
          const data= await response.json()
          console.log(data)
          if(response.ok){
            console.log("Details Updated Sucessfully ! ")
            setalert("Details Updated Successfully !!")
            seteflag(false)
            setdalert("")
            setuflag("upd")
            setsalert("")
           setsmodel({})
          }
          else{
            console.log(data.message)
            setalert(data.message)
          }
        }
        catch(error){
      console.error('Error:',error);
        }
      }

     

    const adds = async (e) => {
        e.preventDefault();
        setalert("Adding Staff...");
        const co = {  ...smodel,dtyp:"staff",pkey:"sid" };
        try {
          const response = await fetch("/api/alldata", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
const data= await response.json()
console.log(data)
          if (response.ok) {
            setalert("Staff added Successfully!");
            setsmodel({})
            setuflag("add")
            setsalert("")
            setdalert("")
            
          } else {
            setalert(data.message);
          }
        } catch (error) {
          setalert("Error in adding Staff.");
          console.error('Error:', error);
        }
      };

 return (
  <>
  <div className="flex-col justify-items-center space-y-2 p-1 ">
  <div className="bg-gradient-to-r from-indigo-600 to-purple-300  w-11/12 lg:w-4/5  text-sm lg:text-lg flex flex-col sm:flex-row sm:justify-center sm:gap-8  font-serif font-semibold  p-2  rounded-md">
  <p className='text-center'>Menu for Staff  !! </p>
  <select className='rounded-full sm:p-1 p-2 bg-indigo-200' onChange={cstf} name="srole" id="srole">
    <option value="">Choose Staff type</option>
  <option value="Driver">Driver</option>
  <option value="Operator">Operator</option>
  <option value="Helper">Helper</option>
  <option value="All">All</option>
</select>

</div>
<div className="container h-[75vh] bg-blue-500 p-2 rounded-lg bg-opacity-20 w-11/12 lg:w-4/5 space-y-2 overflow-y-scroll">
{salert && (
    <div className="text-center mt-4 text-sky-700 font-semibold">
      {salert}
    </div>
  )}
  {stf.map((b) => (
    
        <div key={b.sid}>
             
           {(b.srole===srle || srle==="All")?(<><div
           className='space-y-2 sm:space-x-2 sm:space-y-3 flex flex-col sm:flex-row sm:justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-sky-700 to-sky-800 rounded-md p-4  shadow-lg  container mx-auto'
           >
            <div onClick={() => handlesdetails(b)} className='bg-sky-300 bg-opacity-80 hover:cursor-pointer hover:opacity-80 rounded-md py-2 px-5 w-full flex flex-col sm:flex-row sm:space-x-3'>
            <span className='border-sky-950 sm:border-b-0 border-b-2 sm:border-r-2 sm:px-4'  >{b.sid} </span><span className=''> {b.name}</span></div>
       <div className="  flex flex-row sm:gap-8  justify-evenly">   <button className= "   hover:bg-blue-700 bg-blue-200   p-2 rounded-full" onClick={() => handledit(b)}><RiEditCircleFill  className="text-blue-500 hover:text-blue-200"  size={30}  /></button>
       { (dflag && chck===b.sid)? (<><button onClick={() => handledel(b.sid)} className="bg-red-500 rounded-full md:px-4  px-2 text-red-200 hover:bg-opacity-80 hover:text-red-100">Yes</button > <button onClick={() => deletes(false,b.sid)} className="bg-green-500 rounded-full md:px-4  text-green-200 px-2 hover:bg-opacity-80 hover:text-green-100">No</button></>):(<><button className="hover:bg-fuchsia-700 bg-fuchsia-200     p-2 rounded-full " onClick={() => deletes(true,b.sid)}><MdDeleteForever  className="text-fuchsia-700 hover:text-fuchsia-200"  size={30} /></button></>)}
          </div> </div></>):"" }</div>
      ))}
{dalert && (
    <div className="text-center mt-4 text-red-500 font-semibold">
      {dalert}
    </div>
  )}
</div>
<div className=" border-2 p-2 border-cyan-500 bg-cyan-100 bg-opacity-50 rounded-md w-full sm:w-4/5">
<form onSubmit={adds} className="space-y-4">
<div className="text-center text-sm lg:text-lg font-semibold font-mono bg-cyan-400 bg-opacity-50 p-2 rounded-lg  ">Add Details: </div>
    <label htmlFor="sid" className="block text-md font-semibold text-cyan-900">
      Staff user ID :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={smodel?.sid || ""} required type="text" name="sid" id="sid"
      onChange={onchange}       placeholder="Create User ID"
      className=" w-full px-4 py-2 border border-cyan-500  bg-cyan-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-600"

    />
    
    <label htmlFor="name" className="block text-md font-semibold text-cyan-900">
      Full Name :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={smodel?.name || ""} required type="text" name="name" id="name"
      onChange={onchange}       placeholder="Enter Name"
      className=" w-full px-4 py-2 border border-cyan-500  bg-cyan-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-600"

    />
<label htmlFor="name" className="block text-md font-semibold text-cyan-900">
  Staff Role:
</label>
    <select  onChange={onchange}  name="srole" id="srole" value={smodel?.srole || ""}
       className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-5 text-cyan-500 font-semibold rounded-full hover:bg-cyan-700 hover:text-cyan-50 "
       >
        <option value="">Select the Staff Type:</option>
  <option value="Driver">Driver</option>
  <option value="Operator">Operator</option>
  <option value="Helper">Helper</option>
</select>
{eflag? (<><button onClick={(e) => handleupdate(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-50 text-cyan-50 font-semibold rounded-full hover:bg-cyan-700 hover:text-cyan-50 "
      >Update Staff</button>
       <button onClick={(e) => handleditf()} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-50 text-cyan-50 font-semibold rounded-full  hover:bg-cyan-700 hover:text-cyan-50 "
      >Cancel</button>
      
      </>):
    (<><button
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-50 text-cyan-50 font-semibold rounded-full hover:bg-cyan-700 hover:text-cyan-50 "
    >
      Add Staff
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
