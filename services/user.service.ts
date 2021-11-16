import { BehaviorSubject } from 'rxjs';
import Router from 'next/router';
import { fetchWrapper } from '../lib/api/fetchWrapper';


const userSubject = new BehaviorSubject(process.browser && JSON.parse( localStorage.getItem('user')! ));


const baseUrl =  "http://localhost:3001"

function login(username:string, password:string) {
    return fetchWrapper.post(`${baseUrl}/auth/login`, { username, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}



function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/login');
}

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    logout
}