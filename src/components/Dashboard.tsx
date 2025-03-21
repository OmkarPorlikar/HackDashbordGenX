import { useState, useEffect,  } from 'react';
import { Users, GraduationCap, } from 'lucide-react';
import { NavigationButton } from './NavigationButton';
import { LoadingSpinner } from './LoadingSpinner';
import { fetchRegistrations, fetchMasterClassRegistrations, RegistrationData, MasterClassData } from '../api';
import React from 'react';

export function Dashboard() {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [masterClasses, setMasterClasses] = useState<MasterClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [count , setCount] = useState(0);



const getCollegeCount = () =>{
let tempCount = 0;
registrations.forEach((data)=>{
  if(data.collegeName){
tempCount++;
  }
});
setCount(tempCount);
}


  useEffect(() => {

    const fetchData = async () => {
      try {
        const [regData, masterClassData] = await Promise.all([
          fetchRegistrations(),
          fetchMasterClassRegistrations()
        ]);
        // console.log("Setting registrations:", regData); // Debug log ✅
        // console.log("Setting masterClasses:", masterClassData); // Debug log ✅
        setRegistrations(regData);
        setMasterClasses(masterClassData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
        // console.time('api fetch time end');
      }
    };
  
    fetchData();
    // console.log(count ,"count");

//    const timer = setTimeout (()=>{
// setLoading(false);
//     },1300)

// return ()=> clearTimeout(timer);

  }, [window.location.pathname ]);



useEffect(()=>{
   
  if(registrations.length > 0){
    getCollegeCount();
  }

},[registrations])


  return (

<>  

{loading && (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "#0f223f",  // ✅ Changed background color to solid #0f223f
      }}
    >
      {/* <PuffLoader color="#25d8de" size={80} /> */}

       <LoadingSpinner  />

    </div>
  )}



    <div className="space-y-6">
{/*       
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-gray-400">Total Registrations</p>
              <p className="text-2xl font-bold">{registrations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 w-full rounded-lg ">
          <div className="flex items-center gap-4">
            <GraduationCap className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-gray-400">Master Classes</p>
              <p className="text-2xl font-bold">{masterClasses.length}</p>
            </div>
          </div>
        </div>

   

      </div> */}
      <div className="grid grid-cols-1 max-w-[100%] md:grid-cols-3 gap-6">
        <NavigationButton
          to="/registration"
          icon={<Users className="w-6 h-6 text-blue-400" />}
          text="Registration Data"
          number={registrations.length}
        />
        <NavigationButton
          to="/masterclass"
          icon={<GraduationCap className="w-6 h-6 text-purple-400" />}
          text="Master Class Data"
          number={masterClasses.length}
        />
         <NavigationButton
          to={`/colleges/${count}`}
          icon = { <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-university"><circle cx="12" cy="10" r="1"/><path d="M22 20V8h-4l-6-4-6 4H2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2"/><path d="M6 17v.01"/><path d="M6 13v.01"/><path d="M18 17v.01"/><path d="M18 13v.01"/><path d="M14 22v-5a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5"/></svg> }
          text="Colleges Data"
          number={count}
        />
      </div>
    </div>
    </>

  );
}

