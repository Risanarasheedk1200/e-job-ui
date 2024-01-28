import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './AllJobs.css';
function AllJobs() {
    const navigate= useNavigate();
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
    // Fetch jobs from the backend
    axios.get('/api/jobs/active')
      .then(response => {setJobs(response.data)
    console.log("response",jobs)})
      .catch(error => console.error(error));
     
  }, []);
  const handleBack=()=>{
    navigate("/dashboard");
  }
  return (
    <div className="alljobs_header">
        <button onClick={handleBack}>Back</button>
        <div> Jobs List</div>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            {job.title} - {job.description}
            <div>Expires at : {job.expireAt}, Bids : {job.numBids}</div> 
            <div>Least Bid now - {job.leastBidAmount}</div>
            <br/>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AllJobs