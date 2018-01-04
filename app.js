/**
 * The model
 */
var theModel = (function() {

    // Expose public API
    return {

    };
}());

/**
  * The view
  */
var theView = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        intputValue: '.add__value',
        inputBtn: '.add__btn',
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Value is either 'inc' or 'exp'
                description: document.querySelector(DOMstrings.inputDesc).value,
                amount: document.querySelector(DOMstrings.intputValue).value,
            };
        },

        clearInput: function() {
            document.querySelector(DOMstrings.inputDesc).value = '';
            document.querySelector(DOMstrings.intputValue).value = '';
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };
}());

/**
 * The controller
 */
var theController = (function(model, view) {
    var DOMstrings = theView.getDOMstrings();

    /**
     * The function to read the input from UI and handle it properly
     */
    var ctrlAddItem = function() {
        // Get the input data
        var input = theView.getInput();
        theView.clearInput();

        // Add the item to the model

        // Add a new item to the UI

        // Calculate the budget

        // Display the budget
    };

    document.querySelector(DOMstrings.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) { // If pressed key is the Return key
            ctrlAddItem();
        }
    });
}(theModel, theView));