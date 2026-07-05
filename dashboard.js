import { db } from "./firebase-config.js";

import {
    ref,
    onValue,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ======================
// DATA GRAFIK
// ======================

const tempLabels = [];
const tempData = [];

const humLabels = [];
const humData = [];

const luxLabels = [];
const luxData = [];

const mqLabels = [];
const mqData = [];

// ======================
// GRAFIK SUHU
// ======================

const tempChart = new Chart(
    document.getElementById("tempChart"),
    {
        type: "line",
        data: {
            labels: tempLabels,
            datasets: [
                {
                    label: "Suhu (°C)",
                    data: tempData,
                    borderWidth: 4,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    }
);

// ======================
// GRAFIK KELEMBABAN
// ======================

const humChart = new Chart(
    document.getElementById("humChart"),
    {
        type: "line",
        data: {
            labels: humLabels,
            datasets: [
                {
label: "Kelembaban (%)",
data: humData,
borderWidth: 4,
tension: 0.4,
pointRadius: 0,
pointHoverRadius: 5,
fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    }
);

// ======================
// GRAFIK LUX
// ======================

const luxChart = new Chart(
    document.getElementById("luxChart"),
    {
        type: "line",
        data: {
            labels: luxLabels,
            datasets: [{
label: "Lux",
data: luxData,
borderWidth: 4,
tension: 0.4,
pointRadius: 0,
pointHoverRadius: 5,
fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    }
);

// ======================
// GRAFIK MQ135
// ======================

const mqChart = new Chart(
    document.getElementById("mqChart"),
    {
        type: "line",
        data: {
            labels: mqLabels,
            datasets: [{
label: "MQ135",
data: mqData,
borderWidth: 4,
tension: 0.4,
pointRadius: 0,
pointHoverRadius: 5,
fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    }
);

// ======================
// AMBIL TANGGAL HARI INI
// ======================

function getTodayDate()
{
    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(now.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// ======================
// LOAD HISTORY
// ======================

async function loadHistory()
{
    const today =
        getTodayDate();

    const historyRef =
        ref(
            db,
            `history/${today}`
        );

    const snapshot =
        await get(historyRef);

    if (!snapshot.exists())
    {
        return;
    }

    const history =
        snapshot.val();

    tempLabels.length = 0;
    tempData.length = 0;

    humLabels.length = 0;
    humData.length = 0;

    luxLabels.length = 0;
    luxData.length = 0;

    mqLabels.length = 0;
    mqData.length = 0;

    const sortedKeys =
        Object.keys(history)
        .sort();

sortedKeys.forEach((key) =>
{
    const item =
        history[key];

    // ======================
    // SUHU
    // ======================

    tempLabels.push(key);

    tempData.push(
        Number(item.temperature ?? 0)
    );

    // ======================
    // HUMIDITY
    // ======================

    humLabels.push(key);

    humData.push(
        Number(item.humidity ?? 0)
    );

    // ======================
    // LUX
    // ======================

    luxLabels.push(key);

    luxData.push(
        Number(item.lux ?? 0)
    );

    // ======================
    // MQ135
    // ======================

    mqLabels.push(key);

    mqData.push(
        Number(item.mq135 ?? 0)
    );
});

tempChart.update();
humChart.update();
luxChart.update();
mqChart.update();
}
// ======================
// REALTIME CARD SENSOR
// ======================

const dataRef =
    ref(db, "quail_cage");

onValue(dataRef, (snapshot) =>
{
    const data =
        snapshot.val();

    if (!data)
    {
        return;
    }

    // ======================
    // CARD SENSOR
    // ======================

    document.getElementById(
        "temperature"
    ).innerText =
        data.temperature ?? "--";

    document.getElementById(
        "humidity"
    ).innerText =
        data.humidity ?? "--";

    document.getElementById(
        "lux"
    ).innerText =
        Number(data.lux).toFixed(2);

    document.getElementById(
        "mq135"
    ).innerText =
        data.mq135 ?? "--";

    // ======================
    // STATUS SUHU
    // ======================

    const tempStatus =
        document.getElementById(
            "tempStatus"
        );

    if (data.temperature < 28)
    {
        tempStatus.innerText =
            "🔵 DINGIN";
    }
    else if (data.temperature <= 32)
    {
        tempStatus.innerText =
            "🟢 NORMAL";
    }
    else
    {
        tempStatus.innerText =
            "🔴 PANAS";
    }

    // ======================
    // STATUS HUMIDITY
    // ======================

    const humStatus =
        document.getElementById(
            "humStatus"
        );

    if (data.humidity < 60)
    {
        humStatus.innerText =
            "🟡 RENDAH";
    }
    else if (data.humidity <= 80)
    {
        humStatus.innerText =
            "🟢 NORMAL";
    }
    else
    {
        humStatus.innerText =
            "🔵 TINGGI";
    }

    // ======================
    // STATUS LUX
    // ======================

    const luxStatus =
        document.getElementById(
            "luxStatus"
        );

    if (data.lux < 10)
    {
        luxStatus.innerText =
            "⚫ GELAP";
    }
    else if (data.lux < 100)
    {
        luxStatus.innerText =
            "🟠 REDUP";
    }
    else
    {
        luxStatus.innerText =
            "🟢 TERANG";
    }

    // ======================
    // STATUS MQ135
    // ======================

    const mqStatus =
        document.getElementById(
            "mqStatus"
        );

    if (data.mq135 < 400)
    {
        mqStatus.innerText =
            "🟢 BAIK";
    }
    else if (data.mq135 < 1000)
    {
        mqStatus.innerText =
            "🟡 SEDANG";
    }
    else
    {
        mqStatus.innerText =
            "🔴 BURUK";
    }

    // ======================
    // STATUS DEVICE
    // ======================

    const fanElement =
        document.getElementById(
            "fan"
        );

    const lampElement =
        document.getElementById(
            "lamp"
        );

    fanElement.innerText =
        data.fan;

    lampElement.innerText =
        data.lamp;

    fanElement.className =
        data.fan === "ON"
            ? "badge bg-success"
            : "badge bg-danger";

    lampElement.className =
        data.lamp === "ON"
            ? "badge bg-warning text-dark"
            : "badge bg-secondary";

    // ======================
    // LAST UPDATE
    // ======================

    document.getElementById(
        "lastUpdate"
    ).innerText =
        new Date()
        .toLocaleString("id-ID");
});

// ======================
// LOAD HISTORY SAAT PAGE DIBUKA
// ======================

loadHistory();

// ======================
// REFRESH HISTORY
// ======================
// mengecek histori baru
// setiap 30 detik
// ======================

setInterval(() =>
{
    loadHistory();
}, 30000);
// ======================
// AUTO GANTI HARI
// ======================

let currentDate =
    getTodayDate();

setInterval(() =>
{
    const newDate =
        getTodayDate();

    if (newDate !== currentDate)
    {
        currentDate =
            newDate;

        console.log(
            "Tanggal berganti:",
            currentDate
        );

        loadHistory();
    }

}, 60000);
// ======================
// DOWNLOAD CSV
// ======================

document
.getElementById("downloadCsv")
.addEventListener(
"click",
async () =>
{
const selectedDate =
document.getElementById(
"downloadDate"
).value;

if (!selectedDate)
{
    alert("Pilih tanggal terlebih dahulu");
    return;
}

const historyRef =
    ref(
        db,
        `history/${selectedDate}`
    );

const snapshot =
    await get(historyRef);

if (!snapshot.exists())
{
    alert("Tidak ada data pada tanggal tersebut");
    return;
}

const history =
    snapshot.val();

let csv =

"Tanggal;Waktu;Suhu;Kelembaban;Lux;MQ135;Fan;Lamp\n";

Object.keys(history)
    .sort()
    .forEach((time) =>
{
    const item =
        history[time];

    const waktu =
        time.replace("-", ":");

csv +=
`${selectedDate};` +
`${waktu};` +
`${Number(item.temperature || 0).toFixed(1)};` +
`${Number(item.humidity || 0).toFixed(1)};` +
`${Number(item.lux || 0).toFixed(2)};` +
`${Number(item.mq135 || 0).toFixed(0)};` +
`${item.fan || ""};` +
`${item.lamp || ""}\n`;
});

const blob =
    new Blob(
        [csv],
        {
            type:
            "text/csv;charset=utf-8;"
        }
    );

const url =
    URL.createObjectURL(blob);

const link =
    document.createElement("a");

link.href = url;

link.download =
    `history-${selectedDate}.csv`;

link.click();

URL.revokeObjectURL(url);

});