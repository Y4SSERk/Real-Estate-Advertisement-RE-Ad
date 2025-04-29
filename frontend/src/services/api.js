import axios from 'axios';  

export const fetchData = async () => {  
    const res = await axios.get('http://localhost:8000/api/hello/');  
    return res.data;  
}; 