import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const UnprotectedRoutes = ({ Component }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    (async () => {
      const user = await localStorage.getItem("user");
      if (user) {
        setLoader(false);
        navigate("/dashboard");
      } else {
        setLoader(false);
      }
    })();
  });

  return <div>{loader ? <></> : <Component />}</div>;
};

export default UnprotectedRoutes;
