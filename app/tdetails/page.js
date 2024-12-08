"use client"
import { useState, useEffect,Suspense } from "react";
import { TbEditCircle } from "react-icons/tb";
import { useSearchParams } from "next/navigation";
import { RiDeleteBin5Line } from "react-icons/ri";
export default function Home() {
const [tndr, settndr] = useState([])
const [tmodel, settmodel] = useState({})
const [alert, setalert] = useState("");
const [talert, settalert] = useState("")
const [td, settd] = useState(null)


const fetcht = async () => {
  const response = await fetch(`/api/tdetails?tid=${encodeURIComponent(td.tid)}`);
  let tjson = await response.json();
  settndr(tjson.at);
  console.log(tndr)
  if (tjson.at.length === 0) settalert("No Details Added");
};

useEffect(() => {
  if(td){ fetcht();}
},[tmodel,td]);

    
      const onchange = (e) => {
        settmodel({
          ...tmodel,tid:td.tid,
          [e.target.name]: e.target.value,
        });
      };

      const deletet = async () => {}
      const handledit = async () => {}
      const addtndr = async (e) => {
        e.preventDefault();
        setalert("Adding details...");
        const co = {  ...tmodel };
        try {
          const response = await fetch('/api/tdetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
          if (response.ok) {
            setalert("Details added Successfully!");
            settmodel({});
            settalert("");
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
        <LoadParams setDbobj={settd} />

      </Suspense>
  All details of {td?(<>{td.tid}:{td.name} of {td.td}</>):"Loading..."} are here !!

  <div>
  {tndr.map((b) => (
        <div key={b._id}
            className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'>      
           <span  className="inline-block w-full sm:w-3/5">{b.amount} -- {b.date} </span>  
       <div className="  flex justify-center gap-20  xs:justify-between xs:gap-8">   <button className= "   hover:bg-green-700 bg-green-200   p-2 rounded-full" onClick={() => handledit()}><TbEditCircle className="text-green-700 hover:text-green-200"  size={30}  /></button>
          <button className="hover:bg-red-700 bg-red-200     p-2 rounded-full " onClick={() => deletet()}><RiDeleteBin5Line className="text-red-700 hover:text-red-200"  size={30} /></button>
          </div> </div>
      ))}</div>
  {talert && (
    <div className="text-center mt-4 text-red-200 font-semibold">
      {talert}
    </div>
  )}

 
<div>Add amount and date:</div>
<form onSubmit={addtndr} className="space-y-4">
    <label htmlFor="amount" className="block text-md font-semibold text-green-500">
      Tender Amount:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.amount || ""} required type="text" name="amount" id="amount"
      onChange={onchange}       placeholder="Enter amount"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
    
    <label htmlFor="date" className="block text-md font-semibold text-green-500">
      Tender Submission Date:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.date || ""} required type="text" name="date" id="date" 
      onChange={onchange}       placeholder="Enter Date"
      className=" w-full px-4 py-2 border border-green-500 bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
    <button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
    >
      Add Data
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
  const tobj = searchParams.get('tdtls');
  useEffect(() => {
    if (tobj) {
      const dtobj = tobj ? JSON.parse(decodeURIComponent(tobj)) : null;
      setDbobj(
        {...dtobj}
      );
    
    }}, [tobj, setDbobj]);

  return null;
}