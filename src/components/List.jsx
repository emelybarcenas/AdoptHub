import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import Card from './Card';
import BarGraph from './BarGraph';
import PieChart from './PieChart';

export default function List() {
  const API_KEY = import.meta.env.VITE_PETFINDER_API_KEY;
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
  const [token, setToken] = useState();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [mostCommonBreed, setMostCommonBreed] = useState("Loading...");
  const [mostCommonType, setMostCommonType] = useState("Loading...");
  const [averageAge, setAverageAge] = useState("Loading...");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropDownSelection, setDropDowSelection] = useState("")

  const calculatePetStats = (pets) => {
    if (pets.length > 0) {
      const breedCounts = {};
      const typeCounts = {};
      const ageCounts = {};

      pets.forEach((pet) => {
        if (!typeCounts[pet.type]) typeCounts[pet.type] = 0;
        typeCounts[pet.type]++;

        const breed = pet.breeds?.primary || "Unknown";
        if (!breedCounts[breed]) breedCounts[breed] = 0;
        breedCounts[breed]++;

        if (!ageCounts[pet.age]) ageCounts[pet.age] = 0;
        ageCounts[pet.age]++;
      });

      let mostCommonBreed = null;
      let highestBreedCount = 0;
      for (const breed in breedCounts) {
        if (breedCounts[breed] > highestBreedCount) {
          highestBreedCount = breedCounts[breed];
          mostCommonBreed = breed;
        }
      }

      let mostCommonType = null;
      let highestTypeCount = 0;
      for (const type in typeCounts) {
        if (typeCounts[type] > highestTypeCount) {
          highestTypeCount = typeCounts[type];
          mostCommonType = type;
        }
      }

      let mostCommonAge = null;
      let highestAgeCount = 0;
      for (const age in ageCounts) {
        if (ageCounts[age] > highestAgeCount) {
          highestAgeCount = ageCounts[age];
          mostCommonAge = age;
        }
      }

      return { mostCommonBreed, mostCommonType, averageAge: mostCommonAge };
    }
    return {};
  };

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

  useEffect(() => {
    if (!token) return;

    const fetchPet = async () => {
      try {
        const response = await fetch("https://api.petfinder.com/v2/animals", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setPets(data.animals);
        setFilteredPets(data.animals); // Initialize filteredPets with all pets
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPet();
  }, [token]);

  useEffect(() => {
    const { mostCommonBreed, mostCommonType, averageAge } = calculatePetStats(pets);
    setMostCommonBreed(mostCommonBreed);
    setMostCommonType(mostCommonType);
    setAverageAge(averageAge);
  }, [pets]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = pets.filter((pet) => {
      return (
        pet.breeds?.primary?.toLowerCase().includes(value)
      );
    });

    setFilteredPets(filtered);
  };
  const handleDropDown = (event) => {
    const value = event.target.value.toLowerCase();
    setDropDowSelection(value);

    const filtered = pets.filter((pet) => {
      return (
        pet.age?.toLowerCase().includes(value)
      );
    });

    setFilteredPets(filtered);
  };

  return (
    <section className="flex w-full h-screen">
    {/* Left section (Table) - 2/3 of the screen width */}
    <div className="w-2/3 p-10 overflow-y-auto">
      <div className="rounded-xl bg-gray-100 text-black mb-20 max-h-[80vh] overflow-y-auto"> {/* Set max-height */}
        <div className="flex flex-row">
          <Card title="Most Available Breed:" description={mostCommonBreed} />
          <Card title="Most Available Type:" description={mostCommonType} />
          <Card title="Average age:" description={averageAge} />
        </div>
        <div className="flex gap-2.5 justify-center">
          <p>Breed:</p>
          <input
            type="search"
            className="bg-white rounded-sm justify-items-center border-2 border-amber-600 pl-2"
            id="search"
            placeholder="Enter breed"
            value={searchTerm}
            onChange={handleSearch}
          />
          <p>Age:</p>
          <select
            className="bg-white rounded-sm justify-items-center border-2 border-amber-600 pl-2"
            value={dropDownSelection}
            onChange={handleDropDown}
          >
            <option value="" disabled>
              Select Age
            </option>
            <option value="baby">Baby</option>
            <option value="young">Young</option>
            <option value="adult">Adult</option>
          </select>
        </div>
        <div className="overflow-y-auto max-h-[60vh]"> {/* Set max-height for scrollable table */}
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Breed</th>
                <th className="px-4 py-2 border-b">Gender</th>
                <th className="px-4 py-2 border-b">Age</th>
                <th className="px-4 py-2 border-b">Type</th>
                <th className="px-4 py-2 border-b">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredPets.length > 0 ? (
                filteredPets.map((pet) => (
                  <tr key={pet.id}>
                    <td className="px-4 py-2">{pet.name}</td>
                    <td className="px-4 py-2">{pet.breeds ? pet.breeds.primary : "N/A"}</td>
                    <td className="px-4 py-2">{pet.gender || "N/A"}</td>
                    <td className="px-4 py-2">{pet.age || "N/A"}</td>
                    <td className="px-4 py-2">{pet.type || "N/A"}</td>
                    <td className="px-4 py-2">
                      <Link to={`/pet-details/${pet.id}`}>🔗</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No pets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  
    {/* Right section - 1/3 of the screen width */}
    <div className="w-1/3 p-10 flex flex-col  h-[91vh]">
      {/* First Div - Takes up 50% of the height of the right section */}
      <div className="bg-amber-600  p-5 flex flex-col m-2 rounded-xl justify-center align-center items-center">
      <BarGraph pets={filteredPets} />
      <h3>Pet Ages</h3>
      </div>
  
      {/* Second Div - Takes up the remaining 50% height of the right section */}
      <div className="bg-amber-600 flex flex-col p-5 m-2 rounded-xl justify-center align-center items-center ">
        <PieChart pets={filteredPets} options={{
          labels:{
            color:''
          }
        }}/>
        <h3>Pet Breeds</h3>
      </div>
    </div>
  </section>
  
  
  );
}