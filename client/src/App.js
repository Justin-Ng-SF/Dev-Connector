import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';//must put in container but above switch b/c switch can only hav routes inside
//redux stuff 
import { Provider } from 'react-redux';
import store from './store';



const App = () => (
  <Provider store={store}>
    <Router>

      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert/>
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login}/>
          </Switch>

        </section>

      </Fragment>
          
    </Router>
  </Provider>
);

export default App;
