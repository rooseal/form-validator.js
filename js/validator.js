/*
        ************************************************************
        *                                                          *
        *   Pure Javascript Module for validating HTML (5) Forms   *
        *                                                          *
        ************************************************************   
 */

/* Global Form Service Namespace
 This contains all available modules */
var arFormService = arFormService || {};

/*
    Validator class, contains the inputs with registered validation tests
    @formID     -   Id of the form on which to validate
*/
arFormService.validator = function(formID) {

    // Helper variables
    var _form = null;
    var _formID = "";
    var _inputs = {};
    var _msg = {
        default: "Er is een fout bij dit veld",
        required: "Dit veld is verplicht",
        numeric: "Enkel cijfers zijn toegelaten"
    }
    var _validations = {
        required: function(input) {
            if(input.value == '' || input.value == 'null')
                return false;
            else   
                return true; 
        },
        numeric: function(input) {
            if(isNaN(input.value))
                return false;
            else
                return true;
        }
    };
    var _this = this;

    init(formID);

    // Private methods
    function init( formName ) {
        _form = document.getElementById(formName);
        if(_form) {
            _formID = formName;
        }
    }

    var setValidation = function( inputName, validation ) {
        // Check inputName parameter and set input object
        if(!inputName) return console.log("Error: No input passed");
        var input = _form.elements.namedItem(inputName);
        if(!input) return console.log("Error: form element not found!");

        // Check if input already has validations
        if(!_inputs[inputName]) {
            _inputs[inputName] = {
                el: input,
                tests: {}
            }
        }

        // Add an event listener for the blur event to validate
        input.addEventListener("blur", function() {
            validateInput(_inputs[inputName]);
        });

        // Check if valid validation is passed
        if(!validation) return console.log("Error: No Validation passed");
        if(typeof validation === "string") {
            if(!_validations[validation]) return console.log("Error: Unknown Validation");
            //_inputs[inputName].tests.push(_validations[validation]); Uses array for tests
            _inputs[inputName].tests[validation] = _validations[validation];
        } else if(typeof validation === "object") {
            for(var index in validation) {
                if(validation[index] == false) continue;
                if(_validations[index]) {
                    _inputs[inputName].tests[index] = _validations[index];
                } else {
                    if(typeof validation[index] === "function") {
                        _validations[index] = validation[index];
                        _inputs[inputName].tests[index] = validation[index];
                    } else {
                        return console.log("Error: " + index + " has an invalid value");
                    }
                }
            }
        } else {
            return console.log("Error: Validation isn't of correct type");
        }
    }

    var addValidation = function(name, callback, message) {
        // Check parameters
        if(!(name && typeof name === "string") || (!callback && typeof callback !== "function") || (!message && typeof message !== "string")) return console.log("Error: Wrong parameters");

        // Add validation and error message
        _validations[name] = callback;
        _msg[name] = message;
    }

    /*
        Validate all inputs that are assigned to this validator, submit the form if it is valid
    */
    var validate = function() {
        console.log("Validate Full Form");
        var formValid = true;
        //Loop trough all inputs in this validator and validate them
        for(var inputName in _inputs) {
            if(!validateInput(_inputs[inputName])) formValid = false;
        }

        // Submit the form
        if(formValid) {
            console.log("Submitting form");
            _form.submit();
        }
    }

    /*
        Validate the value of a single input against the assigned tests
        @inputObject    -   the input as stored in the _inputs object
        @return         -   true if the input is valid, false if the input is invalid
    */
    function validateInput(input) {
        var valid = true;
        // var input = _inputs[inputName];
        messages = [];
        //Loop through all validations of a given input and test the values
        for(var testName in input.tests) {
            var test = input.tests[testName];
            console.log("Testing " + input.el.name + " for test " + testName);
            if(!test(input.el)) {
                console.log("Test failed");
                valid = false;
                messages.push(_msg[testName] || _msg["default"]);
            } else {
                console.log("Test passed");
            }
        }

        // Reset displayed error messages
        resetErrorMessages(input.el);

        // Display error messages for this input
        if(!valid) {
            setErrorMessage(input.el, messages);
            return false;
        } else { 
            input.el.classList.remove("invalid");
            return true;
        }
    }

    /*
        Display an error message under the input element
        @element        -   the invalid input element
        @messages       -   the error messages
    */
    function setErrorMessage(element, messages) {
        // Check the arguments
        if(!element || !(messages && Object.prototype.toString.call(messages) ===  "[object Array]")) return console.log("Error: Wrong arguments");

        var parent = element.parentElement;
        var sibling = element.nextElementSibling;

        // Create messages
        var messagesDiv = document.createElement("div");
        messagesDiv.className = "input-messages";
        for(var i = 0; i < messages.length; i++) {
            //create the message and append to the messagebox
            var msgText = document.createTextNode(messages[i]);
            var msgDiv = document.createElement("div");
            msgDiv.appendChild(msgText);
            messagesDiv.appendChild(msgDiv);
        }

        // Insert message after input
        if(sibling) {
            parent.insertBefore(messagesDiv, sibling);
        } else {
            parent.appendChild(messagesDiv);
        }

        // Set input invalid class
        element.classList.add("invalid");
        
    }

    function resetErrorMessages(element) {
        var parent = element.parentElement;
        var sibling = element.nextElementSibling;

        // Remove previous messages
        if(!sibling) return;
        while(sibling && sibling.className == "input-messages") {
            parent.removeChild(sibling);
            sibling = element.nextElementSibling;
        }
    }

    /* 
        Public interface of validator
    */
    return {
        setValidation: setValidation,
        addValidation: addValidation,
        validate: validate,
        getFormID: function() { return _formID; }
    }

}

/*
    Object to store all available tests, 
    shared by all validator instances
*/
arFormService.validator.tests = {
    /*
        Standard predefined validation tests, same as HTML5 input attributes
    */

    // Required checks if any input is given
    // Works for textbased inputs
    required: function(input) {
        if(input.value == '' || input.value == 'null')
            return false;
        else   
            return true; 
    },
    // Numeric checks if input is a number
    // Works for textbased inputs
    numeric: function(input) {
        if(isNaN(input.value))
            return false;
        else
            return true;
    }
}

/*
    Object to store the error messages corresponding to the tests, 
    shared by all validator instances
*/
arFormService.validator.messages = {
    /*
        Messages for the standard predefined tests
    */
    default: "Foutieve input",
    required: "Dit veld is verplicht",
    numeric: "Enkel cijfers zijn toegelaten"
}

/*
    Public method to add custom validation tests to the service
*/
arFormService.validator.addTest = function(name, message, callback) {
    // Check parameters
    if(!(name && typeof name === "string") || (!callback && typeof callback !== "function") || (!message && typeof message !== "string")) return console.log("Error: Wrong parameters");

    // Add validation and error message
    arFormService.validator.tests[name] = callback;
    arFormService.validator.messages[name] = message;
}