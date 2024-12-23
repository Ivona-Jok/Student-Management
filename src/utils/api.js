/* const API_URL = 'https://jsonplaceholder.typicode.com'; // Mock API


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
 */

const API_URL = 'http://localhost:5000'; // Lokalna json-server URL

// Kreiranje vještačkog tokena (U realnim projektima token se dobija od strane backend-a)
const generateJWT = (user) => {
  return `fake-jwt-token-for-${user.id}`;
}


// Registracija korisnika
export const register = async (firstName, lastName, email, password, role) => {
  try {
    // Slanje POST upita za kreiranje korisnika
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
        role: "student", // Difoltna uloga za novog korisnika, uloge može mijenjati admin na stranici Settings.
      }),
    });

    // Provjera je li upit u redu
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating user:', errorData);
      throw new Error('Failed to register.');
    }

    const newUser = await response.json();
    // Kreiranje lažnog tokena
    const token = generateJWT(newUser);

    // Čuvanje podataka o korisniku i tokenu u lokac storage, podaci se čuvaju odvojeno
    localStorage.setItem('user', JSON.stringify(newUser)); 
    localStorage.setItem('token', token);  

    // Token se čuva u bazi podataka u okviru user-a
    const updateResponse = await fetch(`${API_URL}/users/${newUser.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        token: token,
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to save token in database');
    }

    // Dobijaju se user i token koji su odvojeni
    return { user: newUser, token };
  } catch (error) {
    throw error;
  }
};

// Logovanje korisnika
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });

    // Provjera da li je response u redu
    if (!response.ok) {
      throw new Error('Login failed');
    }

    const users = await response.json();

    // Ako ne postoji user javlja se greška
    if (users.length === 0) {
      throw new Error('Invalid email or password');
    }

    // Kreiranje vještačkog tokena
    const user = users[0];
    const token = generateJWT(user);

    // Čuvanje podataka o korisniku i tokenu u lokac storage, podaci se čuvaju odvojeno
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);

    // Token se čuva u bazi podataka u okviru user-a
    const updateResponse = await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        token: token,
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to save token in database');
    }

    // Dobijaju se user i token koji su odvojeni
    return { user, token };
  } catch (error) {
    throw error;
  }
};
