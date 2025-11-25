let stopClicked = false;
let phoneNet = "";
var pointValue = 0;

const closeBtn = document.getElementById("closeSpinModal");
const openBtn = document.getElementById("openSpinModal");

const wheelCanvas = document.getElementById("wheel");
const ctx = wheelCanvas.getContext("2d");

const W = wheelCanvas.width;
const H = wheelCanvas.height;
const CX = W / 2;
const CY = H / 2;
const R = 170;

const winners = [
  { name: "Chinedu Okeke", gift: "P2" },
  { name: "Aisha Bello", gift: "P5" },
  { name: "Kunle Adeyemi", gift: "SPIN1" },
  { name: "Ngozi Nwankwo", gift: "P30" },
  { name: "David Olawale", gift: "P2" },
  { name: "Fatima Yusuf", gift: "P5" },
  { name: "Samuel Ibeh", gift: "P50" },
  { name: "Blessing Ojo", gift: "P2" },
  { name: "Tope Akin", gift: "D1GB" },
  { name: "Ibrahim Musa", gift: "P2" },

  { name: "Amara Obi", gift: "P2" },
  { name: "Seyi Adebanjo", gift: "P5" },
  { name: "Oluchi Okafor", gift: "SPIN1" },
  { name: "Tunde Balogun", gift: "P30" },
  { name: "Grace Eze", gift: "P2" },
  { name: "John Danladi", gift: "P30" },
  { name: "Victoria Anike", gift: "P5" },
  { name: "Hassan Sule", gift: "P2" },
  { name: "Precious Nnaji", gift: "P50" },
  { name: "Emmanuel Udoh", gift: "P2" },

  { name: "Ezinne Ike", gift: "SPIN1" },
  { name: "Collins Adegoke", gift: "P2" },
  { name: "Sarah Omoruyi", gift: "P5" },
  { name: "Bola Olatunji", gift: "P500" },
  { name: "Kelechi Ugo", gift: "P2" },
  { name: "Ruth James", gift: "P30" },
  { name: "Musa Lawal", gift: "SPIN1" },
  { name: "Janet Iruobe", gift: "P2" },
  { name: "Femi Johnson", gift: "D2GB" },
  { name: "Adaora Chukwu", gift: "P50" },

  { name: "Ifeanyi Nwosu", gift: "P2" },
  { name: "Zainab Ali", gift: "SPIN1" },
  { name: "Peter Omo", gift: "P30" },
  { name: "Chioma Opara", gift: "P2" },
  { name: "Gabriel Bassey", gift: "P5" },
  { name: "Vivian Ode", gift: "P2" },
  { name: "Ayo Abiodun", gift: "P500" },
  { name: "Bisi Edet", gift: "P2" },
  { name: "Gloria Mohammed", gift: "SPIN1" },
  { name: "Daniel Okon", gift: "P2" },

  { name: "Kemi Peters", gift: "P30" },
  { name: "Olamide Afolabi", gift: "P2" },
  { name: "Stanley Obi", gift: "P5" },
  { name: "Helen Audu", gift: "P2" },
  { name: "Lawrence Idris", gift: "P30" },
  { name: "Chisom Orji", gift: "SPIN1" },
  { name: "Mary Ogbor", gift: "D1GB" },
  { name: "Tobi Ade", gift: "P2" },
  { name: "Bukky Salami", gift: "P5" },
  { name: "Joseph Okoro", gift: "P2" },

  // 50 more added
  { name: "Chris Ekanem", gift: "P2" },
  { name: "Joy Ajayi", gift: "P5" },
  { name: "Segun Alabi", gift: "SPIN1" },
  { name: "Modupe Onah", gift: "P50" },
  { name: "Jude Nnamdi", gift: "P2" },
  { name: "Princess Adamu", gift: "P30" },
  { name: "Tunde Shittu", gift: "P500" },
  { name: "Adaeze Mgbe", gift: "D1GB" },
  { name: "Yusuf Garba", gift: "P2" },
  { name: "Tomi Eze", gift: "SPIN1" },

  { name: "Cynthia Obi", gift: "P2" },
  { name: "Chuka Eze", gift: "D2GB" },
  { name: "Mariam Umeh", gift: "P5" },
  { name: "Paul Adejoh", gift: "P2" },
  { name: "Deborah Odili", gift: "P50" },
  { name: "Jamal Danjuma", gift: "P2" },
  { name: "Ifeoma Ude", gift: "SPIN1" },
  { name: "Tolu Idowu", gift: "P30" },
  { name: "Mabel Alade", gift: "P2" },
  { name: "Kelvin Ogbodo", gift: "P500" },

  { name: "Hope Nwogu", gift: "P2" },
  { name: "Jumoke Adesina", gift: "P5" },
  { name: "Efe Bob", gift: "SPIN1" },
  { name: "Ugochukwu Obi", gift: "P2" },
  { name: "Moyin Lawal", gift: "D1GB" },
  { name: "Ezinne Oka", gift: "P2" },
  { name: "Chijioke Anyanwu", gift: "P50" },
  { name: "Blessing Achonu", gift: "P30" },
  { name: "Timi Ogundele", gift: "P2" },
  { name: "Ibrahim Dikko", gift: "SPIN1" },

  { name: "Queen Adisa", gift: "P2" },
  { name: "Henry Nweke", gift: "P5" },
  { name: "Adanna Uya", gift: "P2" },
  { name: "Jide Oladipo", gift: "P30" },
  { name: "Sandra Edem", gift: "P2" },
  { name: "Ovie Solomon", gift: "P500" },
  { name: "Agnes Ehio", gift: "SPIN1" },
  { name: "Goodnews Ayo", gift: "P2" },
  { name: "Lilian Shehu", gift: "D1GB" },
  { name: "Edward Ogba", gift: "P2" },

  { name: "Chima Promise", gift: "P5" },
  { name: "Funke Dada", gift: "P2" },
  { name: "Okey Nwankwo", gift: "P30" },
  { name: "Timi Olu", gift: "P2" },
  { name: "Idara Ekong", gift: "SPIN1" },
  { name: "Faith Iroko", gift: "P2" },
  { name: "Alex Ojo", gift: "P50" },
  { name: "Nadia Okeke", gift: "P2" },
  { name: "Micheal Nsa", gift: "P5" },
  { name: "Gbenga Ajayi", gift: "P2" },

  { name: "Rasheed Abiola", gift: "P2" },
  { name: "Kosi Umeh", gift: "P5" },
  { name: "Oluwatobi Fashola", gift: "SPIN1" },
  { name: "Zara Udoh", gift: "P30" },
  { name: "Jimoh Bamidele", gift: "D2GB" },
  { name: "Esther Aremu", gift: "P50" },
  { name: "Taye Jamiu", gift: "P2" },
  { name: "Rosemary Nwachukwu", gift: "P500" },
  { name: "Oluwaseun Banjo", gift: "P2" },
  { name: "Janet Oche", gift: "SPIN1" },

  { name: "Musa Sani", gift: "P5" },
  { name: "Somto Okon", gift: "D1GB" },
  { name: "Chukwudi Azubuike", gift: "P2" },
  { name: "Patience Ode", gift: "P30" },
  { name: "Destiny Uka", gift: "SPIN1" },
  { name: "Ovie Osereme", gift: "P2" },
  { name: "Abdul Malik", gift: "P50" },
  { name: "Ekaette Eyo", gift: "P5" },
  { name: "Hauwa Isa", gift: "D1GB" },
  { name: "Benjamin Eru", gift: "P2" },

  { name: "Donald Ume", gift: "SPIN1" },
  { name: "Funmilayo Ojo", gift: "P30" },
  { name: "Chioma Ilo", gift: "P2" },
  { name: "Raymond Etim", gift: "P500" },
  { name: "Blessing Saliu", gift: "P2" },
  { name: "Amina Bello", gift: "P5" },
  { name: "Ogechi Nnenna", gift: "D2GB" },
  { name: "Christian Udoh", gift: "P2" },
  { name: "Temitope Salawu", gift: "SPIN1" },
  { name: "Ejiro Ikponmwen", gift: "P50" },

  { name: "Franca Udoka", gift: "P2" },
  { name: "Chijioke Uzoma", gift: "P30" },
  { name: "Harmony Anaba", gift: "P2" },
  { name: "Olamide Osho", gift: "P500" },
  { name: "Bashiru Adeyemi", gift: "SPIN1" },
  { name: "Chidera Odukwe", gift: "P2" },
  { name: "Precious Umar", gift: "P5" },
  { name: "Adaobi Akpan", gift: "D1GB" },
  { name: "Usman Gambo", gift: "P2" },
  { name: "Chioma Igwe", gift: "P30" },

  { name: "Gbenga Adisa", gift: "SPIN1" },
  { name: "Marvellous Obi", gift: "P2" },
  { name: "Onyeka Ibeh", gift: "P50" },
  { name: "Grace Enwere", gift: "P2" },
  { name: "Hamza Mohammed", gift: "D2GB" },
  { name: "Pere Solomon", gift: "P5" },
  { name: "Deborah Omali", gift: "P2" },
  { name: "Adekunle Elisha", gift: "SPIN1" },
  { name: "Farida Yakubu", gift: "P500" },
  { name: "Daniel Uwa", gift: "P2" },

  { name: "Sodiq Sulaiman", gift: "P30" },
  { name: "Ifeoma Attah", gift: "SPIN1" },
  { name: "Kenny Obi", gift: "P2" },
  { name: "Gideon Sarki", gift: "P50" },
  { name: "Faith Chidimma", gift: "D1GB" },
  { name: "David Kyari", gift: "P2" },
  { name: "Ngozi Fubara", gift: "P5" },
  { name: "Halima Yusuf", gift: "P2" },
  { name: "Shola Adedeji", gift: "SPIN1" },
  { name: "Victor Amadi", gift: "P30" },

  { name: "Wisdom Ikpe", gift: "P2" },
  { name: "Opeyemi Daniel", gift: "P50" },
  { name: "Chiamaka Moses", gift: "D2GB" },
  { name: "Aliyu Tijani", gift: "P2" },
  { name: "Juliet Okon", gift: "SPIN1" },
  { name: "Raphael Uso", gift: "P5" },
  { name: "Nancy Ajayi", gift: "P2" },
  { name: "Lukman Akorede", gift: "P500" },
  { name: "Damilola Aina", gift: "P2" },
  { name: "Helen Udeme", gift: "P30" },

  { name: "Titus Osagie", gift: "P2" },
  { name: "Eunice Omo", gift: "SPIN1" },
  { name: "Majid Bello", gift: "P50" },
  { name: "Ezinne Mercy", gift: "P2" },
  { name: "Ahmed Bassey", gift: "D2GB" },
  { name: "Michelle Atang", gift: "P5" },
  { name: "Bello Idris", gift: "P2" },
  { name: "Diana Otobo", gift: "P30" },
  { name: "Sunday Ogini", gift: "SPIN1" },
  { name: "Samson Eze", gift: "P2" },

  { name: "Teresa Nwoke", gift: "P500" },
  { name: "Nicholas Onu", gift: "P2" },
  { name: "Zara Sule", gift: "P5" },
  { name: "Olabisi Thompson", gift: "P2" },
  { name: "Ebere Okorie", gift: "SPIN1" },
  { name: "Kehinde Ogini", gift: "P30" },
  { name: "Chinyere Uka", gift: "P2" },
  { name: "Muhammed Faruk", gift: "P50" },
  { name: "Kelvin Okoh", gift: "P2" },
  { name: "Folake Omari", gift: "D1GB" },

  // ----- KEEP GOING BELOW -----
  { name: "Daniel Obiakor", gift: "P2" },
  { name: "Zoe Onwudiwe", gift: "P30" },
  { name: "Akinlade Mutiu", gift: "SPIN1" },
  { name: "Isabella Ode", gift: "P2" },
  { name: "Hassan Muktar", gift: "P500" },
  { name: "Micheal Fana", gift: "P5" },
  { name: "Sarah Chinyere", gift: "D2GB" },
  { name: "Ibrahim Atta", gift: "P2" },
  { name: "Justina Orji", gift: "SPIN1" },
  { name: "Onome Ovie", gift: "P50" },

  { name: "Francis Ugwu", gift: "P2" },
  { name: "Aisha Ahmed", gift: "P30" },
  { name: "Ijeoma Enyi", gift: "P2" },
  { name: "Temitope Afolalu", gift: "SPIN1" },
  { name: "Sebastian Nwaju", gift: "P500" },
  { name: "Angela Anozie", gift: "P2" },
  { name: "Marylyn Akpan", gift: "P5" },
  { name: "Sule Raji", gift: "P2" },
  { name: "Nathan Eme", gift: "D1GB" },
  { name: "Oyinade Bello", gift: "P2" }
];

