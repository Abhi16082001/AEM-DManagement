"use client"
import { useRouter } from 'next/navigation';
import { useState ,useEffect} from "react"
import { TbEditCircle } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
export default function Page() {
  const router = useRouter();
    const [vtpe, setvtpe] = useState("")
    const [vmodel, setvmodel] = useState({})
    const [alert, setalert] = useState("")
    const [vhcl, setvhcl] = useState([])
    const [valert, setvalert] = useState("")


    const fetchv = async () => {
        const response = await fetch("/api/alldata?dtyp=vehicle");
        let vjson = await response.json();
        setvhcl(vjson.result);
        console.log(vhcl)
        if (vjson.result.length === 0) setvalert("No Vehicle Added");
      };
    
      useEffect(() => {
         fetchv();
      },[vtpe]);


    const onchange = (e) => {
        setvmodel({
          ...vmodel,
          [e.target.name]: e.target.value,
        });
      };

      const cvhcl = (e) => {
        setvtpe(e.target.value);
      };

      const handlevdetails = (vd) => {
        const evd = encodeURIComponent(JSON.stringify(vd));
        router.push(`/vdetails?vdtls=${evd}`);
      };
      
      const deletev = async () => {}
      const handledit = async () => {}

    const addv = async (e) => {
        e.preventDefault();
        setalert("Adding Vehicle...");
        const dtyp="vehicle"
        const co = {  ...vmodel };
        try {
          const response = await fetch(`/api/alldata?dtyp=${dtyp}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
          if (response.ok) {
            setalert("Vehicle added Successfully!");
            setvmodel({});
          } else {
            setalert("Error in adding Vehicle.");
          }
        } catch (error) {
          setalert("Error in adding Vehicle.");
          console.error('Error:', error);
        }
      };

 return (
  <>
  Menu for Vehicles !!
  <select onChange={cvhcl} name="vtype" id="vtype">
    <option value="">Choose Vehicle type</option>
  <option value="JCB">JCB</option>
  <option value="Hyva">Hyva</option>
  <option value="Poclain">Poclain</option>
  <option value="All">All</option>
</select>
{valert && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {valert}
    </div>
  )}

<div>
  {vhcl.map((b) => (
    
        <div key={b.vno}>
             
           {(b.vtype===vtpe || vtpe==="All")?(<><div
           className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'
           ><span  onClick={() => handlevdetails(b)} >{b.vtype} : {b.vno}</span>
       <div className="  flex justify-center gap-20  xs:justify-between xs:gap-8">   <button className= "   hover:bg-green-700 bg-green-200   p-2 rounded-full" onClick={() => handledit()}><TbEditCircle className="text-green-700 hover:text-green-200"  size={30}  /></button>
          <button className="hover:bg-red-700 bg-red-200     p-2 rounded-full " onClick={() => deletev()}><RiDeleteBin5Line className="text-red-700 hover:text-red-200"  size={30} /></button>
          </div> </div></>):"" }</div>
      ))}</div>


<form onSubmit={addv} className="space-y-4">
    <label htmlFor="vno" className="block text-md font-semibold text-green-500">
      Vehicle No.:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={vmodel?.vno || ""} required type="text" name="vno" id="vno"
      onChange={onchange}       placeholder="Enter vno"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
    
    <select  onChange={onchange}  name="vtype" id="vtype" value={vmodel?.vtype || ""}
       className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
       >
        <option value="">Select the Vehicle Type</option>
  <option value="JCB">JCB</option>
  <option value="Hyva">Hyva</option>
  <option value="Poclain">Poclain</option>
</select>
    <button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
    >
      Add Vehicle
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
