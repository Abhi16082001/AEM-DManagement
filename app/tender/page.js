"use client"
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FcSearch } from "react-icons/fc";
import { useState ,useEffect} from "react"
import { MdDeleteForever } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
export default function Page() {
    const [sflag, setsflag] = useState(false)
    const [sstr, setsstr] = useState("")
  const router = useRouter(); 
  const [uflag, setuflag] = useState("")
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
        setuflag("")
        settalert("")
        if (tjson.result.length === 0) settalert("No Tender Added");
      };
    
      useEffect(() => {
         fetcht();
      },[uflag]);


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
          ...tmodel,pamt:res.toString()
        });}

        const handleditf = async () => {
          settalert("")
          setalert("")
          setdalert("")
          seteflag(false)
          settmodel({})
        }


      const handletdetails = (td) => {
        const etd = encodeURIComponent(JSON.stringify(td));
        router.push(`/tdetails?tdtls=${etd}`);
      };
       
      const deletet = async (bul,id) => {
        setalert("")
        settalert("")
        setdalert("")
        setdflag(bul);setchck(id);
      }
      const handledit = async (dtls) => {
        setalert("")
        settalert("")
        setdalert("")
        seteflag(true)
        settmodel({...dtls,okey:dtls.tid})
      }



      const handlsflag = async (bul) => {
        settalert("")
        settmodel({})
        setalert("")
        setdalert("")
        seteflag(false)
        setsflag(bul)
        setsstr("")
      }

      const onschange = (e) => {
        setsstr( e.target.value);
      };

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
            seteflag(false)
            setalert("")
        settalert("")
        setuflag("upd")
        setdalert("")
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
            setalert("")
        settalert("")
        setuflag("del")
        setdalert("")
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
            setalert("Tender added Successfully!")
            settmodel({})
            settalert("")
            setuflag("add")
        setdalert("")
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
  <div className="flex-col justify-items-center space-y-2 p-1 ">

  <div className="bg-blue-100 rounded-full w-full p-1 flex flex-row gap-2 justify-evenly sm:justify-between sm:px-10 ">
  {!sflag?( <button className="bg-blue-300 rounded-full p-2 hover:bg-blue-400" onClick={() => handlsflag(true)}>  <FcSearch size={30} />  </button>):""}
 { sflag?(<><input className='w-full px-3 rounded-full'
 type="text" name="srch" id="srch" value={sstr? sstr :""} onChange={onschange}/>
  <button className="hover:scale-110 transition-transform duration-300" onClick={() => handlsflag(false)}> 
  <img width="40" height="40" src="https://img.icons8.com/3d-plastilina/69/cancel--v1.png" alt="cancel--v1"/>
     </button></>):""}
 </div>

 <div className="bg-gradient-to-r from-indigo-600 to-purple-300 w-11/12 sm:w-4/5  text-sm sm:text-lg  text-center font-serif font-semibold  p-2  rounded-md">All Tenders:</div>

 <div className="container h-[75vh] bg-blue-500 p-2 rounded-lg bg-opacity-20 w-11/12 lg:w-4/5 space-y-2 overflow-y-scroll">
{talert && (
    <div className="text-center mt-4 text-violet-500 font-semibold">
      {talert}
    </div>
  )}


  {tndr.map((b) => (
    
        <div key={b.tid}>
           { (!(sflag) || (b.tid.toLowerCase().includes(sstr.toLowerCase()) 
           || b.td.toLowerCase().includes(sstr.toLowerCase()) 
           || b.name.toLowerCase().includes(sstr.toLowerCase()) 
           || sstr==="") )?
           (<div className='space-y-2 sm:space-x-2 sm:space-y-3 flex flex-col sm:flex-row sm:justify-between text-teal-950 text-lg font-semibold bg-gradient-to-r from-violet-700 to-violet-800 rounded-md p-4  shadow-lg  container mx-auto'
           ><div onClick={() => handletdetails(b)} className='bg-violet-300 bg-opacity-80 hover:cursor-pointer hover:opacity-80 rounded-md py-2 px-5 w-full flex flex-col lg:flex-row lg:space-x-1'>
            <span className='border-violet-950 sm:border-b-0 border-b-2 sm:border-r-2 sm:p-3'  >{b.tid} </span><span className='border-teal-950 sm:border-b-0 border-b-2 sm:border-r-2 sm:p-3 sm:pl-1'> {b.td}</span><span className='lg:p-3 lg:pl-0a' > {b.name}</span > </div>
       <div className="  flex flex-row sm:gap-8  justify-evenly">   <button className= "   hover:bg-blue-700 bg-blue-200   p-2 rounded-full" onClick={() => handledit(b)}><RiEditCircleFill  className="text-blue-500 hover:text-blue-200"  size={30}  /></button>
       { (dflag && chck===b.tid)? (<><button onClick={() => handledel(b.tid)} className="bg-red-500 hover:bg-opacity-50 text-red-200 rounded-full md:px-4 px-2">Yes</button > <button onClick={() => deletet(false,b.tid)} className="bg-green-500 hover:bg-opacity-50 text-green-200 rounded-full md:px-4 px-2">No</button></>):(<><button className="hover:bg-fuchsia-700 bg-fuchsia-200     p-2 rounded-full " onClick={() => deletet(true,b.tid)}><MdDeleteForever  className="text-fuchsia-700 hover:text-fuchsia-200"  size={30} /></button></>)}
          </div></div>):""}
           </div>
      ))}

