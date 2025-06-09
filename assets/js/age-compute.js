function computeAge(birthDate, currentDate = new Date()) {
    const diffInMs = currentDate.getTime() - birthDate.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = computeAge;
} else {
    (function() {
        const birthDate = new Date('1986-01-29');
        const age = computeAge(birthDate);
        if (window.jQuery) {
            $("#age-field").text(age);
        } else if (document.querySelector) {
            document.querySelector('#age-field').textContent = age;
        }
    })();
}

