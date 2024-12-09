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
    const [cmodel, setcmodel] = useState({})
    const [alert, setalert] = useState("")
    const [cntr, setcntr] = useState([])
    const [calert, setcalert] = useState("Loading...")


    const fetchc = async () => {
        const response = await fetch("/api/alldata?dtyp=contractor");
        let cjson = await response.json();
        setcntr(cjson.result);
        console.log(cntr)
        setcalert("");
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
      
      const deletec = async (bul,id) => {
        setdflag(bul);setchck(id);
      }
      const handledit = async (dtls) => {
        seteflag(true);
        setcmodel({...dtls,okey:dtls.cid})
      }
 

      const handleupdate = async (e) => {
        setalert("Updating Details...")
        e.preventDefault();
        const co = {...cmodel,pkey:"cid",dtype:"contractor" }; 
        try{
          const response= await fetch('api/alldata',{
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

      const handledel = async (id) => {
        setdalert(`Deleting Data ...`)
        const co = {id:id,pkey:"cid",dtype:"contractor" }; 
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
            setcmodel({})
        } catch (erro) {
            console.log('Error:', erro);
        }
      };

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
       <div className="  flex justify-center gap-20  xs:justify-between xs:gap-8">   <button className= "   hover:bg-green-700 bg-green-200   p-2 rounded-full" onClick={() => handledit(b)}><TbEditCircle className="text-green-700 hover:text-green-200"  size={30}  /></button>
       { (dflag && chck===b.cid)?(<><button onClick={() => handledel(b.cid)} className="bg-red-500">Yes</button > <button onClick={() => deletec(false,b.cid)} className="bg-green-500">No</button></>):(<><button className="hover:bg-red-700 bg-red-200     p-2 rounded-full " onClick={() => deletec(true,b.cid)}><RiDeleteBin5Line className="text-red-700 hover:text-red-200"  size={30} /></button></>)}
          </div> </div>
      ))}</div>
{dalert && (
    <div className="text-center mt-4 text-red-300 font-semibold">
      {dalert}
    </div>
  )}

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
  
  {eflag? (<><button onClick={(e) => handleupdate(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
      >Update Contractor</button></>):
    (<><button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
    >
      Add Contractor
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
