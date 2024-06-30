import React from 'react'
import { Link, Link as RouterLink } from 'react-router-dom'

const Feedback = () => {
  return (
    <div className='dashboard-container'>
      <h1>Feedback part is under construction. You must have given great resposes. :) <Link component={RouterLink} to="/dashboard">
            Return to Dashboard
          </Link></h1>
    </div>
  )
}

export default Feedback
