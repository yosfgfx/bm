function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('طلب حجز قاعة اجتماعات قطاع الصحة الحيوانية');
}

function getAvailableTimes(selectedDate, selectedDuration) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Bookings');
  var data = sheet.getDataRange().getValues();
  var bookedIntervals = [];

  var selectedDurationHours = parseInt(selectedDuration);

  // تحويل مدة الاجتماع المطلوبة إلى دقائق
  var requestedDurationMinutes = selectedDurationHours * 60;

  // معالجة الحجوزات الحالية
  for (var i = 1; i < data.length; i++) {
    var date = data[i][2]; // تاريخ الاجتماع في العمود الثالث
    var time = data[i][3]; // وقت الاجتماع في العمود الرابع
    var duration = data[i][4]; // مدة الاجتماع في العمود الخامس

    if (date && time && duration) {
      var formattedDate = Utilities.formatDate(new Date(date), ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd');
      if (formattedDate == selectedDate) {
        // تحويل وقت البدء إلى دقائق منذ منتصف الليل
        var timeParts = time.split(':');
        var hours = parseInt(timeParts[0]);
        var minutes = parseInt(timeParts[1]);
        var startMinutes = hours * 60 + minutes;
        var durationMinutes = parseInt(duration) * 60;
        var endMinutes = startMinutes + durationMinutes;
        bookedIntervals.push({start: startMinutes, end: endMinutes});
      }
    }
  }

  // تحديد الأوقات المحتملة للبدء (من 8 صباحًا إلى 4 مساءً)
  var allTimes = [];
  for (var hour = 8; hour <= 16 - selectedDurationHours; hour++) {
    allTimes.push(hour * 60); // تحويل إلى دقائق منذ منتصف الليل
  }

  var availableTimes = [];

  for (var i = 0; i < allTimes.length; i++) {
    var proposedStart = allTimes[i];
    var proposedEnd = proposedStart + requestedDurationMinutes;

    // التحقق من أن الاجتماع لا ينتهي بعد 5 مساءً (17 * 60 دقيقة)
    if (proposedEnd > 17 * 60) {
      continue;
    }

    var conflict = false;
    for (var j = 0; j < bookedIntervals.length; j++) {
      var booked = bookedIntervals[j];
      // التحقق من تداخل الأوقات
      if ((proposedStart < booked.end) && (proposedEnd > booked.start)) {
        conflict = true;
        break;
      }
    }
    if (!conflict) {
      // تحويل الوقت المقترح إلى صيغة الوقت (24 ساعة)
      var hours = Math.floor(proposedStart / 60);
      var minutes = proposedStart % 60;
      var timeString = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);
      availableTimes.push(timeString);
    }
  }

  return availableTimes;
}

function submitForm(formObject) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Bookings');
  sheet.appendRow([
    new Date(),
    formObject.coordinatorName,
    formObject.mobileNumber,
    formObject.email,
    formObject.departmentName,
    formObject.meetingDate,
    formObject.duration,
    formObject.meetingTime
  ]);
  return 'تم تقديم طلب الحجز بنجاح!';
}