// Higher weight = higher chance to appear
const gifts = [
    // COMMON
    { code: "P2", name: "2 Points 🎯", weight: 300 },
    { code: "P5", name: "5 Points 🎉", weight: 200 },
    { code: "SPIN1", name: "1 Free Spin 🔄", weight: 180 },
    { code: "P30", name: "30 Points 💵", weight: 30 },

    // UNCOMMON
    { code: "P50", name: "50 Points 💳", weight: 10 },

    // RARE
    { code: "D1GB", name: "1GB Data 🚀", weight: 3 },
    { code: "D2GB", name: "2GB Data 🔥", weight: 0 },
    { code: "P500", name: "500 Points 💸", weight: 0 }
];

const arc = (2 * Math.PI) / gifts.length;

function drawWheel() {
    ctx.clearRect(0, 0, W, H);

    // Draw wheel slices
    for (let i = 0; i < gifts.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 ? "#ffeb3b" : "#ffc107";
        ctx.moveTo(CX, CY);
        ctx.arc(CX, CY, R, i * arc, (i + 1) * arc);
        ctx.lineTo(CX, CY);
        ctx.fill();

        // Labels
        ctx.save();
        ctx.translate(CX, CY);
        ctx.rotate(i * arc + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText(gifts[i].name, R - 20, 10);
        ctx.restore();
    }

    // Draw boundary dots LAST so they don't overwrite
    for (let i = 0; i < gifts.length; i++) {
        const a = i * arc;
        const dotX = CX + Math.cos(a) * (R - 10);
        const dotY = CY + Math.sin(a) * (R - 10);

        ctx.beginPath();
        ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#000"; // black dots
        ctx.fill();
    }
}

function highlightSlice(index) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, R, index * arc, (index + 1) * arc);
    ctx.lineTo(CX, CY);
    ctx.fill();
    ctx.restore();
}

