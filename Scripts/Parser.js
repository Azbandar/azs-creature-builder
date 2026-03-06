/*-- PARSER.JS --*/
/*-- Variables --*/
var parseStats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
/*-- Saved Cursor --*/
var savedCursor = {};
document.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('parseBtn')) { return; }
    savedCursor = {};
});
document.addEventListener('selectionchange', function() {
    var el = document.activeElement;
    if (el && el.tagName === 'TEXTAREA') {
        savedCursor = { el: el, start: el.selectionStart, end: el.selectionEnd };
    }
});
/*-- Replace Selection --*/
function replaceSelection(prefix, n, placeholder) {
    var ta = document.getElementById(prefix + n + '-description');
    if (!ta) { return; }
    var start = (savedCursor.el === ta) ? savedCursor.start : ta.value.length;
    var end = (savedCursor.el === ta) ? savedCursor.end : ta.value.length;
    ta.value = ta.value.substring(0, start) + '[' + placeholder + ']' + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + ('[' + placeholder + ']').length;
    savedCursor = { el: ta, start: ta.selectionStart, end: ta.selectionEnd };
    ta.focus();
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    renderStylized(prefix, n);
}
/*-- Render Stylized --*/
function renderStylized(prefix, n) {
    var ta = document.getElementById(prefix + n + '-description');
    var out = document.getElementById(prefix + n + '-stylized');
    if (!ta || !out) { return; }
	if (!ta.value.trim() && prefix !== 'effect') { out.value = 'Awaiting description...'; return; }
    var text = ta.value;
    var prof = parseFloat(document.getElementById('basics-proficiency').value) || 0;
    /*-- Resolve [atkmod] --*/
    var atkMod = 0;
    parseStats.forEach(function(stat) {
        var radio = document.getElementById(prefix + n + '-' + stat + 'check');
        if (radio && radio.checked) {
            atkMod = parseFloat(document.getElementById('ability-' + stat + 'mod').value) || 0;
        }
    });
    var atk = atkMod + prof;
    text = text.replaceAll('[atkmod]', atk >= 0 ? '+' + atk : String(atk));
    /*-- Resolve [range] --*/
    var rangeEl = document.getElementById(prefix + n + '-range');
    var rangeVal = rangeEl ? rangeEl.value : '';
    if (rangeVal) { text = text.replaceAll('[range]', rangeVal); }
    /*-- Resolve [damage1] --*/
    var dmg1El = document.getElementById(prefix + n + '-dmg1');
    var dmg1HasVal = dmg1El && dmg1El.value.trim();
    var type1El = document.getElementById(prefix + n + '-type1');
    var type1 = type1El ? type1El.value.toLowerCase() : '';
    if (dmg1HasVal && type1) {
        var dmg1Resolved = prefix === 'effect' ? parseEffectDamage(n, 1) : parseDamage(prefix, n, 1).display + ' ' + type1 + ' damage';
        text = text.replaceAll('[damage1]', dmg1Resolved);
    }
    /*-- Resolve [damage2] --*/
    var dmg2El = document.getElementById(prefix + n + '-dmg2');
    var dmg2HasVal = dmg2El && dmg2El.value.trim();
    var type2El = document.getElementById(prefix + n + '-type2');
    var type2 = type2El ? type2El.value.toLowerCase() : '';
    if (dmg2HasVal && type2) {
        var dmg2Resolved = prefix === 'effect' ? parseEffectDamage(n, 2) : parseDamage(prefix, n, 2).display + ' ' + type2 + ' damage';
        text = text.replaceAll('[damage2]', dmg2Resolved);
    }
    /*-- Resolve [savevs] --*/
    var statNames = prefix === 'effect'
        ? { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' }
        : { str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };
    var saveVs = '';
    parseStats.forEach(function(stat) {
        var radio = document.getElementById(prefix + n + '-' + stat + 'check');
        if (radio && radio.checked) { saveVs = statNames[stat]; }
    });
    if (saveVs) { text = text.replaceAll('[savevs]', saveVs); }
    /*-- Resolve [sdc] --*/
    var sdcOverrideEl = document.getElementById(prefix + n + '-sdcoverride');
    var sdcOverride = sdcOverrideEl ? sdcOverrideEl.value.trim() : '';
    var sdcVal = sdcOverride ? sdcOverride : (document.getElementById('ability-sdc').value || '');
    if (sdcVal) {
        var sdcResolved = prefix === 'effect' ? sdcVal : 'DC ' + sdcVal;
        text = text.replaceAll('[sdc]', sdcResolved);
    }
    /*-- Resolve [shape] --*/
    var shapes = ['cone', 'radius', 'line', 'cube'];
    var shapeVal = '';
    shapes.forEach(function(shape) {
        var radio = document.getElementById(prefix + n + '-' + shape + 'check');
        if (radio && radio.checked) { shapeVal = shape; }
    });
    if (shapeVal) { text = text.replaceAll('[shape]', shapeVal); }
    /*-- Resolve [condition] --*/
    var conditionEl = document.getElementById(prefix + n + '-condition');
    var conditionVal = conditionEl ? conditionEl.value : '';
    if (conditionVal) { text = text.replaceAll('[condition]', conditionVal); }
    /*-- Resolve [conditionend] --*/
    var conditionEndEl = document.getElementById(prefix + n + '-conditionend');
    var conditionEndVal = conditionEndEl ? conditionEndEl.value : '';
    if (conditionEndVal) { text = text.replaceAll('[conditionend]', conditionEndVal); }
    /*-- Resolve [note1] [note2] [note3] --*/
    ['note1', 'note2', 'note3'].forEach(function(note) {
        var noteEl = document.getElementById(prefix + n + '-' + note);
        var noteVal = noteEl ? noteEl.value : '';
        if (noteVal) { text = text.replaceAll('[' + note + ']', noteVal); }
    });
    /*-- Resolve [meleerange] --*/
    var meleeEl = document.getElementById(prefix + n + '-meleecheck');
    var rangeCheckEl = document.getElementById(prefix + n + '-rangecheck');
    if (meleeEl && meleeEl.checked) { text = text.replaceAll('[meleerange]', 'melee'); }
    else if (rangeCheckEl && rangeCheckEl.checked) { text = text.replaceAll('[meleerange]', 'range'); }
    out.value = text;
    /*-- Aura Override (effects only) --*/
	if (prefix === 'effect') {
		var auraEl = document.getElementById(prefix + n + '-auracheck');
		if (auraEl && auraEl.checked) {
			var effectName = (document.getElementById(prefix + n + '-name') || {}).value || '';
			var auraRange = (document.getElementById(prefix + n + '-range') || {}).value || '';
			var notEl = document.getElementById(prefix + n + '-notcheck');
			var notStr = (notEl && notEl.checked) ? '!' : '';
			var faction = '';
			if ((document.getElementById(prefix + n + '-allcheck') || {}).checked) { faction = 'all'; }
			else if ((document.getElementById(prefix + n + '-friendcheck') || {}).checked) { faction = 'friend'; }
			else if ((document.getElementById(prefix + n + '-foecheck') || {}).checked) { faction = 'foe'; }
			else if ((document.getElementById(prefix + n + '-allycheck') || {}).checked) { faction = 'ally'; }
			else if ((document.getElementById(prefix + n + '-enemycheck') || {}).checked) { faction = 'enemy'; }
			else if ((document.getElementById(prefix + n + '-neutralcheck') || {}).checked) { faction = 'neutral'; }
			else if ((document.getElementById(prefix + n + '-nonecheck') || {}).checked) { faction = 'none'; }
			var extras = [];
			if ((document.getElementById(prefix + n + '-oncecheck2') || {}).checked) { extras.push('once'); }
			if ((document.getElementById(prefix + n + '-cubecheck') || {}).checked) { extras.push('cube'); }
			if ((document.getElementById(prefix + n + '-stickycheck') || {}).checked) { extras.push('sticky'); }
			var customEffectEl = document.getElementById(prefix + n + '-customeffect');
			var customEffectVal = customEffectEl ? customEffectEl.value.trim().toLowerCase() : '';
			if (customEffectVal) { extras.push(customEffectVal); }
			var extrasStr = extras.length ? ', ' + extras.join(', ') : '';
			out.value = effectName + '; AURA: ' + auraRange + ' ' + notStr + faction + extrasStr + '; ' + effectName + '; ' + text;
		}
	}
}
/*-- Render All Stylized --*/
function renderAllStylized() {
    attackSections.forEach(function(section) {
        for (var i = 1; i <= section[1]; i++) {
            renderStylized(section[0], i);
        }
    });
    for (var i = 1; i <= maxEffects; i++) {
        renderStylized('effect', i);
    }
}
/*-- Render Simplified --*/
function renderSimplified(prefix, n) {
    var out = document.getElementById(prefix + n + '-simplified');
    if (!out) { return; }
    var meleeEl = document.getElementById(prefix + n + '-meleecheck');
    var rangeEl = document.getElementById(prefix + n + '-rangecheck1');
    var saveEl = document.getElementById(prefix + n + '-savecheck');
    var isMelee = meleeEl && meleeEl.checked;
    var isRange = rangeEl && rangeEl.checked;
    var isSave = saveEl && saveEl.checked;
    if (!isMelee && !isRange && !isSave) { out.value = 'Awaiting description...'; return; }
    if (isSave) { renderSimplifiedSave(prefix, n); return; }
    var prof = parseFloat(document.getElementById('basics-proficiency').value) || 0;
    var atkMod = 0;
    parseStats.forEach(function(stat) {
        var radio = document.getElementById(prefix + n + '-' + stat + 'check');
        if (radio && radio.checked) {
            atkMod = parseFloat(document.getElementById('ability-' + stat + 'mod').value) || 0;
        }
    });
    var atk = atkMod + prof;
    var atkStr = atk >= 0 ? '+' + atk : String(atk);
    var atkDisplay = (atkMod === 0 && !parseStats.some(function(stat) { var r = document.getElementById(prefix + n + '-' + stat + 'check'); return r && r.checked; })) ? '[atkmod]' : atkStr;
    var range = document.getElementById(prefix + n + '-range');
    var rangeVal = (range && range.value) ? range.value : '[range]';
    var aoeEl = document.getElementById(prefix + n + '-aoecheck');
    var rangeCheck2 = document.getElementById(prefix + n + '-rangecheck2');
    var rangeUnit = (rangeCheck2 && rangeCheck2.checked) ? '.' : ' ft.';
    var rangeStr = (aoeEl && aoeEl.checked) ? 'targets within ' + rangeVal + rangeUnit : rangeVal + rangeUnit;
    var dmg1El = document.getElementById(prefix + n + '-dmg1');
    var dmg1HasVal = dmg1El && dmg1El.value.trim();
    var type1El = document.getElementById(prefix + n + '-type1');
    var type1 = type1El ? type1El.value.toLowerCase() : '';
    var dmg1Str = (dmg1HasVal && type1) ? parseDamage(prefix, n, 1).display + ' ' + type1 + ' damage' : '[damage1]';
    var dmg2El = document.getElementById(prefix + n + '-dmg2');
    var dmg2HasVal = dmg2El && dmg2El.value.trim();
    var type2El = document.getElementById(prefix + n + '-type2');
    var type2 = type2El ? type2El.value.toLowerCase() : '';
    var dmg2Str = (dmg2HasVal && type2) ? ' plus ' + parseDamage(prefix, n, 2).display + ' ' + type2 + ' damage' : '';
    var conditionEl = document.getElementById(prefix + n + '-condition');
    var conditionVal = conditionEl ? conditionEl.value : '';
    var conditionCheck2 = document.getElementById(prefix + n + '-conditioncheck2');
    var conditionStr = (conditionCheck2 && conditionCheck2.checked && conditionVal) ? ' and has become ' + conditionVal : '';
    var conditionEndEl = document.getElementById(prefix + n + '-conditionend');
    var conditionEndVal = conditionEndEl ? conditionEndEl.value : '';
    var conditionEndCheck = document.getElementById(prefix + n + '-conditionendcheck');
    var conditionEndStr = (conditionEndCheck && conditionEndCheck.checked && conditionEndVal) ? ' until the ' + conditionEndVal : '';
    var dotEl = document.getElementById(prefix + n + '-dotcheck');
    var startVsEndEl = document.getElementById(prefix + n + '-startvsendcheck');
    var dotTiming = (startVsEndEl && startVsEndEl.checked) ? 'start' : 'end';
    var dotStr = (dotEl && dotEl.checked) ? ' at the ' + dotTiming + ' of each of its turns' : '';
    var label = isMelee ? 'Melee' : 'Ranged';
    out.value = label + ' Attack Roll: ' + atkDisplay + ', range: ' + rangeStr + ' Hit: ' + dmg1Str + dmg2Str + dotStr + conditionStr + conditionEndStr + '.';
}
/*-- Effect Damage Parse --*/
function parseEffectDamage(n, slot) {
    var dmgEl = document.getElementById("effect" + n + "-dmg" + slot);
    var modEl = document.getElementById("effect" + n + "-modcheck" + slot);
    var typeEl = document.getElementById("effect" + n + "-type" + slot);
    if (!dmgEl || !typeEl) { return ""; }
    var dmg = dmgEl.value.trim();
    var type = typeEl.value.trim().toLowerCase();
    if (!dmg || !type) { return ""; }
    var mod = 0;
    if (modEl && modEl.checked) {
        parseStats.forEach(function(stat) {
            var radio = document.getElementById("effect" + n + "-" + stat + "check");
            if (radio && radio.checked) {
                mod = parseFloat(document.getElementById("ability-" + stat + "mod").value) || 0;
            }
        });
    }
    var result = dmg;
    if (mod !== 0) result += (mod > 0 ? " + " + mod : " - " + Math.abs(mod));
    return result + " " + type;
}
/*-- Render Simplified: Save --*/
function renderSimplifiedSave(prefix, n) {
    var out = document.getElementById(prefix + n + '-simplified');
    if (!out) { return; }
    var saveEl = document.getElementById(prefix + n + '-savecheck');
    if (!saveEl || !saveEl.checked) { return; }
    var statNames = { str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };
    var saveVs = '[savevs]';
    parseStats.forEach(function(stat) {
        var radio = document.getElementById(prefix + n + '-' + stat + 'check');
        if (radio && radio.checked) { saveVs = statNames[stat]; }
    });
    var sdcOverrideEl = document.getElementById(prefix + n + '-sdcoverride');
    var sdcOverride = sdcOverrideEl ? sdcOverrideEl.value.trim() : '';
    var sdcVal = sdcOverride ? sdcOverride : (document.getElementById('ability-sdc').value || '');
    var sdcStr = sdcVal ? 'DC ' + sdcVal : '[sdc]';
    var rangeEl = document.getElementById(prefix + n + '-range');
    var rangeVal = (rangeEl && rangeEl.value) ? rangeEl.value : '[range]';
    var aoeEl = document.getElementById(prefix + n + '-aoecheck');
    var rangeCheck2 = document.getElementById(prefix + n + '-rangecheck2');
    var rangeUnit = (rangeCheck2 && rangeCheck2.checked) ? '.' : ' ft.';
    var rangeStr = (aoeEl && aoeEl.checked) ? 'targets within ' + rangeVal + rangeUnit : rangeVal + rangeUnit;
    var dmg1El = document.getElementById(prefix + n + '-dmg1');
    var dmg1HasVal = dmg1El && dmg1El.value.trim();
    var type1El = document.getElementById(prefix + n + '-type1');
    var type1 = type1El ? type1El.value.toLowerCase() : '';
    var dmg1Str = (dmg1HasVal && type1) ? parseDamage(prefix, n, 1).display + ' ' + type1 + ' damage' : '[damage1]';
    var dmg2El = document.getElementById(prefix + n + '-dmg2');
    var dmg2HasVal = dmg2El && dmg2El.value.trim();
    var type2El = document.getElementById(prefix + n + '-type2');
    var type2 = type2El ? type2El.value.toLowerCase() : '';
    var dmg2Str = (dmg2HasVal && type2) ? ' plus ' + parseDamage(prefix, n, 2).display + ' ' + type2 + ' damage' : '';
    var conditionEl = document.getElementById(prefix + n + '-condition');
    var conditionVal = conditionEl ? conditionEl.value : '';
    var conditionCheck2 = document.getElementById(prefix + n + '-conditioncheck2');
    var conditionStr = (conditionCheck2 && conditionCheck2.checked && conditionVal) ? ' and has become ' + conditionVal : '';
    var conditionEndEl = document.getElementById(prefix + n + '-conditionend');
    var conditionEndVal = conditionEndEl ? conditionEndEl.value : '';
    var conditionEndCheck = document.getElementById(prefix + n + '-conditionendcheck');
    var conditionEndStr = (conditionEndCheck && conditionEndCheck.checked && conditionEndVal) ? ' until the ' + conditionEndVal : '';
    var dotEl = document.getElementById(prefix + n + '-dotcheck');
    var startVsEndEl = document.getElementById(prefix + n + '-startvsendcheck');
    var dotTiming = (startVsEndEl && startVsEndEl.checked) ? 'start' : 'end';
    var dotStr = (dotEl && dotEl.checked) ? ' at the ' + dotTiming + ' of each of its turns' : '';
    var successConditionStr = (conditionCheck2 && conditionCheck2.checked && conditionVal) ? ' and is not ' + conditionVal : '';
    var halfEl = document.getElementById(prefix + n + '-halfcheck');
    var isHalf = halfEl && halfEl.checked;
    var noSaveEl = document.getElementById(prefix + n + '-nosavecheck');
    var isNoSave = noSaveEl && noSaveEl.checked;
    var successStr = (isHalf || isNoSave) ? '' : ' Success: Half damage' + successConditionStr + '.';
    if (isNoSave) {
        out.value = 'Range: ' + rangeStr + ' Damage: ' + dmg1Str + dmg2Str + dotStr + conditionStr + conditionEndStr + '.';
    } else {
        out.value = saveVs + ' Saving Throw: ' + sdcStr + ', range: ' + rangeStr + ' Fail: ' + dmg1Str + dmg2Str + dotStr + conditionStr + conditionEndStr + '.' + successStr;
    }
}
/*-- Render All Simplified --*/
function renderAllSimplified() {
    attackSections.forEach(function(section) {
        for (var i = 1; i <= section[1]; i++) {
            renderSimplified(section[0], i);
        }
    });
}
/*-- Simplified Listeners --*/
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        (function(prefix, n) {
            var fields = [prefix + n + '-range', prefix + n + '-dmg1', prefix + n + '-dmg2', prefix + n + '-type1', prefix + n + '-type2', prefix + n + '-modcheck1', prefix + n + '-modcheck2', prefix + n + '-condition', prefix + n + '-conditionend', prefix + n + '-sdcoverride', prefix + n + '-halfcheck', prefix + n + '-aoecheck', prefix + n + '-conditioncheck2', prefix + n + '-conditionendcheck', prefix + n + '-rangecheck2', prefix + n + '-dotcheck', prefix + n + '-startvsendcheck', prefix + n + '-nosavecheck'];
            fields.forEach(function(id) {
                var el = document.getElementById(id);
                if (!el) { return; }
                el.addEventListener('input', function() { renderSimplified(prefix, n); });
                el.addEventListener('change', function() { renderSimplified(prefix, n); });
            });
            parseStats.forEach(function(stat) {
                var radio = document.getElementById(prefix + n + '-' + stat + 'check');
                if (radio) {
                    radio.addEventListener('change', function() { renderSimplified(prefix, n); });
                    radio.addEventListener('click', function() { renderSimplified(prefix, n); });
                }
            });
            ['meleecheck', 'rangecheck1', 'savecheck'].forEach(function(id) {
                var radio = document.getElementById(prefix + n + '-' + id);
                if (radio) {
                    radio.addEventListener('change', function() { renderSimplified(prefix, n); });
                    radio.addEventListener('click', function() { renderSimplified(prefix, n); });
                }
            });
        })(section[0], i);
    }
});
parseStats.forEach(function(stat) {
    document.getElementById('ability-' + stat + 'mod').addEventListener('input', renderAllSimplified);
});
document.getElementById('basics-proficiency').addEventListener('input', renderAllSimplified);
document.getElementById('ability-sdc').addEventListener('input', renderAllSimplified);
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(renderAllSimplified, 0); });
renderAllSimplified();
/*-- Description Listeners --*/
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        (function(prefix, n) {
            var ta = document.getElementById(prefix + n + '-description');
            if (!ta) { return; }
            ta.addEventListener('input', function() {
                renderStylized(prefix, n);
                if (typeof generateExport === 'function') { generateExport(); }
            });
            ta.addEventListener('paste', function() {
                setTimeout(function() {
                    renderStylized(prefix, n);
                    if (typeof generateExport === 'function') { generateExport(); }
                }, 0);
            });
        })(section[0], i);
    }
});
for (var i = 1; i <= maxEffects; i++) {
    (function(n) {
        var ta = document.getElementById('effect' + n + '-description');
        if (!ta) { return; }
        ta.addEventListener('input', function() {
            renderStylized('effect', n);
            if (typeof generateExport === 'function') { generateExport(); }
        });
        ta.addEventListener('paste', function() {
            setTimeout(function() {
                renderStylized('effect', n);
                if (typeof generateExport === 'function') { generateExport(); }
            }, 0);
        });
        ['auracheck', 'notcheck', 'allcheck', 'friendcheck', 'foecheck', 'allycheck', 'enemycheck', 'neutralcheck', 'nonecheck', 'oncecheck2', 'cubecheck', 'stickycheck'].forEach(function(id) {
            var el = document.getElementById('effect' + n + '-' + id);
            if (!el) { return; }
            el.addEventListener('change', function() {
                renderStylized('effect', n);
                if (typeof generateExport === 'function') { generateExport(); }
            });
            el.addEventListener('click', function() {
                renderStylized('effect', n);
                if (typeof generateExport === 'function') { generateExport(); }
            });
        });
        var nameEl = document.getElementById('effect' + n + '-name');
        if (nameEl) {
            nameEl.addEventListener('input', function() {
                renderStylized('effect', n);
                if (typeof generateExport === 'function') { generateExport(); }
            });
        }
        var rangeEl2 = document.getElementById('effect' + n + '-range');
        if (rangeEl2) {
            rangeEl2.addEventListener('input', function() {
                renderStylized('effect', n);
                if (typeof generateExport === 'function') { generateExport(); }
            });
        }
        var customEl = document.getElementById('effect' + n + '-customeffect');
        if (customEl) {
            customEl.addEventListener('input', function() {
                renderStylized('effect', n);
                if (typeof generateExport === 'function') { generateExport(); }
            });
        }
    })(i);
}
/*-- Global Field Listeners --*/
parseStats.forEach(function(stat) {
    document.getElementById('ability-' + stat + 'mod').addEventListener('input', renderAllStylized);
});
document.getElementById('basics-proficiency').addEventListener('input', renderAllStylized);
document.getElementById('ability-sdc').addEventListener('input', renderAllStylized);
/*-- Per-Section Field Listeners --*/
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        (function(prefix, n) {
            var fields = [prefix + n + '-range', prefix + n + '-dmg1', prefix + n + '-dmg2', prefix + n + '-type1', prefix + n + '-type2', prefix + n + '-modcheck1', prefix + n + '-modcheck2', prefix + n + '-sdcoverride', prefix + n + '-condition', prefix + n + '-conditionend', prefix + n + '-note1', prefix + n + '-note2', prefix + n + '-note3'];
            fields.forEach(function(id) {
                var el = document.getElementById(id);
                if (!el) { return; }
                el.addEventListener('input', function() { renderStylized(prefix, n); });
                el.addEventListener('change', function() { renderStylized(prefix, n); });
            });
            parseStats.forEach(function(stat) {
                var radio = document.getElementById(prefix + n + '-' + stat + 'check');
                if (radio) {
                    radio.addEventListener('change', function() { renderStylized(prefix, n); });
                    radio.addEventListener('click', function() { renderStylized(prefix, n); });
                }
            });
            ['cone', 'radius', 'line', 'cube'].forEach(function(shape) {
                var radio = document.getElementById(prefix + n + '-' + shape + 'check');
                if (radio) {
                    radio.addEventListener('change', function() { renderStylized(prefix, n); });
                    radio.addEventListener('click', function() { renderStylized(prefix, n); });
                }
            });
        })(section[0], i);
    }
});
for (var i = 1; i <= maxEffects; i++) {
    (function(n) {
        var fields = ['effect' + n + '-range', 'effect' + n + '-dmg1', 'effect' + n + '-dmg2', 'effect' + n + '-type1', 'effect' + n + '-type2', 'effect' + n + '-modcheck1', 'effect' + n + '-modcheck2', 'effect' + n + '-sdcoverride', 'effect' + n + '-condition', 'effect' + n + '-conditionend', 'effect' + n + '-note1', 'effect' + n + '-note2', 'effect' + n + '-note3'];
        fields.forEach(function(id) {
            var el = document.getElementById(id);
            if (!el) { return; }
            el.addEventListener('input', function() { renderStylized('effect', n); });
            el.addEventListener('change', function() { renderStylized('effect', n); });
        });
        parseStats.forEach(function(stat) {
            var radio = document.getElementById('effect' + n + '-' + stat + 'check');
            if (radio) {
                radio.addEventListener('change', function() { renderStylized('effect', n); });
                radio.addEventListener('click', function() { renderStylized('effect', n); });
            }
        });
        ['meleecheck', 'rangecheck'].forEach(function(id) {
            var radio = document.getElementById('effect' + n + '-' + id);
            if (radio) {
                radio.addEventListener('change', function() { renderStylized('effect', n); });
                radio.addEventListener('click', function() { renderStylized('effect', n); });
            }
        });
    })(i);
}
document.getElementById('clearBtn').addEventListener('click', function() { setTimeout(renderAllStylized, 0); });
renderAllStylized();
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        (function(prefix, n) {
            var btn = document.getElementById(prefix + n + '-parseatk');
            if (!btn) { return; }
            btn.addEventListener('click', function() { replaceSelection(prefix, n, 'atkmod'); });
        })(section[0], i);
    }
});
/*-- Range Button --*/
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        (function(prefix, n) {
            var btn = document.getElementById(prefix + n + '-parserange');
            if (!btn) { return; }
            btn.addEventListener('click', function() { replaceSelection(prefix, n, 'range'); });
        })(section[0], i);
    }
});
for (var i = 1; i <= maxEffects; i++) {
    (function(n) {
        var btn = document.getElementById('effect' + n + '-parserange');
        if (!btn) { return; }
        btn.addEventListener('click', function() { replaceSelection('effect', n, 'range'); });
    })(i);
}
/*-- Damage 1 Button --*/
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        (function(prefix, n) {
            var btn = document.getElementById(prefix + n + '-parsedmg1');
            if (!btn) { return; }
            btn.addEventListener('click', function() { replaceSelection(prefix, n, 'damage1'); });
        })(section[0], i);
    }
});
for (var i = 1; i <= maxEffects; i++) {
    (function(n) {
        var btn = document.getElementById('effect' + n + '-parsedmg1');
        if (!btn) { return; }
        btn.addEventListener('click', function() { replaceSelection('effect', n, 'damage1'); });
    })(i);
}
/*-- Damage 2 Button --*/
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        (function(prefix, n) {
            var btn = document.getElementById(prefix + n + '-parsedmg2');
            if (!btn) { return; }
            btn.addEventListener('click', function() { replaceSelection(prefix, n, 'damage2'); });
        })(section[0], i);
    }
});
for (var i = 1; i <= maxEffects; i++) {
    (function(n) {
        var btn = document.getElementById('effect' + n + '-parsedmg2');
        if (!btn) { return; }
        btn.addEventListener('click', function() { replaceSelection('effect', n, 'damage2'); });
    })(i);
}
/*-- Save Vs Button --*/
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        (function(prefix, n) {
            var btn = document.getElementById(prefix + n + '-parsesavevs');
            if (!btn) { return; }
            btn.addEventListener('click', function() { replaceSelection(prefix, n, 'savevs'); });
        })(section[0], i);
    }
});
for (var i = 1; i <= maxEffects; i++) {
    (function(n) {
        var btn = document.getElementById('effect' + n + '-parsesavevs');
        if (!btn) { return; }
        btn.addEventListener('click', function() { replaceSelection('effect', n, 'savevs'); });
    })(i);
}
/*-- SDC Button --*/
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        (function(prefix, n) {
            var btn = document.getElementById(prefix + n + '-parsesdc');
            if (!btn) { return; }
            btn.addEventListener('click', function() { replaceSelection(prefix, n, 'sdc'); });
        })(section[0], i);
    }
});
for (var i = 1; i <= maxEffects; i++) {
    (function(n) {
        var btn = document.getElementById('effect' + n + '-parsesdc');
        if (!btn) { return; }
        btn.addEventListener('click', function() { replaceSelection('effect', n, 'sdc'); });
    })(i);
}
/*-- Shape Button --*/
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        (function(prefix, n) {
            var btn = document.getElementById(prefix + n + '-parseshape');
            if (!btn) { return; }
            btn.addEventListener('click', function() { replaceSelection(prefix, n, 'shape'); });
        })(section[0], i);
    }
});
/*-- Condition Button --*/
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        (function(prefix, n) {
            var btn = document.getElementById(prefix + n + '-parsecondition');
            if (!btn) { return; }
            btn.addEventListener('click', function() { replaceSelection(prefix, n, 'condition'); });
        })(section[0], i);
    }
});
for (var i = 1; i <= maxEffects; i++) {
    (function(n) {
        var btn = document.getElementById('effect' + n + '-parsecondition');
        if (!btn) { return; }
        btn.addEventListener('click', function() { replaceSelection('effect', n, 'condition'); });
    })(i);
}
/*-- Condition End Button --*/
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        (function(prefix, n) {
            var btn = document.getElementById(prefix + n + '-parseconditionend');
            if (!btn) { return; }
            btn.addEventListener('click', function() { replaceSelection(prefix, n, 'conditionend'); });
        })(section[0], i);
    }
});
for (var i = 1; i <= maxEffects; i++) {
    (function(n) {
        var btn = document.getElementById('effect' + n + '-parseconditionend');
        if (!btn) { return; }
        btn.addEventListener('click', function() { replaceSelection('effect', n, 'conditionend'); });
    })(i);
}
/*-- Note 1, 2, 3 Buttons --*/
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        (function(prefix, n) {
            ['note1', 'note2', 'note3'].forEach(function(note) {
                var btn = document.getElementById(prefix + n + '-parse' + note);
                if (!btn) { return; }
                btn.addEventListener('click', function() { replaceSelection(prefix, n, note); });
            });
        })(section[0], i);
    }
});
for (var i = 1; i <= maxEffects; i++) {
    (function(n) {
        ['note1', 'note2', 'note3'].forEach(function(note) {
            var btn = document.getElementById('effect' + n + '-parse' + note);
            if (!btn) { return; }
            btn.addEventListener('click', function() { replaceSelection('effect', n, note); });
        });
    })(i);
}
/*-- Melee/Range Button --*/
for (var i = 1; i <= maxEffects; i++) {
    (function(n) {
        var btn = document.getElementById('effect' + n + '-parsemeleerange');
        if (!btn) { return; }
        btn.addEventListener('click', function() { replaceSelection('effect', n, 'meleerange'); });
    })(i);
}