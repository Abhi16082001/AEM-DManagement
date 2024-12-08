"use client"
import { useSearchParams } from "next/navigation";
import { useState ,useEffect, Suspense} from "react"
import { TbEditCircle } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
export default function Home() {
    const [vd, setvd] = useState(null)
    const [vmodel, setvmodel] = useState({})
    const [alert, setalert] = useState("")
    const [vhcl, setvhcl] = useState([])
    const [valert, setvalert] = useState("")


    const fetchv = async () => {
        const response = await fetch(`/api/vdetails?vno=${encodeURIComponent(vd.vno)}`);
        let vjson = await response.json();
        setvhcl(vjson.av);
        console.log(vhcl)
        if (vjson.av.length === 0) setvalert("No Details Added");
      };
    
      useEffect(() => {
        if(vd){ fetchv();}
      },[vmodel,vd]);


    const onchange = (e) => {
        setvmodel({
          ...vmodel,vno:vd.vno,
          [e.target.name]: e.target.value,
        });
      };

   

      
      const deletev = async () => {}
      const handledit = async () => {}

    const adddetails = async (e) => {
        e.preventDefault();
        setalert("Adding Details...");
        const co = {  ...vmodel };
        try {
          const response = await fetch("/api/vdetails", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
          if (response.ok) {
            setalert("Details added Successfully!");
            setvmodel({});
            setvalert("");
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
  All details of {vd?(vd.vtype):"Loading..."} are here !!
 
<div>
  {vhcl.map((b) => (
        <div key={b._id}
            className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'>      
           <span  className="inline-block w-full sm:w-3/5">{b.date} -- {b.trip} </span>  
       <div className="  flex justify-center gap-20  xs:justify-between xs:gap-8">   <button className= "   hover:bg-green-700 bg-green-200   p-2 rounded-full" onClick={() => handledit()}><TbEditCircle className="text-green-700 hover:text-green-200"  size={30}  /></button>
          <button className="hover:bg-red-700 bg-red-200     p-2 rounded-full " onClick={() => deletev()}><RiDeleteBin5Line className="text-red-700 hover:text-red-200"  size={30} /></button>
          </div> </div>
      ))}</div>
  {valert && (
    <div className="text-center mt-4 text-red-200 font-semibold">
      {valert}
    </div>
  )}


<form onSubmit={adddetails} className="space-y-4">
    <label htmlFor="date" className="block text-md font-semibold text-green-500">
      Date:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={vmodel?.date || ""} required type="text" name="date" id="date"
      onChange={onchange}       placeholder="Enter date"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
    
    <label htmlFor="trip" className="block text-md font-semibold text-green-500">
      Trip:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={vmodel?.trip || ""} required type="text" name="trip" id="trip"
      onChange={onchange}       placeholder="Enter trip"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
  
    <button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
    >
      Add Details
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