drawWheel();

let spinning = false;
let spinInterval;
let angle = 0; // degrees

// helper: set wheel rotation
function setRotation(deg) {
    wheelCanvas.style.transform = `rotate(${deg}deg)`;
}

function pickWeightedGift() {
    const totalWeight = gifts.reduce((sum, g) => sum + g.weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < gifts.length; i++) {
        if (random < gifts[i].weight) return i;
        random -= gifts[i].weight;
    }
    return gifts.length - 1; // fallback
}

const fingerGuide = document.getElementById("fingerGuide");

document.getElementById("spinBtn").onclick = async function () {
    if (spinning) return;

    const spinBtn = document.getElementById("spinBtn");
    spinBtn.disabled = true;
    spinBtn.style.cursor = "not-allowed";
    spinBtn.style.transition = "opacity 0.3s ease";
    spinBtn.style.opacity = "0.6";

    // CHECK AGAIN before spinning
    const res = await fetch("https://api.payuee.com/payuee/spin/spin-action", {
        method: "POST",
        credentials: "include",
    });

    const data = await res.json();

    if (data.error) {
        showNotification("🚫 " + data.error); // e.g. “Come back tomorrow”
        return;
    }

    closeBtn.disabled = true;
    closeBtn.style.opacity = "0.5";        // fade effect
    closeBtn.style.pointerEvents = "none"; // disable clicking

    stopClicked = false; // RESET here

    drawWheel();  // <-- RESET highlight before a new spin

    spinning = true;

    // Show finger guide after 2 seconds
    setTimeout(() => {
        if (!stopClicked) {
            fingerGuide.style.display = "block";
        }
    }, 2000); // 20000ms = 2 second

    spinInterval = setInterval(() => {
        angle += 12; // fast spin
        setRotation(angle);
    }, 16);
};

