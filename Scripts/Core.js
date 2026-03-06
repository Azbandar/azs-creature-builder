/*-- CORE.JS --*/
/*-- Variables --*/
/*-- Die Size Table --*/
const dieSizeTable = {
    'Tiny': { die: 'd4', average: 2.5 },
    'Small': { die: 'd6', average: 3.5 },
    'Medium': { die: 'd8', average: 4.5 },
    'Large': { die: 'd10', average: 5.5 },
    'Huge': { die: 'd12', average: 6.5 },
    'Gargantuan': { die: 'd20', average: 10.5 }
};
/*-- CR Table --*/
const crTable = {
    0: { hp: 6, prof: 2, xp: 10, dpr: 1, ac: 12 },
    0.125: { hp: 35, prof: 2, xp: 25, dpr: 3, ac: 12 },
    0.25: { hp: 49, prof: 2, xp: 50, dpr: 5, ac: 13 },
    0.5: { hp: 70, prof: 2, xp: 100, dpr: 8, ac: 13 },
    1: { hp: 85, prof: 2, xp: 200, dpr: 14, ac: 13 },
    2: { hp: 100, prof: 2, xp: 450, dpr: 20, ac: 14 },
    3: { hp: 115, prof: 2, xp: 700, dpr: 26, ac: 14 },
    4: { hp: 130, prof: 2, xp: 1100, dpr: 32, ac: 14 },
    5: { hp: 145, prof: 3, xp: 1800, dpr: 38, ac: 15 },
    6: { hp: 160, prof: 3, xp: 2300, dpr: 44, ac: 15 },
    7: { hp: 175, prof: 3, xp: 2900, dpr: 50, ac: 15 },
    8: { hp: 190, prof: 3, xp: 3900, dpr: 56, ac: 16 },
    9: { hp: 205, prof: 4, xp: 5000, dpr: 62, ac: 16 },
    10: { hp: 220, prof: 4, xp: 5900, dpr: 68, ac: 16 },
    11: { hp: 235, prof: 4, xp: 7200, dpr: 74, ac: 17 },
    12: { hp: 250, prof: 4, xp: 8400, dpr: 80, ac: 17 },
    13: { hp: 265, prof: 5, xp: 10000, dpr: 86, ac: 17 },
    14: { hp: 280, prof: 5, xp: 11500, dpr: 92, ac: 18 },
    15: { hp: 295, prof: 5, xp: 13000, dpr: 98, ac: 18 },
    16: { hp: 310, prof: 5, xp: 15000, dpr: 104, ac: 18 },
    17: { hp: 325, prof: 6, xp: 18000, dpr: 110, ac: 19 },
    18: { hp: 340, prof: 6, xp: 20000, dpr: 116, ac: 19 },
    19: { hp: 355, prof: 6, xp: 22000, dpr: 122, ac: 19 },
    20: { hp: 400, prof: 6, xp: 25000, dpr: 140, ac: 20 },
    21: { hp: 445, prof: 7, xp: 33000, dpr: 158, ac: 20 },
    22: { hp: 490, prof: 7, xp: 41000, dpr: 176, ac: 20 },
    23: { hp: 535, prof: 7, xp: 50000, dpr: 194, ac: 21 },
    24: { hp: 580, prof: 7, xp: 62000, dpr: 212, ac: 21 },
    25: { hp: 625, prof: 8, xp: 75000, dpr: 230, ac: 21 },
    26: { hp: 670, prof: 8, xp: 90000, dpr: 248, ac: 22 },
    27: { hp: 715, prof: 8, xp: 105000, dpr: 266, ac: 22 },
    28: { hp: 760, prof: 8, xp: 120000, dpr: 284, ac: 22 },
    29: { hp: 805, prof: 9, xp: 135000, dpr: 302, ac: 23 },
    30: { hp: 850, prof: 9, xp: 155000, dpr: 320, ac: 23 }
};
/*-- Skill to Ability Mapping --*/
const skillAbilityMap = {
    'acrobatics': 'dex',
    'animalhandling': 'wis',
    'arcana': 'int',
    'athletics': 'str',
    'deception': 'cha',
    'history': 'int',
    'insight': 'wis',
    'intimidation': 'cha',
    'investigation': 'int',
    'medicine': 'wis',
    'nature': 'int',
    'perception': 'wis',
    'performance': 'cha',
    'persuasion': 'cha',
    'religion': 'int',
    'sleightofhand': 'dex',
    'stealth': 'dex',
    'survival': 'wis'
};
/*-- Parse Damage --*/
function parseDamage(prefix, n, slot) {
    var dmgEl = document.getElementById(prefix + n + '-dmg' + slot);
    var modEl = document.getElementById(prefix + n + '-modcheck' + slot);
    if (!dmgEl || !modEl) { return { average: 0, display: '' }; }
    var dmg = dmgEl.value.trim();
    var modChecked = modEl.checked;
    var mod = 0;
    if (modChecked) {
        ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(function(stat) {
            var radio = document.getElementById(prefix + n + '-' + stat + 'check');
            if (radio && radio.checked) {
                mod = parseFloat(document.getElementById('ability-' + stat + 'mod').value) || 0;
            }
        });
    }
    var average = 0;
    var displayDice = '';
    var displayFlat = 0;
    if (dmg.indexOf('d') !== -1) {
        var parts = dmg.split('+');
        var dicePart = parts[0].trim();
        var flatPart = parts.length > 1 ? parseFloat(parts[1].trim()) || 0 : 0;
        var diceSplit = dicePart.split('d');
        var numDice = parseFloat(diceSplit[0]) || 0;
        var dieSize = parseFloat(diceSplit[1]) || 0;
        var diceAverage = Math.floor(numDice * ((dieSize + 1) / 2));
        displayFlat = flatPart + mod;
        average = diceAverage + displayFlat;
        displayDice = dicePart;
    } else {
        var flat = parseFloat(dmg) || 0;
        displayFlat = flat + mod;
        average = displayFlat;
        displayDice = '';
    }
    var display = '';
    if (displayDice) {
        display = average + ' (' + displayDice + (displayFlat !== 0 ? ' + ' + displayFlat : '') + ')';
    } else {
        display = String(average);
    }
    return { average: average, display: display };
}
/*-- Refresh All --*/
function refreshAll() {
    calcMods();
    calcSaves();
    calcSDC();
    calcAC();
    calcHP();
    calcPerception();
    calcEffectiveAC();
    calcEffectiveHP();
    setupRoundToggles();
    calcPerRound();
    calcEffectiveDamage();
    calcCR();
    calcProf();
    calcXP();
    calcSkills();
}
/*-- AC Calculation --*/
function calcAC() {
    var dexMod = parseFloat(document.getElementById('ability-dexmod').value) || 0;
    var adjAC = parseFloat(document.getElementById('basics-adjac').value) || 0;
    var acEl = document.getElementById('basics-ac');
    acEl.value = 10 + dexMod + adjAC;
    acEl.dispatchEvent(new Event('input'));
}
document.getElementById('basics-adjac').addEventListener('input', calcAC);
document.getElementById('ability-dexmod').addEventListener('input', calcAC);
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcAC, 0); });
calcAC();
/*-- HP Calculation --*/
function calcHP() {
    var hd = parseFloat(document.getElementById('basics-hd').value) || 0;
    var size = document.getElementById('basics-size').value;
    var conMod = parseFloat(document.getElementById('ability-conmod').value) || 0;
    var sizeData = dieSizeTable[size];
    var die = sizeData ? sizeData.die : 'd0';
    var average = sizeData ? sizeData.average : 0;
    var firstNum = Math.floor(hd * average) + hd * conMod;
    var secondNum = hd * conMod;
    document.getElementById('basics-hp').value = firstNum + ' (' + hd + die + ' + ' + secondNum + ')';
}
document.getElementById('basics-hd').addEventListener('input', calcHP);
document.getElementById('basics-size').addEventListener('input', calcHP);
document.getElementById('ability-conmod').addEventListener('input', calcHP);
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcHP, 0); });
calcHP();
/*-- CR Calculation --*/
function calcCR() {
    var effectiveAC = parseFloat(document.getElementById('effective-ac').value) || 0;
    var effectiveHP = parseFloat(document.getElementById('effective-hp').value) || 0;
    var effectiveDamage = parseFloat(document.getElementById('effective-damage').value) || 0;
    var defensiveCR = Math.floor((effectiveAC + effectiveHP) / 2);
    var cr = (defensiveCR + effectiveDamage) / 2;
    var crKeys = Object.keys(crTable).map(Number).sort(function(a, b) { return a - b; });
    var matched = crKeys[0];
    for (var i = 0; i < crKeys.length; i++) {
        if (cr >= crKeys[i]) { matched = crKeys[i]; }
    }
    var crEl = document.getElementById('basics-cr');
    crEl.value = matched;
    crEl.dispatchEvent(new Event('input'));
}
document.getElementById('effective-ac').addEventListener('input', calcCR);
document.getElementById('effective-hp').addEventListener('input', calcCR);
document.getElementById('effective-damage').addEventListener('input', calcCR);
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcCR, 0); });
calcCR();
/*-- XP Calculation --*/
function calcXP() {
    var cr = parseFloat(document.getElementById('basics-cr').value);
    var row = crTable[cr];
    document.getElementById('basics-xp').value = row ? row.xp.toLocaleString() : '';
}
document.getElementById('basics-cr').addEventListener('input', calcXP);
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcXP, 0); });
calcXP();
/*-- Proficiency Calculation --*/
function calcProf() {
    var cr = parseFloat(document.getElementById('basics-cr').value);
    var row = crTable[cr];
    document.getElementById('basics-proficiency').value = row ? row.prof : 2;
    document.getElementById('basics-proficiency').dispatchEvent(new Event('input'));
}
document.getElementById('basics-cr').addEventListener('input', calcProf);
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcProf, 0); });
calcProf();
/*-- Ability Mod Calculation --*/
function calcMods() {
    var stats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    stats.forEach(function(stat) {
        var score = parseFloat(document.getElementById('ability-' + stat + 'score').value);
        if (isNaN(score)) { score = 10; }
        var mod = Math.floor((score - 10) / 2);
        var modEl = document.getElementById('ability-' + stat + 'mod');
        modEl.value = mod > 0 ? '+' + mod : mod;
        modEl.dispatchEvent(new Event('input'));
    });
}
['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(function(stat) {
    document.getElementById('ability-' + stat + 'score').addEventListener('input', calcMods);
});
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcMods, 0); });
calcMods();
/*-- Ability Save Calculation --*/
function calcSaves() {
    var stats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    stats.forEach(function(stat) {
        var mod = parseFloat(document.getElementById('ability-' + stat + 'mod').value) || 0;
        var checked = document.getElementById('ability-' + stat + 'check').checked;
        var prof = parseFloat(document.getElementById('basics-proficiency').value) || 0;
        var save = mod + (checked ? prof : 0);
        document.getElementById('ability-' + stat + 'save').value = save > 0 ? '+' + save : save;
    });
}
['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(function(stat) {
    document.getElementById('ability-' + stat + 'check').addEventListener('change', calcSaves);
});
document.getElementById('basics-proficiency').addEventListener('input', calcSaves);
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcSaves, 0); });
calcSaves();
/*-- SDC Calculation --*/
function calcSDC() {
    var spellcasting = document.getElementById('ability-spellcasting').value;
    var stat = spellcasting.slice(0, 3).toLowerCase();
    var modEl = document.getElementById('ability-' + stat + 'mod');
    var mod = modEl ? parseFloat(modEl.value) || 0 : 0;
    var prof = parseFloat(document.getElementById('basics-proficiency').value) || 0;
    document.getElementById('ability-sdc').value = 8 + mod + prof;
}
document.getElementById('ability-spellcasting').addEventListener('input', calcSDC);
document.getElementById('basics-proficiency').addEventListener('input', calcSDC);
['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(function(stat) {
    document.getElementById('ability-' + stat + 'mod').addEventListener('input', calcSDC);
});
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcSDC, 0); });
calcSDC();
/*-- Perception Calculation --*/
function calcPerception() {
    var wisMod = parseFloat(document.getElementById('ability-wismod').value) || 0;
    var prof = parseFloat(document.getElementById('basics-proficiency').value) || 0;
    document.getElementById('senses-perception').value = 10 + wisMod + prof;
}
document.getElementById('ability-wismod').addEventListener('input', calcPerception);
document.getElementById('basics-proficiency').addEventListener('input', calcPerception);
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcPerception, 0); });
calcPerception();
/*-- Effective AC Calculation --*/
function calcEffectiveAC() {
    var ac = parseFloat(document.getElementById('basics-ac').value) || 0;
    var crKeys = Object.keys(crTable).map(Number).sort(function(a, b) { return a - b; });
    var matched = crKeys[0];
    for (var i = 0; i < crKeys.length; i++) {
        if (ac >= crTable[crKeys[i]].ac) { matched = crKeys[i]; }
    }
    document.getElementById('effective-ac').value = matched;
    document.getElementById('effective-ac').dispatchEvent(new Event('input'));
}
document.getElementById('basics-ac').addEventListener('input', calcEffectiveAC);
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcEffectiveAC, 0); });
calcEffectiveAC();
/*-- Effective HP Calculation --*/
var damageTypes = ['bludgeoning', 'piercing', 'slashing', 'acid', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'poison', 'psychic', 'radiant', 'thunder'];
function calcEffectiveHP() {
    var hd = parseFloat(document.getElementById('basics-hd').value) || 0;
    var size = document.getElementById('basics-size').value;
    var conMod = parseFloat(document.getElementById('ability-conmod').value) || 0;
    var sizeData = dieSizeTable[size];
    var average = sizeData ? sizeData.average : 0;
    var hp = Math.floor(hd * average) + hd * conMod;
    var hasImmunity = damageTypes.some(function(t) { return document.getElementById('immunity-' + t).checked; });
    var hasResistance = damageTypes.some(function(t) { return document.getElementById('resistance-' + t).checked; });
    var hasVulnerability = damageTypes.some(function(t) { return document.getElementById('vulnerability-' + t).checked; });
    if (hasImmunity) { hp = Math.floor(hp * 2); }
    else if (hasResistance) { hp = Math.floor(hp * 1.5); }
    else if (hasVulnerability) { hp = Math.floor(hp * 0.5); }
    var crKeys = Object.keys(crTable).map(Number).sort(function(a, b) { return a - b; });
    var matched = crKeys[0];
    for (var i = 0; i < crKeys.length; i++) {
        if (hp >= crTable[crKeys[i]].hp) { matched = crKeys[i]; }
    }
    document.getElementById('effective-hp').value = matched;
    document.getElementById('effective-hp').dispatchEvent(new Event('input'));
}
document.getElementById('basics-hd').addEventListener('input', calcEffectiveHP);
document.getElementById('basics-size').addEventListener('input', calcEffectiveHP);
document.getElementById('ability-conmod').addEventListener('input', calcEffectiveHP);
damageTypes.forEach(function(t) {
    document.getElementById('immunity-' + t).addEventListener('change', calcEffectiveHP);
    document.getElementById('resistance-' + t).addEventListener('change', calcEffectiveHP);
    document.getElementById('vulnerability-' + t).addEventListener('change', calcEffectiveHP);
});
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcEffectiveHP, 0); });
calcEffectiveHP();
/*-- Round Checkbox Toggle --*/
function setupRoundToggles() {
    attackSections.forEach(function(section) {
        for (var i = 1; i <= section[1]; i++) {
            for (var r = 1; r <= 3; r++) {
                (function(prefix, n, round) {
                    var check = document.getElementById(prefix + n + '-rnd' + round + 'check');
                    var rnd = document.getElementById(prefix + n + '-rnd' + round);
                    if (!check || !rnd) { return; }
                    check.addEventListener('change', function() {
                        if (check.checked) {
                            if (!rnd.value) { rnd.value = 1; }
                        } else {
                            rnd.value = '';
                        }
                        calcPerRound();
                    });
                })(section[0], i, r);
            }
        }
    });
}
setupRoundToggles();
/*-- Per Section Round Damage --*/
function calcSectionRoundDamage(prefix, n) {
    var results = [0, 0, 0];
    var container = document.getElementById(prefix + n);
    if (!container || container.style.display === 'none') { return results; }
    var dmgRow = document.getElementById(prefix + n + '-damagerow');
    if (!dmgRow || dmgRow.style.display === 'none') { return results; }
    var dmg1 = parseDamage(prefix, n, 1).average;
    var dmg2 = parseDamage(prefix, n, 2).average;
    var total = dmg1 + dmg2;
    for (var r = 1; r <= 3; r++) {
        var check = document.getElementById(prefix + n + '-rnd' + r + 'check');
        var rnd = document.getElementById(prefix + n + '-rnd' + r);
        if (check && check.checked && rnd) {
            results[r - 1] = total * (parseFloat(rnd.value) || 0);
        }
    }
    return results;
}
/*-- Per Round Totals --*/
function calcPerRound() {
    var totals = [0, 0, 0];
    attackSections.forEach(function(section) {
        for (var i = 1; i <= section[1]; i++) {
            var result = calcSectionRoundDamage(section[0], i);
            for (var r = 0; r < 3; r++) { totals[r] += result[r]; }
        }
    });
    for (var r = 1; r <= 3; r++) {
        var el = document.getElementById('perRound-round' + r);
        if (el) {
            el.value = Math.floor(totals[r - 1]) || 0;
            el.dispatchEvent(new Event('input'));
        }
    }
}
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        for (var r = 1; r <= 3; r++) {
            var check = document.getElementById(section[0] + i + '-rnd' + r + 'check');
            var rnd = document.getElementById(section[0] + i + '-rnd' + r);
            if (check) { check.addEventListener('change', calcPerRound); }
            if (rnd) { rnd.addEventListener('input', calcPerRound); }
        }
        var dmg1 = document.getElementById(section[0] + i + '-dmg1');
        var dmg2 = document.getElementById(section[0] + i + '-dmg2');
        var mod1 = document.getElementById(section[0] + i + '-modcheck1');
        var mod2 = document.getElementById(section[0] + i + '-modcheck2');
        if (dmg1) { dmg1.addEventListener('input', calcPerRound); }
        if (dmg2) { dmg2.addEventListener('input', calcPerRound); }
        if (mod1) { mod1.addEventListener('change', calcPerRound); }
        if (mod2) { mod2.addEventListener('change', calcPerRound); }
        ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(function(stat) {
            var radio = document.getElementById(section[0] + i + '-' + stat + 'check');
            if (radio) { radio.addEventListener('change', calcPerRound); }
        });
    }
});
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcPerRound, 0); });
calcPerRound();
/*-- Effective Damage Calculation --*/
function calcEffectiveDamage() {
    var r1 = parseFloat(document.getElementById('perRound-round1').value) || 0;
    var r2 = parseFloat(document.getElementById('perRound-round2').value) || 0;
    var r3 = parseFloat(document.getElementById('perRound-round3').value) || 0;
    var avg = Math.floor((r1 + r2 + r3) / 3);
    var crKeys = Object.keys(crTable).map(Number).sort(function(a, b) { return a - b; });
    var matched = crKeys[0];
    for (var i = 0; i < crKeys.length; i++) {
        var nextDpr = i + 1 < crKeys.length ? crTable[crKeys[i + 1]].dpr : Infinity;
        if (avg >= crTable[crKeys[i]].dpr && avg < nextDpr) { matched = crKeys[i]; break; }
    }
    document.getElementById('effective-damage').value = matched;
    document.getElementById('effective-damage').dispatchEvent(new Event('input'));
}
document.getElementById('perRound-round1').addEventListener('input', calcEffectiveDamage);
document.getElementById('perRound-round2').addEventListener('input', calcEffectiveDamage);
document.getElementById('perRound-round3').addEventListener('input', calcEffectiveDamage);
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcEffectiveDamage, 0); });
calcEffectiveDamage();
/*-- Skill Calculation --*/
function calcSkills() {
    Object.keys(skillAbilityMap).forEach(function(skill) {
        var stat = skillAbilityMap[skill];
        var mod = parseFloat(document.getElementById('ability-' + stat + 'mod').value) || 0;
        var checked = document.getElementById('skills-' + skill).checked;
        var prof = parseFloat(document.getElementById('basics-proficiency').value) || 0;
        var total = mod + (checked ? prof : 0);
        document.getElementById('skills-' + skill + 'mod').value = total > 0 ? '+' + total : total;
    });
}
Object.keys(skillAbilityMap).forEach(function(skill) {
    document.getElementById('skills-' + skill).addEventListener('change', calcSkills);
});
['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(function(stat) {
    document.getElementById('ability-' + stat + 'mod').addEventListener('input', calcSkills);
});
document.getElementById('basics-proficiency').addEventListener('input', calcSkills);
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(calcSkills, 0); });
calcSkills();