const express = require('express');
const fs = require('fs');
const path = require('path');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason,
    fetchLatestBaileysVersion,
    downloadMediaMessage,
    Browsers,
    delay 
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const axios = require('axios');
const yts = require('yt-search');
const QRCode = require('qrcode');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { exec } = require('child_process');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let sock = null;

/* ============================================================
   🔥 RAHUL-AI-MINI — PREMIUM PAIRING & DOWNLOADER PORTAL
   ============================================================ */
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RAHUL-AI-MINI • Premium Pairing Portal by RAHUL-MASTER</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Plus Jakarta Sans', sans-serif;
                transition: background 0.4s ease, color 0.4s ease, border-color 0.4s ease;
            }

            body {
                color: var(--text-color);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 15px;
                overflow-x: hidden;
                position: relative;
                background: var(--bg-color);
            }

            :root {
                --bg-color: #030105;
                --container-bg: #07080c;
                --status-bg: #0b0c14;
                --input-bg: #030407;
                --text-color: #f1f5f9;
                --border-color: rgba(255, 255, 255, 0.1);
                --orb-1: rgba(255, 0, 80, 0.3);
                --orb-2: rgba(0, 120, 255, 0.3);
            }

            [data-theme="light"] {
                --bg-color: #f0f4f8;
                --container-bg: #ffffff;
                --status-bg: #e2e8f0;
                --input-bg: #f8fafc;
                --text-color: #0f172a;
                --border-color: rgba(0, 0, 0, 0.1);
                --orb-1: rgba(255, 0, 80, 0.15);
                --orb-2: rgba(0, 120, 255, 0.15);
            }

            .bg-lighting {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -2;
                background: 
                    radial-gradient(circle at 20% 30%, rgba(255, 0, 70, 0.55), transparent 40%),
                    radial-gradient(circle at 80% 70%, rgba(0, 120, 255, 0.55), transparent 40%),
                    radial-gradient(circle at 50% 50%, rgba(255, 0, 150, 0.3), transparent 60%);
                animation: ultraFastPulse 1.8s ease-in-out infinite alternate;
            }

            @keyframes ultraFastPulse {
                0% { transform: scale(1); filter: hue-rotate(0deg) brightness(0.9); }
                100% { transform: scale(1.25); filter: hue-rotate(60deg) brightness(1.4); }
            }

            .ambient-orb-1 {
                position: fixed;
                top: -10%;
                left: -10%;
                width: 50vw;
                height: 50vw;
                background: var(--orb-1);
                border-radius: 50%;
                filter: blur(80px);
                z-index: -2;
                animation: orbMove1 3s ease-in-out infinite alternate;
            }

            .ambient-orb-2 {
                position: fixed;
                bottom: -10%;
                right: -10%;
                width: 50vw;
                height: 50vw;
                background: var(--orb-2);
                border-radius: 50%;
                filter: blur(80px);
                z-index: -2;
                animation: orbMove2 3s ease-in-out infinite alternate;
            }

            @keyframes orbMove1 {
                0% { transform: translate(0, 0) scale(1); }
                100% { transform: translate(15vw, 15vh) scale(1.2); }
            }

            @keyframes orbMove2 {
                0% { transform: translate(0, 0) scale(1); }
                100% { transform: translate(-15vw, -15vh) scale(1.2); }
            }

            .bg-grid {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                background-image: 
                    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                background-size: 25px 25px;
            }

            .top-wrapper {
                width: 100%;
                max-width: 480px;
                display: flex;
                gap: 10px;
                margin-bottom: 18px;
                align-items: center;
            }

            .status-bar {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--status-bg);
                border: 1px solid rgba(0, 120, 255, 0.4);
                border-radius: 14px;
                padding: 10px 18px;
                font-size: 12px;
                color: #94a3b8;
                box-shadow: 0 0 20px rgba(0, 120, 255, 0.2);
            }

            .status-item {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .theme-toggle-btn {
                background: var(--status-bg);
                border: 1px solid rgba(255, 0, 76, 0.4);
                border-radius: 14px;
                width: 45px;
                height: 45px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                color: #ff004c;
                font-size: 18px;
                box-shadow: 0 0 15px rgba(255, 0, 76, 0.2);
            }

            .theme-toggle-btn:hover {
                transform: scale(1.1) rotate(15deg);
                background: rgba(255, 0, 76, 0.15);
            }

            .container {
                max-width: 480px;
                width: 100%;
                background: var(--container-bg);
                border-radius: 24px;
                padding: 28px;
                position: relative;
                z-index: 1;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.95);
                border: 1px solid var(--border-color);
                animation: smoothContainerFloat 4s ease-in-out infinite alternate;
            }

            @keyframes smoothContainerFloat {
                0% { transform: translateY(0); }
                100% { transform: translateY(-5px); }
            }

            .header {
                text-align: center;
                margin-bottom: 22px;
            }

            .header h1 {
                font-size: 20px;
                font-weight: 800;
                background: linear-gradient(135deg, #ff004c, #0080ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 6px;
            }

            .header p {
                font-size: 12px;
                color: #64748b;
            }

            .input-group {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
                background: var(--input-bg);
                border: 1px solid var(--border-color);
                border-radius: 14px;
                padding: 6px;
                transition: all 0.3s ease;
            }

            .input-group:focus-within {
                border-color: #ff004c;
                box-shadow: 0 0 15px rgba(255, 0, 76, 0.4);
            }

            .input-group input {
                flex: 1;
                background: transparent;
                border: none;
                padding: 12px 14px;
                color: var(--text-color);
                font-size: 14px;
                outline: none;
            }

            .input-group input::placeholder {
                color: #64748b;
            }

            .btn-main {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #ff004c, #0080ff);
                border: none;
                border-radius: 14px;
                color: #fff;
                font-weight: 700;
                font-size: 14px;
                letter-spacing: 1px;
                cursor: pointer;
                box-shadow: 0 0 20px rgba(255, 0, 76, 0.3);
                transition: all 0.3s ease;
            }

            .btn-main:hover {
                transform: translateY(-2px);
                box-shadow: 0 0 30px rgba(0, 128, 255, 0.5);
            }

            .code-box {
                margin-top: 20px;
                padding: 18px;
                background: var(--input-bg);
                border-radius: 16px;
                border: 1.5px dashed #ff004c;
                display: none;
                text-align: center;
            }

            .code-box .label {
                font-size: 11px;
                letter-spacing: 3px;
                color: #ff004c;
                font-weight: 600;
                margin-bottom: 8px;
                text-transform: uppercase;
            }

            .code-box h2 {
                font-size: 28px;
                letter-spacing: 6px;
                color: #0080ff;
                text-shadow: 0 0 15px rgba(0, 128, 255, 0.5);
            }

            .owner-footer {
                text-align: center;
                margin-top: 20px;
                padding-top: 16px;
                border-top: 1px solid var(--border-color);
            }

            .whatsapp-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: linear-gradient(135deg, #25d366, #128c7e);
                color: #fff;
                padding: 10px 22px;
                border-radius: 30px;
                text-decoration: none;
                font-size: 12px;
                font-weight: 600;
                transition: all 0.3s ease;
                margin-bottom: 6px;
            }

            .whatsapp-btn:hover {
                transform: scale(1.05);
            }
        </style>
    </head>
    <body>
        <div class="bg-lighting"></div>
        <div class="ambient-orb-1"></div>
        <div class="ambient-orb-2"></div>
        <div class="bg-grid"></div>

        <div class="top-wrapper">
            <div class="status-bar">
                <div class="status-item" id="liveTime"><i class="fa-regular fa-clock" style="color: #ff004c;"></i> --:-- --</div>
                <div class="status-item" id="liveDate"><i class="fa-regular fa-calendar-days" style="color: #0080ff;"></i> --/--/----</div>
                <div class="status-item" id="batteryStatus"><i class="fa-solid fa-battery-half" style="color: #10b981;"></i> --%</div>
            </div>
            <button class="theme-toggle-btn" id="themeBtn" onclick="toggleTheme()" title="Toggle Dark/Light Mode">
                <i class="fa-solid fa-moon" id="themeIcon"></i>
            </button>
        </div>

        <div class="container">
            <div class="header">
                <h1>RAHUL-AI-MINI • RAHUL-MASTER</h1>
                <p>Enter any WhatsApp number to get pairing code instantly</p>
            </div>

            <div class="input-group">
                <input type="text" id="phone" value="919356730236" placeholder="e.g. 919356730236">
            </div>

            <button class="btn-main" onclick="getPairingCode()">
                <i class="fa-solid fa-bolt"></i> GET PAIRING CODE
            </button>

            <div class="code-box" id="codeContainer">
                <div class="label">Your Pairing Code</div>
                <h2 id="pairCode">-----</h2>
            </div>

            <div class="owner-footer">
                <a href="https://marginal-angele-rahulhiran440-29ef7028.koyeb.app/" class="whatsapp-btn" target="_blank" style="background: linear-gradient(135deg, #ff004c, #0080ff);">
                    <i class="fa-solid fa-globe"></i> Visit Official Repo Portal
                </a><br>
                <a href="https://wa.me/919356730236?text=Hello%20RAHUL%20MASTER,%20I%20need%20help%20with%20RAHUL-AI-MINI!" class="whatsapp-btn" target="_blank">
                    <i class="fa-brands fa-whatsapp" style="font-size: 15px;"></i> Contact RAHUL-MASTER on WhatsApp
                </a>
            </div>
        </div>

        <script>
            function toggleTheme() {
                const html = document.documentElement;
                const themeIcon = document.getElementById('themeIcon');
                if (html.getAttribute('data-theme') === 'light') {
                    html.removeAttribute('data-theme');
                    themeIcon.className = "fa-solid fa-moon";
                } else {
                    html.setAttribute('data-theme', 'light');
                    themeIcon.className = "fa-solid fa-sun";
                }
            }

            function updateClock() {
                const now = new Date();
                let hours = now.getHours();
                let minutes = String(now.getMinutes()).padStart(2, '0');
                let ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
                document.getElementById('liveTime').innerHTML = \`<i class="fa-regular fa-clock" style="color: #ff004c;"></i> \${hours}:\${minutes} \${ampm}\`;
                
                const options = { day: 'numeric', month: 'short' };
                document.getElementById('liveDate').innerHTML = \`<i class="fa-regular fa-calendar-days" style="color: #0080ff;"></i> \${now.toLocaleDateString('en-US', options)}\`;
            }
            setInterval(updateClock, 1000);
            updateClock();

            async function initBattery() {
                if ('getBattery' in navigator) {
                    try {
                        const battery = await navigator.getBattery();
                        function updateBatteryInfo() {
                            const level = Math.floor(battery.level * 100);
                            const isCharging = battery.charging;
                            let iconClass = "fa-battery-full";
                            let iconColor = "#10b981";
                            if (level <= 20) { iconClass = "fa-battery-empty"; iconColor = "#ef4444"; }
                            else if (level <= 50) { iconClass = "fa-battery-half"; iconColor = "#f59e0b"; }

                            if (isCharging) {
                                document.getElementById('batteryStatus').innerHTML = \`<i class="fa-solid fa-bolt" style="color: #ff004c;"></i> \${level}%\`;
                            } else {
                                document.getElementById('batteryStatus').innerHTML = \`<i class="fa-solid \${iconClass}" style="color: \${iconColor};"></i> \${level}%\`;
                            }
                        }
                        updateBatteryInfo();
                        battery.addEventListener('levelchange', updateBatteryInfo);
                        battery.addEventListener('chargingchange', updateBatteryInfo);
                    } catch (e) {
                        document.getElementById('batteryStatus').innerHTML = \`<i class="fa-solid fa-battery-bolt" style="color: #ff004c;"></i> 100%\`;
                    }
                } else {
                    document.getElementById('batteryStatus').innerHTML = \`<i class="fa-solid fa-battery-bolt" style="color: #ff004c;"></i> 100%\`;
                }
            }
            initBattery();

            async function getPairingCode() {
                const phone = document.getElementById('phone').value.trim();
                if(!phone) return alert('Please enter phone number');
                const btn = document.querySelector('.btn-main');
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> GENERATING...';
                btn.disabled = true;

                try {
                    const res = await fetch('/pair?number=' + phone);
                    const data = await res.json();
                    if(data.code) {
                        document.getElementById('codeContainer').style.display = 'block';
                        document.getElementById('pairCode').innerText = data.code;
                    } else {
                        alert(data.error || 'Failed to get code.');
                    }
                } catch(e) {
                    alert('Error connecting to server');
                }
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }
        </script>
    </body>
    </html>
    `);
});

