// server.js

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// إعداد قاعدة البيانات
const db = new sqlite3.Database('./bookings.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the bookings database.');
});

// إنشاء جدول الحجوزات إذا لم يكن موجودًا
db.run(`CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  startTime TEXT,
  endTime TEXT,
  duration INTEGER,
  coordinatorName TEXT,
  mobileNumber TEXT,
  email TEXT,
  departmentName TEXT
)`);

// إعداد المجلد العام
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// معالجة طلب الحصول على الأوقات المتاحة
app.post('/getAvailableTimes', (req, res) => {
  const selectedDate = req.body.selectedDate;
  const selectedDuration = parseInt(req.body.selectedDuration);

  const startHour = 8; // بداية ساعات العمل
  const endHour = 17;  // نهاية ساعات العمل

  // الحصول على الحجوزات في التاريخ المحدد
  db.all(`SELECT * FROM bookings WHERE date = ?`, [selectedDate], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('حدث خطأ أثناء استعلام قاعدة البيانات.');
      return;
    }

    let times = [];

    for (let hour = startHour; hour <= endHour - selectedDuration; hour++) {
      let timeSlot = ("0" + hour).slice(-2) + ":00";
      if (isTimeSlotAvailable(timeSlot, selectedDuration, rows)) {
        times.push(timeSlot);
      }
    }

    res.json(times);
  });
});

// دالة للتحقق من توفر الوقت
function isTimeSlotAvailable(timeSlot, duration, bookings) {
  let [hours, minutes] = timeSlot.split(':').map(Number);
  let startTime = new Date();
  startTime.setHours(hours, minutes, 0, 0);
  let endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + duration);

  for (let booking of bookings) {
    let bookingStartTime = new Date();
    let [bHours, bMinutes] = booking.startTime.split(':').map(Number);
    bookingStartTime.setHours(bHours, bMinutes, 0, 0);

    let bookingEndTime = new Date();
    [bHours, bMinutes] = booking.endTime.split(':').map(Number);
    bookingEndTime.setHours(bHours, bMinutes, 0, 0);

    if ((startTime < bookingEndTime) && (endTime > bookingStartTime)) {
      return false;
    }
  }
  return true;
}

// معالجة إرسال النموذج
app.post('/submitForm', (req, res) => {
  const bookingData = req.body;

  const date = bookingData.meetingDate;
  const startTime = bookingData.meetingTime;
  const duration = parseInt(bookingData.duration);

  let [startHours, startMinutes] = startTime.split(':').map(Number);
  let endDate = new Date();
  endDate.setHours(startHours + duration, startMinutes, 0, 0);
  let endTime = ("0" + endDate.getHours()).slice(-2) + ":" + ("0" + endDate.getMinutes()).slice(-2);

  // التحقق من أن الوقت لا يزال متاحًا
  db.all(`SELECT * FROM bookings WHERE date = ?`, [date], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('حدث خطأ أثناء استعلام قاعدة البيانات.');
      return;
    }

    if (!isTimeSlotAvailable(startTime, duration, rows)) {
      res.status(400).send('الوقت المحدد لم يعد متاحًا. الرجاء اختيار وقت آخر.');
      return;
    }

    // إدخال الحجز في قاعدة البيانات
    db.run(`INSERT INTO bookings (date, startTime, endTime, duration, coordinatorName, mobileNumber, email, departmentName)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [date, startTime, endTime, duration, bookingData.coordinatorName, bookingData.mobileNumber, bookingData.email, bookingData.departmentName],
      function(err) {
        if (err) {
          console.error(err.message);
          res.status(500).send('حدث خطأ أثناء حفظ الحجز.');
          return;
        }
        res.send('تم الحجز بنجاح');
      }
    );
  });
});

// معالجة طلب عرض الحجوزات
app.get('/getBookings', (req, res) => {
  db.all(`SELECT * FROM bookings`, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('حدث خطأ أثناء استعلام قاعدة البيانات.');
      return;
    }
    res.json(rows);
  });
});

// بدء الخادم
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
