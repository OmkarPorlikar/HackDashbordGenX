// import axios from 'axios';


// const API_BASE_URL = "https://hackgenxbackend.onrender.com";


// export interface RegistrationData {
//     id: string; // Add this if it's in the API response
//   fullName: string;
//   email: string;
//   mobileNumber: string;
//   teamId : string;
//   teamName: string;
//   teamSize: number;
//   collegeName: string;
//   branch: string;
//   city: string;
//   problemStatement: string;
//   reasonForParticipation: string;
// }

// export interface MasterClassData {
//   id: string; // Add this if it's in the API response
//   fullName: string;
//   email: string;
//   mobileNumber: string;
//   age: number;
//   exp: string;
//   classes: string[];
// }

// export interface LoginResponse {
//   data: {
//     id: string;
//     name: string;
//     email: string;
//   }[];
//   message: string;
// }


// export interface login {
//   userName: string;
//   password: string; // Changed 'Password' to 'password' (follow camelCase)
// }

// // Mock data fetching functions
// export const fetchRegistrations = async (): Promise<RegistrationData[]> => {
//   try {
//     const response = await axios.get<RegistrationData[]>(`${API_BASE_URL}/getRegistrations`);
//     // console.log("Fetched registrations:", response.data); // Debug log ✅
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch registrations:", error);
//     return []; // Ensure no crash
//   }
// };

// export const fetchMasterClassRegistrations = async (): Promise<MasterClassData[]> => {
//   try {
// const response = await axios.get<MasterClassData[]>(`${API_BASE_URL}/getMasterClass`);
//     // console.log("Fetched master classes:", response.data); 
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch master class registrations:", error);
//     return []; 
//   }
// };

// export const loginApi = async (credentials:login):Promise<LoginResponse> => {
// // console.log('Login started');

// try 
// {
  
// const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, credentials);
// // console.log(response , "login response")
// return response.data
// ;
// }catch(error){
//   console.error(error , "error");
// throw  error;
// }

// }


// export const postPptStatus = async(formData) =>{
//   console.log(formData , "form data");
//   try{
// const data = await axios.post('http://localhost:8004/pptStatus' , formData)
// return data;
// console.log(data , "data");
//   }catch(error){
// console.log(error , "error")
// throw  error;

//   }
// }



// export const getPPTStatus = async (teamId: string) => {
//   try {
//     const response = await axios.get(`http://localhost:8004/pptStatus/getPPTStatus`, {
//       params: { teamId }, // Sending teamId as query param
//     });
//     return response.data || {};
//   } catch (error) {
//     console.error("Error fetching PPT status:", error);
//     return {};
//   }
// };






import axios from 'axios';


const API_BASE_URL = "https://hackgenxbackend.onrender.com";


export interface RegistrationData {
    id: string; // Add this if it's in the API response
  fullName: string;
  email: string;
  mobileNumber: string;
  teamId : string;
  teamName: string;
  teamSize: number;
  collegeName: string;
  branch: string;
  city: string;
  problemStatement: string;
  reasonForParticipation: string;
  pptStatus:string;
}

export interface MasterClassData {
  id: string; // Add this if it's in the API response
  fullName: string;
  email: string;
  mobileNumber: string;
  age: number;
  exp: string;
  classes: string[];
}

export interface LoginResponse {
  data: {
    id: string;
    name: string;
    email: string;
  }[];
  message: string;
}


export interface login {
  userName: string;
  password: string; // Changed 'Password' to 'password' (follow camelCase)
}

// Mock data fetching functions
export const fetchRegistrations = async (): Promise<RegistrationData[]> => {
  try {
    const response = await axios.get<RegistrationData[]>(`${API_BASE_URL}/getRegistrations`);
    // console.log("Fetched registrations:", response.data); // Debug log ✅
    return response.data;
  } catch (error) {
    console.error("Failed to fetch registrations:", error);
    return []; // Ensure no crash
  }
};

export const fetchMasterClassRegistrations = async (): Promise<MasterClassData[]> => {
  try {
const response = await axios.get<MasterClassData[]>(`${API_BASE_URL}/getMasterClass`);
    // console.log("Fetched master classes:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Failed to fetch master class registrations:", error);
    return []; 
  }
};

export const loginApi = async (credentials:login):Promise<LoginResponse> => {
// console.log('Login started');

try 
{
  
const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, credentials);
// console.log(response , "login response")
return response.data
;
}catch(error){
  console.error(error , "error");
throw  error;
}

}




// export const updatePPTStatus = async (teamId: string, pptStatus: string) => {
//   try {
//     const response = await axios.patch("http://localhost:8004/updatePPTStatus", {
//       teamId,
//       pptStatus,
//     });

//     console.log(response , "res")
//     return response.data; // optional: you can return response.message or updatedData
//   } catch (error) {
//     console.error("Error updating PPT status:", error);
//     return { error: "Failed to update PPT status" };
//   }
// };

// export const getRegisterDataByTeamId = async (teamId: string) => {
//   const res = await axios.get("http://localhost:8004/getRegistrationByTeamId", {
//     params: { teamId },
//   });
//   return res.data;
// };

export const getRegisterDataByTeamId = async (teamId: string) => {
  const res = await axios.get(`${API_BASE_URL}/getRegistrationByTeamId/${teamId}`);
  return res.data;
};

export const updatePPTStatus = async (teamId: string, pptStatus: string) => {
  console.log(teamId , pptStatus , "status");
  const res = await axios.patch(`${API_BASE_URL}/updatePPTStatus`, {
    teamId,
    pptStatus,
  });
  return res.data;
};



// export const postPptStatus = async(formData) =>{

//   console.log(formData , "form data");
//   try{
// const data = await axios.post('http://localhost:8004/pptStatus' , formData)
// return data;
// console.log(data , "data");
//   }catch(error){
// console.log(error , "error")
// throw  error;

//   }
// }



// export const getPPTStatus = async (teamId: string) => {

//   console.log('making request');
//   try {
//     // getPPTStatus
//     const response = await axios.get(`http://localhost:8004/getPPTStatus`, {
//       params: { teamId }, // Sending teamId as query param
//     });
//     console.log(response , "res")
//     return response.data || {};
//   } catch (error) {
//     console.error("Error fetching PPT status:", error);
//     return {};
//   }
// };
