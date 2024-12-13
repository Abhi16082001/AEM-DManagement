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
    const [tmodel, settmodel] = useState({})
    const [alert, setalert] = useState("")
    const [tndr, settndr] = useState([])
    const [talert, settalert] = useState("Loading...")


    const fetcht = async () => {
        const response = await fetch("/api/alldata?dtyp=tender");
        let tjson = await response.json();
        settndr(tjson.result);
        console.log(tndr)
        settalert("");
        if (tjson.result.length === 0) settalert("No Tender Added");
      };
    
      useEffect(() => {
         fetcht();
      },[tmodel]);


    const onchange = (e) => {
        settmodel({
          ...tmodel,
          [e.target.name]: e.target.value,
        });
      };

      const calamt = (p,amt) => {

        const per= parseFloat(p);
        const amnt= parseFloat(amt);
        const a=amnt*(per/100)
        const res=amnt +a
        settmodel({
          ...tmodel,pamt:res
        });}


      const handletdetails = (td) => {
        const etd = encodeURIComponent(JSON.stringify(td));
        router.push(`/tdetails?tdtls=${etd}`);
      };
       
      const deletet = async (bul,id) => {
        setdflag(bul);setchck(id);
      }
      const handledit = async (dtls) => {
        seteflag(true);
        settmodel({...dtls,okey:dtls.tid})
      }

      const handleupdate = async (e) => {
        setalert("Updating Details...")
        e.preventDefault();
        const co = {...tmodel,pkey:"tid",dtype:"tender" }; 
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
           settmodel({})
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
        const co = {id:id,pkey:"tid",dtype:"tender" }; 
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
            settmodel({})
        } catch (erro) {
            console.log('Error:', erro);
        }
      };
    const addt = async (e) => {
        e.preventDefault();
        setalert("Adding Tender...");
        const co = {  ...tmodel,dtyp:"tender",pkey:"tid" };
        try {
          const response = await fetch("/api/alldata", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(co),
          });
console.log(response)
const data= await response.json()
          if (response.ok) {
            setalert("Tender added Successfully!");
            settmodel({});
            settalert("");
          } else {
            setalert(data.message);
          }
        } catch (error) {
          setalert("Error in adding Tender.");
          console.error('Error:', error);
        }
      };

 return (
  <>
 
{talert && (
    <div className="text-center mt-4 text-green-200 font-semibold">
      {talert}
    </div>
  )}

<div>
  {tndr.map((b) => (
    
        <div key={b.tid}
           className='space-y-2 sm:space-y-3 xs:flex justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-300 rounded-md p-4 shadow-lg hover:cursor-pointer hover:opacity-80 container mx-auto'
           ><span  onClick={() => handletdetails(b)} >{b.tid} : {b.name}: {b.td}</span>
       <div className="  flex justify-center gap-20  xs:justify-between xs:gap-8">   <button className= "   hover:bg-green-700 bg-green-200   p-2 rounded-full" onClick={() => handledit(b)}><TbEditCircle className="text-green-700 hover:text-green-200"  size={30}  /></button>
       { (dflag && chck===b.tid)? (<><button onClick={() => handledel(b.tid)} className="bg-red-500">Yes</button > <button onClick={() => deletet(false,b.tid)} className="bg-green-500">No</button></>):(<><button className="hover:bg-red-700 bg-red-200     p-2 rounded-full " onClick={() => deletet(true,b.tid)}><RiDeleteBin5Line className="text-red-700 hover:text-red-200"  size={30} /></button></>)}
          </div> </div>
      ))}</div>

{dalert && (
    <div className="text-center mt-4 text-red-300 font-semibold">
      {dalert}
    </div>
  )}
<form onSubmit={addt} className="space-y-4">
    <label htmlFor="tid" className="block text-md font-semibold text-green-500">
      Tender ID :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.tid || ""} required type="text" name="tid" id="tid"
      onChange={onchange}       placeholder="Enter Tender ID"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
    
    <label htmlFor="td" className="block text-md font-semibold text-green-500">
      Tender Division :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.td || ""} required type="text" name="td" id="td"
      onChange={onchange}       placeholder="Enter Division"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />

    <label htmlFor="name" className="block text-md font-semibold text-green-500">
      Tender Name :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.name || ""} required type="text" name="name" id="name"
      onChange={onchange}       placeholder="Enter Name"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />

<label htmlFor="amount" className="block text-md font-semibold text-green-500">
      Tender Amount :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.amount || ""} required type="text" name="amount" id="amount"
      onChange={onchange}       placeholder="Enter amount"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />

<label htmlFor="per" className="block text-md font-semibold text-green-500">
      Tender submission percentage with sign :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.per || ""} required type="text" name="per" id="per"
      onChange={onchange}       placeholder="Enter percentage without symbol"
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />

<span htmlFor="pamt" className="block text-md font-semibold text-green-500"
onClick={() => calamt(tmodel.per,tmodel.amount)}>
       Calculate Amount after percentage:
    </span>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.pamt || ""} required type="text" name="pamt" id="pamt"  
      className=" w-full px-4 py-2 border border-green-500  bg-green-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600"

    />
  
  {eflag? (<><button onClick={(e) => handleupdate(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
      >Update Tender</button></>):
    (<><button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-green-500 bg-green-600 bg-opacity-5 text-green-500 font-semibold rounded-full hover:bg-green-700 hover:text-green-50 "
    >
      Add Tender
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
