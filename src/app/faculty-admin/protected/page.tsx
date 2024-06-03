'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Protected = () => {
  const [message, setMessage] = useState('');
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/protected-route', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
        });

        // Check if the response is successful (status 200)
        if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
        } else {
          // Handle non-200 responses (e.g., 404, 500)
          console.error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        // Handle network errors and other exceptions
        console.error(error);
      }
    };

    fetchData();
  }, []);
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to login page after successful logout
        router.push('/faculty-admin/login');
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };
  return (
    <div>
      <h1>Protected Page</h1>
      <p>{message}</p>
      <button onClick={handleLogout}>
      Logout
    </button>
    </div>
  );
};

export default Protected;
