import Icon from '@mdi/react';
import { mdiAccountCircle } from '@mdi/js';


export default function NavBar(){
    return (
       <nav className="fixed top-0 w-screen flex flex-row justify-between items-center text-amber-600 ">
            <h2 className="m-3 text-2xl font-bold ">AdoptHub 🐾</h2>
            <button className="m-3">
            <Icon path={mdiAccountCircle} size={1.5} />
            </button>
       </nav>
    )
}