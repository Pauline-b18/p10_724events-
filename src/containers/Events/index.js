import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  
  // Mise à jour de l'état du type via le composant Select
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);
 
  // Utilisation du state `type` pour filtrer les événements selon le type sélectionné
  // Les événements sont ensuite filtrés pour la pagination
  const filteredEvents = data?.events
  .filter((event) => event.type === type || !type) // Filtrage par type
  .filter((event, index) => {
      if (
          (currentPage - 1) * PER_PAGE <= index &&
          PER_PAGE * currentPage > index
      ) {
          return true; // Filtrage par pagination
      }
      return false;
  }) || [];

  const changeType = (evtType) => {
    setCurrentPage(1); // Réinitialise la page courante
    setType(evtType); // Met à jour le type sélectionné
  };
  
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;

  // Récupération des différents types d'événements pour le composant Select
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)} // Convertit l'ensemble des types d'événements en tableau et passe comme options
            onChange={(value) => value ? changeType(value) : changeType(null)} // Définir la fonction à appeler lorsque la sélection change
            // Si une valeur est sélectionnée, appeler changeType avec cette valeur
            // Sinon, appeler changeType avec null pour réinitialiser le filtre
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
