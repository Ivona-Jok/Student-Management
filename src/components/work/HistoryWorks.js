import React, { useEffect, useState, useCallback } from "react";
import { getWorkHistory} from "../../utils/api";  // Funkcija za uzimanje istorije radova
import styles from "./HistoryWorks.module.css";  // Importuj CSS module

function HistoryWorks({ workId, setWorkId }) {
  const [works, setWorks] = useState([]);  // Popis svih radova
  const [history, setHistory] = useState([]);  // Istorija za selektovani rad
  const [searchQuery, setSearchQuery] = useState('');  // Upit za pretragu

  // Funkcija za dobijanje svih radova
  // Funkcija za dobijanje svih radova
  const fetchWorks = async () => {
    try {
      const response = await fetch("http://localhost:5000/works");;  // Putanja do API-ja za radove
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
      
      <input
        type="text"
        id="work-search"
        placeholder="Search by name or index"
        value={searchQuery}
        onChange={(e) => {
          handleSearch(e.target.value);
          setSearchQuery(e.target.value)  // Prvo pozovi handleSearch da ažuriraš searchQuery
          setWorkId(e.target.value);     // Zatim postavi workId
        }}
      />
      
      {/* Prikazivanje filtriranih radova */}
      <ul className={styles.workList}>
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
            <ul className={styles.historyList}>
              {history.map((item, index) => (
                <li key={index} className={styles.historyListItem}>
                  <strong>Change Type:</strong> {item.changeType} <br />
                  {/* Prikazivanje prethodnog stanja */}
                  <strong>Previous State:</strong>
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

                  {/* Prikazivanje trenutnog stanja */}
                  <strong>Current State:</strong>
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

                  <br />
                  <strong>Changed By:</strong> {item.changedBy || 'N/A'} <br />
                  <strong>Date:</strong> {item.date || 'N/A'}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.historyInfo}>No history available for this work.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default HistoryWorks;
