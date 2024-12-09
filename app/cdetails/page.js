"use client"
import { useState, useEffect,Suspense } from "react";
import { TbEditCircle } from "react-icons/tb";
import { useSearchParams } from "next/navigation";
import { RiDeleteBin5Line } from "react-icons/ri";
export default function Home() {
const [eflag, seteflag] = useState(false)
const [cntr, setcntr] = useState([])
const [chck, setchck] = useState("")
const [cmodel, setcmodel] = useState({})
const [alert, setalert] = useState("");
const [calert, setcalert] = useState("Loading...")
const [cd, setcd] = useState(null)
const [dflag, setdflag] = useState(false)
const [dalert, setdalert] = useState("")

const fetchc = async () => {
  const response = await fetch(`/api/cdetails?cid=${encodeURIComponent(cd.cid)}`);
  let cjson = await response.json();
  setcntr(cjson.ac);
  console.log(cntr)
  setcalert("");
  if (cjson.ac.length === 0) setcalert("No Details Added");
};

useEffect(() => {
  if(cd){ fetchc();}
},[cmodel,cd]);

    
      const onchange = (e) => {
        setcmodel({
          ...cmodel,cid:cd.cid,
          [e.target.name]: e.target.value,
        });
      };

      const handledel = async (mid) => {
        setdalert(`Deleting Data ...`)
        console.log(mid)
        console.log({mid})
        // console.log(JSON.stringify({ bid}))
        try {
            const response = await fetch('/api/cdetails', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mid} ), // Send the ID in the request body
            });
      
            const data = await response.json();
            if (!response.ok) {
              setdalert(data.message)
                throw new Error(data.message || 'Failed to delete the Data');
            }
      
            console.log(data.message); // Log success message
            setdalert(` Data deleted successfully.`)
            setcmodel({})
        } catch (erro) {
            console.log('Error:', erro);
        }
      };

      const deletec = async (bul,id) => {
        setdflag(bul);setchck(id);
      }
      const handleupdate = async (e) => {
        setalert("Updating Details...")
        e.preventDefault();
        const co = {...cmodel }; 
        try{
          const response= await fetch('api/cdetails',{
            method:'PUT',
            headers:{ 'Content-Type':'application/json'},
            body: JSON.stringify(co)
          });
          if(response.ok){
            console.log("Details Updated Sucessfully ! ")
            setalert("Details Updated Successfully !!")
            seteflag(false);
           setcmodel({})
          }
          else{
            console.log("Error Updating Details !!")
          }
        }
        catch(error){
      console.error('Error:',error);
        }
      }
      const handleditf = async (dtls) => {
        seteflag(true);
        setcmodel(dtls)
      }
      const addcntr = async (e) => {
        e.preventDefault();
        setalert("Adding details...");
        const co = {  ...cmodel };
        try {
          const response = await fetch('/api/cdetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
          if (response.ok) {
            setalert("Details added Successfully!");
            setcmodel({});
            setcalert("");
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
        <LoadParams setDbobj={setcd} />

      </Suspense>
  All details of {cd?(<>{cd.cid}:{cd.name} </>):"Loading..."} are here !!

  <div>
  {cntr.map((b) => (
        <div key={b._id}
            className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'>      
           <span  className="inline-block w-full sm:w-3/5">{b.rate} -- {b.trip} </span>  
       <div className="  flex justify-center gap-20  xs:justify-between xs:gap-8">   <button className= "   hover:bg-green-700 bg-green-200   p-2 rounded-full" onClick={() => handleditf(b)}><TbEditCircle className="text-green-700 hover:text-green-200"  size={30}  /></button>
       { (dflag && chck===b._id)? (<><button onClick={() => handledel(b._id)} className="bg-red-500">Yes</button > <button onClick={() => deletec(false,b._id)} className="bg-green-500">No</button></>):(<><button className="hover:bg-red-700 bg-red-200     p-2 rounded-full " onClick={() => deletec(true,b._id)}><RiDeleteBin5Line className="text-red-700 hover:text-red-200"  size={30} /></button></>)}
          </div> </div>
      ))}</div>

{dalert && (
    <div className="text-center mt-4 text-red-300 font-semibold">
      {dalert}
    </div>
  )}
  {calert && (
    <div className="text-center mt-4 text-red-200 font-semibold">
      {calert}
    </div>
  )}

 
<div>Add Details: </div>
<form onSubmit={addcntr} className="space-y-4">
    <label htmlFor="rate" className="block text-md font-semibold text-green-500">
      Rate:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.rate || ""} required type="text" name="rate" id="rate"
      onChange={onchange}       placeholder="Enter rate"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
    
    <label htmlFor="trip" className="block text-md font-semibold text-green-500">
      No. of Trips:
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={cmodel?.trip || ""} required type="text" name="trip" id="trip" 
      onChange={onchange}       placeholder="Enter trip"
      className=" w-full px-4 py-2 border border-green-500 bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
    {eflag? (<><button onClick={(e) => handleupdate(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
      >Update Data</button></>):
    (<><button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
    >
      Add Data
    </button></>)}
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
  const cobj = searchParams.get('cdtls');
  useEffect(() => {
    if (cobj) {
      const dcobj = cobj ? JSON.parse(decodeURIComponent(cobj)) : null;
      setDbobj(
        {...dcobj}
      );
    
    }}, [cobj, setDbobj]);

  return null;
}