import React, { useState } from "react";
import { Card, CardTitle, Button, CardText } from "reactstrap";
import { getConfig } from "../config";
import { useAuth0 } from '@auth0/auth0-react';
import ChatRoom from './../views/ChatRoom';
import { useSnackbar } from 'react-simple-snackbar'

const Partner = (props) => {
    const [openSnackbar, closeSnackbar] = useSnackbar();

    const { apiOrigin = "http://localhost:3001" } = getConfig();
    const { getAccessTokenSilently } = useAuth0();
    
    const docName = `Non-Disclosure Agreement between ${props.channel}`;

    const [ isChatting, setChatting ] = useState(false);
    const secureButton = (<Button block onClick={(_e) => setChatting(!isChatting)}>Share ideas</Button>)
    const insecureButton = (<Button block onClick={(e) => handle(e, sendDocument)}>Make an agreement</Button>)
    const cardButton = props.secure ? secureButton : insecureButton;
    const cardColor = props.secure ? "success" : "danger";
    
    const sendDocument = async () => {
        const document = buildDocumentMetadata( 
            props.myself.email, 
            props.myself.first_name, 
            props.myself.last_name,
            props.myself.company,
            props.partner.email,
            props.partner.first_name,
            props.partner.last_name,
            props.partner.company
        );

        const message = {
            "message": "Hello! Please sign the NDA to proceed with the discussion.",
            "subject": `${docName}`,
            "silent": false
        }

        const token = await getAccessTokenSilently();
        await fetch(`${apiOrigin}/api/agreements`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({document, message})
        })
        .then(res => {
            (res.status === 200) ?
                openSnackbar(`An agreement was sent to ${props.myself.email}. Please check your inbox!`) :
                openSnackbar(`Unable to make an agreement!`);
            setTimeout(() => {
                closeSnackbar();
            }, 5000);
        });
    };

    const buildDocumentMetadata = 
    (
        sender_email,
        sender_first_name,
        sender_last_name,
        sender_company,
        client_email,
        client_first_name,
        client_last_name,
        client_company
    ) => {
        return {  
            "name": `${docName}`,
            "template_uuid": "e7wHdHirqiQULdrGDSiKn4",
            "recipients": [
                {  
                    "email": sender_email,
                    "first_name": sender_first_name,
                    "last_name": sender_last_name,
                    "role": "Sender",
                    "signing_order": 1
                },
                {  
                    "email": client_email,
                    "first_name": client_first_name,
                    "last_name": client_last_name,
                    "role": "Client",
                    "signing_order": 2
                }
            ],
            "tokens": [  
                {  
                    "name": "Sender.FirstName",
                    "value": sender_first_name
                },
                        {  
                    "name": "Sender.LastName",
                    "value": sender_last_name
                },
                        {  
                    "name": "Sender.Company",
                    "value": sender_company
                },
                        {  
                    "name": "Client.FirstName",
                    "value": client_first_name
                },
                        {  
                    "name": "Client.LastName",
                    "value": client_last_name
                },
                        {  
                    "name": "Client.Company",
                    "value": client_company
                }
            ],
            "metadata":{  
                "sender": sender_email,
                "client": client_email
            }
        };
    };

    const handle = (e, fn) => {
        e.preventDefault();
        fn();
    };

    return (
        <>
        <Card body outline color={cardColor}>
            <CardTitle>{props.partner.first_name} {props.partner.last_name}</CardTitle>
            <CardText>{props.partner.job_title} @ {props.partner.company}</CardText>
            {cardButton}
        </Card>
        
        { isChatting ? <ChatRoom channel={props.channel} /> : null}
        </>
    );
};

export default Partner;
