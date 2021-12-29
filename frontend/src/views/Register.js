import React, { useContext, useState } from "react";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { useSnackbar } from 'react-simple-snackbar'

import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Button } from 'reactstrap';
import { Context } from "../utils/Context";
import { getConfig } from "../config";

export const RegisterComponent = () => {
  const { apiOrigin = "http://localhost:3001" } = getConfig();
  const { user, getAccessTokenSilently } = useAuth0();
  const [contact, setContact] = useState(
      {
          first_name: user.given_name,
          last_name: user.family_name,
          email: user.email,
          company: '',
          job_title: ''
      }
  );
  const [openSnackbar, closeSnackbar] = useSnackbar();
  
  const [context, setContext] = useContext(Context);
  const createContact = async () => {
    const token = await getAccessTokenSilently();

    await fetch(`${apiOrigin}/api/partners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contact)
    }).then( resp => {
      if (resp.status === 200) {
        openSnackbar('Congratulations on joining the partners\' network!');
        setContext({...context, justRegistered: true});
      } else {
        openSnackbar('Something went wrong!');
        setContext({...context, justRegistered: false});
      }
      setTimeout(() => {
        closeSnackbar();
      }, 5000);
    });
  }

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };
  
  return (

    <Form onSubmit={(e) => handle(e, createContact)}>
      <FormGroup>
        <Label for="name">Full Name</Label>
        <Input id="name" value={user.name} disabled />
      </FormGroup>

      <FormGroup>
        <Label for="email">Email Address</Label>
        <Input id="email" value={user.email} disabled />
      </FormGroup>

      <FormGroup>
        <Label for="company">Company Name</Label>
        <Input id="company" onChange={ e => setContact({...contact, company: e.target.value}) } />
      </FormGroup>

      <FormGroup>
        <Label for="job">Job Title</Label>
        <Input id="job" onChange={ e => setContact({...contact, job_title: e.target.value}) }/>
      </FormGroup>

      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default withAuthenticationRequired(RegisterComponent, {
  onRedirecting: () => <Loading />,
});
