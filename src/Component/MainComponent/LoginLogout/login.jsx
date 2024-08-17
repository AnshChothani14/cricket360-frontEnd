import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import './log.css'

const LoginButton = ( {sign} ) => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    const [showIframe, setShowIframe] = useState(false);

    const handleLogin = () => {
        setShowIframe(true);
    };

    return (
        <div className={sign ? 'mt-5 limain text-center' : 'mt-5 limain text-center danger'} >
            <h1>Admin Login </h1>
            <p className="my-5" >Login To Acess The Feature Of Cricket360 like <b>Shadule A match</b> and <b>Start A Match</b> </p>
            {!sign ? <p className="my-5" >* You Must Be LogedIn To Use This Feature </p> : null}
            <button className="btn btn-primary" onClick={() => loginWithRedirect()} >Login</button>
        </div>
    );
};

export default LoginButton;
