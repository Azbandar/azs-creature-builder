/*-- UTILITY.JS --*/
/*-- Variables --*/
/*-- Max Quantities --*/
var maxTraits = 6;
var maxActions = 6;
var maxSpells = 10;
var maxBonusActions = 2;
var maxReactions = 2;
var maxLegendaryActions = 4;
var maxLairActions = 2;
var maxDescriptionTexts = 4;
var maxEffects = 4;
/*-- Dropdown Lists --*/
var sizeList = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
var typeList = ['Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Trap', 'Undead'];
var alignmentList = ['Lawful Evil', 'Neutral Evil', 'Chaotic Evil', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Good', 'Neutral Good', 'Chaotic Good', 'Unaligned'];
var elementList = ['Acid', 'Cold', 'Fire', 'Force', 'Lightning', 'Necrotic', 'Poison', 'Psychic', 'Radiant', 'Thunder'];
var spellcastingList = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
var damageList = ['Bludgeoning', 'Piercing', 'Slashing', 'Acid', 'Cold', 'Fire', 'Force', 'Lightning', 'Necrotic', 'Poison', 'Psychic', 'Radiant', 'Thunder'];
/*-- Dropdown Setup --*/
setupDropdown('basics-size', sizeList);
setupDropdown('basics-type', typeList);
setupDropdown('basics-alignment', alignmentList);
setupDropdown('basics-element', elementList);
setupDropdown('ability-spellcasting', spellcastingList);
var damageTypeSections = [
    ['trait', maxTraits],
    ['action', maxActions],
    ['spell', maxSpells],
    ['bonusaction', maxBonusActions],
    ['reaction', maxReactions],
    ['legendaryaction', maxLegendaryActions],
    ['lairaction', maxLairActions],
    ['effect', maxEffects]
];
/*-- Attack Sections --*/
var attackSections = [
    ['trait', maxTraits],
    ['action', maxActions],
    ['spell', maxSpells],
    ['bonusaction', maxBonusActions],
    ['reaction', maxReactions],
    ['legendaryaction', maxLegendaryActions],
    ['lairaction', maxLairActions]
];
/*-- Save --*/
document.getElementById('saveBtn').addEventListener('click', async function() {
    if (typeof renderAllStylized === 'function') { renderAllStylized(); }
    if (typeof renderAllSimplified === 'function') { renderAllSimplified(); }
    var data = {};
    document.querySelectorAll('[id]').forEach(function(el) {
        if (el.tagName === 'INPUT' && el.type === 'checkbox') {
            data[el.id] = el.checked;
        } else if (el.tagName === 'INPUT' && el.type === 'radio') {
            data[el.id] = el.checked;
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            data[el.id] = el.value;
        }
    });
    var baseName = document.getElementById('basics-name').value || 'creature';
    var isLair = document.getElementById('basics-lair') && document.getElementById('basics-lair').checked;
    var name = isLair ? (baseName + ' - Lair') : baseName;
    var json = JSON.stringify(data, null, 2);
    if (window.showSaveFilePicker) {
        try {
            var handle = await window.showSaveFilePicker({
                suggestedName: name + '.json',
                types: [
                    {
                        description: 'Creature Builder Save',
                        accept: { 'application/json': ['.json'] }
                    }
                ]
            });
            var writable = await handle.createWritable();
            await writable.write(json);
            await writable.close();
            return;
        } catch (e) {
            if (e && e.name === 'AbortError') {
                return;
            }
        }
    }
    var blob = new Blob([json], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
});
/*-- Load --*/
document.getElementById('loadBtn').addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', function() {
        var file = this.files[0];
        if (!file) { return; }
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('clearBtn').click();
            var data = JSON.parse(e.target.result);
            Object.keys(data).forEach(function(id) {
                if (id.indexOf('-qty') !== -1) {
                    var el = document.getElementById(id);
                    if (!el) { return; }
                    el.value = data[id];
                    el.dispatchEvent(new Event('input'));
                }
            });
            Object.keys(data).forEach(function(id) {
                if (id.indexOf('-qty') !== -1) { return; }
                var el = document.getElementById(id);
                if (!el) { return; }
                if (el.type === 'checkbox') {
                    el.checked = data[id];
                    el.dispatchEvent(new Event('change'));
                } else if (el.type === 'radio') {
                    el.checked = data[id];
                    if (data[id]) {
                        el.dataset.checked = 'true';
                        el.dispatchEvent(new Event('change'));
                    }
                } else {
                    el.value = data[id];
                }
            });
            initDropdowns();
            if (typeof renderAllStylized === 'function') { renderAllStylized(); }
            if (typeof renderAllSimplified === 'function') { renderAllSimplified(); }
            for (var j = 1; j <= maxDescriptionTexts; j++) {
                (function(n) {
                    var tableEl = document.getElementById('descriptiontext' + n + '-table');
                    if (tableEl && tableEl.checked) {
                        document.getElementById('descriptiontext' + n + '-columnselection').style.display = 'flex';
                        document.querySelectorAll('[name="descriptiontext' + n + '-col1group"]').forEach(function(el) { el.style.display = 'flex'; });
                        var cols = parseInt(document.getElementById('descriptiontext' + n + '-cols').value) || 0;
                        for (var c = 2; c <= 5; c++) {
                            var show = cols >= c;
                            document.querySelectorAll('[name="descriptiontext' + n + '-col' + c + 'group"]').forEach(function(el) { el.style.display = show ? 'flex' : 'none'; });
                        }
                    }
                })(j);
            }
            for (var j = 1; j <= maxDescriptionTexts; j++) {
                (function(n) {
                    var linesInput = document.getElementById('descriptiontext' + n + '-lines');
                    var qty = parseInt(linesInput ? linesInput.value : '') || 1;
                    for (var i = 1; i <= 12; i++) {
                        var row = document.getElementById('descriptiontext' + n + '-row' + i);
                        if (row) { row.style.display = i <= qty ? 'flex' : 'none'; }
                    }
                })(j);
            }
        };
        reader.readAsText(file);
    });
    input.click();
});
/*-- Clear --*/
document.getElementById('clearBtn').addEventListener('click', function() {
    localStorage.removeItem('creatureBuilder');
    document.querySelectorAll('input, textarea').forEach(function(el) {
        if (el.type === 'checkbox') {
            el.checked = false;
            el.dispatchEvent(new Event('change'));
        } else if (el.type === 'radio') {
            el.checked = false;
            el.dataset.checked = 'false';
        } else {
            el.value = '';
            if (el.id && el.id.indexOf('-qty') !== -1) {
                el.dispatchEvent(new Event('input'));
            }
        }
    });
    attackSections.forEach(function(section) {
        for (var i = 1; i <= section[1]; i++) {
            hideAllRows(section[0], i);
        }
    });
    for (var j = 1; j <= maxDescriptionTexts; j++) {
        hideDescriptionText('descriptiontext', j);
    }
});
/*-- Dropdown --*/
function setupDropdown(inputId, list) {
    var input = document.getElementById(inputId);
    input.classList.add('dropdown-input');
    var wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';
    var isUnlabeled = input.classList.contains('input-unlabeled');
    wrapper.style.marginTop = isUnlabeled ? '2px' : '4px';
    wrapper.style.marginBottom = isUnlabeled ? '2px' : '10px';
    var styleAttr = input.getAttribute('style') || '';
    var flexMatch = styleAttr.match(/flex\s*:\s*([^;]+)/);
    var widthMatch = styleAttr.match(/width\s*:\s*([^;]+)/);
    if (flexMatch) wrapper.style.flex = flexMatch[1].trim();
    if (widthMatch) wrapper.style.width = widthMatch[1].trim();
    input.style.flex = '1';
    input.style.width = '100%';
    var parent = input.parentNode;
    var next = input.nextSibling;
    wrapper.appendChild(input);
    parent.insertBefore(wrapper, next);
    var arrow = document.createElement('button');
    arrow.className = 'dropdown-arrow';
    arrow.textContent = '\u25bc';
    arrow.type = 'button';
    wrapper.appendChild(arrow);
    arrow.addEventListener('click', function(e) {
        e.stopPropagation();
        showList(input.value === '' ? list : list.filter(function(item) { return item.toLowerCase().indexOf(input.value.toLowerCase()) !== -1; }));
    });
    var dropdown = document.createElement('div');
    dropdown.className = 'dropdown-list';
    dropdown.style.display = 'none';
    dropdown.style.position = 'fixed';
    document.body.appendChild(dropdown);
    function showList(items) {
        dropdown.innerHTML = '';
        if (items.length === 0) { dropdown.style.display = 'none'; return; }
        items.forEach(function(item) {
            var div = document.createElement('div');
            div.className = 'dropdown-item';
            div.textContent = item;
            div.addEventListener('click', function() {
                input.value = item;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                dropdown.style.display = 'none';
            });
            dropdown.appendChild(div);
        });
        var rect = input.getBoundingClientRect();
        dropdown.style.width = rect.width + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.top = rect.bottom + 'px';
        dropdown.style.display = 'block';
    }
    input.addEventListener('input', function() {
        var val = this.value.toLowerCase();
        if (!val) { showList(list); return; }
        showList(list.filter(function(item) { return item.toLowerCase().indexOf(val) !== -1; }));
    });
    input.addEventListener('click', function(e) {
        var arrowStart = input.offsetWidth - 25;
        if (e.offsetX >= arrowStart || input.value === '') {
            showList(input.value === '' ? list : list.filter(function(item) { return item.toLowerCase().indexOf(input.value.toLowerCase()) !== -1; }));
        }
    });
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === 'Tab') { dropdown.style.display = 'none'; }
    });
    document.addEventListener('click', function(e) {
        if (e.target !== input && !dropdown.contains(e.target)) { dropdown.style.display = 'none'; }
    });
}
/*-- Dropdown Observer --*/
function initDropdowns() {
    damageTypeSections.forEach(function(section) {
        for (var i = 1; i <= section[1]; i++) {
            var type1 = document.getElementById(section[0] + i + '-type1');
            var type2 = document.getElementById(section[0] + i + '-type2');
            if (type1 && !type1.classList.contains('dropdown-input')) {
                setupDropdown(section[0] + i + '-type1', damageList);
            }
            if (type2 && !type2.classList.contains('dropdown-input')) {
                setupDropdown(section[0] + i + '-type2', damageList);
            }
        }
    });
}
document.addEventListener('change', initDropdowns);
document.addEventListener('input', initDropdowns);
/*-- Speed --*/
document.getElementById('speed-burrowcheck').addEventListener('change', function() {
    document.getElementById('speed-burrowreveal').style.display = this.checked ? 'block' : 'none';
});
document.getElementById('speed-climbcheck').addEventListener('change', function() {
    document.getElementById('speed-climbreveal').style.display = this.checked ? 'block' : 'none';
});
document.getElementById('speed-flycheck').addEventListener('change', function() {
    document.getElementById('speed-flyreveal').style.display = this.checked ? 'block' : 'none';
});
document.getElementById('speed-swimcheck').addEventListener('change', function() {
    document.getElementById('speed-swimreveal').style.display = this.checked ? 'block' : 'none';
});
/*-- Senses --*/
document.getElementById('senses-blindsensecheck').addEventListener('change', function() {
    document.getElementById('senses-blindsensereveal').style.display = this.checked ? 'block' : 'none';
});
document.getElementById('senses-darkvisioncheck').addEventListener('change', function() {
    document.getElementById('senses-darkvisionreveal').style.display = this.checked ? 'block' : 'none';
});
document.getElementById('senses-tremorsensecheck').addEventListener('change', function() {
    document.getElementById('senses-tremorsensereveal').style.display = this.checked ? 'block' : 'none';
});
document.getElementById('senses-truesightcheck').addEventListener('change', function() {
    document.getElementById('senses-truesightreveal').style.display = this.checked ? 'block' : 'none';
});
/*-- Generic Qty Toggle --*/
function setupQtyToggle(sectionId, itemPrefix, maxQty) {
    document.getElementById(sectionId + '-qty').addEventListener('input', function() {
        var qty = parseInt(this.value) || 0;
        document.getElementById(sectionId + '-wrapper').style.display = qty > 0 ? 'flex' : 'none';
        for (var i = 1; i <= maxQty; i++) {
            document.getElementById(itemPrefix + i).style.display = i <= qty ? 'block' : 'none';
        }
        if (typeof calcPerRound === 'function') { calcPerRound(); }
    });
}
/*-- Sections --*/
setupQtyToggle('traits', 'trait', maxTraits);
setupQtyToggle('actions', 'action', maxActions);
setupQtyToggle('spells', 'spell', maxSpells);
setupQtyToggle('bonusactions', 'bonusaction', maxBonusActions);
setupQtyToggle('reactions', 'reaction', maxReactions);
setupQtyToggle('legendaryactions', 'legendaryaction', maxLegendaryActions);
setupQtyToggle('lairactions', 'lairaction', maxLairActions);
setupQtyToggle('descriptiontexts', 'descriptiontext', maxDescriptionTexts);
setupQtyToggle('effects', 'effect', maxEffects);
/*-- Hide All Rows --*/
function hideAllRows(prefix, n) {
    var rows = ['roundsrow', 'modifierrow', 'damagerow', 'parsebtnrow', 'overriderow'];
    rows.forEach(function(row) {
        document.getElementById(prefix + n + '-' + row).style.display = 'none';
    });
    ['atkmodvis', 'savevsvis', 'simplified'].forEach(function(el) {
        document.getElementById(prefix + n + '-' + el).style.display = 'none';
    });
    document.getElementById(prefix + n + '-shapegroup').style.visibility = 'hidden';
    if (typeof calcPerRound === 'function') { calcPerRound(); }
}
/*-- Hide Description Text --*/
function hideDescriptionText(prefix, n) {
    document.getElementById(prefix + n + '-columnselection').style.display = 'none';
    document.querySelectorAll('[name="' + prefix + n + '-col1group"]').forEach(function(el) {
        el.style.display = 'none';
    });
}
/*-- Radio Uncheck --*/
function setupRadioUncheck(prefix, n, groupName, hideFunc) {
    var radios = document.querySelectorAll('[name="' + prefix + n + '-' + groupName + '"]');
    radios.forEach(function(radio) {
        radio.addEventListener('click', function() {
            if (this.dataset.checked === 'true') {
                this.checked = false;
                this.dataset.checked = 'false';
                if (hideFunc) { hideFunc(prefix, n); }
                saveToLocalStorage();
            } else {
                radios.forEach(function(r) {
                    r.dataset.checked = 'false';
                });
                this.dataset.checked = 'true';
            }
        });
    });
}
/*-- Attack Toggle --*/
function setupAttackToggle(prefix, n) {
    var rows = ['roundsrow', 'modifierrow', 'damagerow', 'parsebtnrow', 'overriderow'];
    function showMeleeRange() {
        hideAllRows(prefix, n);
        rows.forEach(function(row) {
            document.getElementById(prefix + n + '-' + row).style.display = 'flex';
        });
        ['atkmodvis', 'simplified'].forEach(function(el) {
            document.getElementById(prefix + n + '-' + el).style.display = 'block';
        });
        if (typeof calcPerRound === 'function') { calcPerRound(); }
    }
    function showSave() {
        hideAllRows(prefix, n);
        rows.forEach(function(row) {
            document.getElementById(prefix + n + '-' + row).style.display = 'flex';
        });
        ['savevsvis', 'simplified'].forEach(function(el) {
            document.getElementById(prefix + n + '-' + el).style.display = 'block';
        });
        document.getElementById(prefix + n + '-shapegroup').style.visibility = 'visible';
        if (typeof calcPerRound === 'function') { calcPerRound(); }
    }
    document.getElementById(prefix + n + '-meleecheck').addEventListener('change', showMeleeRange);
    document.getElementById(prefix + n + '-rangecheck1').addEventListener('change', showMeleeRange);
    document.getElementById(prefix + n + '-savecheck').addEventListener('change', showSave);
}
/*-- Condition Toggle --*/
function setupConditionToggle(prefix, n) {
    document.getElementById(prefix + n + '-conditioncheck1').addEventListener('change', function() {
        document.getElementById(prefix + n + '-conditiongroup').style.visibility = this.checked ? 'visible' : 'hidden';
    });
}
/*-- Notes Toggle --*/
function setupNotesToggle(prefix, n) {
    document.getElementById(prefix + n + '-notescheck').addEventListener('change', function() {
        document.getElementById(prefix + n + '-notesrow').style.display = this.checked ? 'flex' : 'none';
    });
}
/*-- Description Text Table Toggle --*/
function setupDescriptionTextToggle(n) {
    function showTable() {
        document.getElementById('descriptiontext' + n + '-columnselection').style.display = 'flex';
        document.querySelectorAll('[name="descriptiontext' + n + '-col1group"]').forEach(function(el) {
            el.style.display = 'flex';
        });
    }
    document.getElementById('descriptiontext' + n + '-table').addEventListener('change', showTable);
    document.getElementById('descriptiontext' + n + '-para').addEventListener('change', function() { hideDescriptionText('descriptiontext', n); });
    document.getElementById('descriptiontext' + n + '-list').addEventListener('change', function() { hideDescriptionText('descriptiontext', n); });
    if (document.getElementById('descriptiontext' + n + '-table').checked) { showTable(); }
}
/*-- Description Text Lines Toggle --*/
function setupDescriptionTextLines(n) {
    document.getElementById('descriptiontext' + n + '-lines').addEventListener('input', function() {
        var qty = parseInt(this.value) || 1;
        for (var i = 1; i <= 12; i++) {
            document.getElementById('descriptiontext' + n + '-row' + i).style.display = i <= qty ? 'flex' : 'none';
        }
    });
}
/*-- Description Text Columns Toggle --*/
function setupDescriptionTextColumns(n) {
    function updateCols() {
        var tableChecked = document.getElementById('descriptiontext' + n + '-table').checked;
        var cols = parseInt(document.getElementById('descriptiontext' + n + '-cols').value) || 0;
        for (var c = 2; c <= 5; c++) {
            var show = tableChecked && cols >= c;
            document.querySelectorAll('[name="descriptiontext' + n + '-col' + c + 'group"]').forEach(function(el) {
                el.style.display = show ? 'flex' : 'none';
            });
        }
    }
    document.getElementById('descriptiontext' + n + '-table').addEventListener('change', updateCols);
    document.getElementById('descriptiontext' + n + '-cols').addEventListener('input', updateCols);
    updateCols();
}
/*-- Effect Notes Toggle --*/
function setupEffectNotesToggle(n) {
    document.getElementById('effect' + n + '-notecheck').addEventListener('change', function() {
        document.getElementById('effect' + n + '-notesrow').style.display = this.checked ? 'flex' : 'none';
    });
}
attackSections.forEach(function(section) {
    for (var i = 1; i <= section[1]; i++) {
        setupAttackToggle(section[0], i);
        setupRadioUncheck(section[0], i, 'attackstyle', hideAllRows);
        setupRadioUncheck(section[0], i, 'usechecks', null);
        setupRadioUncheck(section[0], i, 'shape', null);
        setupRadioUncheck(section[0], i, 'modifier', null);
        setupConditionToggle(section[0], i);
        setupNotesToggle(section[0], i);
    }
});
for (var k = 1; k <= maxEffects; k++) {
    setupRadioUncheck('effect', k, 'modifier', null);
}
/*-- Description Texts --*/
for (var j = 1; j <= maxDescriptionTexts; j++) {
    setupDescriptionTextToggle(j);
    setupRadioUncheck('descriptiontext', j, 'type', hideDescriptionText);
    setupDescriptionTextLines(j);
    setupDescriptionTextColumns(j);
}
/*-- Effects --*/
for (var k = 1; k <= maxEffects; k++) {
    setupEffectNotesToggle(k);
    setupRadioUncheck('effect', k, 'visibility', null);
    setupRadioUncheck('effect', k, 'expend', null);
    setupRadioUncheck('effect', k, 'durationgroup', null);
    setupRadioUncheck('effect', k, 'change', null);
    setupRadioUncheck('effect', k, 'time', null);
    setupRadioUncheck('effect', k, 'apply', null);
    setupRadioUncheck('effect', k, 'distance', null);
    setupRadioUncheck('effect', k, 'targetgroup', null);
}
/*-- Element Auto-Fill --*/
document.getElementById('basics-element').addEventListener('input', function() {
    var val = this.value;
    attackSections.forEach(function(section) {
        for (var i = 1; i <= section[1]; i++) {
            var el = document.getElementById(section[0] + i + '-type1');
            if (el) { el.value = val; el.dispatchEvent(new Event('input', { bubbles: true })); }
        }
    });
    for (var i = 1; i <= maxEffects; i++) {
        var el = document.getElementById('effect' + i + '-type1');
        if (el) { el.value = val; el.dispatchEvent(new Event('input', { bubbles: true })); }
    }
});
/*-- Local Storage --*/
function saveToLocalStorage() {
    var data = {};
    document.querySelectorAll('input, textarea').forEach(function(el) {
        if (!el.id) { return; }
        if (el.type === 'checkbox') {
            data[el.id] = el.checked;
        } else if (el.type === 'radio') {
            data[el.id] = el.checked;
        } else {
            data[el.id] = el.value;
        }
    });
    localStorage.setItem('creatureBuilder', JSON.stringify(data));
}
function loadFromLocalStorage() {
    var saved = localStorage.getItem('creatureBuilder');
    if (!saved) { return false; }
    var data = JSON.parse(saved);
    Object.keys(data).forEach(function(id) {
        if (id.indexOf('-qty') !== -1) {
            var el = document.getElementById(id);
            if (!el) { return; }
            el.value = data[id];
            el.dispatchEvent(new Event('input'));
        }
    });
    Object.keys(data).forEach(function(id) {
        if (id.indexOf('-qty') !== -1) { return; }
        var el = document.getElementById(id);
        if (!el) { return; }
        if (el.type === 'radio' && data[id]) {
            el.checked = true;
            el.dataset.checked = 'true';
            el.dispatchEvent(new Event('change'));
        }
    });
    Object.keys(data).forEach(function(id) {
        if (id.indexOf('-qty') !== -1) { return; }
        var el = document.getElementById(id);
        if (!el) { return; }
        if (el.type === 'checkbox') {
            el.checked = data[id];
            el.dispatchEvent(new Event('change'));
        }
    });
    Object.keys(data).forEach(function(id) {
        if (id.indexOf('-qty') !== -1) { return; }
        var el = document.getElementById(id);
        if (!el) { return; }
        if (el.type !== 'radio' && el.type !== 'checkbox') {
            el.value = data[id];
        }
    });
    initDropdowns();
    if (typeof renderAllStylized === 'function') { renderAllStylized(); }
    if (typeof renderAllSimplified === 'function') { renderAllSimplified(); }
    return true;
}
document.addEventListener('change', saveToLocalStorage);
document.addEventListener('input', saveToLocalStorage);
var hasLocalStorageData = loadFromLocalStorage();
for (var j = 1; j <= maxDescriptionTexts; j++) {
    (function(n) {
        var tableEl = document.getElementById('descriptiontext' + n + '-table');
        if (!tableEl || !tableEl.checked) { return; }
        document.getElementById('descriptiontext' + n + '-columnselection').style.display = 'flex';
        document.querySelectorAll('[name="descriptiontext' + n + '-col1group"]').forEach(function(el) { el.style.display = 'flex'; });
        var cols = parseInt(document.getElementById('descriptiontext' + n + '-cols').value) || 0;
        for (var c = 2; c <= 5; c++) {
            var show = cols >= c;
            document.querySelectorAll('[name="descriptiontext' + n + '-col' + c + 'group"]').forEach(function(el) { el.style.display = show ? 'flex' : 'none'; });
        }
    })(j);
}
for (var j = 1; j <= maxDescriptionTexts; j++) {
    (function(n) {
        var linesInput = document.getElementById('descriptiontext' + n + '-lines');
        if (!hasLocalStorageData && linesInput && !linesInput.value) {
            linesInput.value = 1;
        }
        var qty = parseInt(linesInput ? linesInput.value : '') || 1;
        for (var i = 1; i <= 12; i++) {
            var row = document.getElementById('descriptiontext' + n + '-row' + i);
            if (row) { row.style.display = i <= qty ? 'flex' : 'none'; }
        }
    })(j);
}/*-- Theme Panel --*/
document.getElementById('themeBtn').addEventListener('click', function() {
	var panel = document.getElementById('theme-panel');
	panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
});
/*-- Theme Panel Drag --*/
(function() {
	var panel = document.getElementById('theme-panel');
	var header = document.getElementById('theme-panel-header');
	var dragging = false, ox = 0, oy = 0;
	header.addEventListener('mousedown', function(e) {
		dragging = true;
		ox = e.clientX - panel.offsetLeft;
		oy = e.clientY - panel.offsetTop;
	});
	document.addEventListener('mousemove', function(e) {
		if (!dragging) return;
		panel.style.left = (e.clientX - ox) + 'px';
		panel.style.top = (e.clientY - oy) + 'px';
	});
	document.addEventListener('mouseup', function() { dragging = false; });
})();
document.getElementById('theme-closeBtn').addEventListener('click', function() {
	document.getElementById('theme-panel').style.display = 'none';
});