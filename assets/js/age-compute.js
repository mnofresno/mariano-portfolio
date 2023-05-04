(function() {
    const birthDate = new Date('1986-01-29');
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - birthDate.getTime();
    const age = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));
    $("#age-field").text(age);
})();