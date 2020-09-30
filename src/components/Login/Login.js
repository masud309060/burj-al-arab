import React, { useContext, useState } from 'react';
import './Login.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { userContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
// import { BorderBottom } from '@material-ui/icons';

const Login = () => {
    const [newUser, setNewUser] = useState(true);
    const [loggedInUser, setLoggedInUser] = useContext(userContext)


    if(firebase.apps.length === 0){
        firebase.initializeApp(firebaseConfig);
    }
    const handleGoogleSignIn = () => {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider)
        .then(function(result) {
            var user = result.user;
            const {displayName, email} = user;
            const newUserSignIn = {name: displayName, email: email}
            newUserSignIn.isSignIn = true;
            setLoggedInUser(newUserSignIn)
            storeAuthToken()
            history.replace(from);

          })
          .catch(function(error) {
            var errorMessage = error.message;
    })
};

const handleBlur = (e) => {
    let isFieldValid = true;
    if(e.target.name === "email"){
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        isFieldValid = re.test(e.target.value)
    }
    if(e.target.name === "password"){
        const rex = /^[A-Za-z]\w{7,14}$/;
        isFieldValid = rex.test(e.target.value)
    }
    if(isFieldValid){
        const newUserInfo = {...loggedInUser}
        newUserInfo[e.target.name] = e.target.value;
        setLoggedInUser(newUserInfo)
    }

}

const handleSubmit = (e) => {
    if(newUser && loggedInUser.email && loggedInUser.password){
        firebase.auth().createUserWithEmailAndPassword(loggedInUser.email, loggedInUser.password)
        .then(res => {
        const newUserInfo = {...loggedInUser}
        newUserInfo.isSignIn = true;
        newUserInfo.success = true;
        newUserInfo.error = "";
        setLoggedInUser(newUserInfo);
        updateUserName(loggedInUser.name)
        history.replace(from);
        alert("Your Account Create Succesfully")
        })
        .catch(error => {
            const newUserInfo = {...loggedInUser}
            newUserInfo.success = false;
            newUserInfo.error = error.message
            setLoggedInUser(newUserInfo);
        
          });
    }
    if(!newUser && loggedInUser.email && loggedInUser.password){
        firebase.auth().signInWithEmailAndPassword(loggedInUser.email, loggedInUser.password )
        .then(res => {
            const newUserInfo = {...loggedInUser}
            newUserInfo.isSignIn = true;
            newUserInfo.success = true;
            newUserInfo.name = res.user.displayName;
            newUserInfo.error = "";
            setLoggedInUser(newUserInfo) 
            history.replace(from);
        })
        .catch(error=> {
            const newUserInfo = {...loggedInUser}
            newUserInfo.success = false;
            newUserInfo.error = error.message;
            setLoggedInUser(newUserInfo)
          });
    }
    e.preventDefault();
}

const storeAuthToken = () => {
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
    .then(function(idToken) {
        sessionStorage.setItem('token', idToken)
        console.log(idToken)
      }).catch(function(error) {
        console.log(error)
      });
}

const updateUserName = name => {
    const user = firebase.auth().currentUser;
    user.updateProfile({
    displayName: name
    }).then(function() {
        console.log("userName update successfully")
    }).catch(function(error) {
        console.log(error)
    });
    }



const history = useHistory();
const location = useLocation();
const { from } = location.state || { from: { pathname: "/" } };

    return (
        <div style={{textAlign: "center"}}>
            <h1>This is Login</h1>
            <button onClick={handleGoogleSignIn}>Google Sign in</button>
            <form onSubmit={handleSubmit}>
                {newUser?
                <input type="text" onBlur={handleBlur} name="name" placeholder="Your Name"/>: "" } 
                <br/> 
                <input onBlur={handleBlur} type="email" name="email" placeholder="Your Email"/><br/>
                <input onBlur={handleBlur} type="Password" name="password" placeholder="Your password"/>
                <p style={{fontSize: "15px"}}>
                    <small>{newUser?"Already have an account?": "Create new account? "}</small>
                    <small onClick={()=> setNewUser(!newUser)} style={{color: "orange",borderBottom:"1px solid orange", cursor:"pointer",marginLeft:"10px"}}>{newUser?"Sign in": "Sign Out"}</small>
                </p>
                <input type="submit" value={newUser?"Create an account":"Sign in"}/>
            </form>
            <p style={{color:"red"}}>{loggedInUser.error}</p>
            {
                loggedInUser.success && <p style={{color:"green"}}>your account {newUser? "create": "logged in"} successfully</p>
            }
        </div>
    );
};

export default Login;