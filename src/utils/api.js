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

    return response.json(); // Dobijamo objekat sa login podacima
  } catch (error) {
    throw error; // Javlja grešku
  }
};
