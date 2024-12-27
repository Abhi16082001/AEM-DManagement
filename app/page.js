"use client"
import { useRouter } from 'next/navigation';
import { useState } from "react";
export default function Home() {
    const [dmodel, setdmodel] = useState({})
    const router = useRouter();
const [alert, setalert] = useState("")

    const onchange = (e) => {
        setdmodel({
            ...dmodel,
            [e.target.name]: e.target.value,
          });
      };

      const fetchv = async (e) => {
        e.preventDefault();
        setalert("Authenticating...")
        const response = await fetch("/api/alldata?dtyp=password");
        let pjson = await response.json();
        console.log(pjson)
        if (pjson.result === dmodel.pwd) {setalert("Authentication Successful !");
            router.push("/menu");
        }
        else setalert("Authentication Failed !!")

      };


 return (
  <>
  <div className='flex flex-col items-center w-full space-y-10'>
  <p className='text-center bg-indigo-500 bg-opacity-50 w-full xs:text-3xl font-mono p-3 rounded-lg font-extrabold'>!! Anil Earth Mover !!</p>
<div className=' rounded-lg p-3 w-full sm:w-3/5 '>
  <form onSubmit={fetchv} className="space-y-4">
<label htmlFor="pwd" className="block text-md font-semibold text-indigo-800">
      Enter Password:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={dmodel?.pwd || ""} required type="text" name="pwd" id="pwd" 
      onChange={onchange}       placeholder="Enter Password"
      className=" w-full px-4 py-2 border border-indigo-500 bg-indigo-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"

    />
   

<button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-indigo-500 bg-indigo-600 bg-opacity-50 text-indigo-50 font-semibold rounded-full hover:bg-indigo-700 hover:text-indigo-50 ">
        Log In</button>
</form>

{alert && (
    <div className="text-center mt-4 text-indigo-900 font-semibold">
      {alert}
    </div>
  )}
</div>
</div>
  </>
 )
}
