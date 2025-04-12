import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';

function PetDetails() {
    const {id} = useParams();
    const API_KEY = import.meta.env.VITE_PETFINDER_API_KEY
    const SECRET_KEY = import.meta.env.VITE_SECRET_KEY
    const [token,setToken] = useState()
    const [pet, setPet] = useState([]);
    const [imgUrl, setImgUrl] = useState();
    
    //Fetching token
    useEffect(() => {
        const fetchToken = async () => {
          try {
            const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: API_KEY,
                client_secret: SECRET_KEY,
              }),
            });
            const data = await response.json();
            setToken(data.access_token);
          } catch (error) {
            console.error("Error fetching token:", error);
          }
        };
    
        fetchToken();
      }, []);
    //Fetching api data
      useEffect(() => {
        if (!token) return;
    
        const fetchPet = async () => {
          try {
            const response = await fetch(`https://api.petfinder.com/v2/animals/${id}`, {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            });
    
            const data = await response.json();
            setPet(data.animal);
    
            if (data.animal.photos && data.animal.photos.length>0){
                setImgUrl(data.animal.photos[0].small)
            }

          } catch (error) {
            console.error("Error fetching pets:", error);
          }
        };
    
        fetchPet();
      }, [token, id]);
    

   
    return(
 <div>
    <NavBar />
       
       <div className="flex flex-row h-screen mt-[8vh] w-[100vw] ">
         <div className='h-full'>
         <Sidebar />
         </div>
         <div className='justify-center'>
        
         <section className='flex justify-center h-[80vh] ml-[2vw] gap-10 align-items'>
  <div className="text-black flex flex-col p-6 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl border-4 border-amber-600 w-full max-w-[600px]">
    <h1 className="text-3xl font-extrabold text-amber-600 mb-4">
      Meet {pet.name}!
    </h1>

    <div className="flex flex-col gap-2 text-lg leading-relaxed">
      {pet.type && <p><span className="font-semibold">Status:</span> {pet.status}</p>}
      {pet.status && <p><span className="font-semibold">Type:</span> {pet.type}</p>}
      {pet.age && <p><span className="font-semibold">Age:</span> {pet.age}</p>}
      {pet.gender && <p><span className="font-semibold">Gender:</span> {pet.gender}</p>}
      {pet.size && <p><span className="font-semibold">Size:</span> {pet.size}</p>}
      {pet.coat && <p><span className="font-semibold">Coat:</span> {pet.coat}</p>}
      {pet.tags && pet.tags.length > 0 && <p><span className="font-semibold">Tags:</span> {pet.tags.join(', ')}</p>}
      {pet.description && (
        <p className="mt-4 whitespace-pre-line break-words">
          <span className="font-semibold">Description:</span> {pet.description}
        </p>
      )}
    </div>
  </div>

  <div className='w-1/2 flex justify-center'>
    {pet.photos && pet.photos.length > 0 && (
      <img src={imgUrl} alt={pet.name} className=' border-amber-600 rounded-2xl border-4' />
    )}
  </div>
</section>


         </div>
       </div>
       </div>
    )
}

export default PetDetails