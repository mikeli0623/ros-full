import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(undefined);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);
        const data = await res.json();
        setData(data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      setData(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return { data, isLoading, fetchData };
};

export default useFetch;
