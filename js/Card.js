function Card(DBfrom, carid) {
	if (DBfrom.indexOf("Minion") != -1)
		return (new Minion(eval(DBfrom)[carid], DBfrom, carid));
	if (DBfrom.indexOf("Spell") != -1)
		return (new Spell(eval(DBfrom)[carid], DBfrom, carid));
	if (DBfrom.indexOf("Weapon") != -1)
		return (new Weapon(eval(DBfrom)[carid], DBfrom, carid));
}