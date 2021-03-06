var express = require('express');
var router = express.Router();


/* New user */
router.get('/', function (req, res) {
  res.render('index');
});

router.get('/events', function (req, res) {
    events = {
        "balances": [
            {
                "date": "20/3/2016",
                "balance": 2683.59
            }
        ],
        "transactions": [
            {
                "name": "Salary",
                "amount": 1383.95,
                "occurs": "every second Tuesday"
            },
            {
                "name": "Bill: Electricity",
                "amount": -150.00,
                "occurs": "on the 26th of each month"
            },
            {
                "name": "Car Insurance",
                "amount": -30.00,
                "occurs": "every fortnight"
            },
            {
                "name": "Rent",
                "amount": -380.00,
                "occurs": "Every second thursday"
            },
            {
                "name": "Groceries",
                "amount": -120.00,
                "occurs": "every Sunday"
            },
            {
                "name": "Petrol",
                "amount": -40.00,
                "occurs": "every second Sunday"
            },
            {
                "name": "Bill: Cell-phone",
                "amount": -20.00,
                "occurs": "on the 24th of each month"
            },
            {
                "name": "Vehicle warrant of fitness",
                "amount": -55.00,
                "occurs": "on the 28th of every 9 months"
            },
            {
                "name": "Bill: Gym membership",
                "amount": -21.90,
                "occurs": "every fortnight"
            },
            {
                "name": "Weekend spending money",
                "amount": -100.00,
                "occurs": "every Friday"
            },
            {
                "name": "Christmas presents",
                "amount": -100.00,
                "occurs": "on the 18th of December"
            },
            {
                "name": "Partners birthday present",
                "amount": -200.00,
                "occurs": "on the 23rd of June"
            },
            {
                "name": "Unexpected expenses",
                "amount": -50.00,
                "occurs": "on Wednesday"
            },
            {
                "name": "Savings",
                "amount": -100.00,
                "occurs": "every second Wednesday"
            }
        ],
        "relative": []
    }
    res.send(events);
});

router.put('/events', function (req, res) {
  console.log("here, parsing...");
  var db = req.db;
  var collection = db.get('events');
  collection.insert(req.body, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    }
    else {
      console.log("it worked, redirecting to ");
      res.send(doc['_id']);
    }
  });
});

router.get('/:id', function (req, res) {
  res.render('index');
});

router.get('/:id/events', function (req, res) {
  var db = req.db;
  var collection = db.get('events');
  collection.findById(req.params.id, function (err, result){
    if (err) {
      res.send("There was a problem pulling information from the database.");
    }
    else {
      delete result['_id'];
      res.send(result);
    }
  });
});

router.put('/:id/events', function (req, res) {
  console.log("Received events");
  var db = req.db;
  var collection = db.get('events');
  collection.findAndModify(req.params.id, req.body, function (err, result){
    if (err) {
      res.send("There was a problem updating information in the database.");
    }
    else {
      res.send(req.body);
    }
  });
});


module.exports = router;
