const express = require('express');
const path = require('path');
const { createUser, verifyUser } = require('../models/users');
const { registerSchema, loginSchema } = require('../validators/schemas');
const validate = require('../middleware/validate');
const { requireAuth, requireGuest } = require('../middleware/auth');

const router = express.Router();

const images = [
  '/image/41500.jpg',
  '/image/41524.jpg',
  '/image/91657.jpg'
];

router.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'หน้าแรก',
    user: req.session.user || null,
    images,
  });
});

router.get('/login', requireGuest, (req, res) => {
  res.render('pages/login', {
    title: 'เข้าสู่ระบบ',
    error: null,
    form: {},
  });
});

router.post('/login', requireGuest, validate(loginSchema, {
  view: 'pages/login',
  title: 'เข้าสู่ระบบ',
}), (req, res) => {
  const user = verifyUser(req.body.email, req.body.password);

  if (!user) {
    return res.status(401).render('pages/login', {
      title: 'เข้าสู่ระบบ',
      error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      form: { email: req.body.email },
    });
  }

  req.session.user = user;
  res.redirect('/dashboard');
});

router.get('/register', requireGuest, (req, res) => {
  res.render('pages/register', {
    title: 'สมัครสมาชิก',
    error: null,
    form: {},
  });
});

router.post('/register', requireGuest, validate(registerSchema, {
  view: 'pages/register',
  title: 'สมัครสมาชิก',
}), (req, res) => {
  const result = createUser(req.body);

  if (result.error) {
    return res.status(409).render('pages/register', {
      title: 'สมัครสมาชิก',
      error: result.error,
      form: {
        name: req.body.name,
        email: req.body.email
      },
    });
  }

  req.session.user = result.user;
  res.redirect('/dashboard');
});

router.get('/dashboard', requireAuth, (req, res) => {
  res.render('pages/dashboard', {
    title: 'แดชบอร์ด',
    user: req.session.user,
  });
});

router.post('/logout', (req, res) => {
  req.destroySession();
  res.redirect('/');
});
module.exports = router;