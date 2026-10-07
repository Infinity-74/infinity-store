// ===== الإعدادات - غيّرها لو حبيت =====
var USERNAME = 'infinity';
var PASSWORD = 'Mo@112233';
var SHEET_ID = '1J9xcyEOjiVr4Z4sfbkclco8N6Ago2eAmjsqcv87vAvg';

// أسماء الأعمدة بالظبط زي ما هي في الشيت
var COL_ORDER_ID = 'Order ID';
var COL_STATUS   = 'Status';

// الحالات المسموح بيها
var ALLOWED_STATUSES = ['قيد المراجعة', 'قيد التجهيز', 'تم الشحن', 'تم التسليم', 'ملغي'];

// أقصى عدد طلبات مسموح بيها كل دقيقة لكل سكريبت
var MAX_ORDERS_PER_MINUTE = 20;

// الحد الأقصى لطول النصوص (لمنع السبام)
var MAX_NAME_LEN    = 100;
var MAX_PHONE_LEN   = 20;
var MAX_PRODUCT_LEN = 100;
var MAX_CITY_LEN    = 50;
var MAX_DETAILS_LEN = 1000;


// ===== لا تعدل تحت السطر ده إلا لو متأكد =====

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    // ---- Login ----
    if (action === 'login') {
      var ok = checkAuth(data.username, data.password);
      return respond(ok ? { success: true } : { success: false, error: 'اليوزر أو الباسورد غلط' });
    }

    // ---- addOrder (مفتوحة للعملاء - مع validation + rate limit) ----
    if (action === 'addOrder') {
      if (!checkRateLimit_()) {
        return respond({ success: false, error: 'في ضغط كبير دلوقتي، حاول تاني بعد شوية' });
      }

      var validation = validateOrder_(data.order);
      if (!validation.ok) {
        return respond({ success: false, error: validation.error });
      }

      var ok3 = addOrder(validation.order);
      return respond(ok3 ? { success: true } : { success: false, error: 'مقدرش أضيف الطلب' });
    }

    // ---- أي إجراء تاني لازم بيانات دخول صحيحة ----
    if (!checkAuth(data.username, data.password)) {
      return respond({ success: false, error: 'غير مصرح لك' });
    }

    if (action === 'getOrders') {
      return respond({ success: true, orders: getOrders(), statuses: ALLOWED_STATUSES });
    }

    if (action === 'updateStatus') {
      var statusCheck = validateStatus_(data.newStatus);
      if (!statusCheck.ok) {
        return respond({ success: false, error: statusCheck.error });
      }
      var ok2 = updateStatus(data.orderId, data.newStatus);
      return respond(ok2 ? { success: true } : { success: false, error: 'الطلب مش موجود' });
    }

    return respond({ success: false, error: 'إجراء غير معروف' });

  } catch (err) {
    return respond({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  var orderId = e.parameter && e.parameter.orderId;
  if (orderId) {
    var found = findOrder_(orderId);
    if (!found) {
      return respond({ found: false });
    }
    return respond({
      found: true,
      orderId: found['Order ID'],
      name: found['Name'],
      phone: found['Phone'],
      product: found['Product'],
      qty: found['Qty'],
      city: found['City'],
      status: found['Status']
    });
  }
  return ContentService.createTextOutput('Infinity Store API is running.');
}

// ============================================
// Validation helpers
// ============================================

// تنظيف النص من الرموز الخطيرة + تحديد الطول
function cleanText_(val, maxLen) {
  if (val === undefined || val === null) return '';
  var s = String(val).replace(/[\u0000-\u001F\u007F]/g, '').trim();
  if (s.length > maxLen) s = s.substring(0, maxLen);
  return s;
}

// التحقق من صحة رقم الموبايل المصري
function isValidPhone_(phone) {
  return /^01[0-2,5][0-9]{8}$/.test(phone);
}

// التحقق من رقم الطلب
function isValidOrderId_(orderId) {
  return /^INF-[A-Z0-9]{8}$/.test(orderId);
}

// التحقق من الطلب بالكامل
function validateOrder_(order) {
  if (!order || typeof order !== 'object') {
    return { ok: false, error: 'بيانات الطلب غير صحيحة' };
  }

  var orderId = cleanText_(order['Order ID'], 20);
  var name    = cleanText_(order['Name'], MAX_NAME_LEN);
  var phone   = cleanText_(order['Phone'], MAX_PHONE_LEN);
  var product = cleanText_(order['Product'], MAX_PRODUCT_LEN);
  var qty     = cleanText_(order['Qty'], 10);
  var city    = cleanText_(order['City'], MAX_CITY_LEN);
  var details = cleanText_(order['Details'], MAX_DETAILS_LEN);

  if (!isValidOrderId_(orderId)) {
    return { ok: false, error: 'رقم الطلب غير صحيح' };
  }
  if (!name || name.length < 2) {
    return { ok: false, error: 'الاسم غير صحيح' };
  }
  if (!isValidPhone_(phone)) {
    return { ok: false, error: 'رقم الموبايل غير صحيح' };
  }
  if (!product) {
    return { ok: false, error: 'المنتج مطلوب' };
  }
  var qtyNum = parseInt(qty, 10);
  if (isNaN(qtyNum) || qtyNum < 1 || qtyNum > 1000) {
    return { ok: false, error: 'الكمية غير صحيحة' };
  }
  if (!city) {
    return { ok: false, error: 'المحافظة مطلوبة' };
  }

  return {
    ok: true,
    order: {
      'Order ID': orderId,
      'Name': name,
      'Phone': phone,
      'Product': product,
      'Qty': qtyNum,
      'City': city,
      'Details': details,
      'Status': 'قيد المراجعة'
    }
  };
}

// التحقق من الحالة
function validateStatus_(status) {
  var s = cleanText_(status, 50);
  if (ALLOWED_STATUSES.indexOf(s) === -1) {
    return { ok: false, error: 'الحالة غير مسموح بيها' };
  }
  return { ok: true };
}

// ============================================
// Auth
// ============================================
function checkAuth(u, p) {
  return u === USERNAME && p === PASSWORD;
}

// ============================================
// Rate Limit (لكل سكريبت - مش لكل IP)
// ============================================
function checkRateLimit_() {
  var cache = CacheService.getScriptCache();
  var key = 'orders_' + Math.floor(Date.now() / 60000);
  var current = Number(cache.get(key) || '0');
  if (current >= MAX_ORDERS_PER_MINUTE) return false;
  cache.put(key, String(current + 1), 70);
  return true;
}

// ============================================
// Sheet helpers
// ============================================
function getSheet_() {
  return SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
}

function getOrders() {
  var sheet = getSheet_();
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers = data[0];
  var rows = data.slice(1);

  return rows
    .filter(function (row) { return row[0] !== '' && row[0] !== null; })
    .map(function (row, idx) {
      var obj = {};
      headers.forEach(function (h, i) {
        var val = row[i];
        if (val instanceof Date) {
          val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
        }
        obj[h] = val;
      });
      obj._row = idx + 2;
      return obj;
    });
}

function updateStatus(orderId, newStatus) {
  var sheet = getSheet_();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var orderIdCol = headers.indexOf(COL_ORDER_ID);
  var statusCol = headers.indexOf(COL_STATUS);

  if (orderIdCol === -1 || statusCol === -1) {
    throw new Error('اتأكد إن أسماء الأعمدة COL_ORDER_ID و COL_STATUS مطابقة لأسماء الأعمدة في الشيت');
  }

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][orderIdCol]) === String(orderId)) {
      sheet.getRange(i + 1, statusCol + 1).setValue(newStatus);
      return true;
    }
  }
  return false;
}

function addOrder(order) {
  if (!order) return false;

  // ---- استخدام LockService لمنع التسابق ----
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (e) {
    return false;
  }

  try {
    var sheet = getSheet_();
    var headers = sheet.getDataRange().getValues()[0];

    var row = headers.map(function (h) {
      if (h === 'وقت إنشاء الطلب') return new Date();
      if (h === COL_STATUS) return order[COL_STATUS] || 'قيد المراجعة';
      return (order[h] !== undefined && order[h] !== null) ? order[h] : '';
    });

    sheet.appendRow(row);
    return true;
  } finally {
    lock.releaseLock();
  }
}

function findOrder_(orderId) {
  var orders = getOrders();
  for (var i = 0; i < orders.length; i++) {
    if (String(orders[i][COL_ORDER_ID]) === String(orderId)) {
      return orders[i];
    }
  }
  return null;
}

// ============================================
// Response helper
// ============================================
function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}