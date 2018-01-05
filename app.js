/**
 * The model
 */
var theModel = (function() {
    // Define prototype objects
    var Expense = {
        id: -1,
        description: 'expense',
        amount: 0,
        percentage: -1,
        calcPercentage: function() {
            this.percentage = (data.totals.inc > 0) ? Math.round((this.amount / data.totals.inc) * 100) : -1;
        },

        getPercentage: function() {
            return this.percentage;
        }
    };

    var Income = {
        id: -1,
        description: 'income',
        amount: 0,
    };

    var data = {
        budget: 0,
        percentage: -1,
        transactionsHistory: {
            inc: [],
            exp: [],
        },
        totals: {
            inc: 0,
            exp: 0,
        },
    };

    console.log(Expense.prototype);

    var calculateTotals = function(type) {
        var sum = 0;
        data.transactionsHistory[type].forEach(function(current) {
            sum += current.amount;
        });
        data.totals[type] = sum;
        return sum;
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

        deleteTransaction: function(type, id) {
            for (var i = 0; i < data.transactionsHistory[type].length; i++) {
                if (data.transactionsHistory[type][i].id === id) {
                    data.transactionsHistory[type].splice(i, 1);
                    return;
                }
            }
        },

        calculateBudget: function() {
            // Calculate total incomes & expenses
            calculateTotals('inc');
            calculateTotals('exp');

            // Calculate the budget: incomes - expenses
            data.budget = data.totals['inc'] - data.totals['exp'];

            // Calculate the percentage of money spent
            if (data.totals['inc'] > 0) {
                data.percentage = Math.round((data.totals['exp'] / data.totals['inc']) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.transactionsHistory.exp.forEach(function(current) {
                current.calcPercentage();
            });
        },

        getPercentages: function() {
            var allPercentages = data.transactionsHistory.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPercentages;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals['inc'],
                totalExpense: data.totals['exp'],
                percentage: data.percentage,
            };
        },

        publicExpose: function() {
            return data;
        }
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
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        monthLabel: 'budget__title--month',
        expensePercentageLabel: '.item__percentage',
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

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %amount%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                container = DOMstrings.expenseContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %amount%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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

        deleteListTransaction: function(type, id) {
            var element = document.getElementById(type + '-' + id);
            element.parentNode.removeChild(element);
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensePercentageLabel);
            
            var nodeListForEach = function(nodeList, fn) {
                for (var i = 0; i < nodeList.length; i++) {
                    fn(nodeList[i], i);
                }
            }

            nodeListForEach(fields, function(current, index) {
                current.textContent = (percentages[index] === 0) ? '---' : percentages[index] + '%';
            });
        },

        displayBudget: function(data) {
            document.querySelector(DOMstrings.budgetLabel).textContent = (data.budget > 0) ? '+ ' + data.budget : data.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = data.totalIncome;
            document.querySelector(DOMstrings.expenseLabel).textContent = data.totalExpense;
            if (data.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = data.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
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

        // Setup event delegation for deleting transactions
        document.querySelector(DOMstrings.container).addEventListener('click', ctrlDeleteItem);
    };

    var updatePercentages = function() {
        // Calculate the percentages
        theModel.calculatePercentages();

        // Read the percentages from the model
        var percentages = theModel.getPercentages();

        // Update to the UI
        theView.displayPercentages(percentages);
    };

    var updateBudget = function() {
        // Calculate the budget
        theModel.calculateBudget();

        // Get the budget
        var budget = theModel.getBudget();

        // Display the budget
        theView.displayBudget(budget);
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

            // Calculate & update the percentages
            updatePercentages();
        }
    };

    /**
     * The function determine the HTML item firing the event and remove it from the UI and delete the transaction from the model
     * @param {*} event 
     */
    var ctrlDeleteItem = function(event) {
        // Getting deleted transaction info
        var transactionID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (transactionID) {
            var transactionInfo = transactionID.split('-');
            var type = transactionInfo[0];
            var id = parseInt(transactionInfo[1]);

            // Delete the transaction from data model
            theModel.deleteTransaction(type, id);

            // Delete the item from the UI
            theView.deleteListTransaction(type, id);

            // Update and show the budget
            updateBudget();

            // Calculate & update the percentages
            updatePercentages();
        }
    };

    return {
        init: function() {
            console.log('Application has started!!!');
            setupEventListeners();
            theView.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: -1,
            });
        },
    };
}(theModel, theView));

theController.init();