/*

    This script is just for illustration purposes and is not part of the validator

*/

document.addEventListener("DOMContentLoaded", function(event) { 
    
    console.log("Document loaded");

    //Make new validator
    var testFormValidator = new arFormService.validator("testForm");

    //Setup the validator
    testFormValidator.setValidation("firstName", "required");
    testFormValidator.setValidation("houseNumber", "required");
    testFormValidator.setValidation("houseNumber", "numeric");

    //Add custom listener for submit button
    var btn = document.getElementById("submitButton");
    btn.addEventListener("click", function(event) {
        event.preventDefault();
        event.currentTarget.blur();
        testFormValidator.validate();
    });

    //Setup the validator
    var testFormValidator2 = new arFormService.validator("testForm2");

    //testFormValidator2.attachForm("testForm2");
    testFormValidator2.setValidation("firstName", "required");
    testFormValidator2.setValidation("houseNumber", "required");
    testFormValidator2.setValidation("houseNumber", "numeric");

    //Add custom listener for submit button
    var btn2 = document.getElementById("submitButton2");
    btn2.addEventListener("click", function(event) {
        event.preventDefault();
        event.currentTarget.blur();
        testFormValidator2.validate();
    });

    console.log(testFormValidator2.getFormID());

});