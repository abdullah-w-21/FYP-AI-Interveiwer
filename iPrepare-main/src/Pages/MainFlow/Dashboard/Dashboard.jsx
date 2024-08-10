import React from 'react'
import './Dashboard.css'
import { useSelector } from 'react-redux';
import { Link, Link as RouterLink } from 'react-router-dom';
import intImage from './int.jpg';

const Dashboard = () => {
  const username = useSelector((state) => state.auth.user.username);

  return (
    // <div className='dashboard-container'>
    //   <div className='greet'>
    //   <p> <span>Hi {username}!</span><p> Welcome to your dashboard. We are under construction at the moment, yet you can use our questions generation part! <Link component={RouterLink} to="/startquiz" style={{ textDecoration: 'none' }}>
    //         Start Quiz
    //       </Link> :)</p></p>
    // </div>
    //   </div>
    <main class="content">
                <div className='sub-container1' class="container-fluid">
                    <div class="mb-3">
                        <h4>Admin Dashboard</h4>
                    </div>
                    <div class="row">
                        <div class="col-12 col-md-6 d-flex">
                            <div class="card flex-fill border-1 illustration">
                                <div class="card-body p-0 d-flex flex-fill">
                                    <div class="row g-0 w-100">
                                        <div class="col-6">
                                            <div class="p-3 m-1">
                                                <h4>Welcome Back,<span className='u-name'>{username}</span> </h4>
                                                <p class="mb-0">Admin Dashboard, IPREPARE</p>
                                            </div>
                                        </div>
                                        <div class="col-6 align-self-end text-end py-4">
                                            {/* This is for int image */}
                                            <img src={intImage} alt="" style={{ width: '300px', height: '200px' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 d-flex">
                            <div class="card flex-fill border-1">
                                <div class="card-body py-4">
                                    <div class="d-flex align-items-start">
                                        <div class="flex-grow-1">
                                            <h4 class="mb-2 mb-3">
                                                Start Quiz
                                            </h4>
                                            <div class="mb-0" style={{}}>
                                              <button class="btn btn-primary mt-2"> <Link component={RouterLink} to="/startquiz" style={{ textDecoration: 'none', listStyle: 'none', color:'white'}}>Lets Begin</Link> :)</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='under-construction'>
                        
                            <h1>
                            We are still in the process of construction
                            </h1>
                        
                        <div>
                           
                        </div>
                    </div>
                </div>
            </main>
     
    
  )
  
}


export default Dashboard
