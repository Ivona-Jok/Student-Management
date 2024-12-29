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

// Funkcija za povlacenje radova
export const getWorks = async () => {
  try {
    const response = await fetch(`${API_URL}/works`); 
    if (!response.ok) {
      throw new Error('Failed to fetch works');
    }
    
    const works = await response.json();
    console.log("Dohvaćeni radovi:", works);  // Logovanje podataka za provjeru
    return works;
  } catch (error) {
    console.error('Greška pri dohvaćanju radova:', error);
    throw error;
  }
};


// Funkcija za dohvat istorije rada sa određenim `workId`
export const getWorkById = async (workId) => {
  try {
    const response = await fetch(`${API_URL}/works/${workId}`);  // Endpoint sa `workId`
    if (!response.ok) {
      throw new Error('Failed to fetch work with id ' + workId);
    }
    
    const work = await response.json();
    console.log("Dohvaćen rad:", work);  // Logovanje podataka za proveru
    return work;
  } catch (error) {
    console.error('Greška pri dohvaćanju rada:', error);
    throw error;
  }
};



// Funkcija za formatiranje datuma
function formatDate(date) {
  const day = date.getDate();       // Dobijamo dan (1-31)
  const month = date.getMonth() + 1; // Dobijamo mjesec (0-11), i dodajemo 1 jer mjeseci pocinju indeksom 0
  const year = date.getFullYear();  // Dobijamo godinu
  // Dodajemo nule jednocifrenim brojevima
  const dayFormatted = day < 10 ? `0${day}` : day;
  const monthFormatted = month < 10 ? `0${month}` : month;
  // Vraćamo formatiran datum
  return `${dayFormatted}.${monthFormatted}.${year}.`;
}



// Dodavanje rada
export const addWork = async (title, description, link, studentId, date, grade, teacherId) => {
  // Pozivamo funkciju za formatiranje datuma da formatira trenutni datum
  const formattedDate = formatDate(new Date());
  try {
    // Slanje POST upita za kreiranje korisnika
    const response = await fetch(`${API_URL}/works`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        title,
        description,
        link,
        studentId:studentId,
        date: formattedDate,
        grade: "",
        teacherId: "",
      }),
    });
    // Provjera je li upit u redu
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating work:', errorData);
      throw new Error('Failed to add work.');
    }
    const newWork = await response.json();
    // Čuvanje podataka o korisniku i tokenu u lokac storage, podaci se čuvaju odvojeno
    localStorage.setItem('work', JSON.stringify(newWork));  
    // Dobijaju se user i token koji su odvojeni
    return { work: newWork };
  } catch (error) {
    throw error;
  }
};



// AŽURIRANJE RADA (NE RADI - OVO NAREDNO RADIM)
export const updateWork = async (workId, title, description, link, studentId, date, grade, teacherId, userId) => {
  
  try {
    
    // Prvo, preuzimamo trenutne podatke o radu
    const currentWork = await fetch(`${API_URL}/works/${workId}`);
    const currentWorkData = await currentWork.json();
    const date = formatDate(new Date());
    // Pripremamo prethodno stanje i novo stanje
    const previousState = {
      grade: currentWorkData.grade,
      studentId: currentWorkData.studentId,
      teacherId: currentWorkData.teacherId,
      title: currentWorkData.title,
      description: currentWorkData.description,
      link: currentWorkData.link
    };

    const currentState = {
      grade,
      studentId,
      teacherId,
      title,
      description,
      link
    };

    // Slanje POST upita za kreiranje korisnika
    const response = await fetch(`${API_URL}/works/${workId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        title,
        description,
        link,
        studentId,
        date,
        grade,
        teacherId
      }),
    });

    // Provjera je li upit u redu
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error updating work: ${errorData.message || 'Unknown error'}`);
      throw new Error(errorData.message || 'Failed to update work.');
    }    

    // Zabeleži promenu u istoriji rada
    await logWorkHistory(workId, 'update', userId, previousState, currentState);

    const updatedWork = await response.json();
    console.log('Work updated successfully:', updatedWork);
    
    return updatedWork;
    
  } catch (error) {
    console.error('Error in updateWork function:', error);
    throw error;
  }
}; 




// Funkcija za brisanje rada
export const deleteWork = async (workId, userId) => {
  try {
    // Prvo, preuzimamo trenutne podatke o radu koji se briše
    const currentWork = await fetch(`${API_URL}/works/${workId}`);
    const currentWorkData = await currentWork.json();

    // Pripremamo prethodno stanje (nema `currentState` jer je rad obrisan)
    const previousState = {
      grade: currentWorkData.grade,
      studentId: currentWorkData.studentId,
      teacherId: currentWorkData.teacherId,
      title: currentWorkData.title,
      description: currentWorkData.description,
      link: currentWorkData.link
    };

    // Slanje DELETE upita za brisanje rada
    const response = await fetch(`${API_URL}/works/${workId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete work with ID: ${workId}`);
    }

    // Zabilježi promjenu u istoriji rada (nema `currentState` jer rad ne postoji nakon brisanja)
    await logWorkHistory(workId, 'delete', userId, previousState, null);

    return response;
  } catch (error) {
    console.error('Error during delete:', error);
    throw error;  
  }
};



// Funkcija za beleženje istorije promena
export const logWorkHistory = async (workId, changeType, changedBy, previousState, currentState) => {
  try {
    const response = await fetch(`${API_URL}/historyWorks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        workId,
        changeType,            // Tip promene: update, delete, add
        changedBy,             // ID korisnika koji je izvršio promenu
        previousState,         // Prethodno stanje (ako postoji)
        currentState,          // Trenutno stanje (ako postoji)
        dateChanged: new Date().toISOString(),  // Datum promene
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error logging work history:', errorData.message || 'Unknown error');
      throw new Error('Failed to log work history.');
    }

    console.log('Work history logged successfully');
  } catch (error) {
    console.error('Error in logWorkHistory function:', error);
    throw error;
  }
};


// UCITAVANJE ISTORIJE PROMJENA ZA WORKS
export const getWorkHistory = async (workId) => {
  try {
    const response = await fetch(`${API_URL}/historyWorks?workId=${workId}`);
    console.log('Work ID:', workId);  // Da li je workId pravilno postavljen?

    if (!response.ok) {
      throw new Error('Failed to fetch work history.');
    }

    const history = await response.json();
    console.log("Ucitana istorija:", history);  // Ispisuje podatke u konzolu
    console.log(response.status);  // Ispisuje podatke u konzolu
    return history;
  } catch (error) {
    console.error('Error fetching work history:', error);
    throw error;
  }
};



export const addStudent = async (firstName, lastName, email, index, year, teacherId) => {
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
        index,
        year,
        role: 'student', // Default role for new student
        teacherId: teacherId, // Linking to the teacher who is adding the student
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating student:', errorData);
      throw new Error('Failed to add new student.');
    }

    const newStudent = await response.json();
    return newStudent;  // Return the created student data
  } catch (error) {
    throw error;
  }
};
