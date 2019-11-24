module.exports = (app, passport, db) => {

    // normal routes ===============================================================
    
        // show the home page (will also have our login links)
        app.get('/', function(req, res) {
            res.render('index.ejs');
        });

        app.get('/orderList', isLoggedIn, function(req, res) {
            db.collection('orders').find().toArray((err, result) => {
              if (err) return console.log(err)
              console.table(result);
              res.render('orderList.ejs', {
                user : req.user,
                allOrders: result
              })
            })
        });

        app.post('/submitOrder', (req, res) => {
            db.collection('orders').save({customerName: req.body.customerName, customerOrder: req.body.customerOrder, completedBy: "", complete: false}, (error, result) => {
                if(error) {
                    return console.log(error);
                }
                console.log("saved to database");
                res.redirect('/');
            });
        });

        app.put('/complete', (req, res) => {
            db.collection('orders')
            .findOneAndUpdate({customerName: req.body.customerName, customerOrder: req.body.customerOrder }, {
              $set: {
                complete:true,
                completedBy: req.user.local.email
              }
            }, {
              sort: {_id: -1},
              upsert: true
            }, (err, result) => {
              if (err) return res.send(err)
              res.send(result)
            })
          })
    
        // LOGOUT ==============================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
    
    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================
    
        // locally --------------------------------
            // LOGIN ===============================
            // show the login form
            app.get('/baristaLogin', function(req, res) {
                res.render('baristaLogin.ejs', { message: req.flash('loginMessage') });
            });
    
            // process the login form
            app.post('/baristaLogin', passport.authenticate('local-login', {
                successRedirect : '/orderList', // redirect to the secure profile section
                failureRedirect : '/baristaLogin', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }));

             app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
    
            // SIGNUP =================================
            // show the signup form
            app.get('/signup', function(req, res) {
                res.render('signup.ejs', { message: req.flash('signupMessage') });
            });
    
            // process the signup form
            app.post('/signup', passport.authenticate('local-signup', {
                successRedirect : '/orderList', // redirect to the secure profile section
                failureRedirect : '/signup', // redirect back to the signup page if there is an error
                failureFlash : true // allow flash messages
            }));
    
    // route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
    
        res.redirect('/');
    }
    
}