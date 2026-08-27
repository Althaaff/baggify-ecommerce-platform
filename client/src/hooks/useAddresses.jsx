//  * Usage: const { addresses, addressLoading, loadAddresses } = useAddresses();

import { useState } from "react";
import { getAllAddresses } from "../services/addressService";
import { useEffect } from "react";

export const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);

  const loadAddresses = async () => {
    try {
      setAddressLoading(true);
      const response = await getAllAddresses();
      setAddresses(response.data);
    } catch (err) {
      console.error("Error loading addresses:", err);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  return { addresses, addressLoading, loadAddresses, setAddresses }; // return data and refetch functions //
};
