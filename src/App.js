import React, { createContext, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Header from './components/Header/Header';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Book from './components/Book/Book';

export const userContext = createContext()

function App() {
  const [loggedInUser, setLoggedInuser] = useState({
    isSignIn: false,
    error: "",
    success: "",
    name: "",
    email: ""
  })

  return (
    <userContext.Provider value={[loggedInUser, setLoggedInuser]}>
      <Router>
          <Header/>
          <Switch>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute path="/book/:bedType">
              <Book></Book>
            </PrivateRoute>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
      </Router>
      </userContext.Provider>
  );
}

export default App;
