import i18n, { changeLanguage } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome to our website!",
          language: "Language",
          greeting: "Hello, User!",
          header_txt: "SM",
          search: "Search...",
          dashboard: "Dashboard",
          student: "Student",
          grades: "Grades",
          works: "Works",
          settings: "Settings",
          year: "Year",
          login: "Log In",
          logout: "Log Out",
          name: "Name",
          f_name: "First Name",
          l_name: "Last Name",
          email: "Email adress",
          email_placeholder: "email@example.com",
          email_desc: "Your email is safe with us",
          pass: "Password",
          pass_placeholder: "Enter password",
          pass_placeholder_rp: "Confirm password",
          pass_desc: "Must be 8-20 characters long, contain letters, numbers and special characters (without spaces or emoji).",
          register: "Register",
          reg_txt1: "Not a member? ",
          reg_txt2: "or joint with:",
          reg_txt3: "Already a member? ",
          display: "Display",
          footer_txt: "Student Management",
          grade: "Grade",
          date: "Date",
          teacher: "Teacher",
          title: "Title",
          author: "Author",
          description: "Description",
          link: "Link",
          sort_by: "Sort by",
          changeTheme: "Change site theme",
          changeLanguage: "Change site language",
          view: "View"
        }
      },
      sr: {
        translation: {
          welcome: "Dobrodošli na našu web stranicu!",
          language: "Jezik",
          greeting: "Zdravo, Korisniče!",
          header_txt: "US",
          search: "Pretraga...",
          dashboard: "Kontlona tabla",
          student: "Student",
          grades: "Ocjene",
          works: "Radovi",
          settings: "Podešavanja",
          year: "Godina",
          login: "Prijava",
          logout: "Odjava",
          name: "Ime",
          f_name: "Ime",
          l_name: "Prezime",
          email: "Email adresa",
          email_placeholder: "ime@primjer.com",
          email_desc: "Vasa mejl adresa je sigurna sa nama",
          pass: "Lozinka",
          pass_placeholder: "Unesite lozinku",
          pass_placeholder_rp: "Potvrdite lozinku",
          pass_desc: "Mora da sadrzi 8-20 karaktera, slovo, cifru i specijalni karakter (ne smije da sadrzi razmak ili emotikon)",
          register: "Registracija",
          reg_txt1: "Nemate nalog? ",
          reg_txt2: "ili putem:",
          reg_txt3: "Imate nalog? ",
          display: "Prikaži",
          footer_txt: "Upravljanje studentima",
          gade: "Ocjena",
          date: "Datum",
          teacher: "Profesor",
          title: "Naslov",
          author: "Autor",
          description: "Opis",
          link: "Putanja",
          grade: "Ocjena",
          sort_by: "Sortiraj po",
          changeTheme: "Promijeni temu sajta",
          changeLanguage: "Promijeni jezik sajta",
          view: "Pogledaj"
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
