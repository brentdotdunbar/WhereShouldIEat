import './App.css';

import Home from './Components/home.js'
import Decidr from './Components/decidr.js'
import RBL from './Components/rbl.js'
import Login from './Components/login.js'
import SignUp from './Components/signup.js'
import Header from './Components/header.js'
import User from './Components/User'
import jwt_decode from 'jwt-decode';

import React, {useState, useEffect} from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { LocalLaundryService } from '@mui/icons-material';

import AuthContext from './Components/authContext';

function clearCookie(name, domain, path){
    var domain = domain || document.domain;
    var path = path || "/";
    document.cookie = name + "=; expires=" + +new Date + "; domain=" + domain + "; path=" + path;
};

function App() {
    const [user, setUser] = useState(null);
    
    const login = (token) => {
        const username = jwt_decode(token).userID;
        localStorage.setItem('token', token);
        
        const getByusername = () => {
            fetch(`http://localhost:25566/api/user/get/${username}`)
            .then(responce => responce.json())
            .then((data) => {
                const user = {
                    username: username,
                    firstName: data[0].firstName,
                    lastName: data[0].lastName,
                    birthDay: data[0].birthDay
                };
                console.log("user: ", user);
                setUser(user);
                return user;
            });
            
            document.cookie = `username=${username}`;
        };
        
        return getByusername();
    }
    
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        clearCookie('username', null, null);
        console.log(`logout ${document.cookie}`);
    }
    
    const auth = {
        user,
        login,
        logout
    }
    
    return (
        <AuthContext.Provider value={auth}>
            <Router>
                <div className="App">
                    <Header/>
                    <Switch>
                        <Route path='/' exact component={Home}/>
                        <Route path='/decidr' component={Decidr}/>
                        <Route path='/rbl' component={RBL}/>
                        <Route path='/login' component={Login}/>
                        <Route path='/signup' component={SignUp}/>
                        <Route path='/User_Settings' component={User}></Route>
                    </Switch>
                </div>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