{dalert && (
    <div className="text-center mt-4 text-red-500 font-semibold">
      {dalert}
    </div>
  )}

</div>

<div className=" border-2 p-2 border-cyan-500 bg-cyan-100 bg-opacity-50 rounded-md w-full sm:w-4/5">
<form onSubmit={addt} className="space-y-4">
<div className="text-center text-sm lg:text-lg font-semibold font-mono bg-cyan-400 bg-opacity-50 p-2 rounded-lg  ">Add Details: </div>
    <label htmlFor="tid" className="block text-md font-semibold text-cyan-900">
      Tender ID :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.tid || ""} required type="text" name="tid" id="tid"
      onChange={onchange}       placeholder="Enter Tender ID"
      className=" w-full px-4 py-2 border border-cyan-500  bg-cyan-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-600"

    />
    
    <label htmlFor="td" className="block text-md font-semibold text-cyan-900">
      Tender Division :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.td || ""} required type="text" name="td" id="td"
      onChange={onchange}       placeholder="Enter Division"
      className=" w-full px-4 py-2 border border-cyan-500  bg-cyan-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-600"

    />

    <label htmlFor="name" className="block text-md font-semibold text-cyan-900">
      Tender Name :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.name || ""} required type="text" name="name" id="name"
      onChange={onchange}       placeholder="Enter Name"
      className=" w-full px-4 py-2 border border-cyan-500  bg-cyan-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-600"

    />

<label htmlFor="amount" className="block text-md font-semibold text-cyan-900">
      Tender Amount :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.amount || ""} required type="text" name="amount" id="amount"
      onChange={onchange}       placeholder="Enter amount"
      className=" w-full px-4 py-2 border border-cyan-500  bg-cyan-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-600"

    />

<label htmlFor="per" className="block text-md font-semibold text-cyan-900">
      Tender submission percentage with sign :
    </label>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.per || ""} required type="text" name="per" id="per"
      onChange={onchange}       placeholder="Enter percentage without symbol"
      className=" w-full px-4 py-2 border border-cyan-500  bg-cyan-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-600"

    />

<span htmlFor="pamt" className="block text-md font-semibold text-center p-2 rounded-lg bg-cyan-300 bg-opacity-80 border-cyan-600   text-cyan-900 hover:cursor-pointer hover:bg-cyan-400 hover:text-cyan-100"
onClick={() => calamt(tmodel.per,tmodel.amount)}>
       Calculate Amount after percentage:
    </span>
    <input
      pattern="^(?!\s*$).+" title="This field cannot be empty or just spaces" value={tmodel?.pamt || ""} required type="text" name="pamt" id="pamt"  onChange={onchange} 
      className=" w-full px-4 py-2 border border-cyan-500  bg-cyan-600 bg-opacity-20 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-600"

    />
  
  {eflag? (<><button onClick={(e) => handleupdate(e)} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-50 text-cyan-50 font-semibold rounded-full hover:bg-cyan-700 hover:text-cyan-50 "
      >Update Tender</button>
      
      <button onClick={(e) => handleditf()} 
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-50 text-cyan-50 font-semibold rounded-full  hover:bg-cyan-700 hover:text-cyan-50 "
      >Cancel</button>
      
      </>):
    (<><button
      type="submit"
      className="flex justify-center gap-2 w-full py-2 mt-4 border-2 border-cyan-500 bg-cyan-600 bg-opacity-50 text-cyan-50 font-semibold rounded-full hover:bg-cyan-700 hover:text-cyan-50 "
    >
      Add Tender
    </button></>)}
  </form>
  {alert && (
    <div className="text-center mt-4 text-cyan-800 font-semibold">
      {alert}
    </div>
  )}
  </div>
  </div>
  </>
 )
}
