import React, { useEffect, useState, useCallback, useContext } from "react";
import { getWorkHistory} from "../../utils/api";  // Funkcija za uzimanje istorije radova
import styles from "../../styles/HistoryWorks.module.css";  // Importuj CSS module
import { format } from 'date-fns';
import { ThemeContext } from "../../theme/Theme";
import { useTranslation } from "react-i18next";

function HistoryWorks({ workId, setWorkId }) {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [works, setWorks] = useState([]);  // Popis svih radova
  const [history, setHistory] = useState([]);  // Istorija za selektovani rad
  const [searchQuery, setSearchQuery] = useState('');  // Upit za pretragu

  // Funkcija za dobijanje svih radova
  // Funkcija za dobijanje svih radova
  const fetchWorks = async () => {
    try {
      const response = await fetch("http://localhost:5000/works");  // Putanja do API-ja za radove
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Data:", data);  // Prikazivanje podataka u konzoli
      setWorks(data);
    } catch (error) {
      console.error("Failed to fetch works:", error);
    }
  };

  // Funkcija za pretragu radova
  const handleSearch = (query) => {
    setSearchQuery(query);  // Ažuriraj searchQuery stanje
  };

  // Funkcija za dobijanje istorije za selektovani rad
  const fetchWorkHistory = useCallback(async () => {
    if (!workId) return;  // Ako workId nije definisan, ne izvodi upit
    try {
      const historyData = await getWorkHistory(workId);
      setHistory(historyData);
    } catch (error) {
      console.error("Failed to fetch work history:", error);
    }
  }, [workId]);  // Zavisi od workId

  
  useEffect(() => {
    fetchWorks();
  }, []); 

  // Preuzmi istoriju kada se workId promeni
  useEffect(() => {
    fetchWorkHistory();
  }, [fetchWorkHistory]);  // Dodajemo fetchWorkHistory kao zavisnost

 // Filtriraj radove na osnovu pretrage po currentState.title
 const filteredWorks = works.filter((work) => 
  work.currentState?.title && work.currentState.title.toLowerCase().includes(searchQuery.toLowerCase())
);

return (

    <div>
      <div>
        <div className={`select-user-role box ${theme}`}>
          <label htmlFor="role-switcher" className={`selectBox ${theme}`}>{t("searchWork")}</label>
          <input
            type="text"
            id="work-search"
            className={`searchBox ${theme}`}
            placeholder={t("searchWorkPlaceholder")}
            value={searchQuery}
            onChange={(e) => {
              handleSearch(e.target.value);
              setSearchQuery(e.target.value);  // Prvo pozovi handleSearch da ažuriraš searchQuery
              setWorkId(e.target.value);       // Zatim postavi workId
            }}
          />
        </div>
      </div>

      {/* Prikazivanje filtriranih radova */}
      <ul className={`styles.workList box ${theme}`}>
        {filteredWorks.map((work) => (
          <li
            key={work.id}  // Koristimo work.id kao ključ
            onClick={() => setWorkId(work.id)}  // Kada klikneš na rad, postavi workId
            style={{ cursor: "pointer" }}
          >
            {work.index} - {work.firstName} {work.lastName}
          </li>
        ))}
      </ul>

      {/* Prikazivanje istorije za selektovani rad */}
      {workId && (
        <div className={styles.historyList}>
          <h3 className={styles.pageTitle}>Work History for ID: {workId}</h3>

          {history.length > 0 ? (
            <>
              {/* Tabela za Previous State i Current State */}
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Previous State</th>
                    <th>Current State</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index} className={styles.historyTableRow}>
                      <td>
                        {item.previousState && typeof item.previousState === 'object' ? (
                          <ul>
                            {Object.entries(item.previousState).map(([key, value], subIndex) => (
                              <li key={subIndex}>
                                <strong>{key}:</strong> {JSON.stringify(value)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span>{item.previousState}</span>
                        )}
                      </td>
                      <td>
                        {item.currentState && typeof item.currentState === 'object' ? (
                          <ul>
                            {Object.entries(item.currentState).map(([key, value], subIndex) => (
                              <li key={subIndex}>
                                <strong>{key}:</strong> {JSON.stringify(value)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span>{item.currentState}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Ostali podaci ispod tabele */}
              {history.map((item, index) => (
                <div key={index} className={styles.historyDetails}>
                  <p><strong>Change Type:</strong> {item.changeType}</p>
                  <p><strong>Changed By:</strong> {item.changedBy || 'N/A'}</p>
                  <p><strong>Date:</strong> {format(new Date(item.dateChanged), 'dd.MM.yyyy HH:mm:ss') || 'N/A'}</p>
                </div>
              ))}
            </>
          ) : (
            <p className={styles.historyInfo}>No history available for this work.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default HistoryWorks;
