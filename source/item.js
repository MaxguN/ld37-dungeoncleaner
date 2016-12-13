function Item(x, y, name, level) {
	Animator.call(this, x, y, level.dynamic);

	this.duration = 5;
	this.states = {
		broken : 'broken',
		clearing : 'clearing',
		cleared : 'cleared',
		fixed : 'fixed'
	}

	this.state = this.states.fixed;
	this.name = name;
	this.level = level;

	this.timer = 0;

	load.json('animations/items/' + name + '.json', this.Init, this);
	// load.json('items/' + name + '.json', this.InitItem, this);
}

Item.prototype = Object.create(Animator.prototype);
Item.prototype.constructor = Item;

// Item.prototype.InitItem = function (data) {

// }

Item.prototype.placed = function () {
	this.state = this.states.fixed;

	if (this.listeners['placed']) {
		this.listeners['placed'].forEach(function (callback) {
			callback.func.call(callback.object);
		}, this);
	}

	this.listeners['placed'] = [];

	this.SwitchToAnim(this.state);
}

Item.prototype.Break = function () {
	if (this.state === this.states.broken) {
		console.log('Item is already broken');
		return false;
	}

	this.state = this.states.broken;
	this.SwitchToAnim(this.state);

	return true;
}

Item.prototype.Fetch = function () {
	return false;
}

Item.prototype.Place = function () {
	if (this.state !== this.states.fixed) {
		console.log('Item is not ready');
		return false;
	}

	this.timer = this.duration;
	this.SwitchToAnim(this.state);

	return true;
}

Item.prototype.Fix = function () {
	if (this.state !== this.states.cleared) {
		console.log('Item is not cleared yet');
		return false;
	}

	this.state = this.states.fixed;
	this.SwitchToAnim(this.state);

	return true;
}

Item.prototype.Tick = function (length) {
	if (this.timer) {
		this.timer -= length;

		if (this.timer <= 0) {
			this.timer = 0;
			this.placed();
		}
	}
}