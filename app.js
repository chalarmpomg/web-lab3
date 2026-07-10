const express = require('express');
const path = require('path');
const sessionMiddleware = require('./middleware/session');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionMiddleware);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(routes);

app.use((req, res) => {
  res.status(404).render('pages/error', {
    title: 'ไม่พบหน้า',
    message: 'ไม่พบหน้าที่คุณต้องการ',
    statusCode: 404,
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('pages/error', {
    title: 'เกิดข้อผิดพลาด',
    message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
    statusCode: 500,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
