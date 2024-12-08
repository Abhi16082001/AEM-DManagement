"use client"
import { useRouter } from 'next/navigation';
import { useState ,useEffect} from "react"
import { TbEditCircle } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
export default function Page() {
  const router = useRouter();
    const [srle, setsrle] = useState("")
    const [smodel, setsmodel] = useState({})
    const [alert, setalert] = useState("")
    const [stf, setstf] = useState([])
    const [salert, setsalert] = useState("")


    const fetchs = async () => {
        const response = await fetch("/api/alldata?dtyp=staff");
        let sjson = await response.json();
        setstf(sjson.result);
        console.log(stf)
        if (sjson.result.length === 0) setsalert("No Staff Added");
      };
    
      useEffect(() => {
         fetchs();
      },[srle]);


    const onchange = (e) => {
        setsmodel({
          ...smodel,
          [e.target.name]: e.target.value,
        });
      };

      const cstf = (e) => {
        setsrle(e.target.value);
      };

      const handlesdetails = (sd) => {
        const esd = encodeURIComponent(JSON.stringify(sd));
        router.push(`/sdetails?sdtls=${esd}`);
      };
      
      const deletes = async () => {}
      const handledit = async () => {}

    const adds = async (e) => {
        e.preventDefault();
        setalert("Adding Staff...");
        const dtyp="staff"
        const co = {  ...smodel };
        try {
          const response = await fetch(`/api/alldata?dtyp=${dtyp}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
          if (response.ok) {
            setalert("Staff added Successfully!");
            setsmodel({});
            setsalert("");
          } else {
            setalert("Error in adding Staff.");
          }
        } catch (error) {
          setalert("Error in adding Staff.");
          console.error('Error:', error);
        }
      };

 return (
  <>
  Menu for Staff  !!
  <select onChange={cstf} name="srole" id="srole">
    <option value="">Choose Staff type</option>
  <option value="Driver">Driver</option>
  <option value="Operator">Operator</option>
  <option value="Helper">Helper</option>
  <option value="All">All</option>
</select>
{salert && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {salert}
    </div>
  )}

<div>
  {stf.map((b) => (
    
        <div key={b.sid}>
             
           {(b.srole===srle || srle==="All")?(<><div
           className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'
           ><span  onClick={() => handlesdetails(b)} >{b.sid} : {b.name}</span>
       <div className="  flex justify-center gap-20  xs:justify-between xs:gap-8">   <button className= "   hover:bg-green-700 bg-green-200   p-2 rounded-full" onClick={() => handledit()}><TbEditCircle className="text-green-700 hover:text-green-200"  size={30}  /></button>
          <button className="hover:bg-red-700 bg-red-200     p-2 rounded-full " onClick={() => deletes()}><RiDeleteBin5Line className="text-red-700 hover:text-red-200"  size={30} /></button>
          </div> </div></>):"" }</div>
      ))}</div>


<form onSubmit={adds} className="space-y-4">
    <label htmlFor="sid" className="block text-md font-semibold text-green-500">
      Staff user ID :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={smodel?.sid || ""} required type="text" name="sid" id="sid"
      onChange={onchange}       placeholder="Create User ID"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
    
    <label htmlFor="name" className="block text-md font-semibold text-green-500">
      Full Name :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={smodel?.name || ""} required type="text" name="name" id="name"
      onChange={onchange}       placeholder="Enter Name"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />

    <select  onChange={onchange}  name="srole" id="srole" value={smodel?.srole || ""}
       className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
       >
        <option value="">Select the Staff Type</option>
  <option value="Driver">Driver</option>
  <option value="Operator">Operator</option>
  <option value="Helper">Helper</option>
</select>
    <button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
    >
      Add Staff
    </button>
  </form>
  {alert && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {alert}
    </div>
  )}
  </>
 )
}
