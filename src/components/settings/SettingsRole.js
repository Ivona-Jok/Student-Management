import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import "../../styles/Components.css";

const SettingsRole = () => {
    const [role, setRole] = useState(''); // Uloga za odabranog korisnika
    const [users, setUsers] = useState([]); // Niz za čuvanje podataka o svim korisnicima
    const [selectedUser, setSelectedUser] = useState(null); // Za potrebe editovanja jednog korisnika
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const { t } = useTranslation();
    const [roleChanged, setRoleChanged] = useState(false); // Prati se da li je uloga promijenjena

    const API_URL = 'http://localhost:5000';
    // Fečujemo podatke o korisnicima na nivou cijele komponente
    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch(`${API_URL}/users`); // Povlačimo podatke o korisnicima sa API-ja
            const data = await response.json();
            setUsers(data);  // Podaci o korisnicima čuvaju se u setUsers
        };
        
        fetchUserData();
    }, []);
    
    // Funkcija koja se pokreće kada se koristi input search polje
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        // Filtriranje korisnika na osnovu termina za pretragu
        const filtered = users.filter(user =>
            user.firstName.toLowerCase().includes(value.toLowerCase()) || // Pretraga na osnovu imena
            user.lastName.toLowerCase().includes(value.toLowerCase()) || // Pretraga na osnovu prezimena
            (user.firstName + ' ' + user.lastName).toLowerCase().includes(value.toLowerCase()) || // Pretraga na osnovu imena i prezimena
            user.email.toLowerCase().includes(value.toLowerCase()) // Pretraga na osnovu email-a
        );
        setFilteredUsers(filtered);
    };

   // Funkcija koja se pokreće pri odabiru korisnika u input search polju
   const handleUserSelect = (user) => {
    
    setSelectedUser(user);
    setRole(user.role);
    setSearchTerm('');  // Briše se search polje pri odabiru korisnika
    setFilteredUsers([]);  // Briše se lista pri odabiru korisnika
    
};

    // Funkcija koja se pokreće pri odabiru nove uloge korisnika
    const handleRoleChange = async (event) => {
        const newRole = event.target.value;
        setRole(newRole);
        setRoleChanged(true);

        if (!selectedUser) return;

        // Ažuriraj ulogu u bazi podataka
        try {
            const response = await fetch(`${API_URL}/users/${selectedUser.id}`, {
                method: 'PATCH',  // Patch mijenja samo ulogu korisnika, ne ažurira ostale podatke u bazi podataka
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${selectedUser.token}`  // Uključuje se token autentifikacija
                },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                // Ažuriraj ulogu u state korisnika
                setUsers(prevUsers => prevUsers.map(u =>
                    u.id === updatedUser.id ? updatedUser : u
                ));
                setSelectedUser(updatedUser); // Ažuriraj ulogu za izabranog korisnika
                console.log('User role updated:', updatedUser);
            } else {
                console.error('Error updating role:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    // Hide role select if no user is selected or if the search term is active
    const shouldShowRoleSelect = selectedUser && searchTerm === ''; 

    // Poruka za loading kada podaci još uvijek nisu učitani
    if (!users.length) {
        return <div>Loading users...</div>;
    }

return (
    <div>

        {/* Input polje za pretragu */}
        <div className="select-user-role">
            <label htmlFor="userSelect">{t("searchUser")}</label>
            <input
                type="text"
                id="userSelect"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for a user..."
            />

            {/* Prikazuje korisnike samo kada se pretraga poklopi sa traženim terminom */}
            {searchTerm && filteredUsers.length > 0 && (
                <ul>
                    {filteredUsers.map(user => (
                        <li key={user.id} onClick={() => handleUserSelect(user)}>
                            {user.firstName} {user.lastName} ({user.email})
                        </li>
                    ))}
                </ul>
            )}

            {/* Poruka se prikazuje ako se ne pronađe korisnik koji se tražio u polju za pretragu */}
            {searchTerm && filteredUsers.length === 0 && (
                <p className='no-users-found-message'>{t("noUsersFound")}</p>
            )}
        </div>

        {/* Select polje za odabir uloge korisnika se pojavljuje samo kada je izabran korisnik */}
        {shouldShowRoleSelect && !roleChanged && (
            <div className='select-user-role'>
                <p>{t("currentRole")} {selectedUser.firstName} {selectedUser.lastName} {t("is")} <span>{selectedUser.role}</span></p>

                {/* Padajući medi za uloge */}
                <label htmlFor="roleSelect">{t("selectRole")}</label>
                <select id="roleSelect" value={role} onChange={handleRoleChange}>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
        )}
    </div>
);
};

export default SettingsRole;