document.getElementById("stopBtn").onclick = function () {
    if (!spinning) return;

    // Enable button back after spin
    closeBtn.disabled = false;
    closeBtn.style.opacity = "1";
    closeBtn.style.pointerEvents = "auto";

    stopClicked = true; // PREVENT future finger guide
    fingerGuide.style.display = "none"; // hide immediately

    clearInterval(spinInterval);
    spinning = false;

    const winningIndex = pickWeightedGift(); // weighted prize

    let speed = 25;
    const friction = 0.995;
    const minSpeed = 0.05;
    let lastTickSector = -1;
    const sectorAngle = 360 / gifts.length;
    const pointerDeg = 270;

    stopClicked = true;
    fingerGuide.style.display = "none";

    const slowInterval = setInterval(() => {
        // Natural deceleration
        speed *= friction;
        angle += speed;
        setRotation(angle);

        // Tick effect for each sector
        const raw = (pointerDeg - (angle % 360) + 360) % 360;
        const currentSector = Math.floor(raw / sectorAngle);
        if (currentSector !== lastTickSector) {
            lastTickSector = currentSector;
        }

        // When wheel is slow, switch to final gentle nudge
        if (speed < 0.2) {
            const targetAngle = (360 - (winningIndex * sectorAngle + sectorAngle / 2) + pointerDeg) % 360
                + Math.floor(angle / 360) * 360;

            let delta = targetAngle - angle;

            // Set a maximum final nudge speed smaller than current speed
            const finalStep = Math.min(0.15, Math.abs(delta)) * Math.sign(delta);
            angle += finalStep;
            setRotation(angle);

            // Stop when very close
            if (Math.abs(delta) < 0.05) {
                clearInterval(slowInterval);
                angle = targetAngle;
                setRotation(angle);

                drawWheel();
                highlightSlice(winningIndex);

                // ADD THIS BEFORE USING prizeText
                const prizeText = gifts[winningIndex].name;

                // NOW THIS WILL WORK
                const prizeObj = gifts.find(g => prizeText.includes(g.name));

                // HANDLE POINTS WON
                if (prizeObj.code === "P2") {
                    pointID = "P2";
                    pointValue = 2; // 2 points
                } 
                else if (prizeObj.code === "P5") {
                    pointID = "P5";
                    pointValue = 5; // 5 points
                }
                else if (prizeObj.code === "P30") {
                    pointID = "P30";
                    pointValue = 30; // 30 points
                }
                else if (prizeObj.code === "P50") {
                    pointID = "P50";
                    pointValue = 50; // 50 points
                }
                else if (prizeObj.code === "P500") {
                    pointID = "P500";
                    pointValue = 500; // 500 points
                }
                else {
                    pointID = "";
                    pointValue = 0;
                }

                showWinnerPopup("You won: " + gifts[winningIndex].name);
                launchConfetti();

                // console.log("POINT WON:", pointID, " VALUE:", pointValue);

                const spinBtn = document.getElementById("spinBtn");
                spinBtn.disabled = false;
                spinBtn.style.cursor = "pointer";
                spinBtn.style.opacity = "1";
            }
        }

    }, 16); // ~60fps
};

