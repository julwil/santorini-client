export const catchError = (err) => {

    err.json().then( errorMessage => {
        alert(errorMessage.message)
    })
}
