import { useEffect } from "react";
import { useState } from "react";
import { productService } from "../services/productsService";

export const useNewArrivalProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await productService.newArrivalProducts();

        if (response.success) {
          setData(response.data.products);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};
