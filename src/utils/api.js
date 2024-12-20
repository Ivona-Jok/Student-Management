const API_URL = 'https://jsonplaceholder.typicode.com'; // Mock API


export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    // Provjerava da li je upit uspješan
    if (!response.ok) {
      throw new Error('Login failed');
    }
    // Dobijamo objekat sa login podacima
    return response.json(); 
  } catch (error) {
    // Javlja grešku
    throw error; 
  }
};


export const register = async (firstName, lastName, email, password, repeatedPassword) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        repeatedPassword,
      }),
    });
    // Provjerava da li je upit uspješan
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    // Dobijamo objekat sa login podacima
    return response.json(); 
  } catch (error) {
    // Javlja grešku
    throw error; 
  }
};
