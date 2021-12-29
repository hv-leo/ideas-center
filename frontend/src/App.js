import React, { useState } from "react";
import { Context } from "./utils/Context";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Partners from "./views/Partners";
import Register from "./views/Register";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";
import SnackbarProvider from 'react-simple-snackbar';
import PubNub, { generateUUID } from 'pubnub';
import { PubNubProvider } from 'pubnub-react';

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

const App = () => {
  const [context, setContext] = useState({});
  const { user, isLoading, error } = useAuth0();
  if (error) {
    return <div>Oops... {error.message}</div>;
  }
  if (isLoading) {
    return <Loading />;
  }
  
  const pubnub = new PubNub({
    publishKey: "pub-c-a2346431-fd9b-4db8-9383-c84df5b1d097",
    subscribeKey: "sub-c-6f0f2fd4-68c2-11ec-a4f8-fa616d2d2ecf",
    uuid: 'Anonymous',
  });
  
  if (user) {
    const name = `${user.given_name} ${user.family_name}`;
    const uuid = generateUUID(name);
    pubnub.setUUID( uuid );

    pubnub.objects.setUUIDMetadata({
      uuid: uuid,
      data: {
          name: name,
          email: user.email,
          profileUrl: user.picture
      }
    });
  }

  return (
    <PubNubProvider client={pubnub}>
      <Context.Provider value={[context, setContext]}>
        <SnackbarProvider>
          <Router history={history}>
            <div id="app" className="d-flex flex-column h-100">
              <NavBar />
              <Container className="flex-grow-1 mt-5">
                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/profile" component={Profile} />
                  <Route path="/partners" component={Partners} />
                  <Route path="/register" component={Register} />
                </Switch>
              </Container>
              <Footer />
            </div>
          </Router>
        </SnackbarProvider>
      </Context.Provider>
    </PubNubProvider>
  );
};

export default App;