document.getElementById("buySpinBtn").onclick = function () {
    // Check if user already has points or wallet balance
    let userPoints = Number(localStorage.getItem("userPoints") || 0);

    if (userPoints >= 10) {
        userPoints -= 10;
        localStorage.setItem("userPoints", userPoints);

        // Increase free spins
        let spins = Number(localStorage.getItem("freeSpins") || 0);
        spins++;
        localStorage.setItem("freeSpins", spins);

        showWinnerPopup("🛒 Purchase Successful! +1 Spin Added 🔄");
    } else {
        showWinnerPopup("⚠ Not Enough Points! Need 5 Points");
    }
};


function showCelebration(text) {
    const resultEl = document.getElementById("result");
    resultEl.innerText = "🎉 " + text + " 🎉";

    // Animate popup
    resultEl.classList.remove("show");
    void resultEl.offsetWidth; // force reflow
    resultEl.classList.add("show");

    // Confetti
    launchConfetti();

    // hide after 4
    setTimeout(() => {
        resultEl.classList.remove("show");
    }, 4000);
}

// Simple confetti effect
function launchConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    const confettis = [];

    // generate confetti pieces
    for (let i = 0; i < 150; i++) {
        confettis.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * 20 + 10,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < confettis.length; i++) {
            const c = confettis[i];
            ctx.beginPath();
            ctx.lineWidth = c.r;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
            ctx.stroke();
        }
        update();
    }

    function update() {
        for (let i = 0; i < confettis.length; i++) {
            const c = confettis[i];
            c.tiltAngle += c.tiltAngleIncrement;
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.tilt = Math.sin(c.tiltAngle) * 15;
            if (c.y > canvas.height) {
                c.y = -10;
                c.x = Math.random() * canvas.width;
            }
        }
    }

    let animFrame;
    function animate() {
        draw();
        animFrame = requestAnimationFrame(animate);
    }

    animate();

    // stop after 4s
    setTimeout(() => {
        cancelAnimationFrame(animFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 10000);
}

function showWinnerPopup(prizeText) {
    const popup = document.getElementById("winnerPopup");
    const prizeEl = document.getElementById("winnerPrize");

    prizeEl.innerText = prizeText;
    popup.classList.remove("show");
    void popup.offsetWidth;
    popup.classList.add("show");

    // FIND THE PRIZE OBJECT
    const prizeObj = gifts.find(g => prizeText.includes(g.name));

    if (!prizeObj) return; // safety

    // POINTS REWARD
    if (prizeObj.code.startsWith("P")) {
        // Send TO BACKEND IF POINT PRIZE
        fetch("https://api.payuee.com/payuee/spin/claim-prize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ 
                prize_type: "points", 
                points_given: pointValue 
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
            showNotification("⚠ Failed to claim: " + data.error);
            } else {
            showNotification("🎯 Points Added Successfully!");
            }
        });
    }

    // FREE SPIN
    if (prizeObj.code === "SPIN1") {
        // Send TO BACKEND IF SOIN PRIZE
        fetch("https://api.payuee.com/payuee/spin/claim-prize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                prize_type: "extra_spin",
                points_given: 0   // still needed in JSON
            }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
            showNotification("⚠ Failed to claim: " + data.error);
            } else {
            showNotification("🎯 Points Added Successfully!");
            }
        });
    }

    // DATA — OPEN CLAIM POPUP
    if (prizeObj.code.startsWith("D")) {
        popup.classList.remove("show"); // hide winner popup
        showClaimPopup(prizeObj);        // open data claim
    }

    // hide default popup after 6s
    setTimeout(() => {
        popup.classList.remove("show");
    }, 6000);
}

