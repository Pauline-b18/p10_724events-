import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Classement des événements par ordre chronologique (du plus ancien au plus récent)
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );

  const nextCard = () => {
    setTimeout(
      // Vérification pour éviter une page blanche lorsque le slider arrive à la dernière image
      () => setIndex(index + 1 < byDateDesc.length ? index + 1 : 0),
      5000
    );
  };

  useEffect(() => {
    // Ajout d'une condition pour vérifier que byDateDesc n'est pas undefined
    if (byDateDesc) {
      nextCard();
    }
  });

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        // Suppression de la balise fragment inutile (<> </>)
        <div
          key={event.title}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map((event, BPIndex) => (
            <input
              key={event.title}
              type="radio"
              name="radio-button"
              checked={BPIndex === index}
              // Ajout de readOnly pour empêcher la modification de l'état par l'utilisateur
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
