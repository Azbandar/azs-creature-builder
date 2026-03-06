/*-- EXPORT.JS --*/
/*-- Variables --*/
let exportXml = "";
/*-- Tab Structure --*/
const indent1 = "\t";
const indent2 = "\t\t";
const indent3 = "\t\t\t";
const indent4 = "\t\t\t\t";
const indent5 = "\t\t\t\t\t";
const indent6 = "\t\t\t\t\t\t";
const indent7 = "\t\t\t\t\t\t\t";
/*-- Helper Functions --*/
function crToTag(cr) {
	if (cr === "0.125") return "0125";
	if (cr === "0.25") return "025";
	if (cr === "0.5") return "05";
	return cr;
}
function buildTagName(name, cr) {
	const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
	const cleanCR = crToTag(cr);
	return cleanName + cleanCR;
}
/*-- Basics --*/
function getBasics() {
	const nameRaw = document.getElementById("basics-name").value.trim();
	const cr = document.getElementById("basics-cr").value.trim();
	const hpRaw = document.getElementById("basics-hp").value.trim();
	const hpParts = hpRaw.split(" (");
	const isLair = document.getElementById("basics-lair").checked;
	return {
		nameRaw: nameRaw,
		name: nameRaw !== "" ? nameRaw : "Awaiting name...",
		cr: cr,
		tag: buildTagName(nameRaw, cr),
		size: document.getElementById("basics-size").value.trim(),
		type: document.getElementById("basics-type").value.trim(),
		alignment: document.getElementById("basics-alignment").value.trim() || "Unaligned",
		ac: document.getElementById("basics-ac").value.trim(),
		dmgred: document.getElementById("basics-dmgred").value.trim() || "0",
		hp: hpParts[0] || "0",
		hd: hpParts[1] ? "(" + hpParts[1] : "",
		initiative: document.getElementById("basics-initiative").value.trim() || "0",
		prof: document.getElementById("basics-proficiency").value.trim() || "0",
		habitat: document.getElementById("descriptiontext-habitat").value.trim(),
		treasure: document.getElementById("descriptiontext-treasure").value.trim(),
		xp: (document.getElementById("basics-xp").value.trim() || "0").replace(/,/g, ""),
		noidName: document.getElementById("basics-unidentified").value.trim() || "Unidentified",
		isIdentified: document.getElementById("basics-identified").checked ? 1 : 0,
		isLair: isLair,
	};
}
/*-- Alternative Name --*/
function getAlternativeName(b) {
	const altNameEl = document.getElementById("alternate-name");
	const altName = altNameEl ? altNameEl.value.trim() : "";
	return altName || b.nameRaw;
}
/*-- Speed --*/
function getSpeed() {
	const base = document.getElementById("speed-speed").value.trim();
	const parts = [];
	if (base) parts.push(base + " ft.");
	const others = [
		{ id: "speed-burrow", check: "speed-burrowcheck", label: "burrow" },
		{ id: "speed-climb", check: "speed-climbcheck", label: "climb" },
		{ id: "speed-fly", check: "speed-flycheck", label: "fly" },
		{ id: "speed-swim", check: "speed-swimcheck", label: "swim" },
	];
	others.forEach(function(s) {
		const checked = document.getElementById(s.check).checked;
		const val = document.getElementById(s.id).value.trim();
		if (checked && val) parts.push(s.label + " " + val + " ft.");
	});
	const individual = {};
	others.forEach(function(s) {
		const checked = document.getElementById(s.check).checked;
		const val = document.getElementById(s.id).value.trim();
		individual[s.label] = (checked && val) ? val + " ft." : "";
	});
	return {
		speed: parts.length ? parts.join(", ") : "",
		base: base ? base + " ft." : "",
		burrow: individual["burrow"],
		climb: individual["climb"],
		fly: individual["fly"],
		swim: individual["swim"],
	};
}
/*-- Abilities --*/
function getAbilities(b) {
	const list = [
		{ ab: "str", full: "strength" },
		{ ab: "dex", full: "dexterity" },
		{ ab: "con", full: "constitution" },
		{ ab: "int", full: "intelligence" },
		{ ab: "wis", full: "wisdom" },
		{ ab: "cha", full: "charisma" },
	];
	return list.map(function(a) {
		const checked = document.getElementById("ability-" + a.ab + "check").checked;
		return {
			full: a.full,
			score: document.getElementById("ability-" + a.ab + "score").value.trim() || "0",
			bonus: (document.getElementById("ability-" + a.ab + "mod").value.trim() || "0").replace("+", ""),
			save: checked ? b.prof : "0",
		};
	});
}
/*-- Skills --*/
function getSkills() {
	const list = [
		{ id: "acrobatics", label: "Acrobatics" },
		{ id: "animalhandling", label: "Animal Handling" },
		{ id: "arcana", label: "Arcana" },
		{ id: "athletics", label: "Athletics" },
		{ id: "deception", label: "Deception" },
		{ id: "history", label: "History" },
		{ id: "insight", label: "Insight" },
		{ id: "intimidation", label: "Intimidation" },
		{ id: "investigation", label: "Investigation" },
		{ id: "medicine", label: "Medicine" },
		{ id: "nature", label: "Nature" },
		{ id: "perception", label: "Perception" },
		{ id: "performance", label: "Performance" },
		{ id: "persuasion", label: "Persuasion" },
		{ id: "religion", label: "Religion" },
		{ id: "sleightofhand", label: "Sleight of Hand" },
		{ id: "stealth", label: "Stealth" },
		{ id: "survival", label: "Survival" },
	];
	const parts = [];
	list.forEach(function(skill) {
		const checked = document.getElementById("skills-" + skill.id).checked;
		if (checked) {
			const val = document.getElementById("skills-" + skill.id + "mod").value.trim();
			parts.push(skill.label + " " + val);
		}
	});
	return { skills: parts.join(", ") };
}
/*-- Damage Types --*/
const exportDamageTypes = [
	{ id: "bludgeoning", label: "Bludgeoning" },
	{ id: "piercing", label: "Piercing" },
	{ id: "slashing", label: "Slashing" },
	{ id: "acid", label: "Acid" },
	{ id: "cold", label: "Cold" },
	{ id: "fire", label: "Fire" },
	{ id: "force", label: "Force" },
	{ id: "lightning", label: "Lightning" },
	{ id: "necrotic", label: "Necrotic" },
	{ id: "poison", label: "Poison" },
	{ id: "psychic", label: "Psychic" },
	{ id: "radiant", label: "Radiant" },
	{ id: "thunder", label: "Thunder" },
];
/*-- Vulnerabilities --*/
function getVulnerabilities() {
	const parts = [];
	exportDamageTypes.forEach(function(v) {
		if (document.getElementById("vulnerability-" + v.id).checked) parts.push(v.label);
	});
	return { vulnerabilities: parts.join(", ") };
}
/*-- Resistances --*/
function getResistances() {
	const parts = [];
	exportDamageTypes.forEach(function(r) {
		if (document.getElementById("resistance-" + r.id).checked) parts.push(r.label);
	});
	return { resistances: parts.join(", ") };
}
/*-- Immunities --*/
function getImmunities() {
	const condList = [
		{ id: "blinded", label: "Blinded" },
		{ id: "charmed", label: "Charmed" },
		{ id: "deafened", label: "Deafened" },
		{ id: "exhaustion", label: "Exhaustion" },
		{ id: "frightened", label: "Frightened" },
		{ id: "grappled", label: "Grappled" },
		{ id: "incapacitated", label: "Incapacitated" },
		{ id: "invisible", label: "Invisible" },
		{ id: "paralyzed", label: "Paralyzed" },
		{ id: "petrified", label: "Petrified" },
		{ id: "poisoned", label: "Poisoned" },
		{ id: "prone", label: "Prone" },
		{ id: "restrained", label: "Restrained" },
		{ id: "stunned", label: "Stunned" },
		{ id: "unconscious", label: "Unconscious" },
	];
	const dmgParts = [];
	exportDamageTypes.forEach(function(d) {
		if (document.getElementById("immunity-" + d.id).checked) dmgParts.push(d.label);
	});
	const condParts = [];
	condList.forEach(function(c) {
		if (document.getElementById("conditionalimmunity-" + c.id).checked) condParts.push(c.label);
	});
	const dmg = dmgParts.join(", ");
	const cond = condParts.join(", ");
	let combined = "";
	if (dmg && cond) combined = dmg + "; " + cond;
	else if (dmg) combined = dmg;
	else if (cond) combined = cond;
	return { immunities: combined, dmg: dmg, cond: cond };
}
/*-- Senses --*/
function getSenses() {
	const others = [
		{ id: "blindsense", check: "senses-blindsensecheck", label: "Blindsense" },
		{ id: "darkvision", check: "senses-darkvisioncheck", label: "Darkvision" },
		{ id: "tremorsense", check: "senses-tremorsensecheck", label: "Tremorsense" },
		{ id: "truesight", check: "senses-truesightcheck", label: "True Sight" },
	];
	const parts = [];
	others.forEach(function(s) {
		const checked = document.getElementById(s.check).checked;
		const val = document.getElementById("senses-" + s.id).value.trim();
		if (checked && val) parts.push(s.label + " " + val + " ft.");
	});
	const perception = document.getElementById("senses-perception").value.trim() || "0";
	const passive = "Passive Perception " + perception;
	const senses = parts.length ? parts.join(", ") + "; " + passive : passive;
	return { senses: senses, other: parts.join(", "), perception: perception };
}
/*-- Languages --*/
function getLanguages() {
	const list = [
		{ id: "common", label: "Common" },
		{ id: "abyssal", label: "Abyssal" },
		{ id: "celestial", label: "Celestial" },
		{ id: "deepspeech", label: "Deep Speech" },
		{ id: "draconic", label: "Draconic" },
		{ id: "druidic", label: "Druidic" },
		{ id: "dwarvish", label: "Dwarvish" },
		{ id: "elvish", label: "Elvish" },
		{ id: "giant", label: "Giant" },
		{ id: "gnomish", label: "Gnomish" },
		{ id: "goblin", label: "Goblin" },
		{ id: "halfling", label: "Halfling" },
		{ id: "infernal", label: "Infernal" },
		{ id: "orc", label: "Orc" },
		{ id: "primordial", label: "Primordial" },
		{ id: "sylvan", label: "Sylvan" },
		{ id: "thievescant", label: "Thieves Cant" },
		{ id: "undercommon", label: "Undercommon" },
	];
	const parts = [];
	list.forEach(function(l) {
		if (document.getElementById("language-" + l.id).checked) parts.push(l.label);
	});
	return { languages: parts.join(", ") };
}
/*-- Combat Section Builder --*/
function buildCombatSection(prefix, outerTag, qtyId) {
	const qty = parseInt(document.getElementById(qtyId).value) || 0;
	if (qty === 0) return indent3 + "<" + outerTag + " />\n";
	let xml = "";
	xml += indent3 + "<" + outerTag + ">\n";
	for (var i = 1; i <= qty; i++) {
		const nameBase = document.getElementById(prefix + i + "-name").value.trim();
		const uses = document.getElementById(prefix + i + "-uses").value.trim();
		const isRounds = document.getElementById(prefix + i + "-roundscheck").checked;
		const isPerDay = document.getElementById(prefix + i + "-perdaycheck").checked;
		const isRecharge = document.getElementById(prefix + i + "-rechargecheck").checked;
		let name = nameBase;
		if (isRounds && uses) name += ": Uses: " + uses;
		else if (isPerDay && uses) name += ": " + uses + "/Day";
		else if (isRecharge && uses) name += " (Recharge " + uses + ")";
		const isMelee = document.getElementById(prefix + i + "-meleecheck").checked;
		const isRange = document.getElementById(prefix + i + "-rangecheck1").checked;
		const isSave = document.getElementById(prefix + i + "-savecheck").checked;
		const useSimplified = isMelee || isRange || isSave;
		let descRaw;
		if (useSimplified) {
			const simpId = prefix + i + "-simplified";
			const simpEl = document.getElementById(simpId);
			if (
				simpEl &&
				(!simpEl.value.trim() || simpEl.value.trim() === "Awaiting description...") &&
				typeof renderSimplified === "function"
			) {
				renderSimplified(prefix, i);
			}
			descRaw = (document.getElementById(simpId) || { value: "" }).value.trim();
		} else {
			const styId = prefix + i + "-stylized";
			const styEl = document.getElementById(styId);
			if (
				styEl &&
				(!styEl.value.trim() || styEl.value.trim() === "Awaiting description...") &&
				typeof renderStylized === "function"
			) {
				renderStylized(prefix, i);
			}
			descRaw = (document.getElementById(styId) || { value: "" }).value.trim();
		}
		const desc = descRaw.replace(/\.\s*(?!$)/g, ".\\n");
		xml += indent4 + "<" + prefix + i + ">\n";
		xml += indent5 + '<name type="string">' + name + "</name>\n";
		xml += indent5 + '<desc type="string">' + desc + "</desc>\n";
		xml += indent4 + "</" + prefix + i + ">\n";
	}
	xml += indent3 + "</" + outerTag + ">\n";
	return xml;
}
/*-- Effects Builder --*/
function buildEffects(nameRaw) {
	const qty = parseInt(document.getElementById("effects-qty").value) || 0;
	if (qty === 0) return indent3 + "<effectlist />\n";
	let xml = "";
	xml += indent3 + "<effectlist>\n";
	for (var i = 1; i <= qty; i++) {
		const styId = "effect" + i + "-stylized";
		const styEl = document.getElementById(styId);
		if (
			styEl &&
			(!styEl.value.trim() || styEl.value.trim() === "Awaiting description...") &&
			typeof renderStylized === "function"
		) {
			renderStylized("effect", i);
		}
		const effect = (document.getElementById(styId) || { value: "" }).value.trim();
		const dice = document.getElementById("effect" + i + "-dice").value.trim();
		const mod = document.getElementById("effect" + i + "-mod").value.trim();
		const isRounds = document.getElementById("effect" + i + "-roundscheck").checked;
		const isMinutes = document.getElementById("effect" + i + "-minutescheck").checked;
		const isHours = document.getElementById("effect" + i + "-hourscheck").checked;
		const isDays = document.getElementById("effect" + i + "-dayscheck").checked;
		const isShow = document.getElementById("effect" + i + "-showcheck").checked;
		const isAction = document.getElementById("effect" + i + "-actioncheck").checked;
		const isRoll = document.getElementById("effect" + i + "-rollcheck").checked;
		const isOnce = document.getElementById("effect" + i + "-oncecheck1").checked;
		const isDisable = document.getElementById("effect" + i + "-disablecheck").checked;
		const anyChk = document.getElementById("effect" + i + "-anycheck").checked;
		const targetChk = document.getElementById("effect" + i + "-targetcheck").checked;
		const sourceChk = document.getElementById("effect" + i + "-sourcecheck").checked;
		const startChk = document.getElementById("effect" + i + "-startcheck").checked;
		const endChk = document.getElementById("effect" + i + "-endcheck").checked;
		const activateChk = document.getElementById("effect" + i + "-activatecheck").checked;
		const deactivateChk = document.getElementById("effect" + i + "-deactivatecheck").checked;
		const removeChk = document.getElementById("effect" + i + "-removecheck").checked;
		const hasDice = dice !== "";
		const effectiveMod = (!hasDice && mod === "" && (isRounds || isMinutes || isHours || isDays)) ? "1" : mod;
		const modNum = parseFloat(effectiveMod) || 0;
		let unitBase = "";
		if (isRounds) unitBase = "rnd";
		else if (isMinutes) unitBase = "minute";
		else if (isHours) unitBase = "hour";
		else if (isDays) unitBase = "day";
		const plural = hasDice || modNum > 1;
		const durunit = unitBase ? (plural ? unitBase + "s" : unitBase) : "";
		let durStr = "";
		if (durunit) {
			const durParts = [];
			if (hasDice) durParts.push(dice);
			if (effectiveMod) durParts.push(effectiveMod);
			durStr = durParts.join(" + ") + " " + durunit;
		}
		const isHide = document.getElementById("effect" + i + "-hidecheck").checked;
		const visibility = isHide ? "hide" : "show";
		const effectDesc = "[" + effect + "]" + (durStr ? " [" + durStr + "]" : "") + " [" + (visibility.charAt(0).toUpperCase() + visibility.slice(1)) + "]";
		const apply = isAction ? "action" : isRoll ? "roll" : isOnce ? "single" : isDisable ? "duse" : "";
		let changeState = "";
		if ((anyChk || targetChk || sourceChk) && (startChk || endChk) && (activateChk || deactivateChk || removeChk)) {
			const sPrefix = sourceChk ? "s" : "";
			const applyLetter = activateChk ? "a" : deactivateChk ? "d" : "r";
			const actorLetter = anyChk ? "t" : "";
			const timeLetter = startChk ? "s" : "e";
			if (anyChk && endChk) { changeState = ""; }
			else { changeState = sPrefix + applyLetter + actorLetter + timeLetter; }
		}
		xml += indent4 + "<effect" + i + ">\n";
		xml += indent5 + '<name type="string">' + nameRaw + "</name>\n";
		xml += indent5 + '<effect type="string">' + effect + "</effect>\n";
		xml += indent5 + '<effect_description type="string">' + effectDesc + "</effect_description>\n";
		xml += indent5 + '<visibility type="string">' + visibility + "</visibility>\n";
		xml += indent5 + '<durdice type="dice">' + dice + "</durdice>\n";
		xml += indent5 + '<durmod type="number">' + effectiveMod + "</durmod>\n";
		xml += indent5 + '<durunit type="string">' + durunit + "</durunit>\n";
		xml += indent5 + '<apply type="string">' + apply + "</apply>\n";
		xml += indent5 + '<changestate type="string">' + changeState + "</changestate>\n";
		xml += indent5 + '<actiononly type="number">0' + "</actiononly>\n";
		xml += indent4 + "</" + "effect" + i + ">\n";
	}
	xml += indent3 + "</effectlist>\n";
	return xml;
}
/*-- Description Texts --*/
function buildDescriptionTexts() {
	const qty = parseInt(document.getElementById("descriptiontexts-qty").value) || 0;
	if (qty === 0) return "";
	let xml = "";
	for (var i = 1; i <= qty; i++) {
		const isTable = document.getElementById("descriptiontext" + i + "-table").checked;
		const isList = document.getElementById("descriptiontext" + i + "-list").checked;
		if (isTable) {
			const cols = parseInt(document.getElementById("descriptiontext" + i + "-cols").value) || 1;
			const lines = parseInt(document.getElementById("descriptiontext" + i + "-lines").value) || 1;
			xml += indent4 + "<table>\n";
			for (var r = 1; r <= lines; r++) {
				const bold = document.getElementById("descriptiontext" + i + "-row" + r + "-bold").checked;
				const italic = document.getElementById("descriptiontext" + i + "-row" + r + "-italic").checked;
				let tr = indent5 + "<tr>";
				for (var c = 1; c <= cols; c++) {
					const colEl = document.getElementById("descriptiontext" + i + "-row" + r + "-col" + c);
					const text = colEl ? colEl.value.trim() : "";
					const spanEl = document.getElementById("descriptiontext" + i + "-span" + c);
					const span = spanEl ? parseInt(spanEl.value) || 1 : 1;
					const colspanAttr = span > 1 ? ' colspan="' + span + '"' : "";
					let inner = text;
					if (italic) inner = "<i>" + inner + "</i>";
					if (bold) inner = "<b>" + inner + "</b>";
					tr += "<td" + colspanAttr + ">" + inner + "</td>";
				}
				tr += "</tr>\n";
				xml += tr;
			}
			xml += indent4 + "</table>\n";
			continue;
		}
		if (isList) {
			const lines = parseInt(document.getElementById("descriptiontext" + i + "-lines").value) || 1;
			xml += indent4 + "<linklist>\n";
			for (var r = 1; r <= lines; r++) {
				const text = document.getElementById("descriptiontext" + i + "-row" + r + "-col1").value.trim();
				if (!text) { continue; }
				const recordname = "tables." + text.toLowerCase().replace(/[^a-z0-9]/g, "");
				xml += indent5 + '<link class="table" recordname="' + recordname + '"><b>Table: </b>' + text + "</link>\n";
			}
			xml += indent4 + "</linklist>\n";
			continue;
		}
		const lines = parseInt(document.getElementById("descriptiontext" + i + "-lines").value) || 1;
		for (var r = 1; r <= lines; r++) {
			const text = document.getElementById("descriptiontext" + i + "-row" + r + "-col1").value.trim();
			if (!text) { continue; }
			const bold = document.getElementById("descriptiontext" + i + "-row" + r + "-bold").checked;
			const italic = document.getElementById("descriptiontext" + i + "-row" + r + "-italic").checked;
			let inner = text;
			if (italic) inner = "<i>" + inner + "</i>";
			if (bold) inner = "<b>" + inner + "</b>";
			xml += indent4 + "<p>" + inner + "</p>\n";
		}
	}
	return xml;
}
/*-- Has Description Text --*/
function getHasDescText() {
	const qty = parseInt(document.getElementById("descriptiontexts-qty").value) || 0;
	for (var i = 1; i <= qty; i++) {
		const lines = parseInt(document.getElementById("descriptiontext" + i + "-lines").value) || 1;
		for (var r = 1; r <= lines; r++) {
			var col1 = document.getElementById("descriptiontext" + i + "-row" + r + "-col1");
			if (col1 && col1.value.trim()) { return true; }
		}
	}
	return false;
}
/*-- Ability Table --*/
function getAbilityTable(abilities) {
	var xml = "";
	var pairs = [
		["strength","STR","str","dexterity","DEX","dex"],
		["constitution","CON","con","intelligence","INT","int"],
		["wisdom","WIS","wis","charisma","CHA","cha"],
	];
	xml += indent4 + "<table>\n";
	xml += indent5 + "<tr>\n";
	xml += indent6 + '<td colspan="2" /><td><b>MOD</b></td><td><b>SAVE</b></td>\n';
	xml += indent6 + '<td colspan="2" /><td><b>MOD</b></td><td><b>SAVE</b></td>\n';
	xml += indent5 + "</tr>\n";
	pairs.forEach(function(p) {
		var a1 = abilities.filter(function(a){return a.full===p[0];})[0];
		var a2 = abilities.filter(function(a){return a.full===p[3];})[0];
		var save1 = document.getElementById("ability-" + p[2] + "save").value.trim() || "0";
		var save2 = document.getElementById("ability-" + p[5] + "save").value.trim() || "0";
		var mod1 = parseFloat(a1.bonus) >= 0 ? "+" + a1.bonus : a1.bonus;
		var mod2 = parseFloat(a2.bonus) >= 0 ? "+" + a2.bonus : a2.bonus;
		xml += indent5 + "<tr>\n";
		xml += indent6 + "<td><b>" + p[1] + "</b></td><td>" + a1.score + "</td><td>" + mod1 + "</td><td>" + save1 + "</td>\n";
		xml += indent6 + "<td><b>" + p[4] + "</b></td><td>" + a2.score + "</td><td>" + mod2 + "</td><td>" + save2 + "</td>\n";
		xml += indent5 + "</tr>\n";
	});
	xml += indent4 + "</table>\n";
	return xml;
}
/*-- Formatted Section Builder --*/
function buildFormattedSection(prefix, header, qtyId) {
	const qty = parseInt(document.getElementById(qtyId).value) || 0;
	if (qty === 0) return "";
	let xml = "";
	xml += indent4 + "<h>" + header + "</h>\n";
	for (var i = 1; i <= qty; i++) {
		const nameBase = document.getElementById(prefix + i + "-name").value.trim();
		const uses = document.getElementById(prefix + i + "-uses").value.trim();
		const isRounds = document.getElementById(prefix + i + "-roundscheck").checked;
		const isPerDay = document.getElementById(prefix + i + "-perdaycheck").checked;
		const isRecharge = document.getElementById(prefix + i + "-rechargecheck").checked;
		let name = nameBase;
		if (isRounds && uses) name += ": Uses: " + uses;
		else if (isPerDay && uses) name += ": " + uses + "/Day";
		else if (isRecharge && uses) name += " (Recharge " + uses + ")";

		const styId = prefix + i + "-stylized";
		const styEl = document.getElementById(styId);
		if (
			styEl &&
			(!styEl.value.trim() || styEl.value.trim() === "Awaiting description...") &&
			typeof renderStylized === "function"
		) {
			renderStylized(prefix, i);
		}
		const desc = (document.getElementById(styId) || { value: "" }).value.trim();

		xml += indent4 + "<p><b>" + name + ". </b>" + desc + "</p>\n";
	}
	return xml;
}
/*-- Export Function --*/
function generateExport() {
	const exportCode = document.getElementById("export-code");
	if (!exportCode) return;
	if (!document.getElementById("basics-name").value.trim()) {
		exportCode.textContent = "Awaiting name...";
		return;
	}
	const b = getBasics();
	const imageBaseName = getAlternativeName(b);
	const s = getSpeed();
	const abilities = getAbilities(b);
	const sk = getSkills();
	const v = getVulnerabilities();
	const r = getResistances();
	const im = getImmunities();
	const se = getSenses();
	const hasDescText = getHasDescText();
	const la = getLanguages();
	let xml = "";
	xml += indent2 + "<" + b.tag + ">\n";
	xml += indent3 + '<name type="string">' + b.name + "</name>\n";
	xml += indent3 + '<noid_name type="string">' + b.noidName + "</noid_name>\n";
	xml += indent3 + '<isidentified type="number">' + b.isIdentified + "</isidentified>\n";
	xml += indent3 + '<size type="string">' + b.size + "</size>\n";
	xml += indent3 + '<type type="string">' + (b.isLair ? "Lair" : b.type) + "</type>\n";
	xml += indent3 + '<alignment type="string">' + b.alignment + "</alignment>\n";
	xml += indent3 + '<ac type="number">' + b.ac + "</ac>\n";
	xml += indent3 + '<damagethreshold type="number">' + b.dmgred + "</damagethreshold>\n";
	xml += indent3 + '<hp type="number">' + b.hp + "</hp>\n";
	xml += indent3 + '<hd type="string">' + b.hd + "</hd>\n";
	xml += indent3 + '<speed type="string">' + s.speed + "</speed>\n";
	xml += indent3 + "<initiative>\n";
	xml += indent4 + '<misc type="number">' + b.initiative + "</misc>\n";
	xml += indent3 + "</initiative>\n";
	xml += indent3 + "<abilities>\n";
	abilities.forEach(function(a) {
		xml += indent4 + "<" + a.full + ">\n";
		xml += indent5 + '<score type="number">' + a.score + "</score>\n";
		xml += indent5 + '<bonus type="number">' + a.bonus + "</bonus>\n";
		xml += indent5 + '<savemodifier type="number">' + a.save + "</savemodifier>\n";
		xml += indent4 + "</" + a.full + ">\n";
	});
	xml += indent3 + "</abilities>\n";
	xml += indent3 + '<skills type="string">' + sk.skills + "</skills>\n";
	xml += indent3 + '<damagevulnerabilities type="string">' + v.vulnerabilities + "</damagevulnerabilities>\n";
	xml += indent3 + '<damageresistances type="string">' + r.resistances + "</damageresistances>\n";
	xml += indent3 + '<damageimmunities type="string">' + im.immunities + "</damageimmunities>\n";
	xml += indent3 + '<senses type="string">' + se.senses + "</senses>\n";
	xml += indent3 + '<languages type="string">' + la.languages + "</languages>\n";
	xml += indent3 + '<cr type="string">' + b.cr + "</cr>\n";
	xml += indent3 + '<xp type="number">' + b.xp + "</xp>\n";
	xml += indent3 + '<token type="token">tokens/' + imageBaseName + ".png" + "</token>\n";
	xml += indent3 + '<picture type="token">images/' + imageBaseName + ".png" + "</picture>\n";
	xml += indent3 + '<token3Dflat type="token">tokens/' + imageBaseName + ".png" + "</token3Dflat>\n";
	xml += indent3 + '<locked type="number">1' + "</locked>\n";
	xml += indent3 + '<version type="string">2024' + "</version>\n";
	xml += buildCombatSection("trait", "traits", "traits-qty");
	xml += buildCombatSection("action", "actions", "actions-qty");
	xml += buildCombatSection("bonusaction", "bonusactions", "bonusactions-qty");
	xml += buildCombatSection("reaction", "reactions", "reactions-qty");
	xml += buildCombatSection("legendaryaction", "legendaryactions", "legendaryactions-qty");
	xml += buildCombatSection("lairaction", "lairactions", "lairactions-qty");
	xml += indent3 + "<spellslots>\n";
	xml += indent4 + '<level1 type="number">0' + "</level1>\n";
	xml += indent4 + '<level2 type="number">0' + "</level2>\n";
	xml += indent4 + '<level3 type="number">0' + "</level3>\n";
	xml += indent4 + '<level4 type="number">0' + "</level4>\n";
	xml += indent4 + '<level5 type="number">0' + "</level5>\n";
	xml += indent4 + '<level6 type="number">0' + "</level6>\n";
	xml += indent4 + '<level7 type="number">0' + "</level7>\n";
	xml += indent4 + '<level8 type="number">0' + "</level8>\n";
	xml += indent4 + '<level9 type="number">0' + "</level9>\n";
	xml += indent3 + "</spellslots>\n";
	xml += indent3 + "<spells />\n";
	xml += buildCombatSection("spell", "innatespells", "spells-qty");
	xml += buildEffects(b.nameRaw);
	if (b.habitat) xml += indent3 + '<habitat type="string">' + b.habitat + "</habitat>\n";
	if (b.treasure) xml += indent3 + '<treasure type="string">' + b.treasure + "</treasure>\n";
	xml += indent3 + '<text type="formattedtext">\n';
	xml += indent4 + "<h>" + b.nameRaw + "</h>\n";
	xml += buildDescriptionTexts();
	if (hasDescText) xml += indent4 + "<h>" + b.nameRaw + "</h>\n";
	xml += indent4 + '<p><b><i>' + b.size + " " + b.type + ", " + b.alignment + "</i></b></p>\n";
	xml += indent4 + '<p><b>Armor Class: </b>' + b.ac + "</p>\n";
	xml += indent4 + '<p><b>Hit Points: </b>' + b.hp + " " + b.hd + "</p>\n";
	xml += indent4 + '<p><b>Speed: </b>' + s.base + "</p>\n";
	if (s.burrow) xml += indent4 + '<p><b>Burrow: </b>' + s.burrow + "</p>\n";
	if (s.climb) xml += indent4 + '<p><b>Climb: </b>' + s.climb + "</p>\n";
	if (s.fly) xml += indent4 + '<p><b>Fly: </b>' + s.fly + "</p>\n";
	if (s.swim) xml += indent4 + '<p><b>Swim: </b>' + s.swim + "</p>\n";
	xml += getAbilityTable(abilities);
	if (sk.skills) xml += indent4 + '<p><b>Skills: </b>' + sk.skills + "</p>\n";
	if (v.vulnerabilities) xml += indent4 + '<p><b>Damage Vulnerabilities: </b>' + v.vulnerabilities + "</p>\n";
	if (r.resistances) xml += indent4 + '<p><b>Damage Resistances: </b>' + r.resistances + "</p>\n";
	if (im.dmg) xml += indent4 + '<p><b>Damage Immunities: </b>' + im.dmg + "</p>\n";
	if (im.cond) xml += indent4 + '<p><b>Condition Immunities: </b>' + im.cond + "</p>\n";
	if (se.other) xml += indent4 + '<p><b>Senses: </b>' + se.other + "</p>\n";
	xml += indent4 + '<p><b>Passive Perception: </b>' + se.perception + "</p>\n";
	if (la.languages) xml += indent4 + '<p><b>Languages: </b>' + la.languages + "</p>\n";
	xml += indent4 + '<p><b>CR: </b>' + b.cr + " (XP " + b.xp + ")" + "</p>\n";
	xml += indent4 + '<p><b>Proficiency: </b>' + "+" + b.prof + "</p>\n";
	xml += buildFormattedSection("trait", "Traits", "traits-qty");
	xml += buildFormattedSection("action", "Actions", "actions-qty");
	xml += buildFormattedSection("spell", "Spells", "spells-qty");
	xml += buildFormattedSection("bonusaction", "Bonus Actions", "bonusactions-qty");
	xml += buildFormattedSection("reaction", "Reactions", "reactions-qty");
	xml += buildFormattedSection("legendaryaction", "Legendary Actions", "legendaryactions-qty");
	xml += buildFormattedSection("lairaction", "Lair Actions", "lairactions-qty");
	xml += indent3 + "</text>\n";
	xml += indent3 + "<coins />\n";
	xml += indent3 + "<inventorylist />\n";
	xml += indent3 + "<encumbrance>\n";
	xml += indent4 + '<encumbered type="number">0</encumbered>\n';
	xml += indent4 + '<encumberedheavy type="number">0</encumberedheavy>\n';
	xml += indent4 + '<liftpushdrag type="number">0</liftpushdrag>\n';
	xml += indent4 + '<load type="number">0</load>\n';
	xml += indent4 + '<max type="number">0</max>\n';
	xml += indent3 + "</encumbrance>\n";
	xml += indent3 + "<classes></classes>\n";
	xml += indent3 + '<deathsavefail type="number">0</deathsavefail>\n';
	xml += indent3 + '<deathsavesuccess type="number">0</deathsavesuccess>\n';
	xml += indent3 + '<hpadjust type="number">0</hpadjust>\n';
	xml += indent3 + '<hptemp type="number">0</hptemp>\n';
	xml += indent2 + "</" + b.tag + ">";
	exportXml = xml;
	const lines = exportXml.split("\n");
	lines[0] = lines[0].startsWith(indent2) ? lines[0].slice(indent2.length) : lines[0];
	const display = lines.map(function(line) {
		return line.startsWith(indent2) ? line.slice(indent2.length) : line;
	}).join("\n");
	document.getElementById("export-code").textContent = display;
	exportXml = lines[0].trimStart() + "\n" + lines.slice(1).join("\n");
}
/*-- Listeners --*/
document.getElementById("basics-name").addEventListener("input", generateExport);
document.getElementById("basics-unidentified").addEventListener("input", generateExport);
document.getElementById("basics-identified").addEventListener("change", generateExport);
document.getElementById("basics-lair").addEventListener("change", generateExport);
document.getElementById("basics-cr").addEventListener("input", generateExport);
document.getElementById("basics-xp").addEventListener("input", generateExport);
document.getElementById("descriptiontext-habitat").addEventListener("input", generateExport);
document.getElementById("descriptiontext-treasure").addEventListener("input", generateExport);
document.getElementById("basics-size").addEventListener("input", generateExport);
document.getElementById("basics-type").addEventListener("input", generateExport);
document.getElementById("basics-alignment").addEventListener("input", generateExport);
document.getElementById("basics-ac").addEventListener("input", generateExport);
document.getElementById("basics-dmgred").addEventListener("input", generateExport);
document.getElementById("basics-hp").addEventListener("input", generateExport);
document.getElementById("basics-initiative").addEventListener("input", generateExport);
document.getElementById("basics-proficiency").addEventListener("input", generateExport);
document.getElementById("alternate-name").addEventListener("input", generateExport);
["str","dex","con","int","wis","cha"].forEach(function(ab) {
	document.getElementById("ability-" + ab + "save").addEventListener("input", generateExport);
});
document.getElementById("senses-perception").addEventListener("input", generateExport);
document.getElementById("senses-blindsense").addEventListener("input", generateExport);
document.getElementById("senses-darkvision").addEventListener("input", generateExport);
document.getElementById("senses-tremorsense").addEventListener("input", generateExport);
document.getElementById("senses-truesight").addEventListener("input", generateExport);
document.getElementById("senses-blindsensecheck").addEventListener("change", generateExport);
document.getElementById("senses-darkvisioncheck").addEventListener("change", generateExport);
document.getElementById("senses-tremorsensecheck").addEventListener("change", generateExport);
document.getElementById("senses-truesightcheck").addEventListener("change", generateExport);
["acrobatics","animalhandling","arcana","athletics","deception","history","insight","intimidation","investigation","medicine","nature","perception","performance","persuasion","religion","sleightofhand","stealth","survival"].forEach(function(skill) {
	document.getElementById("skills-" + skill).addEventListener("change", generateExport);
	document.getElementById("skills-" + skill + "mod").addEventListener("input", generateExport);
});
document.getElementById("speed-speed").addEventListener("input", generateExport);
document.getElementById("speed-burrow").addEventListener("input", generateExport);
document.getElementById("speed-climb").addEventListener("input", generateExport);
document.getElementById("speed-fly").addEventListener("input", generateExport);
document.getElementById("speed-swim").addEventListener("input", generateExport);
document.getElementById("speed-burrowcheck").addEventListener("change", generateExport);
document.getElementById("speed-climbcheck").addEventListener("change", generateExport);
document.getElementById("speed-flycheck").addEventListener("change", generateExport);
document.getElementById("speed-swimcheck").addEventListener("change", generateExport);
["str","dex","con","int","wis","cha"].forEach(function(ab) {
	document.getElementById("ability-" + ab + "score").addEventListener("input", generateExport);
	document.getElementById("ability-" + ab + "mod").addEventListener("input", generateExport);
	document.getElementById("ability-" + ab + "check").addEventListener("change", generateExport);
});
["bludgeoning","piercing","slashing","acid","cold","fire","force","lightning","necrotic","poison","psychic","radiant","thunder"].forEach(function(d) {
	document.getElementById("vulnerability-" + d).addEventListener("change", generateExport);
	document.getElementById("resistance-" + d).addEventListener("change", generateExport);
	document.getElementById("immunity-" + d).addEventListener("change", generateExport);
});
["blinded","charmed","deafened","exhaustion","frightened","grappled","incapacitated","invisible","paralyzed","petrified","poisoned","prone","restrained","stunned","unconscious"].forEach(function(c) {
	document.getElementById("conditionalimmunity-" + c).addEventListener("change", generateExport);
});
["abyssal","celestial","common","deepspeech","draconic","druidic","dwarvish","elvish","giant","gnomish","goblin","halfling","infernal","orc","primordial","sylvan","thievescant","undercommon"].forEach(function(l) {
	document.getElementById("language-" + l).addEventListener("change", generateExport);
});
var combatSections = [
	{ prefix: "trait", max: maxTraits, qty: "traits-qty" },
	{ prefix: "action", max: maxActions, qty: "actions-qty" },
	{ prefix: "bonusaction", max: maxBonusActions, qty: "bonusactions-qty" },
	{ prefix: "reaction", max: maxReactions, qty: "reactions-qty" },
	{ prefix: "legendaryaction", max: maxLegendaryActions, qty: "legendaryactions-qty" },
	{ prefix: "lairaction", max: maxLairActions, qty: "lairactions-qty" },
	{ prefix: "spell", max: maxSpells, qty: "spells-qty" },
];
combatSections.forEach(function(sec) {
	document.getElementById(sec.qty).addEventListener("input", generateExport);
	for (var i = 1; i <= sec.max; i++) {
		(function(prefix, n) {
			document.getElementById(prefix + n + "-name").addEventListener("input", generateExport);
			document.getElementById(prefix + n + "-uses").addEventListener("input", generateExport);
			document.getElementById(prefix + n + "-roundscheck").addEventListener("change", generateExport);
			document.getElementById(prefix + n + "-perdaycheck").addEventListener("change", generateExport);
			document.getElementById(prefix + n + "-rechargecheck").addEventListener("change", generateExport);
			document.getElementById(prefix + n + "-meleecheck").addEventListener("change", generateExport);
			document.getElementById(prefix + n + "-rangecheck1").addEventListener("change", generateExport);
			document.getElementById(prefix + n + "-savecheck").addEventListener("change", generateExport);
			document.getElementById(prefix + n + "-stylized").addEventListener("input", generateExport);
			document.getElementById(prefix + n + "-simplified").addEventListener("input", generateExport);
		})(sec.prefix, i);
	}
});
document.getElementById("effects-qty").addEventListener("input", generateExport);
for (var ei = 1; ei <= maxEffects; ei++) {
	(function(i) {
		["stylized","dice","mod"].forEach(function(f) {
			document.getElementById("effect" + i + "-" + f).addEventListener("input", generateExport);
		});
		["showcheck","hidecheck","actioncheck","rollcheck","oncecheck1","disablecheck",
		 "roundscheck","minutescheck","hourscheck","dayscheck",
		 "anycheck","targetcheck","sourcecheck","startcheck","endcheck",
		 "activatecheck","deactivatecheck","removecheck"].forEach(function(f) {
			document.getElementById("effect" + i + "-" + f).addEventListener("change", generateExport);
		});
	})(ei);
}
document.getElementById("descriptiontexts-qty").addEventListener("input", generateExport);
for (var di = 1; di <= maxDescriptionTexts; di++) {
	(function(n) {
		["para","table","list"].forEach(function(t) {
			document.getElementById("descriptiontext" + n + "-" + t).addEventListener("change", generateExport);
		});
		document.getElementById("descriptiontext" + n + "-lines").addEventListener("input", generateExport);
		for (var r = 1; r <= 12; r++) {
			(function(row) {
				var col1 = document.getElementById("descriptiontext" + n + "-row" + row + "-col1");
				var bold = document.getElementById("descriptiontext" + n + "-row" + row + "-bold");
				var italic = document.getElementById("descriptiontext" + n + "-row" + row + "-italic");
				if (col1) col1.addEventListener("input", generateExport);
				for (var c = 2; c <= 5; c++) {
					var colN = document.getElementById("descriptiontext" + n + "-row" + row + "-col" + c);
					if (colN) colN.addEventListener("input", generateExport);
				}
				["span1","span2","span3","span4","span5"].forEach(function(s) {
					var spanEl = document.getElementById("descriptiontext" + n + "-" + s);
					if (spanEl) spanEl.addEventListener("input", generateExport);
				});
				if (bold) bold.addEventListener("change", generateExport);
				if (italic) italic.addEventListener("change", generateExport);
			})(r);
		}
	})(di);
}
generateExport();
/*-- Export Button: Copy to Clipboard --*/
document.getElementById("exportBtn").addEventListener("click", async function() {
	if (typeof generateExport === "function") {
		generateExport();
	}
	if (!exportXml) {
		return;
	}
	try {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			await navigator.clipboard.writeText(exportXml);
		} else {
			var ta = document.createElement("textarea");
			ta.value = exportXml;
			ta.style.position = "fixed";
			ta.style.left = "-9999px";
			document.body.appendChild(ta);
			ta.focus();
			ta.select();
			document.execCommand("copy");
			document.body.removeChild(ta);
		}
		alert("Export copied to clipboard.");
	} catch (e) {
		console.error(e);
		alert("Unable to copy to clipboard. You can copy manually from the Export panel.");
	}
});

