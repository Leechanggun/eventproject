var express = require('express');
var router = express.Router();
var catchErrors = require('../lib/async-error');
var User = require('../models/user');

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

function validateForm(form, options) {
  var name = form.name || "";
  var email = form.email || "";
  name = name.trim();
  email = email.trim();

  if (!name) {
    return 'Name is required.';
  }

  if (!email) {
    return 'Email is required.';
  }

  if (!form.password && options.needPassword) {
    return 'Password is required.';
  }

  if (form.password !== form.password_confirmation) {
    return 'Passsword do not match.';
  }

  if (form.password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return null;
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/new',catchErrors((req,res,next)=>{
  res.render('users/new');
}));

// 회원 가입 정보를 디비에 저장한다
// 에러 검사를 위해 catchErrors
router.post('/',catchErrors(async (req,res,next)=>{
  // 회원 가입 정보를 검사를 한다.
  var err = validateForm(req.body, {needPassword: true});
  // 예외처리를하고
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  var user = await User.findOne({email: req.body.email});
  // 이미 사용하고있는 사용자일 경우에도 에러처리를 한다.
  if (user) {
    req.flash('danger', 'Email address already exists.');
    return res.redirect('back');
  }
  user = new User({
    name : req.body.name,
    email : req.body.email,
  });
  console.log(user.name);
  user.password = await user.generateHash(req.body.password);
  // 새로운 사용자를 디비에 저장 한다
  await user.save();
  req.flash('success', 'Registered successfully. Please sign in.');
  // 홈 화면으로 리다이렉트 해준다~
  res.redirect('/');
}));
module.exports = router;




