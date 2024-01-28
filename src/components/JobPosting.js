import React, { useState ,useEffect} from 'react'
import axios from 'axios';
import { Button, CircularProgress } from '@mui/material';
import './JobPosting.css'
import { useNavigate } from 'react-router-dom';
function JobPosting() {
   
   const navigate= useNavigate();

   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);

 
  
  const [postData, setPostData] = useState({
     title: '', jobRequirements: '', description: '' ,jobPosterName:'',jobContactInfo:'',leastBidAmount:''
  })

  useEffect(() => {
    document.title = 'eJob Post';
  }, []);

  const areAllFieldsSet = (data) => {
    return Object.values(data).every((value) => value !== '');
  };

  

  const handlePostRequest = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    setError('');
    if (areAllFieldsSet(postData)) {
      try {
        setIsLoading(true);
        const response = await axios.post('/api/jobs', postData);
        // Handle the response
        console.log('API call successful', response.data);
        // Clear the form fields after successful submission
      setPostData({
        title: '',
        jobRequirements: '',
        description: '',
        jobPosterName: '',
        jobContactInfo: '',
        leastBidAmount: ''
      });
      } catch (error) {
        // Handle errors
        console.error('Error making API call', error);
      }finally {
        setIsLoading(false);
        alert('Job Posted');
      }
    } else {
      // Handle the case where not all fields are set
      console.error('Not all fields are set. API call aborted.');
      
      setError('Please fill in all fields before submitting.');
    }

    
  };
  
  const handleBack=()=>{
    navigate("/dashboard");
  }


  return (
    <div className="jobposting_header">
      <button onClick={handleBack}>Back</button>
      {isLoading && <CircularProgress />}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <h2>Job Information</h2>
      <form onSubmit={handlePostRequest}>
      <label>
          Job Title:
          <textarea
          value={postData.title}
          
          onChange={(e) => setPostData(prevData => ({ ...prevData, title: e.target.value }))}
            maxLength={16 * 1024}
          />
          <br/>
        </label>
        <label>
          Job Description:
          <textarea
            value={postData.description}
            onChange={(e) => setPostData(prevData => ({ ...prevData, description: e.target.value }))}
            maxLength={16 * 1024}
          />
          <br/>
        </label>

        <label>
          Job Requirements:
          <textarea
            value={postData.jobRequirements}
            onChange={(e) => setPostData(prevData => ({ ...prevData, jobRequirements: e.target.value }))}
            maxLength={16 * 1024}
          />
          <br/>
        </label>

        <label>
          Name of Job Poster:
          <input
            type="text"
            value={postData.jobPosterName}
            onChange={(e) => setPostData(prevData => ({ ...prevData, jobPosterName: e.target.value }))}
          />
          <br/>
        </label>
        <label>
          Contact :
          <input
            type="text"
            value={postData.jobContactInfo}
            onChange={(e) => setPostData(prevData => ({ ...prevData, jobContactInfo: e.target.value }))}
          />
          <br/>
        </label>
        <label>
          Initial Bid Amount:
          <input
            type="text"
            value={postData.leastBidAmount}
            onChange={(e) => setPostData(prevData => ({ ...prevData, leastBidAmount: e.target.value }))}
          />
          <br/>
        </label>
        <button type="submit">Post </button>
      
        
      </form>
      
    </div>
  );
};




export default JobPosting