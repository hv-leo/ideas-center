import React, { useState, useEffect } from "react";
import { CardColumns } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import Partner from "../components/Partner";

export const PartnersComponent = () => {
  const { apiOrigin = "http://localhost:3001" } = getConfig();
  const { user, getAccessTokenSilently } = useAuth0();

  const [myself, setMyself] = useState();
  const [partners, setPartners] = useState();
  const [documents, setDocuments] = useState();

  useEffect(() => {
    ( async () => {
      if (!partners || !myself) {
        const token = await getAccessTokenSilently();
    
        await fetch(`${apiOrigin}/api/partners`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(contacts => {
          if ( contacts ) {
            setPartners(
              contacts.filter( contact =>  user.email !== contact.email )
            );
            setMyself(
              contacts.filter( contact => user.email === contact.email )[0]
            );

            fetch(`${apiOrigin}/api/agreements`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            .then(res => res.json())
            .then(agreements => {
              if (agreements) {
                setDocuments(
                  agreements.map( doc => ({ 'name': doc.name, 'status': doc.status }))
                );
              }
            });
          }
        });
      }
    })();
  }, [getAccessTokenSilently, apiOrigin, user.email, myself, partners,documents]);

  const [cards, setCards] = useState([]);
  if( myself && partners && documents && cards.length === 0 ) {
    const myselfId = `${myself.first_name}${myself.last_name}@${myself.company}`;
    for( const partner of partners ) {
      const partnerId = `${partner.first_name}${partner.last_name}@${partner.company}`;
      const agreement = documents.find(
        document => document.name.includes(myselfId) && document.name.includes(partnerId)
      );
      const channel = [myselfId,partnerId].sort().join(" and ");
      if (agreement) {
        cards.push(
          <Partner 
            key={partner.email}
            myself={myself} 
            partner={partner}
            channel={channel}
            secure
          />
        )
      } else {
        cards.push(
          <Partner 
            key={partner.email}
            myself={myself} 
            partner={partner}
            channel={channel}
          />
        )
      }
    }
    setCards(cards);
  }

  return(
    <CardColumns>
      {cards}
    </CardColumns>
  );
};

export default withAuthenticationRequired(PartnersComponent, {
  onRedirecting: () => <Loading />,
});
