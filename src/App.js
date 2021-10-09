import './App.css';
// import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import initializeAuthentication from './Firebase/firebase.initialize';
import { useState } from 'react';

initializeAuthentication();
const googleProvider = new GoogleAuthProvider();
const gitHubProvider = new GithubAuthProvider();

function App() {
  const [user, setUser] = useState({});
  const auth = getAuth();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        // console.log(loggedInUser);
        const loggedInUser = {
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(loggedInUser);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const handleGitHubSignIn = () => {
    signInWithPopup(auth, gitHubProvider)
      .then(result => {
        const { displayName, photoURL } = result.user;
        const loggedInUser = {
          name: displayName,
          photo: photoURL
        }
        setUser(loggedInUser);
      })
  }

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser({});
      })
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }

  const handleRegistration = (e) => {
    e.preventDefault();
    console.log(email, password);
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if(!/(?=(.*[0-9]){1,})/.test(password)){
      setError("Pasword must contain a number.");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user1 = result.user;
        console.log(user1);
        setError("");
      })
      .catch(error => {
        setError(error.message);
      })
  }


  return (
    <div className="mx-auto w-50">
      <h3 className="text-center text-primary">Register</h3>
      <form onSubmit={handleRegistration}>
        <div className="mb-3 row">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required />
          </div>
        </div>
        <div className="mb-3 row">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Example checkbox
              </label>
            </div>
          </div>
        </div>
        <div className="text-danger">{error}</div>
        <button type="submit" className="btn btn-primary">Sign in</button>
      </form>
    </div>
  );
}

export default App;
/*  {!user.name ?
   <div>
     <button onClick={handleGoogleSignIn}>Google Sign In</button>
     <br />
     <button onClick={handleGitHubSignIn}>GitHub Sign In</button>
     <br />
   </div> :
   <button onClick={handleSignOut}>Sign Out</button>
 }
 {
   user.name && <div>
     <h2>Hellow, {user.name}</h2>
     <h3>Your email is: {user.email}</h3>
     <img src={user.photo} alt="" />
   </div>
 } */