// JobList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyModal from './Modal';
import { Link, useNavigate } from 'react-router-dom';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import './JobList.css'
import WorkIcon from '@mui/icons-material/Work';
const JobList = () => {
  const[error,setError]=useState('');
  const [jobs, setJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [newLeastBidAmount, setNewLeastBidAmount] = useState('');
  const[userName,setUserName]=useState("");
  const [userEmail,setUserEmail]=useState("");
  const [remainingTime, setRemainingTime] = useState(null);

  const navigate= useNavigate();
  useEffect(() => {
    document.title = 'eJob Home';
  }, []);

  const calculateTimeDifference=() =>{
    if (selectedJob && selectedJob.expireAt) {
    const targetDate=new Date(selectedJob.expireAt)
    const currentDate = new Date();
    const timeDifference = targetDate - currentDate;

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };  // Return default values if selectedJob is null or expireAt is undefined
  };

  const formatRemainingTime = () => {
    const { days, hours, minutes, seconds } = remainingTime;
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(calculateTimeDifference());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [calculateTimeDifference]);
  

  const onUpdateBid = (jobId, newLeastBidAmount,numBids) => {
    setJobs((prevJobs) => {
      return prevJobs.map((job) => {
        if (job.id === jobId) {
          return { ...job, leastBidAmount: newLeastBidAmount ,numBids:numBids};
        }
        return job;
      });
    });

    setActiveJobs((prevActiveJobs) => {
      return prevActiveJobs.map((activeJob) => {
        if (activeJob.id === jobId) {
          return { ...activeJob, leastBidAmount: newLeastBidAmount ,numBids:numBids};
        }
        return activeJob;
      });
    });
    
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prevSelectedJob) => ({
        ...prevSelectedJob,
        leastBidAmount: newLeastBidAmount,
        numBids: numBids,
      }));
    
  }
  alert('Bid successfully done!')
}

  const openModal = (job) => {
    setSelectedJob(job);
    // Initialize newLeastBidAmount with the current leastBidAmount
    setNewLeastBidAmount(job.leastBidAmount);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setNewLeastBidAmount(''); // Reset newLeastBidAmount when the modal is closed
  };

  const handleBidChange = (e) => {
    setNewLeastBidAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Validate if the new bid is less than the current bid
      if (newLeastBidAmount < selectedJob.leastBidAmount) {
        // Call the update-bids API
        const response = await axios.put(`/api/jobs/${selectedJob.id}/update-bids?leastBidAmount=${newLeastBidAmount}&email=${userEmail}&name=${userName}`);

        console.log('API Response:', response.data);
        // Call the callback function to update the bid
        onUpdateBid(selectedJob.id, response.data.leastBidAmount,response.data.numBids);
      } else {
        // Handle error
        setError('New Bid must be less than current value');
      }
    } catch (error) {
      // Handle API error
      console.error('Error updating bid:', error.message);
    }
  };

  
  useEffect(() => {
    // Fetch jobs from the backend
    setUserName(localStorage.getItem('name'));
    setUserEmail(localStorage.getItem('email'));
    axios.get('/api/jobs/recent10')
      .then(response => setJobs(response.data))
      .catch(error => console.error(error));

    axios.get('/api/jobs/top10bybid')
      .then(response => setActiveJobs(response.data))
      .catch(error => console.error(error));
  }, [selectedJob]);

  const handleLogOut=()=>{
    // remove all items from local storage
    localStorage.clear();
    navigate("/login")


  }
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return (
    <div className="joblist_header">
      <div style={{display:"flex"}}>
      <div  style={{paddingRight:"300px"}}>
      <h2>eJob <WorkIcon/></h2>
      <h2>Hi, {userName} <div style={{margin :'3px' }}>
      <SentimentSatisfiedAltIcon />
      </div>
    </h2>
      </div>
      <div>
      <button style={{ marginLeft: '90%' }}
      onClick={handleLogOut}>Logout</button>
       <Link to="/notifications" >Notifications</Link>
      <Link className="post_link"to="/post-job" > Post a Job!</Link>
      </div>
      </div>
      <h2 style={{marginTop:'1%', justifyContent:'center', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>Recently Added Jobs</h2>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            <button className="job_item" onClick={() => openModal(job)}>
              <div className="joblist_item_" style={{fontWeight:'bold'}}>   
             {job.title} 
              </div>
              <br/>
             {/* JobId: {job.id} */}
             Description - {job.description}
            </button>
          </li>
        ))}
      </ul>

      <h2 style={{marginTop:'1%', justifyContent:'center', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>Top Jobs</h2>
      <ul>
        {activeJobs.map(activeJob => (
          <li key={activeJob.id}>
            <button className="job_item" onClick={() => openModal(activeJob)}>
             <div style={{fontWeight:'bold'}}> {activeJob.title}  </div>
             <br/>
             Description - {activeJob.description}
              {/* JobId:{activeJob.id} */}
              <br/>
              <div style={{color:'green', fontWeight:'bold'}}>Bid Count- {activeJob.numBids}</div>
              {/* - {activeJob.description} */}
            </button>
          </li>
        ))}
      </ul>

      <Link className="post_link" to="/all-jobs" >See All Jobs!</Link>
      <br/>
     

      {/* Render the modal component */}
      {selectedJob && (
        <MyModal className="modal"
          isOpen={!!selectedJob}
          closeModal={closeModal}
          content={
            <p>
             
              <div>
                <h2 style={{color:'#fffff'}}>{selectedJob.title}</h2>

                <br/>
                <div>JobId: {selectedJob.id}</div>
                <br/>
                <div>Description : {selectedJob.desription}</div>
                <br/>
                <div>Eligibility Criteria: {selectedJob.jobRequirements}</div>
                <br/>
                 {/* MONTH - DAY - YEAR - TIME  */}
                {selectedJob.expireAt && (
                  <div>Expires at: {new Date(selectedJob.expireAt).toLocaleString('en-US', options)}</div>
                )}
                <br/>
                <div> Number of Bids: {selectedJob.numBids}</div>
                <br/>
                <div>Poster : {selectedJob.jobPosterName}</div>
                <br/>
                {selectedJob.expireAt && remainingTime && (
                  <div style={{color:'#007bff'}}>Remaining time : {formatRemainingTime()}</div>
                )}
                <br/>
                <div>Current Bid - {selectedJob.leastBidAmount}</div>
                 <br/>
                {/* Form to update bid */}
                <form onSubmit={handleSubmit}>
                  <label>
                    New Bid:
                    <input style={{ width: '50%',
    
                          padding: '8px',
                          marginBottom:'15px',
                          boxSizing: 'border-box'}} type="text" value={newLeastBidAmount} onChange={handleBidChange} />
                  </label>
                  <button style={{ backgroundColor:  remainingTime && remainingTime.days < 0 ? '#aaa':'#4caf50', color:'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer'}} disabled={remainingTime &&remainingTime.days<0} type="submit">Place Bid</button>
                  {error && <div style={{ color: 'red' }}>{error}</div>}
                </form>
              </div>
            </p>
          }
        />
      )}
    </div>
  );
};

export default JobList;
