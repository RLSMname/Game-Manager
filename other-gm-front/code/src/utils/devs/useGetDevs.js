import { useEffect, useState } from "react";

// returns the devs and setDevs
export const useGetDevs = () => {
  const [devs, setDevs] = useState([]);

  const fetchDevs = async () => {
    await fetch("/api/devs/all")
      .then((response) => response.json())
      .then((data) => {
        setDevs(data);
      });
  };

  useEffect(() => {
    fetchDevs();
  }, []);

  return { devs, setDevs };
};
