import React from "react";


export const catchError = (err, that) => {
    if(err.status === 401){//Unauthorized
        localStorage.clear();
        setTimeout(() => {window.location = '/login';},4000);
    }
    console.error(err);
    that.setState({error : err.message});
};
