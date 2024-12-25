import Link from "next/link"
export default function Home() {
 return (
  <>
  Menu for Anil Earth Mover !!
  <Link className="bg-sky-500" href='staff'>Staff</Link>
  <Link className="bg-teal-500" href='vehicle'>Vehicle</Link>
  <Link className="bg-emerald-500" href='contractor'>Contractor</Link>
  <Link className="bg-violet-500" href='tender'>Tender</Link>
  <Link className="bg-indigo-500" href='daily'>Daily Summary</Link>
  </>
 ) 
}
