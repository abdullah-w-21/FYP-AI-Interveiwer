import React from 'react';
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import './AuthFlow.css'; 


import logo from './images/logo2.png';
import reportImg from './images/report.jpg';
import testImg from './images/test.jpg';
import interviewImg from './images/interview.jpg';
import userIcon from './images/usericon.jpg';
import serviceImg1 from './images/service-img1.jpg';
import serviceImg2 from './images/service-img2.jpg';
import serviceImg3 from './images/service-img3.png';
import emailImg from './images/iprepcomp.png';
import f1 from './images/f1.png'
import f2 from './images/f2.png'
import f3 from './images/f3.png'
import f4 from './images/f4.png'
import f5 from './images/f5.png'
import f6 from './images/f6.png'
import f7 from './images/f7.png'
import f8 from './images/f8.png'
import f9 from './images/f9.png'
import f10 from './images/f10.png'
import projectvideo from './images/projectvideo1.mp4'






const LandingPage = () => {

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  
  
  
  return (
    <div>
        {/* Navigation Bar */}
        <div id="nav-bar">
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#"><img src={logo} alt="iPrepare Logo"/></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                            <Link className="nav-link" to="/signup">Sign-up</Link>
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
        {/* Banner Section */}
        <div id="banner">
            <div className="container">
                <div className="row">
                    <div className="child_banner col-md-6">
                        <p className="promo-title">IPREPARE</p>
                        <p>Master Your Interviews with AI</p>
                    </div>
                    <div className=" col-md-6">
                        <div className="img">
                            <div className="social-icons">
                                <img src={userIcon} alt="User" />
                                <img src={reportImg} alt=""/>
                                <img src={testImg} alt=""/>
                                <img src={interviewImg} alt=""/>
                                <img src={reportImg} alt=""/>
                            </div>
                            {/* <img className="email-icon" src="images/comp.png" alt="Email" /> */}
                            <img className="email-icon" src={emailImg} alt=""/>
                        </div>
                    </div>
                </div>
            </div>
            

            <svg id="wave" style={{transform: 'rotate(0deg)', transition: '0.3s'}} viewBox="0 0 1440 220" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
                        <stop stopColor="rgba(255, 255, 255, 1)" offset="0%"></stop>
                        <stop stopColor="rgba(255, 255, 255, 1)" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <path style={{transform: 'translate(0, 0px)', opacity: 1}} fill="url(#sw-gradient-0)" d="M0,88L60,95.3C120,103,240,117,360,128.3C480,139,600,147,720,132C840,117,960,81,1080,80.7C1200,81,1320,117,1440,128.3C1560,139,1680,125,1800,132C1920,139,2040,169,2160,183.3C2280,198,2400,198,2520,198C2640,198,2760,198,2880,168.7C3000,139,3120,81,3240,47.7C3360,15,3480,7,3600,7.3C3720,7,3840,15,3960,36.7C4080,59,4200,95,4320,117.3C4440,139,4560,147,4680,146.7C4800,147,4920,139,5040,113.7C5160,88,5280,44,5400,25.7C5520,7,5640,15,5760,33C5880,51,6000,81,6120,80.7C6240,81,6360,51,6480,33C6600,15,6720,7,6840,36.7C6960,66,7080,132,7200,139.3C7320,147,7440,95,7560,80.7C7680,66,7800,88,7920,95.3C8040,103,8160,95,8280,91.7C8400,88,8520,88,8580,88L8640,88L8640,220L8580,220C8520,220,8400,220,8280,220C8160,220,8040,220,7920,220C7800,220,7680,220,7560,220C7440,220,7320,220,7200,220C7080,220,6960,220,6840,220C6720,220,6600,220,6480,220C6360,220,6240,220,6120,220C6000,220,5880,220,5760,220C5640,220,5520,220,5400,220C5280,220,5160,220,5040,220C4920,220,4800,220,4680,220C4560,220,4440,220,4320,220C4200,220,4080,220,3960,220C3840,220,3720,220,3600,220C3480,220,3360,220,3240,220C3120,220,3000,220,2880,220C2760,220,2640,220,2520,220C2400,220,2280,220,2160,220C2040,220,1920,220,1800,220C1680,220,1560,220,1440,220C1320,220,1200,220,1080,220C960,220,840,220,720,220C600,220,480,220,360,220C240,220,120,220,60,220L0,220Z"></path>
            </svg>
            
        </div>

        {/* Services Section */}
        <div id="services">
            <div className="container text-center">
                <h1 className="title">Functionality</h1>
                <div className="row text-center">
                    <div className="col-md-4 services">
                        <img className="service-img" src={serviceImg1} alt="Service 1" />
                        <h4>AI-Powered Interview Simulation</h4>
                        <p>Experience cutting-edge interview practice with our AI that simulates real-life interview scenarios, allowing you to hone your skills and respond to challenging questions in a realistic environment.</p>
                    </div>
                    <div className="col-md-4 services">
                        <img className="service-img" src={serviceImg2} alt="Service 2" />
                        <h4>PDF-Driven Question Generation</h4>
                        <p>Upload your interview experiences or relevant content in PDF format, and let our system generate custom quizzes tailored to your specific needs using advanced Retrieval-Augmented Generation RAG technology.</p>
                    </div>
                    <div className="col-md-4 services">
                        <img className="service-img" src={serviceImg3} alt="Service 3" />
                        <h4>Real-Time Performance Feedback</h4>
                        <p>Receive instant, in-depth feedback on your performance after every quiz, with detailed reports highlighting your strengths, weaknesses, and actionable insights to help you improve for future interviews.</p>
                    </div>
                </div>
                <button className="feature-btn btn btn-primary" onClick={scrollToFeatures}>Features</button>
            </div>
        </div>

        {/* About Us Section */}
        <div id="about-us">
      <div className="container">
        <h1 className="title text-center">Why US ?</h1>
        <div className="row">
          <div className="col-md-6">
            <p className="about-title">IPREPARE</p>
            <ul>
              <li>Experience realistic interviews with AI that mimics real-world scenarios.</li>
              <li>Get detailed reports on your performance, identifying strengths and areas for improvement.</li>
              <li>Upload your own interview materials and receive tailored quizzes based on your content.</li>
              <li>Practice both verbal responses and multiple-choice questions, ensuring you're well-rounded and confident.</li>
              <li>Believe in yourself</li>
            </ul>
          </div>
          <div className="col-md-6">          
            <video width="100%" autoPlay muted loop controls>
            <source src={projectvideo} type="video/mp4" />
              Your browser does not support the video tag.
          </video>

          </div>
        </div>
      </div>
    </div>

        {/* Feature Section */}
        <div id="features">
      <div className="container text-center">
        <p>OUR FEATURES</p>
        <div className="row text-center">
          <div className="col-md-3 features">
            <img className="feature-img" src={f1} />
            <h5>LLM</h5>
          </div>
          <div className="col-md-3 features">
            <img className="feature-img" src={f2}alt="" />
            <h5>RAG</h5>
          </div>
          <div className="col-md-3 features">
            <img className="feature-img" src={f3} alt="" />
            <h5>MultiModal Input</h5>
          </div>
          <div className="col-md-3 features">
            <img className="feature-img" src={f4} alt="" />
            <h5>Diversity Of Topics</h5>
          </div>
          <div className="col-md-3 features">
            <img className="feature-img" src={f5} alt="" />
            <h5>Explainability For MCQs Based Questions</h5>
          </div>
          <div className="col-md-3 features">
            <img className="feature-img" src={f6} alt="" />
            <h5>Interactive GUI</h5>
          </div>
          <div className="col-md-3 features">
            <img className="feature-img" src={f7} alt="" />
            <h5>Feedback</h5>
          </div>
          <div className="col-md-3 features">
            <img className="feature-img" src={f8} alt="" />
            <h5>Advanced Reporting</h5>
          </div>
          <div className="col-md-3 features">
            <img className="feature-img" src={f9} alt="" />
            <h5>History Management</h5>
          </div>
          <div className="col-md-3 features">
            <img className="feature-img" src={f10} alt="" />
            <h5>Context Awareness</h5>
          </div>
        </div>
      </div>
    </div>

        {/* Footer */}
        <div id="footer">
      <svg id="wave" style={{ transform: 'rotate(180deg)', transition: '0.3s' }} viewBox="0 0 1440 250" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
            <stop stopColor="rgba(243, 106, 62, 1)" offset="0%" />
            <stop stopColor="rgba(255, 179, 11, 1)" offset="100%" />
          </linearGradient>
        </defs>
        <path style={{ transform: 'translate(0, 0px)', opacity: 1 }} fill="url(#sw-gradient-0)" d="M0,25L26.7,37.5C53.3,50,107,75,160,83.3C213.3,92,267,83,320,66.7C373.3,50,427,25,480,50C533.3,75,587,150,640,154.2C693.3,158,747,92,800,70.8C853.3,50,907,75,960,91.7C1013.3,108,1067,117,1120,120.8C1173.3,125,1227,125,1280,104.2C1333.3,83,1387,42,1440,58.3C1493.3,75,1547,150,1600,154.2C1653.3,158,1707,92,1760,75C1813.3,58,1867,92,1920,104.2C1973.3,117,2027,108,2080,116.7C2133.3,125,2187,150,2240,170.8C2293.3,192,2347,208,2400,200C2453.3,192,2507,158,2560,133.3C2613.3,108,2667,92,2720,95.8C2773.3,100,2827,125,2880,150C2933.3,175,2987,200,3040,204.2C3093.3,208,3147,192,3200,170.8C3253.3,150,3307,125,3360,120.8C3413.3,117,3467,133,3520,145.8C3573.3,158,3627,167,3680,145.8C3733.3,125,3787,75,3813,50L3840,25L3840,250L3813.3,250C3786.7,250,3733,250,3680,250C3626.7,250,3573,250,3520,250C3466.7,250,3413,250,3360,250C3306.7,250,3253,250,3200,250C3146.7,250,3093,250,3040,250C2986.7,250,2933,250,2880,250C2826.7,250,2773,250,2720,250C2666.7,250,2613,250,2560,250C2506.7,250,2453,250,2400,250C2346.7,250,2293,250,2240,250C2186.7,250,2133,250,2080,250C2026.7,250,1973,250,1920,250C1866.7,250,1813,250,1760,250C1706.7,250,1653,250,1600,250C1546.7,250,1493,250,1440,250C1386.7,250,1333,250,1280,250C1226.7,250,1173,250,1120,250C1066.7,250,1013,250,960,250C906.7,250,853,250,800,250C746.7,250,693,250,640,250C586.7,250,533,250,480,250C426.7,250,373,250,320,250C266.7,250,213,250,160,250C106.7,250,53,250,27,250L0,250Z" />
      </svg>
      <div className="container">
        <div className="row">
          <div className="col-md-4 footer-box">
             <img src={logo} alt="" /> 
          </div>
          <div className="col-md-4 footer-box">
            <p><b>Contact Us</b></p>
            <p><i className="fa fa-map-marker" aria-hidden="true"></i> Karachi, Iqra University</p>
            <p><i className="fa fa-phone" aria-hidden="true"></i> +92-334-1263137</p>
            <p><i className="fa fa-envelope" aria-hidden="true"></i> Iprepare@gmail.com</p>
          </div>
          <div className="col-md-4 footer-box">
            <p><b>Follow Us</b></p>
            <p><i className="fa fa-linkedin" aria-hidden="true"></i>Linkedin</p>
            <p><i className="fa fa-facebook" aria-hidden="true"></i>Facebook</p>
            <p><i className="fa fa-twitter" aria-hidden="true"></i>Twitter</p>
          </div>
        </div>
      </div>
      <p className='copyright'>Copyright</p>
    </div>
    </div>
);
};

export default LandingPage;
