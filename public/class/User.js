function User(uid) {
	this.uid = uid;
	this.login = null;
	this.ip = null;
	this.sid = null;
	this.safe = true;
	this.socket = null;
	this.creation_date = Date.now();
}

User.prototype.getLogin = function () {
	if (this.login)
		return (this.login);
	else
		return ('Unknown');
}