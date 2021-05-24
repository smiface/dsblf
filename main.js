let hpbar = document.querySelector('.hpbar')
let hpBarBg = document.querySelector('.hp')
let hpDisplay = document.querySelector('.hpDisplay')

let fistRight = document.querySelector('.fistRight')
let fistLeft = document.querySelector('.fistLeft')
let hitLeftBtn = document.querySelector('.hitLeft')
let hitRightBtn = document.querySelector('.hitRight')

let faceImg = document.querySelector('.face')
let bodyArmor = document.querySelector('.bodyArmor')
let headArmor = document.querySelector('.headArmor')
let deathCounter = document.querySelector('.deathCounter')
let damageDisplay = document.querySelector('.damage')

function playRandomMoan() {
    // let number = Math.floor(Math.random() * 12)
    let song = new Audio('./sounds/punch.mp3')
    // let song = new Audio('./sounds/Moan ' + number + '.wav')
    song.play()
}

let defaultDed = {
    hp: 100,
    armor: 0,
    deathCount: 0,
    isHealing: false,
}

let attackDelay = 300;
let ded;

if (localStorage.getItem('ded') == undefined) {
    ded = defaultDed
} else {
    let localDed = JSON.parse(localStorage.getItem('ded'))
    ded = localDed
}

let damageSum = function () {
    let dmg;
    if (ded.armor < 9) {
        dmg = 10 - ded.armor
    } else {
        dmg = 1
    }

    return (
        dmg
    )
}

function updateDed() {
    localStorage.setItem('ded', JSON.stringify(ded))
}
function updateArmor() {
    if (ded.armor < 4) {
        bodyArmor.src = './img/armor' + ded.armor + '.png'
    } else if (ded.armor < 7) {
        bodyArmor.src = './img/armor' + 3 + '.png'
        headArmor.src = './img/armor' + ded.armor + '.png'
    }
}
function updateHpBar() {
    hpDisplay.innerHTML = ded.hp
    hpbar.style.width = ded.hp + '%'
}
function updateDamageDisplay(number) {
    damageDisplay.innerHTML = number
}
function updateDeathDisplay() {
    deathCounter.innerHTML = 'Перекуров : ' + ded.deathCount;
}

setInterval(() => {
    if (hpBarBg.style.backgroundColor == 'red') {
        hpBarBg.style.backgroundColor = 'grey'
    } else {
        hpBarBg.style.backgroundColor = 'red'
    }
}, attackDelay);

updateArmor()
updateDeathDisplay()
updateHpBar()
updateDamageDisplay(null)

function hitSide(btn, action) {
    if (ded.deathCount > 10) {
        alert('брух')
    }
    btn.disabled = true
    action()
    playRandomMoan()
    if (ded.hp < 21) {
        ded.armor++
        hpDisplay.innerHTML = ded.hp -= damageSum()
        ded.deathCount++
        updateArmor()
        healing()
        updateDeathDisplay()
    } else {
        ded.hp -= damageSum()
    }
}

hitRightBtn.onclick = () => {
    hitSide(this, hitRight)
}

hitLeftBtn.onclick = () => {
    hitSide(this, hitLeft)
}

function hitRight() {
    hit(fistRight, '250px', '50px', './img/fist1.png', './img/fist2.png')
}
function hitLeft() {
    hit(fistLeft, '-250px', '-100px', './img/fist3.png', './img/fist4.png')
}

function hit(side, marginBefore, marginAfter, fistBefore, fistAfter) {
    side.src = fistAfter
    side.style.marginLeft = marginAfter
    updateDamageDisplay('-' + damageSum())
    faceImg.src = './img/x2.png'

    hitRightBtn.disabled = true
    hitLeftBtn.disabled = true

    setTimeout(() => {
        side.style.marginLeft = marginBefore
        side.src = fistBefore
        faceImg.src = './img/x1.png'
        updateHpBar()
        if (ded.isHealing == false) {
            hitLeftBtn.disabled = false
        }
        updateDamageDisplay(null)

        hitRightBtn.disabled = false
        hitLeftBtn.disabled = false
    }, attackDelay);
}

function healing() {
    ded.isHealing = true
    if (ded.hp > 90) {
        hpDisplay.innerHTML = ded.hp = 100
        faceImg.src = './img/x1.png'
        ded.isHealing = false
        hitRightBtn.disabled = false
        hitLeftBtn.disabled = false
        updateDed()
    } else {
        hitRightBtn.disabled = true
        hitLeftBtn.disabled = true
        setTimeout(() => {
            ded.hp += 10
            if (faceImg.src.match('x3.png')) {
                faceImg.src = './img/x4.png'
            } else {
                faceImg.src = './img/x3.png'
            }
            hpDisplay.innerHTML = ded.hp
            healing()
        }, attackDelay);
    }
    updateHpBar()
}