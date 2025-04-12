import {Link} from 'react-router-dom'
export default function Sidebar(){
    return(
        <div className="bg-amber-600 text-white  h-full flex flex-col gap-5 p-5">
           
          <Link to="/">
          Dashboard
          </Link>
           <a> Search </a>
           <a> About</a>
        </div>

    )
}