"use client"
import { useRouter } from 'next/navigation';
import { useState ,useEffect} from "react"
import { TbEditCircle } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
export default function Page() {
  const router = useRouter();
    const [cmodel, setcmodel] = useState({})
    const [alert, setalert] = useState("")
    const [cntr, setcntr] = useState([])
    const [calert, setcalert] = useState("")


    const fetchc = async () => {
        const response = await fetch("/api/alldata?dtyp=contractor");
        let cjson = await response.json();
        setcntr(cjson.result);
        console.log(cntr)
        if (cjson.result.length === 0) setcalert("No Contractor Added");
      };
    
      useEffect(() => {
         fetchc();
      },[cmodel]);


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
      
      const deletec = async () => {}
      const handledit = async () => {}

    const addc = async (e) => {
        e.preventDefault();
        setalert("Adding Contractor...");
        const dtyp="contractor"
        const co = {  ...cmodel };
        try {
          const response = await fetch(`/api/alldata?dtyp=${dtyp}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
          if (response.ok) {
            setalert("Contractor added Successfully!");
            setcmodel({});
            setcalert("");
          } else {
            setalert("Error in adding Contractor.");
          }
        } catch (error) {
          setalert("Error in adding Contractor.");
          console.error('Error:', error);
        }
      };

 return (
  <>
 
{calert && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {calert}
    </div>
  )}

<div>
  {cntr.map((b) => (
    
        <div key={b.cid}
           className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'
           ><span  onClick={() => handlecdetails(b)} >{b.cid} : {b.name}: {b.td}</span>
       <div className="  flex justify-center gap-20  xs:justify-between xs:gap-8">   <button className= "   hover:bg-green-700 bg-green-200   p-2 rounded-full" onClick={() => handledit()}><TbEditCircle className="text-green-700 hover:text-green-200"  size={30}  /></button>
          <button className="hover:bg-red-700 bg-red-200     p-2 rounded-full " onClick={() => deletec()}><RiDeleteBin5Line className="text-red-700 hover:text-red-200"  size={30} /></button>
          </div> </div>
      ))}</div>


<form onSubmit={addc} className="space-y-4">
    <label htmlFor="cid" className="block text-md font-semibold text-green-500">
      Contractor ID :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.cid || ""} required type="text" name="cid" id="cid"
      onChange={onchange}       placeholder="Create Contractor ID"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
    
    <label htmlFor="name" className="block text-md font-semibold text-green-500">
      Contractor Name :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.name || ""} required type="text" name="name" id="name"
      onChange={onchange}       placeholder="Enter Name"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
  
    <button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
    >
      Add Contractor
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
