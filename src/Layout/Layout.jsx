import { useLocation } from "react-router-dom";
import { logOut } from "../Redux/Store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideBar from "../Component/Layout/Sidebar";
import { React } from "react";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hideNavBarPaths = ["/signup", "/" ,"/login", "/forgotpassword"];
  const hideNavBar = hideNavBarPaths.includes(location.pathname);
  const handleLogout = async () => {
    dispatch(logOut());
    navigate("/");
  };
  return (
    <div className="layout">
      {!hideNavBar && <SideBar logout={handleLogout} data={children} />}
      {hideNavBar && <main>{children}</main>}
      
    </div>
  );
};
export default Layout;