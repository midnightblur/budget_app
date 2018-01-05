/**
 * The model
 */
var theModel = (function() {
    // Define prototype objects
    var Expense = {
        id: -1,
        description: 'expense',
        amount: 0,
    };

    var Income = {
        id: -1,
        description: 'income',
        amount: 0,
    };

    var data = {
        totalExpense: 0,
        transactionsHistory: {
            inc: [],
            exp: [],
        },
        totals: {
            inc: 0,
            exp: 0,
        },
    };

    // Expose public API
    return {
        addTransaction: function(type, desc, amount) {
            // Create the transaction
            var transaction;
            if (type === 'inc') {
                transaction = Object.create(Income);
            } else if (type === 'exp') {
                transaction = Object.create(Expense);
            } else {
                throw 'Invalid transaction type';
            }
            if (data.transactionsHistory[type].length === 0) {
                transaction.id = 0;
            } else {
                transaction.id = data.transactionsHistory[type][data.transactionsHistory[type].length - 1].id + 1; // the latest transaction's id + 1
            }
            transaction.description = desc;
            transaction.amount = amount;

            // Record the transaction
            data.transactionsHistory[type].push(transaction);

            return transaction;
        },
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
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Value is either 'inc' or 'exp'
                description: document.querySelector(DOMstrings.inputDesc).value,
                amount: parseFloat(document.querySelector(DOMstrings.intputValue).value),
            };
        },

        clearInput: function() {
            // Clear fields
            var clearedFields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.intputValue); // return a list, not an array
            clearedFields = Array.prototype.slice.call(clearedFields); // convert a list to an array
            clearedFields.forEach(function(current, index, array) {
                current.value = '';
            });

            // Reset focus
            clearedFields[0].focus();
        },

        addListTransaction: function(transaction, type) {
            // Create HTML string with placeholder text
            var html, container;
            
            if (type === 'inc') {
                container = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %amount%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                container = DOMstrings.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %amount%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                throw 'Invalid transaction type';
            }

            // Replace the placeholder text with actual data
            html = html.replace('%id%', transaction.id);
            html = html.replace('%description%', transaction.description);
            html = html.replace('%amount%', transaction.amount);

            // Insert the HTML into the DOM
            document.querySelector(container).insertAdjacentHTML('beforeend', html);
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
    var setupEventListeners = function() {
        var DOMstrings = theView.getDOMstrings();
        document.querySelector(DOMstrings.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) { // If pressed key is the Return key
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function() {
        // Calculate the budget

        // Return the budget

        // Display the budget
    };

    /**
     * The function to read the input from UI and handle it properly
     */
    var ctrlAddItem = function() {
        // Get the input data
        var input = theView.getInput();

        if (input.description !== '' && !isNaN(input.amount) && input.amount > 0) {
            // Clear all input fields
            theView.clearInput();

            // Add the item to the model
            var newTransaction = theModel.addTransaction(input.type, input.description, input.amount);

            // Add a new item to the UI
            theView.addListTransaction(newTransaction, input.type);

            // Calculate & Update the budget
            updateBudget();
        }
    };

    return {
        init: function() {
            console.log('Application has started!!!');
            setupEventListeners();
        },
    };
}(theModel, theView));

theController.init();