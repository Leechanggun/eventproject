module.exports = (app, passport) => {
    
    
    app.get('/signin', (req, res, next) => {
      res.render('signin');
    });
    
    // local login
    app.post('/signin', passport.authenticate('local-signin', {
      successRedirect : '/', // redirect to the secure profile section
      failureRedirect : '/signin', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));
    
    // facebook login
    app.get('/auth/facebook',
      passport.authenticate('facebook', { scope : 'email' })
    );
  
    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
        failureRedirect : '/signin',
        failureFlash : true // allow flash messages
      }), (req, res, next) => {
        req.flash('success', 'Welcome!');
        res.redirect('/');
      }
    );

    // // // kakaotalk login 
    app.get('/auth/kakao', 
      passport.authenticate('kakao')
    );

    app.get('/auth/kakao/callback',
      passport.authenticate('kakao', {
        failureRedirect : '/signin',
        failureFlash : true // allow flash messages
      }), (req, res, next) => {
        req.flash('success', 'Welcome!');
        res.redirect('/');
      }
    );

    // logout
    app.get('/signout', (req, res) => {
      req.logout();
      req.flash('success', 'Successfully signed out');
      res.redirect('/');
    });
  };
  