// SMALL CONFETTI FOR NOTIFICATION
function showSmallConfetti() {
  const duration = 1000; // 1 second
  const animationEnd = Date.now() + duration;

  const defaults = { 
    startVelocity: 30,
    spread: 360,       // full spread
    ticks: 60,
    scalar: 0.8,
    gravity: 1,
    particleCount: 10  // small burst
  };

  function frame() {
    confetti({
      ...defaults,
      origin: {
        x: Math.random() * 0.2 + 0.75,  // top right area
        y: Math.random() * 0.2 + 0.05
      }
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  }
  frame();
}

function showClaimPopup(prizeObj) {
    const claimPopup = document.getElementById("claimPopup");
    document.getElementById("claimPrize").innerText =
        `🎁 ${prizeObj.name} — Enter details to claim`;

    claimPopup.style.pointerEvents = "auto";
    claimPopup.classList.add("show");

    document.getElementById("claimBtn").onclick = function () {
        const phone = document.getElementById("phoneInput").value.trim();
        const network = document.getElementById("networkSelect").value;

        if (!/^\d{11}$/.test(phone)) {
            alert("Phone number must be exactly 11 digits!");
            return;
        }

        if (!phone || !network) {
            alert("Please enter phone & network 🚨");
            return;
        }

        phoneNet = phone;

        // console.log("DATA CLAIM:", { phone, network, prize: prizeObj.code });

        // HERE YOU SEND TO API (backend)
        alert(`📡 SUBSCRIBING ${phone} to ${prizeObj.name} on ${network}...`);

        claimPopup.classList.remove("show");
    };
}

// SHOW NOTIFICATION (top right)
function showNotification(message) {
  const container = document.getElementById("liveNotifications");

  // CREATE ELEMENT
  const note = document.createElement("div");
  note.classList.add("notify-item");
  note.innerText = message;
  
  container.appendChild(note);

  // FORCE REPAINT (for animation)
  void note.offsetWidth;

  // SHOW
  setTimeout(() => {
    note.classList.add("show");
    showSmallConfetti();  // 🎉 TRIGGER HERE
  }, 100);

  // REMOVE AFTER 5 sec
  setTimeout(() => {
    note.classList.remove("show");
    note.classList.add("hide");
    setTimeout(() => {
      note.remove();
    }, 400);
  }, 5000);
}

function showNotificationError(message) {
  const container = document.getElementById("liveNotifications");

  // CREATE ELEMENT
  const note = document.createElement("div");
  note.classList.add("notify-item");
  note.innerText = message;
  
  container.appendChild(note);

  // FORCE REPAINT (for animation)
  void note.offsetWidth;
}

function getRandomWinner() {
  const randomIndex = Math.floor(Math.random() * winners.length);
  return winners[randomIndex]; // ❌ NO SPLICE — keep it in array
}

function showRandomWinnerNotification() {
  const winner = getRandomWinner();
  if (!winner) return; // If no winners left, stop

  // find gift name from gift code
  const giftObj = gifts.find(g => g.code === winner.gift);
  const giftName = giftObj ? giftObj.name : winner.gift;

  // Show in notification
  showNotification(`🎉 ${winner.name} just won ${giftName}!`);
}

function getRandomTime() {
  return Math.floor(Math.random() * 13000) + 1000; // 1s - 13s
}

const originalWinners = [...winners]; // backup

function startRandomNotifications() {
  if (winners.length === 0) {
    winners.push(...originalWinners); // reset when empty
  }

  const winner = getRandomWinner();
  const giftObj = gifts.find(g => g.code === winner.gift);
  const giftName = giftObj ? giftObj.name : winner.gift;

  showNotification(`🎉 ${winner.name} just won ${giftName}!`);

  setTimeout(startRandomNotifications, getRandomTime()); // random 1–13 sec
}

// Example: Start when user opens the app
startRandomNotifications();

// CLOSE BUTTON FUNCTION
document.getElementById("closeSpinModal").addEventListener("click", () => {
    document.getElementById("dailySpinModal").style.display = "none";
});

// REMOVE THIS AFTER TESTING
// window.onload = () => {
//     document.getElementById("dailySpinModal").style.display = "flex";
// }


// Show popup after login
// function checkDailySpinReward() {
//   const lastSpinDate = localStorage.getItem("lastSpinDate");
//   const today = new Date().toDateString();

//   if (lastSpinDate !== today) {
//     localStorage.setItem("lastSpinDate", today);
    // setTimeout(() => {
    // document.getElementById("dailySpinModal").style.display = "flex";
    // }, 3000);
//   }
// }

// Call this AFTER USER LOGINS successfully:
// checkDailySpinReward();

// =================================
// DATA GIFTING
// =================================
let planIDSpin = ""; // variable to update
let bundleSpin = ""; // variable to update
let servicePlanIDSpin = ""; // for data purchase

const networkSelect = document.getElementById("networkSelect");

networkSelect.addEventListener("change", function () {
     servicePlanIDSpin = this.value;

    if (selectedNetwork === "mtn_sme") {
        planIDSpin = "166"; // MTN plan ID
        bundleSpin = "1GB - 30days"; // MTN bundleSpin ID
    } else if (selectedNetwork === "airtel_gifting") {
        planIDSpin = "426"; // Airtel plan ID
        bundleSpin = "1.0 GB - 1 day"; // Airtel bundleSpin ID
    } else if (selectedNetwork === "glo_data") {
        planIDSpin = "1000"; // Glo plan ID
        bundleSpin = "1GB - 30days"; // Glo bundleSpin ID
    } else if (selectedNetwork === "etisalat_data") {
        planIDSpin = "298"; // 9mobile plan ID
        bundleSpin = "1GB for 30 Days"; // 9mobile bundleSpin ID
    } else {
        planIDSpin = ""; // no selection
        bundleSpin = "1GB - 30days"; // no selection
    }

    console.log("Selected Network:", servicePlanIDSpin);
});

document.getElementById('claimBtn').addEventListener('click', async function (event) {
    event.preventDefault();

    if (validated) {
        deactivateButtonStyles();
        const user = {
            PaymentType: "wallet",
            ServiceID: "data_spin_free",
            NetworkPlan: servicePlanIDSpin,
            PlanID: planIDSpin,
            Bundle: bundleSpin,
            Price: 0,
            TranCharge: 0,
            PhoneNumber: phoneNet,
            AutoRenew: false,
        };

        const apiUrl = "https://api.payuee.com/payuee/init-transaction";

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', // set credentials to include cookies
            body: JSON.stringify(user),
        };

        try {
            const response = await fetch(apiUrl, requestOptions);
            // alert("this is the error message 1: ", response);

            // console.log(response);
            if (!response.ok) {
                const errorData = await response.json();

                // alert("this is the error message: ", errorData);

                if (errorData.error === 'Failed to unmarshal data request from client side...') {
                    showError('NAN', 'incorrect body format');
                } else if (errorData.error === 'This email is invalid because it uses illegal characters. Please enter a valid email') {
                    showError('NAN', 'This is an invalid email address. Please enter a valid email address.');
                } else if (errorData.error === 'No Authentication cookie found' || errorData.error === "Unauthorized attempt! JWT's not valid!" || errorData.error === "No Refresh cookie found") {
                    // let's log user out the users session has expired
                    await logUserOutIfTokenIsExpired();
                } else if (errorData.error === 'insufficient funds') {
                    insufficientFunds();
                } else if (errorData.error === 'an error occurred while trying to buy data') {
                    showError('NAN', 'Transaction reversed please check number properly before trying again.');
                } else {
                    showError('passwordError', 'An error occurred. Please try again.');
                }

                return;
            }

            const responseData = await response.json();

            // console.log('here 1')
            if (responseData.success == 'data successfully bought') {
                window.location.href = "https://payuee.com/successful.html"
                return
            } else {
                window.location.href = responseData.success.data.authorization_url;
                return
            }
        } finally {
            reactivateButtonStyles();
        }
    }
});

async function checkUserSpinStatus() {
  try {
    const res = await fetch("https://api.payuee.com/payuee/spin/status", {   // adjust for your API route
      method: "GET",
      credentials: "include",  // if you’re using cookies/session
    });

    const data = await res.json();

    if (data.error) {
      showNotification("❌ Error fetching spin status!");
      return;
    }

    // data example: { available_spins: 1, lastSpinDate: "2025-11-23" }
    if (data.spins_left > 0) {
        openBtn.textContent = data.spins_left + " Spins Left!"
      document.getElementById("dailySpinModal").style.display = "flex"; // SHOW MODAL
    } else {
      showNotificationError("🚫 No spins left — Come back tomorrow! 🕛");
      document.getElementById("spinBtn").disabled = true;
    }

  } catch (err) {
    // console.log(err);
    showNotificationError("⚠ Network Error! Try again later.");
  }
}

checkUserSpinStatus();  // NOT always show modal anymore
