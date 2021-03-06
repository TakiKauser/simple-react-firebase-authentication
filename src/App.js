import './App.css';
// import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile, FacebookAuthProvider } from "firebase/auth";
import initializeAuthentication from './Firebase/firebase.initialize';
import { useState } from 'react';

initializeAuthentication();
const googleProvider = new GoogleAuthProvider();
const gitHubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

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
      .catch((error) => {
        console.log(error.message);
      });
  }

  const handleFacebookSignIn = () => {
    signInWithPopup(auth, facebookProvider)
      .then(result => {
        // console.log(result.user);
        const { displayName, email, photoURL } = result.user;
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


  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser({});
      })
  }

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const toggleLogIn = e => {
    setIsLogin(e.target.checked);
  }

  const handleNameChange = e => {
    setUserName(e.target.value);
  }

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
    if (!/(?=(.*[0-9]){1,})/.test(password)) {
      setError("Pasword must contain a number.");
      return;
    }

    isLogin ? processLogIn(email, password) : createNewUser(email, password);
  }

  const processLogIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user1 = result.user;
        console.log(user1);
        setError("");
        verifyEmail();
        setName();
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const setName = () => {
    updateProfile(auth.currentUser, { displayName: userName })
      .then(result => {

      })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {

      })
  }

  return (
    <div className="mx-auto w-50">
      <h3 className="text-center text-primary">{isLogin ? "Log In" : "Register"} </h3>
      <form onSubmit={handleRegistration}>
        {!isLogin && <div className="mb-3 row">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Username</label>
          <div className="col-sm-10">
            <input onBlur={handleNameChange} type="text" className="form-control" id="inputName" required />
          </div>
        </div>}
        <div className="mb-3 row">
          <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email</label>
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
              <input onChange={toggleLogIn} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered?
              </label>
            </div>
            <button onClick={handleResetPassword} type="button" className="btn btn-link">Reset Password</button>
          </div>
        </div>
        <div className="text-danger">{error}</div>
        <button type="submit" className="btn btn-primary">{isLogin ? "Log In" : "Register"}</button>
      </form>
      <hr /> <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      {!user.name ?
        <div>
          <button onClick={handleGoogleSignIn}>Google Sign In</button>
          <br /> <br />
          <button onClick={handleGitHubSignIn}>GitHub Sign In</button>
          <br /> <br />
          <button onClick={handleFacebookSignIn}>Facebook Sign In</button>
          <br /> <br />
        </div> :
        <button onClick={handleSignOut}>Sign Out</button>
      }
      {
        user.name && <div>
          <h2>Hellow, {user.name}</h2>
          <h3>Your email is: {user.email}</h3>
          <img src={user.photo} alt="" />
        </div>
      }
    </div>
  );
}

export default App;