import GlobalState from './GlobalState.js';

//this function changes the background based on whether the user is logged in or not
//if the user is logged in, there should be no background image (white)
//if the user is not logged in, the background image should be of a doctor, or whatver is specified
function changeToDefaultBackground (session) {
    console.log(session);
    if (!session) {
        document.body.style.backgroundImage = "url('https://www.gapyear.com/images/content/11.08.07-ces_ft_doctor_6966282.jpg')";
    } else {
        document.body.style.backgroundImage = "url('#')";
    }
}

export default changeToDefaultBackground;