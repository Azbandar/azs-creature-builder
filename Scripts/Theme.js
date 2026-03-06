/*-- THEME.JS --*/
/*-- Variables --*/
var themeCssMap = {
	'theme-header-bg': '--header-bg',
	'theme-header-font': '--header-font',
	'theme-theme-btn': '--theme-btn',
	'theme-theme-font': '--theme-font',
	'theme-save-btn': '--save-btn',
	'theme-save-font': '--save-font',
	'theme-load-btn': '--load-btn',
	'theme-load-font': '--load-font',
	'theme-clear-btn': '--clear-btn',
	'theme-clear-font': '--clear-font',
	'theme-export-btn': '--export-btn',
	'theme-export-font': '--export-font',
	'theme-canvas-bg': '--canvas-bg',
	'theme-section-header-font': '--section-header-font',
	'theme-section-bg': '--section-bg',
	'theme-section-border': '--section-border',
	'theme-form-bg': '--form-bg',
	'theme-form-border': '--form-border',
	'theme-form-font': '--form-font',
	'theme-dropdown-arrow': '--dropdown-arrow',
	'theme-parse-btn': '--parse-btn',
	'theme-parse-font': '--parse-font',
	'theme-section-font': '--section-font',
	'theme-placeholder-font': '--placeholder-font',
	'theme-checkbox-bg': '--checkbox-bg',
	'theme-checkbox-border': '--checkbox-border',
	'theme-checkbox-check': '--checkbox-check',
	'theme-combat-bg': '--combat-bg',
	'theme-export-bg': '--export-bg',
	'theme-export-text': '--export-text',
};
/*-- Defaults --*/
var themeDefaults = {
	'theme-header-bg': '#000000',
	'theme-header-font': '#ffffff',
	'theme-theme-btn': '#ffffff',
	'theme-theme-font': '#000000',
	'theme-save-btn': '#ffffff',
	'theme-save-font': '#000000',
	'theme-load-btn': '#ffffff',
	'theme-load-font': '#000000',
	'theme-clear-btn': '#ffffff',
	'theme-clear-font': '#000000',
	'theme-export-btn': '#ffffff',
	'theme-export-font': '#000000',
	'theme-canvas-bg': '#ffffff',
	'theme-section-header-font': '#000000',
	'theme-section-bg': '#c8c8c8',
	'theme-section-border': '#000000',
	'theme-form-bg': '#ffffff',
	'theme-form-border': '#000000',
	'theme-form-font': '#000000',
	'theme-dropdown-arrow': '#000000',
	'theme-parse-btn': '#7d7d7d',
	'theme-parse-font': '#ffffff',
	'theme-section-font': '#000000',
	'theme-placeholder-font': '#646464',
	'theme-checkbox-bg': '#ffffff',
	'theme-checkbox-border': '#000000',
	'theme-checkbox-check': '#000000',
	'theme-combat-bg': '#afafaf',
	'theme-export-bg': '#ffffff',
	'theme-export-text': '#000000',
};
/*-- Apply Theme --*/
function applyTheme(data) {
	Object.keys(data).forEach(function(id) {
		document.documentElement.style.setProperty(themeCssMap[id], data[id]);
		var el = document.getElementById(id);
		if (el) el.value = data[id];
	});
}
/*-- Load Theme --*/
function loadTheme() {
	var saved = localStorage.getItem('theme_current');
	if (saved) {
		applyTheme(JSON.parse(saved));
	} else {
		applyTheme(themeDefaults);
	}
}
loadTheme();
/*-- Picker Listeners --*/
Object.keys(themeCssMap).forEach(function(id) {
	var el = document.getElementById(id);
	if (!el) return;
	el.addEventListener('input', function() {
		document.documentElement.style.setProperty(themeCssMap[id], el.value);
		var current = {};
		Object.keys(themeCssMap).forEach(function(k) {
			var e = document.getElementById(k);
			if (e) current[k] = e.value;
		});
		localStorage.setItem('theme_current', JSON.stringify(current));
	});
});/*-- Default Button --*/
document.getElementById('theme-defaultBtn').addEventListener('click', function() {
	applyTheme(themeDefaults);
	localStorage.setItem('theme_current', JSON.stringify(themeDefaults));
});
/*-- Save Button --*/
document.getElementById('theme-saveBtn').addEventListener('click', async function() {
	var current = {};
	Object.keys(themeCssMap).forEach(function(id) {
		var el = document.getElementById(id);
		if (el) current[id] = el.value;
	});
	var json = JSON.stringify(current, null, 2);
	if (window.showSaveFilePicker) {
		try {
			var handle = await window.showSaveFilePicker({
				suggestedName: 'Theme.json',
				types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
			});
			var writable = await handle.createWritable();
			await writable.write(json);
			await writable.close();
			localStorage.setItem('theme_current', json);
			return;
		} catch (e) {
			if (e && e.name === 'AbortError') return;
		}
	}
	var blob = new Blob([json], { type: 'application/json' });
	var url = URL.createObjectURL(blob);
	var a = document.createElement('a');
	a.href = url;
	a.download = 'Theme.json';
	a.click();
	URL.revokeObjectURL(url);
	localStorage.setItem('theme_current', json);
});
/*-- Load Button --*/
document.getElementById('theme-loadBtn').addEventListener('click', function() {
	var input = document.createElement('input');
	input.type = 'file';
	input.accept = '.json';
	input.addEventListener('change', function() {
		var file = this.files[0];
		if (!file) { return; }
		var reader = new FileReader();
		reader.onload = function(e) {
			var data = JSON.parse(e.target.result);
			applyTheme(data);
			localStorage.setItem('theme_current', JSON.stringify(data));
		};
		reader.readAsText(file);
	});
	input.click();
});