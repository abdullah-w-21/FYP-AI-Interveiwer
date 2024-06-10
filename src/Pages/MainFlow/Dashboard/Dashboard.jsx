import React from 'react'
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const username = useSelector((state) => state.auth.user.username);

  return (
    <div className='dashboard-container'>
     <h1> Hello {username}! Welcome to your dashboard. We are under construction at the moment, see you soon! :)</h1>
    </div>
  )
}

export default Dashboard
