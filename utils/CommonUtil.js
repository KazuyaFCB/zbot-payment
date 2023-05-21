const NUMBER_OF_MILISECONDS_PER_DAY = 24 * 3600 * 1000;

module.exports = {
    isPhoneNumber: (phoneNumber) => {
        return true;
    },
    diffDate: (followingDate, previousDate) => {
        return (followingDate - previousDate) / NUMBER_OF_MILISECONDS_PER_DAY;
    },
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
}