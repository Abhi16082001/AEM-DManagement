"use client"
import Link from "next/link"
import { useState } from "react"
export default function Home() {
    const [pflag, setpflag] = useState(false)
    const [dmodel, setdmodel] = useState({})
    const [alert, setalert] = useState("")
    const onchange = (e) => {
      setdmodel({
          ...dmodel,
          [e.target.name]: e.target.value,
        });
    };


    const handleupdate = async (e) => {
      e.preventDefault();
      setalert("Updating Password...")
      const co = {...dmodel,dtype:"password" }; 
      try{
        const response= await fetch('api/daily',{
          method:'PUT',
          headers:{ 'Content-Type':'application/json'},
          body: JSON.stringify(co)
        });
        const data= await response.json()
        if(data.ok){
          console.log("Password Updated Sucessfully ! ")
          setalert("Password Updated Successfully !!")
         setdmodel({})
        }
        else{
          console.log("Error Updating Password !!")
          setalert(data.message)
        }
      }
      catch(error){
    console.error('Error:',error);
      }
    }


 return (
  <>
  <div className="flex-col justify-items-center space-y-2 p-1 ">
    <div  >
  Menu for Anil Earth Mover !!
  <Link className="bg-sky-500" href='staff'>Staff</Link>
  <Link className="bg-teal-500" href='vehicle'>Vehicle</Link>
  <Link className="bg-emerald-500" href='contractor'>Contractor</Link>
  <Link className="bg-violet-500" href='tender'>Tender</Link>
  <Link className="bg-indigo-500" href='daily'>Daily Summary</Link>
  </div>
  <div className="bg-blue-500 bg-opacity-50 p-2 justify-items-center rounded-md w-full sm:w-4/5 ">

{pflag?( <> <form onSubmit={handleupdate} className="bg-indigo-200 bg-opacity-50  space-y-4 w-full sm:w-4/5 p-2 rounded-lg border-2 border-indigo-700">
<label htmlFor="pwd" className="block text-md font-semibold text-indigo-800">
      Enter Password:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={dmodel?.pwd || ""} required type="text" name="pwd" id="pwd" 
      onChange={onchange}       placeholder="Enter Password"
      className=" w-full px-4 py-2 border border-indigo-500 bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600" />
<div className="flex flex-col sm:flex-row sm:gap-2">
<button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full hover:bg-indigo-700 hover:text-indigo-50 ">
        Update</button>

        <button onClick={()=>{setpflag(false); setalert(""); setdmodel({});}}
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full hover:bg-indigo-700 hover:text-indigo-50 ">
        Cancel</button>
        </div>
</form></>):""}

{alert && (
    <div className="text-center mt-4 text-indigo-900 font-semibold">
      {alert}
      </div>
  )}
    
    {pflag?"":(<button className="bg-indigo-300 p-2 rounded-full border-2 border-indigo-200 text-indigo-900 font-serif w-full font-extrabold hover:bg-opacity-50 hover:text-indigo-50" onClick={()=>{setpflag(true);}} >Change Password</button>)}
  </div>
  </div>
  </>
 ) 
}