// Fully fixed instant pair endpoint that resets session & generates code instantly
app.get('/pair', async (req, res) => {
    let phone = req.query.number || '919356730236';
    let cleanedNumber = phone.replace(/[^0-9]/g, '');

    try {
        if (sock) {
            try { await sock.logout(); } catch (e) {}
            try { sock.end(undefined); } catch (e) {}
            sock = null;
        }

        const authDir = await getPersistentAuthDir();
        if (fs.existsSync(authDir)) {
            fs.rmSync(authDir, { recursive: true, force: true });
        }
        fs.mkdirSync(authDir, { recursive: true });

        await connectToWhatsApp();

        let retries = 16;
        while ((!sock || !sock.requestPairingCode) && retries > 0) {
            await delay(500);
            retries--;
        }

        if (!sock || !sock.requestPairingCode) {
            return res.json({ error: 'Socket warming up. Please click Get Pairing Code again in 3 seconds.' });
        }

        await delay(2000);
        let code = await sock.requestPairingCode(cleanedNumber);
        return res.json({ code: code, status: 'Success' });
    } catch (err) {
        console.error("Pairing Code Generation Error:", err);
        return res.json({ error: 'Pairing Error: ' + err.message + '. Please retry.' });
    }
});

app.listen(PORT, () => {
    console.log(`🌐 RAHUL AI MINI Web Server running on port ${PORT}`);
});

/* ============================================================
   ⚙️ BOT SETTINGS & CUSTOM COMMAND STORAGE (JSON BASED)
   ============================================================ */
const startTime = Date.now();
let isAlwaysOnline = String(process.env.ALWAYS_ONLINE || 'true').toLowerCase() === 'true';
let isAutoStatusView = true;
let isAutoReact = true;
let isAutoDL = true;
let isAutoVoice = false;
let BOT_MODE = 'public'; // 'public' or 'private'
let PREFIX = '.';
let MENU_STYLE = 'big';
let customReactEmoji = '❤️';
const OFFICIAL_REPO = 'https://marginal-angele-rahulhiran440-29ef7028.koyeb.app/';

// Custom Command Store File
const customCmdFile = path.resolve('custom_cmds.json');
let customCommands = {};
if (fs.existsSync(customCmdFile)) {
    try {
        customCommands = JSON.parse(fs.readFileSync(customCmdFile, 'utf8'));
    } catch (e) {
        customCommands = {};
    }
}
function saveCustomCommands() {
    try {
        fs.writeFileSync(customCmdFile, JSON.stringify(customCommands, null, 2));
    } catch (e) {}
}

let presenceHeartbeat = null;
function syncAlwaysOnlineHeartbeat() {
    if (presenceHeartbeat) {
        clearInterval(presenceHeartbeat);
        presenceHeartbeat = null;
    }
    if (isAlwaysOnline) {
        presenceHeartbeat = setInterval(async () => {
            try {
                if (sock?.user) await sock.sendPresenceUpdate('available');
            } catch (err) {
                console.error('Always-online heartbeat error:', err.message);
            }
        }, 25000);
        presenceHeartbeat.unref?.();
    }
}

// 24x7 Automatic Background Git Pull Updater every 5 minutes
setInterval(() => {
    exec('git pull', (err, stdout, stderr) => {
        if (!err && stdout && !stdout.includes('Already up to date')) {
            console.log('🔄 Auto-update detected new GitHub commits. Restarting process...');
            setTimeout(() => process.exit(0), 3000);
        }
    });
}, 5 * 60 * 1000);

async function getFastVideoUrl(url) {
    const encodedUrl = encodeURIComponent(url);
    try {
        const res1 = await axios.get(`https://api.tinew.tech/api/downloader/fbdl?url=${encodedUrl}`, { timeout: 10000 });
        if (res1.data?.result?.hd || res1.data?.result?.sd) return res1.data.result.hd || res1.data.result.sd;
    } catch(e) {}
    try {
        const res2 = await axios.get(`https://api.dreaded.site/api/fbdl?url=${encodedUrl}`, { timeout: 10000 });
        if (res2.data?.data?.hd || res2.data?.data?.sd || res2.data?.data?.url) return res2.data.data.hd || res2.data.data.sd || res2.data.data.url;
    } catch(e) {}
    try {
        const res3 = await axios.get(`https://api.siputzx.my.id/api/d/facebook?url=${encodedUrl}`, { timeout: 10000 });
        if (res3.data?.data?.video || res3.data?.data?.hd || res3.data?.data?.sd) return res3.data.data.video || res3.data.data.hd || res3.data.data.sd;
    } catch(e) {}
    try {
        const res4 = await axios.get(`https://api.vreden.web.id/api/download/fbdl?url=${encodedUrl}`, { timeout: 10000 });
        const link = res4.data?.result?.response?.video_hd || res4.data?.result?.response?.video_sd;
        if (link) return link;
    } catch(e) {}
    return null;
}

let reconnectTimer = null;
let isConnecting = false;

async function getPersistentAuthDir() {
    const localDir = path.resolve('session');
    const volumeDir = '/data';
    if (fs.existsSync(volumeDir)) {
        const persistentDir = path.join(volumeDir, 'session');
        fs.mkdirSync(persistentDir, { recursive: true });
        const hasPersistentFiles = fs.existsSync(persistentDir) &&
            fs.readdirSync(persistentDir).some(name => name.endsWith('.json'));
        if (!hasPersistentFiles && fs.existsSync(localDir)) {
            fs.cpSync(localDir, persistentDir, { recursive: true, force: false, errorOnExist: false });
            console.log('📦 Migrated existing WhatsApp session to persistent volume.');
        }
        return persistentDir;
    }
    return localDir;
}

