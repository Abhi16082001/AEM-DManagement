"use client"
import { useRouter } from 'next/navigation';
import { useState ,useEffect} from "react"
import { TbEditCircle } from "react-icons/tb";
import { RiDeleteBin5Line } from "react-icons/ri";
export default function Page() {
  const router = useRouter();
  const [dflag, setdflag] = useState(false)
  const [dalert, setdalert] = useState("")
  const [chck, setchck] = useState("")
  const [eflag, seteflag] = useState(false)
    const [vtpe, setvtpe] = useState("")
    const [vmodel, setvmodel] = useState({})
    const [alert, setalert] = useState("")
    const [vhcl, setvhcl] = useState([])
    const [valert, setvalert] = useState("")
 

    const fetchv = async () => {
        const response = await fetch("/api/alldata?dtyp=vehicle");
        let vjson = await response.json();
        console.log(vjson)
        if (vjson.result.length === 0) setvalert("No Vehicle Added");
        setvalert("");
        setvhcl(vjson.result);
        console.log(vhcl)
      };
    
      useEffect(() => {
         fetchv();
      },[vtpe,vmodel]);

 
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
        setdflag(bul);
        setchck(id);
      }
      const handledit = async (dtls) => {
        seteflag(true);
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
            seteflag(false);
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
            setvmodel({});
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
       <div className="  flex justify-center gap-20  xs:justify-between xs:gap-8">   <button className= "   hover:bg-green-700 bg-green-200   p-2 rounded-full" onClick={() => handledit(b)}><TbEditCircle className="text-green-700 hover:text-green-200"  size={30}  /></button>
       { (dflag && chck===b.vno)? (<><button onClick={() => handledel(b.vno)} className="bg-red-500">Yes</button > <button onClick={() => deletev(false,b.vno)} className="bg-green-500">No</button></>):(<><button className="hover:bg-red-700 bg-red-200     p-2 rounded-full " onClick={() => deletev(true,b.vno)}><RiDeleteBin5Line className="text-red-700 hover:text-red-200"  size={30} /></button></>)}
          </div> </div></>):"" }</div>
      ))}</div>

{dalert && (
    <div className="text-center mt-4 text-red-300 font-semibold">
      {dalert}
    </div>
  )}
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
{eflag? (<><button onClick={(e) => handleupdate(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
      >Update Vehicle</button></>):
    (<><button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
    >
      Add Vehicle
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
