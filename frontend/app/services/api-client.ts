import axios, { CanceledError } from 'axios';

export default axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}:4000`,
    withCredentials: true,
});

export { CanceledError };