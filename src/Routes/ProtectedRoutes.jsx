import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getStorageItem } from "../utils/Index";

const ProtectedRoutes = ({ Component }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await getStorageItem("user");
      if (!user) {
        setLoader(false);
        navigate("/");
    } else {
        setLoader(false);
      }
    })();
  });

  return <div>{loader ? <></> : <Component />}</div>;
};

export default ProtectedRoutes;
