import React from "react";


export const catchError = (err, that) => {
    if(err.status === 401){
        localStorage.removeItem('token');
        window.location = '/login';
    }
    console.log(err);
    that.setState({error : err.message});
};
