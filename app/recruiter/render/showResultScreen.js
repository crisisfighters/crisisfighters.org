import resultPage from './resultPage';

export default function showResultScreen(userParams, {result: elements}, location) {
    document.getElementById('recruiter-screen').innerHTML = resultPage(userParams, location, elements);
}
