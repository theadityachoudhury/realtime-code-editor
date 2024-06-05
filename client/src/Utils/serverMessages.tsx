import responseMessages, { ResponseMessageKey } from "./ServerResponseMessages";

// Assuming you have a function to handle server responses
const handleServerResponse = (responseCode: ResponseMessageKey) => {
    const message = responseMessages[responseCode] || 'An unknown error occurred. Please try again.';
    return message;
};

export default handleServerResponse;