async function connectToWhatsApp() {
    if (isConnecting) return;
    isConnecting = true;
    try {
    const authDir = await getPersistentAuthDir();
    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: Browsers.ubuntu("Chrome")
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.log('⚠️ Connection closed. Status:', statusCode, 'Reconnecting:', shouldReconnect);
            if (shouldReconnect && !reconnectTimer) {
                reconnectTimer = setTimeout(() => {
                    reconnectTimer = null;
                    connectToWhatsApp().catch(err => console.error('Reconnect error:', err.message));
                }, 3000);
            }
        } else if (connection === 'open') {
            console.log('\n==================================================');
            console.log('✅ RAHUL MINI IS ONLINE & CONNECTED SUCCESSFULLY!');
            console.log('==================================================\n');
            syncAlwaysOnlineHeartbeat();
            try {
                const userJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                const startMessage = 
`🔴 *RAHUL-AI-MINI CONNECTED SUCCESSFULLY!* ⚡

👨‍💻 *Developer & Owner:* RAHUL-MASTER
📌 *Prefix:* [ \`${PREFIX === 'none' ? 'NO PREFIX' : PREFIX}\` ]
🌐 *Portal/Repo:* ${OFFICIAL_REPO}
🎨 *Menu Style:* ${MENU_STYLE}
🔒 *Bot Mode:* ${BOT_MODE.toUpperCase()}
⚡ *Status:* Online & Ready 24/7
🟢 *Always Online:* ${isAlwaysOnline ? 'ON' : 'OFF'}
👀 *Auto Status View:* ${isAutoStatusView ? 'ON' : 'OFF'}

💡 *Try typing:* \`${PREFIX === 'none' ? 'menu' : PREFIX + 'menu'}\` or \`${PREFIX === 'none' ? 'ping' : PREFIX + 'ping'}\` to test!`;

                await sock.sendMessage(userJid, { text: startMessage });
            } catch (err) {
                console.error("Start Message Send Error:", err);
            }
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        try {
            const msg = m.messages[0];
            if (!msg.message) return;

            const from = msg.key.remoteJid;
            const sender = msg.key.participant || from;
            const isOwner = msg.key.fromMe || sender.includes('919356730236');
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || '';

            if (isAutoReact && !msg.key.fromMe && from !== 'status@broadcast') {
                const emojis = [customReactEmoji, '❤️', '🔥', '⚡', '🤖', '👍', '⭐', '✨'];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                await sock.sendMessage(from, { react: { text: randomEmoji, key: msg.key } });
            }

            if (isAlwaysOnline && from) {
                await sock.sendPresenceUpdate('available', from);
            }

            if (msg.key.remoteJid === 'status@broadcast') {
                if (isAutoStatusView) await sock.readMessages([msg.key]);
                return;
            }

            // Auto-voice greeting reply for hi, hello, good morning, good night (Cute girl voice / audio reply simulation or note)
            if (isAutoVoice && !msg.key.fromMe && from !== 'status@broadcast') {
                const lowerText = text.trim().toLowerCase();
                const greetings = ['hi', 'hello', 'hey', 'good morning', 'good night'];
                if (greetings.includes(lowerText)) {
                    try {
                        // Send cute audio greeting response
                        const voiceUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Cute simulated audio track
                        await sock.sendMessage(from, {
                            audio: { url: voiceUrl },
                            mimetype: 'audio/mp4',
                            ptt: true,
                            caption: `🎙️ *Cute Girl Audio Reply for "${text}"*`
                        }, { quoted: msg });
                    } catch (e) {}
                }
            }

            if (isAutoDL && (PREFIX === 'none' || !text.startsWith(PREFIX))) {
                const urlMatch = text.match(/(https?:\/\/[^\s]+)/g);
                if (urlMatch) {
                    const url = urlMatch[0];
                    if (url.includes('instagram.com')) {
                        try {
                            await sock.sendMessage(from, { text: '📸 *Instagram AutoDL:* Downloading media...' }, { quoted: msg });
                            const res = await axios.get(`https://api.sayan-nexuswork.workers.dev/insta?url=${encodeURIComponent(url)}`, { timeout: 30000 });
                            const data = res.data;
                            const mediaUrl = data?.url || data?.urls?.[0];
                            if (data?.status === 'success' && mediaUrl) {
                                if (data.type === 'image' || /\.jpe?g(\?|$)/i.test(mediaUrl) || /\.png(\?|$)/i.test(mediaUrl)) await sock.sendMessage(from, { image: { url: mediaUrl }, caption: '👑 RAHUL-MASTER Insta DL' }, { quoted: msg });
                                else await sock.sendMessage(from, { video: { url: mediaUrl }, caption: '👑 RAHUL-MASTER Insta DL' }, { quoted: msg });
                                return;
                            }
                        } catch (e) { console.error('Instagram AutoDL error:', e.message); }
                    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
                        try {
                            await sock.sendMessage(from, { text: '🎬 *YouTube AutoDL:* Downloading video...' }, { quoted: msg });
                            const res = await axios.get(`https://api.sayan-nexuswork.workers.dev/video?query=${encodeURIComponent(url)}`, { timeout: 30000 });
                            const data = res.data;
                            if (data?.status === 'success' && data?.url) {
                                await sock.sendMessage(from, { video: { url: data.url }, caption: `🎬 *${data.title || 'VFX MINI Video'}*\n🎞️ Quality: ${data.quality || 'MP4'}\n👑 RAHUL-MASTER` }, { quoted: msg });
                                return;
                            }
                        } catch (e) { console.error('YouTube AutoDL error:', e.message); }
                    } else if (url.includes('facebook.com') || url.includes('fb.watch') || url.includes('tiktok.com')) {
                        await sock.sendMessage(from, { text: '🚀 *Fast AutoDL:* Downloading video...' }, { quoted: msg });
                        const videoUrl = await getFastVideoUrl(url);
                        if (videoUrl) {
                            await sock.sendMessage(from, { video: { url: videoUrl }, caption: '⚡ *RAHUL AI MINI Fast AutoDL Success!*' }, { quoted: msg });
                            return;
                        }
                    }
                }
            }

            const isGroup = from.endsWith('@g.us');
            let isCmd = false;
            let body = '';
            
            if (PREFIX === 'none') {
                isCmd = true;
                body = text.trim();
            } else {
                isCmd = text.startsWith(PREFIX);
                body = isCmd ? text.slice(PREFIX.length).trim() : text.trim();
            }

            const command = body.toLowerCase().split(' ')[0];
            const args = body.split(' ').slice(1).join(' ');

            // Check BOT_MODE (If private, only owner can execute commands)
            if (isCmd && BOT_MODE === 'private' && !isOwner) {
                return await sock.sendMessage(from, { text: '🔒 *Bot is currently in PRIVATE MODE.* Only RAHUL-MASTER can use commands.' }, { quoted: msg });
            }

            // Expanded Status Reply handler for keywords: send, sent, sendme, de, ye, pathva, dakhva, etc.
            const contextInfo = msg.message.extendedTextMessage?.contextInfo;
            if (contextInfo?.quotedMessage) {
                const quotedMsg = contextInfo.quotedMessage;
                const isStatusReply = contextInfo.remoteJid === 'status@broadcast';
                const triggerWords = ['send', 'sent', 'sendme', 'dya', 'pathva', 'dakhva', 'sənd', 'पाठव', 'दे', 'ye'];
                const userText = text.trim().toLowerCase();

                if (isStatusReply && triggerWords.some(word => userText.includes(word))) {
                    await sock.sendMessage(from, { text: '⏳ Status download karat aahe...' }, { quoted: msg });
                    try {
                        const mediaBuffer = await downloadMediaMessage(
                            { message: quotedMsg }, 'buffer', {}
                        );
                        if (quotedMsg.videoMessage) {
                            await sock.sendMessage(from, {
                                video: mediaBuffer,
                                caption: quotedMsg.videoMessage.caption || '🎬 *Here is your status video!* 👑 RAHUL-MASTER',
                                mimetype: 'video/mp4'
                            }, { quoted: msg });
                        } else if (quotedMsg.imageMessage) {
                            await sock.sendMessage(from, {
                                image: mediaBuffer,
                                caption: quotedMsg.imageMessage.caption || '🖼️ *Here is your status image!* 👑 RAHUL-MASTER'
                            }, { quoted: msg });
                        }
                    } catch (err) {
                        console.error('Status Send Error:', err);
                        await sock.sendMessage(from, { text: '❌ Status download karun pathvnyat adchan aali.' }, { quoted: msg });
                    }
                }
            }

            // Check Custom Commands created via setcmd
            if (customCommands[command]) {
                await sock.sendMessage(from, { text: `${customCommands[command]}\n\n👑 *By RAHUL-MASTER*` }, { quoted: msg });
                return;
            }

            if (!isCmd && command !== 'ping' && command !== 'menu') return;

            if (command === 'setcmd' || command === 'addcmd') {
                if (!isOwner) return await sock.sendMessage(from, { text: '❌ Only RAHUL-MASTER can add custom commands!' }, { quoted: msg });
                const parts = args.split('|');
                if (parts.length < 2) {
                    return await sock.sendMessage(from, { text: `❌ Format chuka aahe!\n\n📌 *Usage:* \`${PREFIX === 'none' ? '' : PREFIX}setcmd <command> | <response text>\`` }, { quoted: msg });
                }
                const cmdName = parts[0].trim().toLowerCase();
                const cmdResp = parts.slice(1).join('|').trim();
                customCommands[cmdName] = cmdResp;
                saveCustomCommands();
                await sock.sendMessage(from, { text: `✅ *Custom Command Added Successfully!*\n\n📌 *Command:* \`${PREFIX === 'none' ? '' : PREFIX}${cmdName}\`\n💬 *Response:* ${cmdResp}` }, { quoted: msg });
            }
            else if (command === 'delcmd' || command === 'removecmd') {
                if (!isOwner) return await sock.sendMessage(from, { text: '❌ Only RAHUL-MASTER can remove custom commands!' }, { quoted: msg });
                const targetCmd = args.trim().toLowerCase();
                if (!customCommands[targetCmd]) {
                    return await sock.sendMessage(from, { text: `❌ Custom command "${targetCmd}" sapadli nahi.` }, { quoted: msg });
                }
                delete customCommands[targetCmd];
                saveCustomCommands();
                await sock.sendMessage(from, { text: `✅ Custom command "${targetCmd}" successfully delete keli!` }, { quoted: msg });
            }
            else if (command === 'channelreact' || command === 'fakecount' || command === 'reactcount') {
                const counts = ['1M', '2M', '5M', '10M', '999K', '500K'];
                const randomCount = counts[Math.floor(Math.random() * counts.length)];
                await sock.sendMessage(from, { text: `🌟 *Channel Fake React Status*\n\n🔥 React Count Generated: *${randomCount}* ❤️\n👑 *By RAHUL-MASTER*` }, { quoted: msg });
            }
            else if (command === 'mode') {
                if (!isOwner) return await sock.sendMessage(from, { text: '❌ Only RAHUL-MASTER can change bot mode!' }, { quoted: msg });
                const modeArg = args.toLowerCase().trim();
                if (modeArg === 'public' || modeArg === 'on') {
                    BOT_MODE = 'public';
                    await sock.sendMessage(from, { text: '🌐 *Bot Mode is now PUBLIC! Everyone can use commands.*' }, { quoted: msg });
                } else if (modeArg === 'private' || modeArg === 'off') {
                    BOT_MODE = 'private';
                    await sock.sendMessage(from, { text: '🔒 *Bot Mode is now PRIVATE! Only owner can use commands.*' }, { quoted: msg });
                } else {
                    await sock.sendMessage(from, { text: `⚙️ *Current Bot Mode:* \`${BOT_MODE.toUpperCase()}\`\n\n📌 *Usage:* \`${PREFIX === 'none' ? '' : PREFIX}mode public\` or \`${PREFIX === 'none' ? '' : PREFIX}mode private\`` }, { quoted: msg });
                }
            }
            else if (command === 'setmenustyle' || command === 'menustyle' || command === 'menuthemesetting') {
                const styles = ['long', 'small', 'big', 'normal', 'cyberpunk', 'neon', 'minimalist', 'hacker', 'neonbox', 'modern', 'default', 'profile', 'small2', 'big2', 'profile2'];
                const selected = args.toLowerCase().trim();
                if (!styles.includes(selected)) {
                    return await sock.sendMessage(from, { 
                        text: `🎨 *AVAILABLE MENU STYLES & THEMES (15)*\n\n1. \`big\` (Default Big Image)\n2. \`small\`\n3. \`normal\`\n4. \`profile\`\n5. \`small2\`\n6. \`big2\`\n7. \`profile2\`\n8. \`cyberpunk\`\n9. \`neon\`\n10. \`minimalist\`\n11. \`hacker\`\n12. \`neonbox\`\n13. \`modern\`\n\n📌 *Usage:* \`${PREFIX === 'none' ? '' : PREFIX}setmenustyle cyberpunk\`\n⚙️ *Current Style:* \`${MENU_STYLE}\`` 
                    }, { quoted: msg });
                }
                MENU_STYLE = selected;
                await sock.sendMessage(from, { text: `✅ *Menu Style successfully updated to:* \`${MENU_STYLE}\`` }, { quoted: msg });
            }
            else if (command === 'tourl' || command === 'upload') {
                const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
                const isMedia = msg.message.imageMessage || msg.message.videoMessage || msg.message.documentMessage || quoted?.imageMessage || quoted?.videoMessage || quoted?.documentMessage;
                if (!isMedia) return await sock.sendMessage(from, { text: `❌ Please reply to any photo or video with \`${PREFIX === 'none' ? '' : PREFIX}tourl\`!` }, { quoted: msg });
                await sock.sendMessage(from, { text: '📤 *Uploading media to server (multi-API backup), please wait...*' }, { quoted: msg });
                try {
                    const mediaBuffer = await downloadMediaMessage(
                        quoted ? { message: quoted } : msg, 'buffer', {}
                    );
                    
                    let fileUrl = null;
                    try {
                        const form = new FormData();
                        form.append('file', mediaBuffer, { filename: 'rahul-ai.jpg', contentType: 'image/jpeg' });
                        const uploadRes = await axios.post('https://itzpire.com/tools/tourl', form, {
                            headers: { ...form.getHeaders() },
                            timeout: 20000
                        });
                        fileUrl = uploadRes.data?.url || uploadRes.data?.result;
                    } catch (e1) {}

                    if (!fileUrl) {
                        try {
                            const form2 = new FormData();
                            form2.append('file', mediaBuffer, { filename: 'rahul.jpg' });
                            const uploadRes2 = await axios.post('https://api.siputzx.my.id/api/upload', form2, {
                                headers: { ...form2.getHeaders() },
                                timeout: 20000
                            });
                            fileUrl = uploadRes2.data?.data?.url || uploadRes2.data?.url;
                        } catch (e2) {}
                    }

                    if (!fileUrl) {
                        try {
                            const form3 = new FormData();
                            form3.append('file', mediaBuffer, { filename: 'file.png' });
                            const uploadRes3 = await axios.post('https://btch.caliph.biz/api/upload', form3, {
                                headers: { ...form3.getHeaders() },
                                timeout: 20000
                            });
                            fileUrl = uploadRes3.data?.result?.url || uploadRes3.data?.url;
                        } catch(e3) {}
                    }

                    if (fileUrl) {
                        await sock.sendMessage(from, { text: `🔗 *MEDIA UPLOADED SUCCESSFULLY!*\n\n📌 *URL:* ${fileUrl}\n👑 *RAHUL-MASTER*` }, { quoted: msg });
                    } else {
                        throw new Error('All backup upload APIs returned error or timed out.');
                    }
                } catch (e) {
                    await sock.sendMessage(from, { text: '❌ Tourl failed: ' + e.message }, { quoted: msg });
                }
            }
            else if (command === 'tomp3' || command === 'toaudio') {
                const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
                const isVideoMsg = msg.message.videoMessage || quoted?.videoMessage;
                if (!isVideoMsg) return await sock.sendMessage(from, { text: `❌ Please reply to any video with \`${PREFIX === 'none' ? '' : PREFIX}tomp3\` to convert it into an audio file!` }, { quoted: msg });
                await sock.sendMessage(from, { text: '🎵 *Extracting audio from video, please wait...*' }, { quoted: msg });
                try {
                    const mediaBuffer = await downloadMediaMessage(
                        quoted ? { message: quoted } : msg, 'buffer', {}
                    );
                    await sock.sendMessage(from, {
                        audio: mediaBuffer,
                        mimetype: 'audio/mpeg',
                        fileName: 'rahul-ai-audio.mp3',
                        ptt: false
                    }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: '❌ Video to MP3 conversion failed.' }, { quoted: msg });
                }
            }
            else if (command === 'autovoice') {
                if (args.toLowerCase() === 'on') {
                    isAutoVoice = true;
                    await sock.sendMessage(from, { text: '🎙️ *Auto Voice Reply is now ACTIVATED!*' }, { quoted: msg });
                } else if (args.toLowerCase() === 'off') {
                    isAutoVoice = false;
                    await sock.sendMessage(from, { text: '🎙️ *Auto Voice Reply is now DEACTIVATED!*' }, { quoted: msg });
                } else {
                    await sock.sendMessage(from, { text: `🎙️ *Auto Voice Status:* ${isAutoVoice ? 'ON' : 'OFF'}\nUse: \`${PREFIX === 'none' ? '' : PREFIX}autovoice on/off\`` }, { quoted: msg });
                }
            }
            else if (command === 'ptt' || command === 'voicemail') {
                const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
                const audioMsg = msg.message.audioMessage || quoted?.audioMessage;
                if (audioMsg) {
                    const mediaBuffer = await downloadMediaMessage(
                        quoted ? { message: quoted } : msg, 'buffer', {}
                    );
                    await sock.sendMessage(from, { audio: mediaBuffer, mimetype: 'audio/mp4', ptt: true }, { quoted: msg });
                } else {
                    await sock.sendMessage(from, { text: `❌ Please reply to any audio or voice note with \`${PREFIX === 'none' ? '' : PREFIX}ptt\`!` }, { quoted: msg });
                }
            }
            else if (command === 'tts' || command === 'speak') {
                if (!args) return await sock.sendMessage(from, { text: `❌ Text taka! e.g. \`${PREFIX === 'none' ? '' : PREFIX}tts Hello Rahul Master\`` }, { quoted: msg });
                try {
                    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(args)}&tl=en&client=tw-ob`;
                    await sock.sendMessage(from, { audio: { url: ttsUrl }, mimetype: 'audio/mp4', ptt: true }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: '❌ TTS generation failed.' }, { quoted: msg });
                }
            }
            else if (command === 'img' || command === 'image' || command === 'aiimg') {
                if (!args) return await sock.sendMessage(from, { text: `❌ Image description taka! e.g. \`${PREFIX === 'none' ? '' : PREFIX}img Cyberpunk Motorcycle\`` }, { quoted: msg });
                await sock.sendMessage(from, { text: `🎨 Generating image for "${args}"...` }, { quoted: msg });
                try {
                    const imgApi = `https://api.siputzx.my.id/api/s/flux?prompt=${encodeURIComponent(args)}`;
                    await sock.sendMessage(from, { image: { url: imgApi }, caption: `🖼️ *Generated Image:* ${args}\n👑 *By RAHUL-MASTER*` }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: '❌ Image generation failed.' }, { quoted: msg });
                }
            }
            else if (command === 'wallpaper' || command === 'wallpapers' || command === 'wp') {
                if (!args) return await sock.sendMessage(from, { text: `❌ Wallpaper topic taka! e.g. \`${PREFIX === 'none' ? '' : PREFIX}wallpaper 4K Car\`` }, { quoted: msg });
                await sock.sendMessage(from, { text: `📱 Searching 3D/4K wallpapers for "${args}"...` }, { quoted: msg });
                try {
                    const res = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(args + ' 4k wallpaper')} `, { timeout: 20000 });
                    const images = res.data?.data || res.data?.result;
                    if (!Array.isArray(images) || !images.length) throw new Error('No wallpapers found');
                    const randomWp = images[Math.floor(Math.random() * images.length)];
                    await sock.sendMessage(from, { image: { url: randomWp }, caption: `📱 *3D/4K Wallpaper:* ${args}\n👑 *By RAHUL-MASTER*` }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: '❌ Wallpaper search failed.' }, { quoted: msg });
                }
            }
            else if (command === 'msgboom' || command === 'spam' || command === 'bomb') {
                const parts = args.split('|');
                if (parts.length < 2) {
                    return await sock.sendMessage(from, { text: `❌ Format chuka aahe!\n\n📌 *Usage:* \`${PREFIX === 'none' ? '' : PREFIX}msgboom Hello Rahul | 5\`` }, { quoted: msg });
                }
                const spamText = parts[0].trim();
                const count = Math.min(parseInt(parts[1].trim()) || 3, 15);
                for (let i = 0; i < count; i++) {
                    await sock.sendMessage(from, { text: `${spamText} (${i + 1}/${count})` });
                    await delay(500);
                }
            }
            else if (command === 'apk' || command === 'downloadapk') {
                if (!args) return await sock.sendMessage(from, { text: `❌ App name taka! e.g. \`${PREFIX === 'none' ? '' : PREFIX}apk WhatsApp\` or \`${PREFIX === 'none' ? '' : PREFIX}apk Free Fire\`` }, { quoted: msg });
                await sock.sendMessage(from, { text: `📦 *Searching APK for:* "${args}"...` }, { quoted: msg });
                try {
                    const res = await axios.get(`https://api.siputzx.my.id/api/apk/dl?q=${encodeURIComponent(args)}`, { timeout: 25000 });
                    const appData = res.data?.data || res.data?.result;
                    if (!appData?.dllink) throw new Error('APK not found');
                    await sock.sendMessage(from, {
                        document: { url: appData.dllink },
                        mimetype: 'application/vnd.android.package-archive',
                        fileName: `${appData.name || args}.apk`,
                        caption: `📦 *RAHUL AI APK DOWNLOADER*\n\n📱 *App Name:* ${appData.name}\n⭐ *Developer:* ${appData.developer || 'Unknown'}\n👑 *By RAHUL-MASTER*`
                    }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: '❌ APK download failed or app not found.' }, { quoted: msg });
                }
            }
            else if (command === 'pinterest' || command === 'pin') {
                if (!args) return await sock.sendMessage(from, { text: `❌ Search query taka! e.g. \`${PREFIX === 'none' ? '' : PREFIX}pinterest Hacker Wallpaper\`` }, { quoted: msg });
                await sock.sendMessage(from, { text: `📌 *Searching Pinterest for:* "${args}"...` }, { quoted: msg });
                try {
                    const res = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(args)}`, { timeout: 25000 });
                    const images = res.data?.data || res.data?.result;
                    if (!Array.isArray(images) || !images.length) throw new Error('No images found');
                    const randomImg = images[Math.floor(Math.random() * images.length)];
                    await sock.sendMessage(from, { image: { url: randomImg }, caption: `📌 *Pinterest Search:* ${args}\n👑 *By RAHUL-MASTER*` }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: '❌ Pinterest search failed.' }, { quoted: msg });
                }
            }
            else if (command === 'update' || command === 'autoupdate') {
                await sock.sendMessage(from, { text: '🔄 *Checking for updates & pulling latest code from GitHub...*' }, { quoted: msg });
                exec('git pull', async (err, stdout, stderr) => {
                    if (err) return await sock.sendMessage(from, { text: `❌ *Update Failed:* ${err.message}` }, { quoted: msg });
                    if (stdout.includes('Already up to date')) return await sock.sendMessage(from, { text: '✅ *RAHUL AI MINI is already on the latest version!*' }, { quoted: msg });
                    await sock.sendMessage(from, { text: `✅ *Update Successful!*\n\n\`\`\`${stdout}\`\`\`\n\n🔄 *Restarting bot now...*` }, { quoted: msg });
                    process.exit(0);
                });
            }
            else if (command === 'alwaysonline' || command === 'autoonline') {
                if (args.toLowerCase() === 'on') {
                    isAlwaysOnline = true;
                    syncAlwaysOnlineHeartbeat();
                    try { await sock.sendPresenceUpdate('available'); } catch (e) {}
                    try { await sock.sendPresenceUpdate('available', from); } catch (e) {}
                    await sock.sendMessage(from, { text: '🟢 *Always Online Status is now ACTIVATED!*' }, { quoted: msg });
                } else if (args.toLowerCase() === 'off') {
                    isAlwaysOnline = false;
                    syncAlwaysOnlineHeartbeat();
                    try { await sock.sendPresenceUpdate('unavailable'); } catch (e) {}
                    try { await sock.sendPresenceUpdate('unavailable', from); } catch (e) {}
                    await sock.sendMessage(from, { text: '🔴 *Always Online Status is now DEACTIVATED!*' }, { quoted: msg });
                } else {
                    await sock.sendMessage(from, { 
                        text: `⚙️ *Always Online Settings*\n\n🟢 On: \`${PREFIX === 'none' ? '' : PREFIX}alwaysonline on\`\n🔴 Off: \`${PREFIX === 'none' ? '' : PREFIX}alwaysonline off\`\n\n📌 *Status:* ${isAlwaysOnline ? '🟢 ON' : '🔴 OFF'}` 
                    }, { quoted: msg });
                }
            }
            else if (command === 'statusview' || command === 'autostatus') {
                if (args.toLowerCase() === 'on') {
                    isAutoStatusView = true;
                    await sock.sendMessage(from, { text: '🟢 *Auto Status View & YTV Auto Status Downloader is now ACTIVATED!*' }, { quoted: msg });
                } else if (args.toLowerCase() === 'off') {
                    isAutoStatusView = false;
                    await sock.sendMessage(from, { text: '🔴 *Auto Status View is now DEACTIVATED!*' }, { quoted: msg });
                } else {
                    await sock.sendMessage(from, { 
                        text: `👀 *Auto Status View & YTV Downloader Settings*\n\n🟢 On: \`${PREFIX === 'none' ? '' : PREFIX}statusview on\`\n🔴 Off: \`${PREFIX === 'none' ? '' : PREFIX}statusview off\`\n\n📌 *Status:* ${isAutoStatusView ? '🟢 ON' : '🔴 OFF'}` 
                    }, { quoted: msg });
                }
            }
            else if (command === 'autoreact') {
                if (args.toLowerCase() === 'on') {
                    isAutoReact = true;
                    await sock.sendMessage(from, { text: '❤️ *Auto React is now ACTIVATED!*' }, { quoted: msg });
                } else if (args.toLowerCase() === 'off') {
                    isAutoReact = false;
                    await sock.sendMessage(from, { text: '🖤 *Auto React is now DEACTIVATED!*' }, { quoted: msg });
                } else {
                    await sock.sendMessage(from, { text: `❤️ *Auto React Status:* ${isAutoReact ? 'ON' : 'OFF'}\nUse: \`${PREFIX === 'none' ? '' : PREFIX}autoreact on/off\`` }, { quoted: msg });
                }
            }
            else if (command === 'customreact') {
                if (!args) return await sock.sendMessage(from, { text: `❌ Emoji taka! e.g. \`${PREFIX === 'none' ? '' : PREFIX}customreact ⚡\`` }, { quoted: msg });
                customReactEmoji = args.trim();
                await sock.sendMessage(from, { text: `✅ *Custom React Emoji set to:* ${customReactEmoji}` }, { quoted: msg });
            }
            else if (command === 'autodl') {
                if (args.toLowerCase() === 'on') {
                    isAutoDL = true;
                    await sock.sendMessage(from, { text: '📥 *Auto DL (All Video Downloader) is now ACTIVATED!*' }, { quoted: msg });
                } else if (args.toLowerCase() === 'off') {
                    isAutoDL = false;
                    await sock.sendMessage(from, { text: '📤 *Auto DL is now DEACTIVATED!*' }, { quoted: msg });
                } else {
                    await sock.sendMessage(from, { text: `📥 *Auto DL Status:* ${isAutoDL ? 'ON' : 'OFF'}\nUse: \`${PREFIX === 'none' ? '' : PREFIX}autodl on/off\`` }, { quoted: msg });
                }
            }
            else if (command === 'setprefix' || command === 'prefix') {
                if (!args) return await sock.sendMessage(from, { text: `⚙️ *Current Prefix:* \`${PREFIX}\`\n\nUsage: \`${PREFIX === 'none' ? '' : PREFIX}setprefix !\` or \`${PREFIX === 'none' ? '' : PREFIX}setprefix none\`` }, { quoted: msg });
                const newPref = args.trim().toLowerCase();
                if (newPref === 'none') {
                    PREFIX = 'none';
                    await sock.sendMessage(from, { text: `✅ *Prefix removed! Now bot runs without prefix (Direct commands like 'menu', 'ping').*` }, { quoted: msg });
                } else {
                    PREFIX = args.trim();
                    await sock.sendMessage(from, { text: `✅ *Bot Prefix successfully changed to:* \`${PREFIX}\`` }, { quoted: msg });
                }
            }
            else if (command === 'sudo' || command === 'setvar') {
                await sock.sendMessage(from, { text: `⚙️ *SUDO & ENV SETTINGS*\n\n📌 *Owner:* RAHUL-MASTER\n📌 *Prefix:* ${PREFIX}\n📌 *Bot Mode:* ${BOT_MODE.toUpperCase()}\n📌 *Always Online:* ${isAlwaysOnline}\n📌 *Auto Status View & YTV:* ${isAutoStatusView}\n📌 *Auto React:* ${isAutoReact}\n🌐 *Repo:* ${OFFICIAL_REPO}` }, { quoted: msg });
            }
            else if (command === 'settings') {
                await sock.sendMessage(from, { text: `⚙️ *RAHUL-AI-MINI CONTROL PANEL*\n\n1. \`${PREFIX === 'none' ? '' : PREFIX}mode public/private\`\n2. \`${PREFIX === 'none' ? '' : PREFIX}alwaysonline on/off\`\n3. \`${PREFIX === 'none' ? '' : PREFIX}statusview on/off\`\n4. \`${PREFIX === 'none' ? '' : PREFIX}autoreact on/off\`\n5. \`${PREFIX === 'none' ? '' : PREFIX}autodl on/off\`\n6. \`${PREFIX === 'none' ? '' : PREFIX}autovoice on/off\`\n7. \`${PREFIX === 'none' ? '' : PREFIX}setprefix <symbol/none>\`\n8. \`${PREFIX === 'none' ? '' : PREFIX}setmenustyle <style>\`` }, { quoted: msg });
            }
            else if (command.startsWith('ping')) {
                const subNum = command.replace('ping', '').trim() || args.trim() || '1';
                const start = Date.now();
                const testMsg = await sock.sendMessage(from, { text: '⚡ *RAHUL-AI-MINI Speed Testing...*' }, { quoted: msg });
                const latency = Date.now() - start;

                let pingText = '';
                switch (subNum) {
                    case '1':
                        pingText = `🚀 *Rᴀʜᴜʟ-Aɪ-Mɪɴɪ Pɪɴɢ 1*\n\n⏱️ *Speed:* \`${latency}ms\`\n👑 *Master:* RAHUL-MASTER\n⚡ *Status:* Blazing Fast 🔥`;
                        break;
                    case '2':
                        pingText = `╔═══════════════════════╗\n║ ⚡ *RAHUL-AI-MINI PING 2* ⚡\n╠═══════════════════════╣\n║ ⏱️ Latency: \`${latency}ms\`\n║ 🟢 Engine: Online\n╚═══════════════════════╝`;
                        break;
                    case '3':
                        pingText = `┏━━[ ✦ *RAHUL-AI-MINI PING 3* ✦ ]━━┓\n┃ ⚡ Latency: \`${latency}ms\`\n┃ 👑 Creator: Rahul Master\n┗━━━━━━━━━━━━━━━━━━━━━━━━┛`;
                        break;
                    case '4':
                        pingText = `✨ *[ RAHUL-AI-MINI SPEED TEST 4 ]*\n\n🚀 Response Time: \`${latency}ms\`\n🔥 System Normal & Fully Optimized!`;
                        break;
                    case '5':
                        pingText = `🔥 *R.A.H.U.L - A.I - P.I.N.G  5*\n\n⚡ Speed: \`${latency}ms\`\n👑 Powered by RAHUL-MASTER`;
                        break;
                    case '6':
                        pingText = `⚡ *PING [STYLE 6]* ➔ \`${latency}ms\`\n👑 RAHUL-AI-MINI is operating at 100% capacity!`;
                        break;
                    case '7':
                        pingText = `🌟 *RAHUL-AI-MINI • ULTIMATE PING 7*\n\n⏱️ \`${latency}ms\` response recorded.`;
                        break;
                    case '8':
                        pingText = `🎯 *TARGET LOCKED: RAHUL-AI-MINI PING 8*\n\n⚡ Latency: \`${latency}ms\` | Ready for action!`;
                        break;
                    case '9':
                        pingText = `💎 *CYBER PING 9* ➔ \`${latency}ms\`\n⚡ RAHUL-AI-MINI secure server online.`;
                        break;
                    case '10':
                        pingText = `🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟\n🚀 *RAHUL-AI-MINI PING 10*\n⏱️ Speed: \`${latency}ms\`\n👑 Owner: RAHUL-MASTER\n🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟`;
                        break;
                    default:
                        pingText = `⚡ *RAHUL-AI-MINI PING (${subNum})* ➔ \`${latency}ms\``;
                }
                await sock.sendMessage(from, { text: pingText }, { quoted: msg });
            }
            else if (command.startsWith('alive')) {
                const subNum = command.replace('alive', '').trim() || args.trim() || '1';
                let aliveText = '';
                const uptimeMs = Date.now() - startTime;
                const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
                const mins = Math.floor((uptimeMs / (1000 * 60)) % 60);

                switch (subNum) {
                    case '1':
                        aliveText = `👑 *RAHUL-AI-MINI IS ONLINE!* ⚡\n\n👨‍💻 Owner: RAHUL-MASTER\n⏱️ Uptime: ${hours}h ${mins}m\n⚡ Status: Active 24/7`;
                        break;
                    case '2':
                        aliveText = `╔═══════════════════════╗\n║ 🤖 *RAHUL-AI-MINI ALIVE 2* 🤖\n╠═══════════════════════╣\n║ 👑 Master: RAHUL-MASTER\n║ ⏱️ Uptime: ${hours}h ${mins}m\n╚═══════════════════════╝`;
                        break;
                    case '3':
                        aliveText = `┏━━[ ✦ *RAHUL-AI-MINI ALIVE 3* ✦ ]━━┓\n┃ ⚡ Bot is running smoothly!\n┃ 👑 Owner: Rahul Master\n┗━━━━━━━━━━━━━━━━━━━━━━━━┛`;
                        break;
                    case '4':
                        aliveText = `✨ *[ RAHUL-AI-MINI ACTIVE 4 ]*\n\n👑 Master: RAHUL-MASTER\n🚀 Ready to execute all commands!`;
                        break;
                    case '5':
                        aliveText = `🔥 *R.A.H.U.L - A.I - A.L.I.V.E  5*\n\n⚡ All systems online and responsive.`;
                        break;
                    case '6':
                        aliveText = `⚡ *ALIVE [STYLE 6]* ➔ RAHUL-AI-MINI is fully functional!`;
                        break;
                    case '7':
                        aliveText = `🌟 *RAHUL-AI-MINI • ULTIMATE ALIVE 7*\n\n👑 Owner: RAHUL-MASTER`;
                        break;
                    case '8':
                        aliveText = `🎯 *RAHUL-AI-MINI ALIVE 8*\n\n⚡ Running stable on cloud server!`;
                        break;
                    case '9':
                        aliveText = `💎 *CYBER ALIVE 9* ➔ RAHUL-AI-MINI is online & secure.`;
                        break;
                    case '10':
                        aliveText = `🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟\n🚀 *RAHUL-AI-MINI ALIVE 10*\n👑 Owner: RAHUL-MASTER\n⏱️ Uptime: ${hours}h ${mins}m\n🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟`;
                        break;
                    default:
                        aliveText = `👑 *RAHUL-AI-MINI ALIVE (${subNum})* ➔ Active & Online!`;
                }
                await sock.sendMessage(from, { text: aliveText }, { quoted: msg });
            }
            else if (command === 'uptime' || command === 'runtime') {
                const uptimeMs = Date.now() - startTime;
                const seconds = Math.floor((uptimeMs / 1000) % 60);
                const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
                const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
                const days = Math.floor(hours / 24);
                await sock.sendMessage(from, { text: `⏱️ *RAHUL-AI-MINI RUNTIME / UPTIME*\n\n🚀 \`${days} Days, ${hours % 24} Hours, ${minutes} Minutes, ${seconds} Seconds\`\n👑 *Master:* RAHUL-MASTER\n🌐 *Repo Portal:* ${OFFICIAL_REPO}` }, { quoted: msg });
            }
            else if (command === 'menu' || command === 'help' || command === 'allmenu') {
                const usedRam = Math.round(process.memoryUsage().rss / 1024 / 1024);
                
                let menuText = '';
                switch (MENU_STYLE) {
                    case 'long':
                        menuText = [
                            '╔════════════════════════════════════════╗',
                            '║          🔥 RAHUL AI MINI 🔥           ║',
                            '║      Ultimate WhatsApp Automation      ║',
                            '╚════════════════════════════════════════╝',
                            `📌 Owner: RAHUL-MASTER | Prefix: ${PREFIX}`,
                            `🌐 Repo: ${OFFICIAL_REPO}`,
                            `🎨 Style: ${MENU_STYLE} | Mode: ${BOT_MODE.toUpperCase()}`,
                            '',
                            '╭─❑ AI & TOOLS',
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}ai <text>`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}img <prompt>`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}wallpaper <topic>`,
                            `│ ▫️ ${PREFIX}tts <text>`,
                            `│ ▫️ ${PREFIX}ptt (reply audio)`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}google <query>`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}tourl (reply media)`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}tomp3 (reply video)`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}apk <name>`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}pinterest <query>`,
                            '╰─────────────────',
                            '',
                            '╭─❑ DOWNLOADERS & SPAM',
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}play <song>`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}video <name>`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}insta <url>`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}msgboom <text> | <count>`,
                            '╰─────────────────',
                            '',
                            '╭─❑ SYSTEM & SETTINGS',
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}ping / ping1-10`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}alive / alive1-10`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}uptime / runtime`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}mode public/private`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}setcmd <cmd> | <resp>`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}setmenustyle <style>`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}alwaysonline on/off`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}autovoice on/off`,
                            `│ ▫️ ${PREFIX === 'none' ? '' : PREFIX}update`,
                            '╰─────────────────'
                        ].join('\n');
                        break;
                    case 'small':
                        menuText = `⚡ *RAHUL AI MINI* (${PREFIX})\n\n🔹 *AI & Media:* ai, img, wallpaper, tts, ptt, play, video, insta\n🔹 *Tools:* msgboom, apk, pinterest, google, tourl\n🔹 *System:* mode, setcmd, setmenustyle, update\n\n_Powered by RAHUL-MASTER_`;
                        break;
                    case 'big':
                        menuText = [
                            '🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟',
                            '🚀 RAHUL AI MINI - ADVANCED DASHBOARD 🚀',
                            '🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟',
                            `👑 Developer: RAHUL-MASTER`,
                            `⌨️ Command Prefix: ${PREFIX}`,
                            `🌐 Repo Portal: ${OFFICIAL_REPO}`,
                            `🎨 Active Menu Style: BIG | Mode: ${BOT_MODE.toUpperCase()}`,
                            '-------------------------------------------------',
                            `[1] ai - Chat with AI Assistant`,
                            `[2] img / wallpaper - Generate/Search 3D & 4K wallpapers`,
                            `[3] play / video - YouTube Music & Video Downloader`,
                            `[4] insta - Instagram Reels Downloader`,
                            `[5] tourl / tomp3 - Media to URL & Video to Audio`,
                            `[6] apk / pinterest - App & Image Downloader`,
                            `[7] tts / ptt - Text-to-Speech & Voice Notes`,
                            `[8] msgboom - Spam/Bomb messages in chat`,
                            `[9] setcmd - Add custom commands dynamically`,
                            `[10] ping / alive (1 to 10 stylish styles)`,
                            `[11] mode / setprefix - Public/Private & Prefix settings`,
                            `[12] setmenustyle - Change menu layout (15 styles)`,
                            `[13] update - Auto-update from GitHub repository`,
                            '-------------------------------------------------',
                            '🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟'
                        ].join('\n');
                        break;
                    case 'profile':
                    case 'profile2':
                        menuText = [
                            '┏━━━[ 👑 RAHUL-MASTER PROFILE ]━━━┓',
                            `┃ 🤖 Bot Name: RAHUL-AI-MINI`,
                            `┃ ⌨️ Prefix: [ ${PREFIX} ]`,
                            `┃ 🔋 RAM Usage: ${usedRam} MB`,
                            `┃ ⚡ Status: Active 24/7`,
                            '┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫',
                            `┃ 📌 ai | img | wallpaper`,
                            `┃ 📌 play | video | insta`,
                            `┃ 📌 tourl | apk | tts`,
                            `┃ 📌 msgboom | setcmd`,
                            `┃ 📌 ping 1-10 | alive 1-10`,
                            `┃ 📌 mode | setmenustyle`,
                            '┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛'
                        ].join('\n');
                        break;
                    case 'cyberpunk':
                        menuText = [
                            '┏━━━[ ⚡ CYBERPUNK RAHUL AI ⚡ ]━━━┓',
                            `┃ 🎛️ PREFIX: [ ${PREFIX} ]`,
                            `┃ 🔋 RAM USAGE: ${usedRam} MB`,
                            `┃ 🎨 THEME: CYBERPUNK`,
                            '┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫',
                            `┃ ⚡ ai <prompt>`,
                            `┃ ⚡ img <prompt>`,
                            `┃ ⚡ wallpaper <topic>`,
                            `┃ ⚡ play <song>`,
                            `┃ ⚡ msgboom <text> | <count>`,
                            `┃ ⚡ setcmd <cmd> | <resp>`,
                            `┃ ⚡ mode public/private`,
                            `┃ ⚡ update`,
                            '┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛'
                        ].join('\n');
                        break;
                    case 'neon':
                        menuText = [
                            '╔═══════════════✦❖✦═══════════════╗',
                            '       🌟 𝗥𝗔𝗛𝗨𝗟 𝗔𝗜 𝗠𝗜𝗡𝗜 𝗡𝗘𝗢𝗡 🌟        ',
                            '╚═══════════════✦❖✦═══════════════╝',
                            `🎵 *Music:* play, video, insta`,
                            `🎨 *AI & Art:* ai, img, wallpaper, tts`,
                            `📥 *Tools:* tourl, apk, pinterest, msgboom`,
                            `⚙️ *Customization:* setcmd, mode, setmenustyle, update`,
                            '═════════════════════════════════'
                        ].join('\n');
                        break;
                    case 'minimalist':
                        menuText = `RAHUL AI MINI (${PREFIX})\n\n/ai - AI Chat\n/img - Generate Image\n/wallpaper - 4K Wallpaper\n/play - Play Audio\n/video - YouTube Video\n/insta - Insta Downloader\n/msgboom - Spam Tool\n/setcmd - Custom Cmd\n/ping / alive - Status\n/mode - Public/Private\n/update - Auto Update`;
                        break;
                    case 'hacker':
                        menuText = [
                            'root@rahul-ai:~# ./menu.sh',
                            '[+] SYSTEM: ONLINE',
                            `[+] PREFIX: ${PREFIX}`,
                            `[+] REPO: ${OFFICIAL_REPO}`,
                            '[+] MODULES LOADED:',
                            `    - ai, img, wallpaper`,
                            `    - play, video, insta`,
                            `    - tourl, apk, pinterest`,
                            `    - msgboom, setcmd`,
                            `    - ping 1-10, alive 1-10`,
                            `    - mode, setmenustyle`,
                            `    - update`,
                            'root@rahul-ai:~# _'
                        ].join('\n');
                        break;
                    case 'neonbox':
                        menuText = [
                            '╭───────────────╮',
                            '│ 🤖 RAHUL AI   │',
                            '╰───────────────╯',
                            `Prefix: ${PREFIX}`,
                            `• ai | img | wallpaper`,
                            `• play | video | insta`,
                            `• msgboom | setcmd`,
                            `• apk | tourl | tts`,
                            `• ping 1-10 | mode`,
                            `• setmenustyle`
                        ].join('\n');
                        break;
                    case 'modern':
                        menuText = [
                            '🚀 *RAHUL AI MINI* • Dashboard',
                            `─────────────────────────`,
                            `🤖 *AI & Art:* \`ai\` | \`img\` | \`wallpaper\` | \`tts\``,
                            `🎵 *Media:* \`play\` | \`video\` | \`insta\` | \`tomp3\``,
                            `🛠️ *Tools:* \`msgboom\` | \`setcmd\` | \`apk\` | \`tourl\``,
                            `⚡ *Status:* \`ping\` | \`alive\` | \`uptime\``,
                            `🎨 *Layout:* \`mode\` | \`setmenustyle\` | \`update\``,
                            `─────────────────────────`
                        ].join('\n');
                        break;
                    default:
                        menuText = [
                            '╭━━━『 ✦ RAHUL AI MINI ✦ 』━━━╮',
                            '┃ ⚡ *ᴘʀᴇᴍɪᴜᴍ ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ*',
                            '┃ 👑 *ᴏᴡɴᴇʀ:* RAHUL-MASTER',
                            '┃ ⌨️ *ᴘʀᴇғɪx:* ' + PREFIX,
                            '┃ 🎨 *sᴛʏʟᴇ:* ' + MENU_STYLE,
                            '╰━━━━━━━━━━━━━━━━━━━━━━╯',
                            `📌 ai <text>`,
                            `📌 img <prompt>`,
                            `📌 wallpaper <topic>`,
                            `📌 play <song>`,
                            `📌 video <name>`,
                            `📌 insta <url>`,
                            `📌 msgboom <text> | <count>`,
                            `📌 setcmd <cmd> | <resp>`,
                            `📌 tourl | tomp3 | apk`,
                            `📌 ping 1-10 | alive 1-10`,
                            `📌 mode public/private`,
                            `📌 setmenustyle <style>`,
                            `📌 update`
                        ].join('\n');
                }

                try {
                    const page = await axios.get('https://ibb.co/d0prYPDW', { timeout: 12000 });
                    const html = typeof page.data === 'string' ? page.data : '';
                    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
                    const imageUrl = match?.[1]?.replace(/&amp;/g, '&');
                    if (imageUrl) {
                        const imageResponse = await axios.get(imageUrl, {
                            responseType: 'arraybuffer',
                            timeout: 15000,
                            headers: { 'User-Agent': 'Mozilla/5.0' }
                        });
                        await sock.sendMessage(from, { image: Buffer.from(imageResponse.data), caption: menuText }, { quoted: msg });
                    } else {
                        await sock.sendMessage(from, { text: menuText }, { quoted: msg });
                    }
                } catch (e) {
                    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
                }
            }
            else if (command === 'fancy' || command === 'font' || command === 'fonts') {
                if (!args.trim()) {
                    return await sock.sendMessage(from, {
                        text: `✨ *RAHUL AI MINI FANCY TEXT*\n\nUse: ${PREFIX === 'none' ? '' : PREFIX}fancy Your Text`
                    }, { quoted: msg });
                }
                try {
                    const apiUrl = `https://eliteprotech-apis.zone.id/fun/font?text=${encodeURIComponent(args.trim())}`;
                    const response = await axios.get(apiUrl, { timeout: 20000 });
                    const styles = response.data?.results;
                    if (response.data?.status !== true || !Array.isArray(styles) || !styles.length) {
                        throw new Error('No font styles returned');
                    }
                    const lines = styles.slice(0, 25).map((item, index) =>
                        `${index + 1}. *${String(item.name || 'Font')}*\n${item.text || ''}`
                    );
                    const output = `✨ *RAHUL AI MINI FANCY TEXT* ✨\n\n${lines.join('\n\n')}`;
                    await sock.sendMessage(from, { text: output.slice(0, 60000) }, { quoted: msg });
                } catch (error) {
                    await sock.sendMessage(from, { text: '❌ Fancy font API currently unavailable.' }, { quoted: msg });
                }
            }
            else if (command === 'play' || command === 'song') {
                if (!args) return await sock.sendMessage(from, { text: `❌ Song name taka! e.g. \`${PREFIX === 'none' ? '' : PREFIX}play Blinding Lights\`` }, { quoted: msg });
                await sock.sendMessage(from, { text: `🎵 Searching: "${args}"...\n⚡ Preparing audio file.` }, { quoted: msg });
                try {
                    const api = `https://api.sayan-nexuswork.workers.dev/music?query=${encodeURIComponent(args.trim())}`;
                    const res = await axios.get(api, { timeout: 20000 });
                    const data = res.data;
                    if (data?.status !== 'success' || !data?.url) {
                        return await sock.sendMessage(from, { text: '❌ Song not found or music API failed.' }, { quoted: msg });
                    }
                    const title = data.title || args;
                    const safeTitle = title.replace(/[\\/:*?"<>|]/g, '').slice(0, 80) || 'audio';
                    
                    const audioRes = await axios.get(data.url, {
                        responseType: 'arraybuffer',
                        timeout: 60000,
                        maxRedirects: 5,
                        maxContentLength: 25 * 1024 * 1024,
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    });
                    const audioBuffer = Buffer.from(audioRes.data);
                    if (!audioBuffer.length) throw new Error('Audio response was empty');
                    
                    await sock.sendMessage(from, {
                        audio: audioBuffer,
                        mimetype: 'audio/mpeg',
                        fileName: `${safeTitle}.mp3`,
                        ptt: false
                    }, { quoted: msg });

                } catch (err) {
                    console.error('Play audio download/send error:', err.message);
                    await sock.sendMessage(from, { text: `❌ Play audio failed. Try again with a shorter track.` }, { quoted: msg });
                }
            }
            else if (command === 'video' || command === 'ytvideo') {
                if (!args) return await sock.sendMessage(from, { text: `❌ Video name taka! e.g. \`${PREFIX === 'none' ? '' : PREFIX}video Tere Naam\`` }, { quoted: msg });
                await sock.sendMessage(from, { text: `🎬 Searching: "${args}"...\n⏳ Fetching video file.` }, { quoted: msg });
                try {
                    const api = `https://api.sayan-nexuswork.workers.dev/video?query=${encodeURIComponent(args.trim())}`;
                    const res = await axios.get(api, { timeout: 30000 });
                    const data = res.data;
                    if (data?.status !== 'success' || !data?.url) {
                        return await sock.sendMessage(from, { text: '❌ Video not found.' }, { quoted: msg });
                    }
                    const caption = `🎬 *RAHUL AI MINI VIDEO*\n\n📌 *Title:* ${data.title || args}\n👑 *By RAHUL-MASTER*`;
                    const videoRes = await axios.get(data.url, {
                        responseType: 'arraybuffer',
                        timeout: 120000,
                        maxRedirects: 5,
                        maxContentLength: 80 * 1024 * 1024,
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    });
                    const videoBuffer = Buffer.from(videoRes.data);
                    await sock.sendMessage(from, { video: videoBuffer, mimetype: 'video/mp4', caption }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: `❌ Video download failed.` }, { quoted: msg });
                }
            }
            else if (command === 'insta' || command === 'instagram') {
                if (!args || !/instagram\.com\//i.test(args)) return await sock.sendMessage(from, { text: `❌ Instagram URL taka! e.g. \`${PREFIX === 'none' ? '' : PREFIX}insta https://www.instagram.com/reel/URL\`` }, { quoted: msg });
                await sock.sendMessage(from, { text: '📥 *Downloading Instagram media...*' }, { quoted: msg });
                try {
                    const api = `https://api.sayan-nexuswork.workers.dev/insta?url=${encodeURIComponent(args.trim())}`;
                    const res = await axios.get(api, { timeout: 30000 });
                    const data = res.data;
                    const mediaUrl = data?.url || data?.urls?.[0];
                    if (data?.status !== 'success' || !mediaUrl) return await sock.sendMessage(from, { text: '❌ Instagram media unavailable.' }, { quoted: msg });
                    if (data.type === 'image' || /\.jpe?g(\?|$)/i.test(mediaUrl) || /\.png(\?|$)/i.test(mediaUrl)) {
                        await sock.sendMessage(from, { image: { url: mediaUrl }, caption: '📸 *RAHUL AI Insta Downloader*\n👑 *RAHUL-MASTER*' }, { quoted: msg });
                    } else {
                        await sock.sendMessage(from, { video: { url: mediaUrl }, caption: '📸 *RAHUL AI Insta Downloader*\n👑 *RAHUL-MASTER*' }, { quoted: msg });
                    }
                } catch (e) {
                    await sock.sendMessage(from, { text: '❌ Instagram download failed.' }, { quoted: msg });
                }
            }
            else if (command === 'qr') {
                if (!args) return await sock.sendMessage(from, { text: `❌ Text kiwa link taka! e.g. \`${PREFIX === 'none' ? '' : PREFIX}qr Hello RAHUL AI\`` }, { quoted: msg });
                try {
                    const qrBuffer = await QRCode.toBuffer(args);
                    await sock.sendMessage(from, { image: qrBuffer, caption: `🔲 *QR Code for:* ${args}\n👑 *RAHUL-MASTER*` }, { quoted: msg });
                } catch {
                    await sock.sendMessage(from, { text: '❌ QR Code generation error.' }, { quoted: msg });
                }
            }
            else if (command === 'calc') {
                if (!args) return await sock.sendMessage(from, { text: `❌ Expression taka! e.g. \`${PREFIX === 'none' ? '' : PREFIX}calc 50 + 50 * 2\`` }, { quoted: msg });
                try {
                    const sanitized = args.replace(/[^0-9+\-*/().]/g, '');
                    const result = eval(sanitized);
                    await sock.sendMessage(from, { text: `🧮 *Calculator*\n\n✅ *Answer:* ${result}` }, { quoted: msg });
                } catch {
                    await sock.sendMessage(from, { text: '❌ Invalid expression.' }, { quoted: msg });
                }
            }
            else if (command === 'google' || command === 'g') {
                if (!args) return await sock.sendMessage(from, { text: `❌ Search query taka! e.g. \`${PREFIX === 'none' ? '' : PREFIX}google India\`` }, { quoted: msg });
                await sock.sendMessage(from, { text: `🔍 Searching for "${args}"...` }, { quoted: msg });
                try {
                    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(args)}&format=json`;
                    const res = await axios.get(searchUrl);
                    let resultText = res.data.AbstractText || res.data.RelatedTopics?.[0]?.Text || 'No direct result found.';
                    await sock.sendMessage(from, { text: `🌐 *Google Search*\n\n${resultText}` }, { quoted: msg });
                } catch {
                    await sock.sendMessage(from, { text: '❌ Search error.' }, { quoted: msg });
                }
            }
            else if (command === 'sticker' || command === 's') {
                const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
                const isImage = msg.message.imageMessage || quoted?.imageMessage;
                if (isImage) {
                    await sock.sendMessage(from, { text: '⏳ Creating sticker...' }, { quoted: msg });
                    const media = await downloadMediaMessage(
                        quoted ? { message: quoted } : msg, 'buffer', {}
                    );
                    const sticker = new Sticker(media, {
                        pack: 'RAHUL AI MINI',
                        author: 'RAHUL-MASTER',
                        type: StickerTypes.FULL,
                        quality: 70
                    });
                    const buffer = await sticker.toBuffer();
                    await sock.sendMessage(from, { sticker: buffer }, { quoted: msg });
                } else {
                    await sock.sendMessage(from, { text: `❌ Reply to an image with \`${PREFIX === 'none' ? '' : PREFIX}sticker\`!` }, { quoted: msg });
                }
            }
            else if (command === 'ai') {
                if (!args) return await sock.sendMessage(from, { text: `❌ Prashna taka! e.g. \`${PREFIX === 'none' ? '' : PREFIX}ai Hello\`` }, { quoted: msg });
                await sock.sendMessage(from, { text: '🤖 *RAHUL AI is thinking...*' }, { quoted: msg });
                try {
                    const res = await axios.get(
                        `https://eliteprotech-apis.zone.id/ai/chatgpt?prompt=${encodeURIComponent(args)}`,
                        { timeout: 45000 }
                    );
                    const responseText = res.data?.text || res.data?.response || res.data?.message;
                    if (res.data?.success !== true || !responseText) throw new Error('AI API returned no answer');
                    await sock.sendMessage(from, { text: `🤖 *RAHUL AI*\n\n${responseText}\n👑 *By RAHUL-MASTER*` }, { quoted: msg });
                } catch (e) {
                    await sock.sendMessage(from, { text: '❌ AI API currently busy.' }, { quoted: msg });
                }
            }
            else if (command === 'tagall' && isGroup) {
                const groupMetadata = await sock.groupMetadata(from);
                let mentionsText = `📢 *TAGALL*\n\n💬 *Message:* ${args || 'Attention!'}\n\n`;
                let mentions = [];
                for (let mem of groupMetadata.participants) {
                    mentionsText += `👥 @${mem.id.split('@')[0]}\n`;
                    mentions.push(mem.id);
                }
                await sock.sendMessage(from, { text: mentionsText, mentions: mentions }, { quoted: msg });
            }
            else if (command === 'owner') {
                await sock.sendMessage(from, { text: `👑 *Owner Info*\n\nDeveloper: RAHUL-MASTER\nBot: RAHUL-AI-MINI\n🌐 Repo: ${OFFICIAL_REPO}` }, { quoted: msg });
            }

        } catch (err) {
            console.error('Error handling message:', err);
        }
    });
    } catch (err) {
        console.error('WhatsApp connection setup failed:', err);
        if (!reconnectTimer) {
            reconnectTimer = setTimeout(() => {
                reconnectTimer = null;
                connectToWhatsApp().catch(e => console.error('Reconnect error:', e.message));
            }, 5000);
        }
    } finally {
        isConnecting = false;
    }
}

connectToWhatsApp().catch(err => console.error('Initial WhatsApp connection error:', err));
