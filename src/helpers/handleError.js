export const handleError = (response) => {
    if (!response.ok) {
        throw response;
    }
    return response;
}