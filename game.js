// --- 1. CONFIGURATION & DATABASE ---
const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;

const TYPES = {
	// Atlas Frame Names from simpleSpace_sheet@2.xml
	PLAYER: "station_C.png",
	ENEMY_BAT: "enemy_A.png", // Fast enemy
	ENEMY_SKEL: "enemy_D.png", // Tougher enemy
	ENEMY_BOSS: "ship_sidesC.png", // Boss
	BULLET: "star_tiny.png",
	GEM: "star_small.png",
	ORB: "meteor_small.png",
	LASER: "effect_purple.png",
	HELPER: "station_A.png",
	GRENADE: "meteor_squareSmall.png",
	PARTICLE: "star_tiny.png",
	AOE: "aoe_texture", // Procedural
};

const UPGRADES = [
	// Stats
	{ id: "might", name: "Spinach", desc: "Increases Damage by 20%", icon: "💪", type: "stat", stat: "damageMult", val: 0.2 },
	{ id: "haste", name: "Coffee", desc: "Increases Fire Rate by 15%", icon: "☕", type: "stat", stat: "fireRateMult", val: 0.15 },
	{ id: "speed", name: "Sneakers", desc: "Increases Move Speed by 15%", icon: "👟", type: "stat", stat: "speedMult", val: 0.15 },
	{ id: "magnet", name: "Magnet", desc: "Increases Pickup Range by 30%", icon: "🧲", type: "stat", stat: "pickupMult", val: 0.3 },
	{ id: "vitality", name: "Heart", desc: "Heal 50% HP & +20% Max HP", icon: "❤️", type: "heal" },
	{ id: "area", name: "Candelabra", desc: "Increases Area of Effect by 25%", icon: "🕯️", type: "stat", stat: "areaMult", val: 0.25 },
	{ id: "duration", name: "Hourglass", desc: "Increases Effect Duration by 30%", icon: "⏳", type: "stat", stat: "durationMult", val: 0.3 },
	{ id: "pierce", name: "Spearhead", desc: "Projectiles pierce +1 extra enemy", icon: "🗡️", type: "stat", stat: "pierce", val: 1 },
	{ id: "crit", name: "Lucky Coin", desc: "+15% Critical Hit Chance", icon: "🪙", type: "stat", stat: "critChance", val: 0.15 },
	{ id: "critdmg", name: "Diamond Edge", desc: "+50% Critical Damage", icon: "💎", type: "stat", stat: "critDamageMult", val: 0.5 },
	{ id: "armor", name: "Turtle Shell", desc: "Reduce incoming damage by 15%", icon: "🐢", type: "defense", stat: "damageReduction", val: 0.15 },
	{ id: "regen", name: "Green Tea", desc: "Regenerate 1 HP per second", icon: "🍵", type: "stat", stat: "hpRegen", val: 1 },
	{ id: "luck", name: "Four Leaf", desc: "+20% Luck (better drops)", icon: "🍀", type: "stat", stat: "luck", val: 0.2 },
	{ id: "telescope", name: "Stargazer", desc: "Projectiles gain +50% range", icon: "🔭", type: "stat", stat: "rangeMult", val: 0.5 },
	{ id: "xpboost", name: "Study Book", desc: "+25% XP gain", icon: "📖", type: "economy", stat: "xpMult", val: 0.25 },
	{ id: "choices", name: "Diploma", desc: "Adds +1 Option to future level ups", icon: "📜", type: "special", stat: "upgradeChoices", val: 1, oneTime: true },

	// Weapons
	{ id: "multi", name: "Twin Wand", desc: "Add +1 Projectile to attacks", icon: "✨", type: "weapon_mod", stat: "projectileCount", val: 1 },
	{ id: "triple", name: "Trident", desc: "Add +2 Projectiles to attacks", icon: "🔱", type: "weapon_mod", stat: "projectileCount", val: 2 },
	{ id: "shotgun", name: "Scattergun", desc: "Fires a cone of 5 weak bullets", icon: "🔫", type: "weapon_add", weaponId: "shotgun", oneTime: true },
	{ id: "laser", name: "Red Pointer", desc: "Lock-on Laser beam (Continuous)", icon: "🔴", type: "weapon_add", weaponId: "laser", oneTime: true },
	{ id: "fist", name: "Iron Knuckle", desc: "Melee punch nearby enemies", icon: "👊", type: "weapon_add", weaponId: "fist", oneTime: true },
	{ id: "grenade", name: "Frag Grenade", desc: "Throws explosives periodically", icon: "💣", type: "weapon_add", weaponId: "grenade", oneTime: true },
	{ id: "orbit", name: "Planets", desc: "Spawn 2 orbiting fireballs", icon: "🪐", type: "aura_add", auraId: "orbit", val: 2 },
	{ id: "garlic", name: "Garlic Aura", desc: "Damages all enemies in radius", icon: "🧄", type: "aura_add", auraId: "garlic", oneTime: true },

	// Projectile Mods
	{ id: "homing", name: "Love Letter", desc: "Projectiles gain homing", icon: "💌", type: "proj_mod", stat: "homing", val: 0.4, oneTime: true },
	{ id: "bounce", name: "Pinball", desc: "Projectiles bounce +2 times", icon: "🎳", type: "proj_mod", stat: "bounce", val: 2, oneTime: true },
	{ id: "poison", name: "Venom Vial", desc: "Projectiles apply Poison", icon: "☠️", type: "status", effect: "poison", oneTime: true },
	{ id: "fire", name: "Matchbox", desc: "Projectiles set enemies on fire", icon: "🔥", type: "status", effect: "burn", oneTime: true },
	{ id: "freeze", name: "Snowflake", desc: "Chance to freeze enemies", icon: "❄️", type: "status", effect: "freeze", oneTime: true },

	// Helpers
	{ id: "drone", name: "Tiny Drone", desc: "Summons a drone that shoots", icon: "🤖", type: "helper", helperId: "drone" },
	{ id: "turret", name: "Mini Turret", desc: "Places a stationary turret", icon: "🗼", type: "helper", helperId: "turret" },

	// Special
	{ id: "vampire", name: "Blood Lust", desc: "Heal 2 HP on enemy kill", icon: "🩸", type: "onkill", effect: "heal", oneTime: true },
	{ id: "explosion", name: "Bomb Vest", desc: "Enemies explode on death", icon: "🧨", type: "onkill", effect: "explode", oneTime: true },
	{ id: "thorns", name: "Rose Thorns", desc: "Reflect 50% damage to attackers", icon: "🌹", type: "defense", stat: "thorns", val: 0.5 },
	{ id: "phoenix", name: "Phoenix Feather", desc: "Revive once on death", icon: "🐦‍🔥", type: "special", stat: "revives", val: 1, oneTime: true },
	{ id: "timewarp", name: "Broken Clock", desc: "Slows nearby enemies by 30%", icon: "⏰", type: "aura_add", auraId: "slow", oneTime: true },
];

// --- 2. BOOT SCENE ---
class BootScene extends Phaser.Scene {
	constructor() {
		super("BootScene");
	}

	preload() {
		// Load the asset provided by user. Note: atlasXML is used for XML format.
		this.load.atlasXML("space", "assets/simpleSpace_sheet@2.png", "assets/simpleSpace_sheet@2.xml"); // Credits to Kenney.nl for assets
	}

	create() {
		// Create procedural AOE texture since we don't have a perfect sprite for it
		let g = this.make.graphics({ x: 0, y: 0, add: false });
		g.fillStyle(0xffffff, 0.2);
		g.lineStyle(2, 0xffffff, 0.5);
		g.fillCircle(64, 64, 60);
		g.strokeCircle(64, 64, 60);
		g.generateTexture(TYPES.AOE, 128, 128);

		this.scene.start("GameScene");
	}
}

// --- 3. MAIN GAME SCENE ---
class GameScene extends Phaser.Scene {
	constructor() {
		super("GameScene");
	}

	create() {
		// Physics & World
		this.physics.world.setBounds(-10000, -10000, 20000, 20000);

		// Generate background tile sprite using stars from atlas
		this.createSpaceBackground();
		this.bg = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, "space_bg").setOrigin(0, 0).setScrollFactor(0);

		// Groups
		this.bullets = this.physics.add.group({ maxSize: 300 });
		this.enemies = this.physics.add.group({ runChildUpdate: true });
		this.gems = this.physics.add.group();
		this.helpers = this.physics.add.group(); // Drones, Turrets
		this.auras = this.add.group(); // Visual auras attached to player
		this.floatingTexts = this.add.group(); // Damage numbers

		// Player - Using Sprite from Atlas
		this.player = this.physics.add.sprite(0, 0, "space", TYPES.PLAYER).setDepth(100);
		this.player.setScale(0.5); // Scale down assets
		this.player.setCircle(45, 15, 15); // Adjust hitbox
		this.player.setCollideWorldBounds(true);
		this.cameras.main.startFollow(this.player);

		// Graphics for persistent effects (Laser)
		this.laserGraphics = this.add.graphics().setDepth(99);

		// Particles
		this.particles = this.add.particles(0, 0, "space", {
			frame: TYPES.PARTICLE,
			speed: { min: 100, max: 400 },
			scale: { start: 0.5, end: 0 },
			blendMode: "ADD",
			lifespan: 800,
			emitting: false,
		});
		this.particles.setDepth(101);

		// State
		this.stats = {
			speed: 200,
			maxHp: 100,
			hp: 100,
			damageMult: 1,
			fireRateMult: 1,
			speedMult: 1,
			pickupMult: 1,
			areaMult: 1,
			durationMult: 1,
			rangeMult: 1,
			xpMult: 1,
			projectileCount: 1,
			pierce: 0,
			homing: 0,
			bounce: 0,
			critChance: 0,
			critDamageMult: 1.5,
			damageReduction: 0,
			hpRegen: 0,
			luck: 1,
			thorns: 0,
			revives: 0,
			upgradeChoices: 3,
			poison: false,
			burn: false,
			freeze: false,
			healOnKill: 0,
			explodeOnKill: false,
			level: 1,
			xp: 0,
			xpToNext: 20,
		};

		// Weapon Inventory
		this.weapons = [{ id: "wand", cooldown: 800, timer: 0, type: "auto" }];

		// Inventory Tracker for UI
		this.takenUpgrades = {}; // { id: count }

		// Laser State
		this.laserState = {
			target: null,
			active: false,
			tickTimer: 0,
		};

		// Active Auras
		this.activeAuras = {
			garlic: false,
			slow: false,
			orbit: 0,
		};

		this.currentOptions = []; // Stores current upgrade cards

		this.setupInputs();
		this.setupCollisions();
		this.setupUIReferences();

		// Timers
		this.gameTime = 0;
		this.kills = 0;
		this.regenTimer = 0;
		this.spawnTimer = 0;
		this.spawnDelay = 1000;
		this.waveCycle = 0;
		this.isPaused = false;
	}

	createSpaceBackground() {
		// Create a texture for background
		const canvas = this.textures.createCanvas("space_bg", 512, 512);
		const ctx = canvas.context;

		// Fill black
		ctx.fillStyle = "#050505";
		ctx.fillRect(0, 0, 512, 512);

		// Random white stars
		ctx.fillStyle = "#ffffff";
		for (let i = 0; i < 100; i++) {
			const x = Math.random() * 512;
			const y = Math.random() * 512;
			const r = Math.random() * 1.5;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI * 2);
			ctx.fill();
		}
		canvas.refresh();
	}

	setupInputs() {
		this.cursors = this.input.keyboard.createCursorKeys();
		this.wasd = this.input.keyboard.addKeys("W,A,S,D");

		// Pause Key
		this.input.keyboard.on("keydown-ESC", () => {
			this.togglePause();
		});

		// Upgrade Selection Keys (1-9)
		this.input.keyboard.on("keydown", (event) => {
			// Only active if game is paused and upgrade modal is showing
			if (this.isPaused && document.getElementById("upgrade-modal").style.display === "flex") {
				const key = parseInt(event.key);
				if (!isNaN(key) && key > 0 && key <= this.currentOptions.length) {
					this.applyUpgrade(this.currentOptions[key - 1]);
				}
			}
		});
	}

	togglePause() {
		// Don't toggle normal pause if upgrade menu is open
		if (document.getElementById("upgrade-modal").style.display === "flex") return;

		this.isPaused = !this.isPaused;
		const modal = document.getElementById("pause-modal");
		if (this.isPaused) {
			this.physics.pause();
			modal.style.display = "flex";
		} else {
			this.physics.resume();
			modal.style.display = "none";
		}
	}

	setupCollisions() {
		this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
		this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this);
		this.physics.add.overlap(this.player, this.gems, this.collectGem, null, this);
	}

	setupUIReferences() {
		this.xpBarFill = document.getElementById("xp-bar-fill");
		this.hpBarFill = document.getElementById("hp-bar-fill");
		this.lvlText = document.getElementById("level-indicator");
		this.timerText = document.getElementById("timer-display");
		this.killText = document.getElementById("kill-display");
		this.statsDetails = document.getElementById("stats-details");
		this.inventoryContainer = document.getElementById("inventory-container");
		this.updateUI();
	}

	update(time, delta) {
		if (this.isPaused) return;

		this.gameTime += delta;

		// Systems
		this.handleMovement(delta);
		this.handleSpawning(delta);
		this.handleWeapons(delta);
		this.handleLaserLogic(delta);
		this.handleRegen(delta);
		this.handleAuras(delta);
		this.handleHelpers(delta);
		this.handleBullets(delta); // Homing logic
		this.handleEnemies(delta); // Status effects logic

		// BG Scroll
		this.bg.tilePositionX = this.cameras.main.scrollX;
		this.bg.tilePositionY = this.cameras.main.scrollY;

		// UI
		let seconds = Math.floor(this.gameTime / 1000);
		let minutes = Math.floor(seconds / 60);
		this.timerText.innerText = `Time: ${minutes.toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
	}

	handleMovement(delta) {
		const speed = this.stats.speed * this.stats.speedMult;
		this.player.setVelocity(0);

		let dx = 0,
			dy = 0;
		if (this.cursors.left.isDown || this.wasd.A.isDown) dx = -1;
		else if (this.cursors.right.isDown || this.wasd.D.isDown) dx = 1;

		if (this.cursors.up.isDown || this.wasd.W.isDown) dy = -1;
		else if (this.cursors.down.isDown || this.wasd.S.isDown) dy = 1;

		if (dx !== 0 || dy !== 0) {
			const vec = new Phaser.Math.Vector2(dx, dy).normalize().scale(speed);
			this.player.setVelocity(vec.x, vec.y);
			// Rotate ship towards movement
			this.player.setRotation(vec.angle() + Math.PI / 2);
		}

		// Loot Magnet
		this.gems.children.each((gem) => {
			if (gem.active) {
				const dist = Phaser.Math.Distance.Between(gem.x, gem.y, this.player.x, this.player.y);
				if (dist < 100 * this.stats.pickupMult) {
					this.physics.moveToObject(gem, this.player, 400 + this.stats.speedMult * 50);
				} else {
					gem.setVelocity(0, 0);
				}
			}
		});
	}

	handleRegen(delta) {
		if (this.stats.hpRegen > 0 && this.stats.hp < this.stats.maxHp) {
			this.regenTimer += delta;
			if (this.regenTimer >= 1000) {
				this.healPlayer(this.stats.hpRegen);
				this.regenTimer = 0;
			}
		}
	}

	handleSpawning(delta) {
		const mins = this.gameTime / 60000;

		// Periodic Wave check (every 60s)
		const currentWaveCycle = Math.floor(mins);
		if (currentWaveCycle > this.waveCycle) {
			this.waveCycle = currentWaveCycle;
			this.spawnWave(mins);
		}

		// Normal Spawning
		this.spawnTimer -= delta;
		if (this.spawnTimer <= 0) {
			// Formula from user
			this.spawnDelay = Math.max(20, 1000 * Math.pow(0.9, mins));
			this.spawnTimer = this.spawnDelay;

			const radius = Math.max(GAME_WIDTH, GAME_HEIGHT) / 2 + 100;
			const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
			const spawnX = this.player.x + Math.cos(angle) * radius;
			const spawnY = this.player.y + Math.sin(angle) * radius;

			let type = TYPES.ENEMY_BAT;
			let hp = 10;
			let speed = 80;

			if (mins > 1 && Math.random() > 0.5) {
				type = TYPES.ENEMY_SKEL;
				hp = 25;
				speed = 60;
			}

			// HP Scaling Formula from user
			hp *= Math.pow(1.08, mins);

			let enemy = this.spawnEnemyEntity(spawnX, spawnY, type);
			enemy.hp = hp;
			enemy.maxHp = hp;
			enemy.speed = speed;
			enemy.status = { poison: 0, burn: 0, freeze: 0, stun: 0 };
		}
	}

	spawnEnemyEntity(x, y, type) {
		// Use Atlas texture 'space', frame 'type'
		let enemy = this.enemies.create(x, y, "space", type);
		if (type === TYPES.ENEMY_BAT) {
			enemy.setTint(0xff4444); // Light blue tint for bats
		} else if (type === TYPES.ENEMY_SKEL) {
			enemy.setTint(0xcccccc);
		}
		enemy.setScale(0.4);
		// Adjust physics body to be smaller than sprite
		enemy.setCircle(36, 12, 12);
		return enemy;
	}

	spawnWave(mins) {
		// Burst Spawn 30-40 enemies
		const count = Phaser.Math.Between(30, 40);
		// Add radius randomization for scatter
		const baseRadius = Math.max(GAME_WIDTH, GAME_HEIGHT) / 2 + 150;

		for (let i = 0; i < count; i++) {
			const radius = baseRadius + Phaser.Math.Between(-50, 100);
			const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
			const spawnX = this.player.x + Math.cos(angle) * radius;
			const spawnY = this.player.y + Math.sin(angle) * radius;

			let enemy = this.spawnEnemyEntity(spawnX, spawnY, TYPES.ENEMY_BAT);
			enemy.hp = 10 * Math.pow(1.08, mins);
			enemy.maxHp = enemy.hp;
			enemy.speed = 100; // Fast rush
			enemy.status = { poison: 0, burn: 0, freeze: 0, stun: 0 };
			enemy.setTint(0xffaa00); // Orange tint for wave enemies
		}

		// Elite / Boss
		const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
		const spawnX = this.player.x + Math.cos(angle) * baseRadius;
		const spawnY = this.player.y + Math.sin(angle) * baseRadius;

		let boss = this.spawnEnemyEntity(spawnX, spawnY, TYPES.ENEMY_BOSS); // Use Boss Sprite
		let bossHp = 200 * Math.pow(1.2, mins);
		boss.hp = bossHp;
		boss.maxHp = bossHp;
		boss.speed = 40; // Slow but tanky
		boss.setScale(0.8); // Bigger than others
		boss.isElite = true;
		boss.status = { poison: 0, burn: 0, freeze: 0, stun: 0 };
		boss.setTint(0xff0000); // Red tint
	}

	handleEnemies(delta) {
		this.enemies.children.each((enemy) => {
			if (enemy.active && enemy.body) {
				// Status Updates
				if (enemy.status.poison > 0) {
					enemy.hp -= (0.05 * delta) / 16;
					enemy.status.poison -= delta;
					enemy.setTint(0x00ff00);
				} else if (enemy.status.burn > 0) {
					enemy.hp -= (0.1 * delta) / 16;
					enemy.status.burn -= delta;
					enemy.setTint(0xff8800);
				} else if (enemy.status.freeze > 0) {
					enemy.status.freeze -= delta;
					enemy.setTint(0x8888ff);
				} else {
					if (enemy.isElite)
						enemy.setTint(0xff0000); // Boss tint
					else if (enemy.tintTopLeft === 0xffaa00) {
						// Wave tint, keep it
					} else if (enemy.textureFrame === TYPES.ENEMY_BAT) {
						enemy.setTint(0xff4444); // Normal bat tint
					} else {
						enemy.setTint(0xcccccc); // Normal skel tint
					}
				}

				if (enemy.hp <= 0) {
					this.killEnemy(enemy);
					return;
				}

				// Movement
				const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);

				if (dist > 1500) {
					enemy.destroy();
					return;
				}

				if (enemy.status.freeze <= 0 && enemy.status.stun <= 0) {
					let moveSpeed = enemy.speed;
					if (this.activeAuras.slow && dist < 200 * this.stats.areaMult) {
						moveSpeed *= 0.7;
					}
					if (enemy.body) {
						this.physics.moveToObject(enemy, this.player, moveSpeed);
						// Point towards player
						enemy.setRotation(enemy.body.velocity.angle() + Math.PI / 2);
					}
				} else {
					if (enemy.body) enemy.setVelocity(0, 0);
					if (enemy.status.stun > 0) enemy.status.stun -= delta;
				}
			}
		});
	}

	handleWeapons(delta) {
		this.weapons.forEach((w) => {
			if (w.id === "laser") {
				return;
			}

			w.timer -= delta;
			if (w.timer <= 0) {
				let cd = w.cooldown / this.stats.fireRateMult;
				if (w.id === "wand") this.fireWand();
				else if (w.id === "shotgun") this.fireShotgun();
				else if (w.id === "fist") this.fireFist();
				else if (w.id === "grenade") this.fireGrenade();

				w.timer = cd;
			}
		});
	}

	handleLaserLogic(delta) {
		// Check if we have the laser weapon
		const laserWep = this.weapons.find((w) => w.id === "laser");
		if (!laserWep) return;

		// If no active target, try to find one if cooldown is ready
		if (!this.laserState.target || !this.laserState.target.active) {
			this.laserGraphics.clear();
			laserWep.timer -= delta;

			if (laserWep.timer <= 0) {
				// Scan for target
				const target = this.getNearestEnemy(this.player.x, this.player.y, 500 * this.stats.rangeMult);
				if (target) {
					this.laserState.target = target;
					this.laserState.tickTimer = 0;
					laserWep.timer = laserWep.cooldown;
				}
			}
		}

		// If we have a target, sustain the beam
		if (this.laserState.target && this.laserState.target.active) {
			// Draw Beam
			this.laserGraphics.clear();
			this.laserGraphics.lineStyle(4, 0xff0000, 1);
			this.laserGraphics.lineBetween(this.player.x, this.player.y, this.laserState.target.x, this.laserState.target.y);
			this.laserGraphics.lineStyle(2, 0xffaaaa, 1); // Core
			this.laserGraphics.lineBetween(this.player.x, this.player.y, this.laserState.target.x, this.laserState.target.y);

			// Damage Tick (every 100ms)
			this.laserState.tickTimer -= delta;
			if (this.laserState.tickTimer <= 0) {
				this.damageEnemy(this.laserState.target, 5, true); // 50 DPS base
				this.laserState.tickTimer = 100; // Reset tick
			}

			// Check if target died during this frame from damage
			if (this.laserState.target.hp <= 0) {
				this.laserState.target = null;
				this.laserGraphics.clear();
				laserWep.timer = laserWep.cooldown; // Cooldown kicks in after kill
			}
		} else {
			// Target lost/dead/despawned
			this.laserState.target = null;
			this.laserGraphics.clear();
			// Apply cooldown if target is lost to prevent instant snap to next
			if (laserWep.timer < 0) laserWep.timer = laserWep.cooldown;
		}
	}

	handleBullets(delta) {
		if (this.stats.homing > 0) {
			this.bullets.children.each((b) => {
				if (b.active && b.homingTarget) {
					if (b.homingTarget.active) {
						// Steer towards target
						let angle = Phaser.Math.Angle.Between(b.x, b.y, b.homingTarget.x, b.homingTarget.y);
						let currentAngle = b.body.velocity.angle();
						let newAngle = Phaser.Math.Angle.RotateTo(currentAngle, angle, this.stats.homing * 0.1);
						this.physics.velocityFromRotation(newAngle, 400, b.body.velocity);
					}
				}
			});
		}
	}

	handleHelpers(delta) {
		this.helpers.children.each((h) => {
			if (h.active) {
				// Ensure helpers don't interact physically if not intended
				if (h.body) h.body.checkCollision.none = true;

				if (h.type === "drone") {
					// Orbit slowly
					h.orbitAngle = (h.orbitAngle || 0) + 0.02;
					h.setPosition(this.player.x + Math.cos(h.orbitAngle) * 50, this.player.y + Math.sin(h.orbitAngle) * 50);
					h.fireTimer = (h.fireTimer || 0) - delta;
					if (h.fireTimer <= 0) {
						this.fireWand(h.x, h.y, 10, 0.5); // Helper shots are weaker
						h.fireTimer = 1000;
					}
				} else if (h.type === "turret") {
					h.fireTimer = (h.fireTimer || 0) - delta;
					if (h.fireTimer <= 0) {
						this.fireWand(h.x, h.y, 15, 0.8);
						h.fireTimer = 1500;
					}
				}
			}
		});
	}

	handleAuras(delta) {
		// Orbiting Orbs
		if (this.activeAuras.orbit > 0) {
			if (!this.orbs) {
				this.orbs = [];
				for (let i = 0; i < this.activeAuras.orbit; i++) {
					let o = this.physics.add.sprite(0, 0, "space", TYPES.ORB).setDepth(90);
					o.setScale(0.4);
					o.setTint(0x00ffff);
					o.orbitOffset = ((Math.PI * 2) / this.activeAuras.orbit) * i;
					this.orbs.push(o);
					// Ensure orbits don't block bullets (though they are separate groups, explicit is good)
					if (o.body) o.body.checkCollision.none = true;
				}
			}
			// Update positions
			const time = this.gameTime * 0.003 * this.stats.speedMult;
			this.orbs.forEach((o, i) => {
				o.setPosition(this.player.x + Math.cos(time + o.orbitOffset) * 80 * this.stats.areaMult, this.player.y + Math.sin(time + o.orbitOffset) * 80 * this.stats.areaMult);
				// Manual collision check
				this.physics.overlap(o, this.enemies, (orb, enemy) => {
					this.damageEnemy(enemy, 5, false); // Low dmg, high hit rate
				});
			});
		}

		// Garlic
		if (this.activeAuras.garlic) {
			if (!this.garlicSprite) {
				this.garlicSprite = this.add.image(0, 0, TYPES.AOE).setAlpha(0.3).setDepth(5);
			}
			this.garlicSprite.setPosition(this.player.x, this.player.y);
			this.garlicSprite.setScale(this.stats.areaMult);
			this.garlicTimer = (this.garlicTimer || 0) - delta;
			if (this.garlicTimer <= 0) {
				const range = 60 * this.stats.areaMult;
				this.enemies.children.each((e) => {
					if (e.active && Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y) < range) {
						this.damageEnemy(e, 3, false);
						e.status.stun = 100; // Slight knockback/stun
					}
				});
				this.garlicTimer = 500;
			}
		}
	}

	// --- WEAPON LOGIC ---

	getNearestEnemy(x, y, range = 600) {
		let nearest = null;
		let minDist = range;
		this.enemies.children.each((e) => {
			if (e.active) {
				let d = Phaser.Math.Distance.Between(x, y, e.x, e.y);
				if (d < minDist) {
					minDist = d;
					nearest = e;
				}
			}
		});
		return nearest;
	}

	fireWand(originX = this.player.x, originY = this.player.y, dmg = 10, scale = 1) {
		let target = this.getNearestEnemy(originX, originY);
		if (target) {
			const count = this.stats.projectileCount;
			for (let i = 0; i < count; i++) {
				let b = this.bullets.create(originX, originY, "space", TYPES.BULLET);
				b.setScale(0.4);
				b.setTint(0xffff00);
				if (b) {
					this.initBullet(b, dmg * scale);
					let angle = Phaser.Math.Angle.Between(originX, originY, target.x, target.y);
					if (count > 1) angle += (i - (count - 1) / 2) * 0.2;
					this.physics.velocityFromRotation(angle, 400, b.body.velocity);
					b.homingTarget = target; // For homing logic
				}
			}
		}
	}

	fireShotgun() {
		const count = 5 + (this.stats.projectileCount - 1); // Shotgun scales too
		let target = this.getNearestEnemy(this.player.x, this.player.y);
		let baseAngle = target ? Phaser.Math.Angle.Between(this.player.x, this.player.y, target.x, target.y) : Math.random() * Math.PI * 2;

		for (let i = 0; i < count; i++) {
			let b = this.bullets.create(this.player.x, this.player.y, "space", TYPES.BULLET);
			b.setScale(0.3);
			if (b) {
				this.initBullet(b, 6); // Lower dmg
				let angle = baseAngle + (i - (count - 1) / 2) * 0.15; // Tighter spread
				this.physics.velocityFromRotation(angle, 450, b.body.velocity);
			}
		}
	}

	fireFist() {
		// AoE around player
		let g = this.add.circle(this.player.x, this.player.y, 60, 0xffffff, 0.5);
		this.tweens.add({
			targets: g,
			scale: 1.5,
			alpha: 0,
			duration: 150,
			onUpdate: () => {
				if (this.player.active) {
					g.setPosition(this.player.x, this.player.y);
				}
			},
			onComplete: () => g.destroy(),
		});

		this.enemies.children.each((e) => {
			if (e.active && Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y) < 80) {
				this.damageEnemy(e, 20, true);
				// Huge Knockback
				const a = Phaser.Math.Angle.Between(this.player.x, this.player.y, e.x, e.y);
				e.x += Math.cos(a) * 50;
				e.y += Math.sin(a) * 50;
			}
		});
	}

	fireGrenade() {
		let a = Math.random() * Math.PI * 2;
		let tx = this.player.x + Math.cos(a) * 200;
		let ty = this.player.y + Math.sin(a) * 200;

		let g = this.add.sprite(this.player.x, this.player.y, "space", TYPES.GRENADE);
		g.setScale(0.5);
		this.tweens.add({
			targets: g,
			x: tx,
			y: ty,
			rotation: 3.14,
			duration: 600,
			ease: "Power2",
			onComplete: () => {
				g.destroy();
				// Explode
				this.triggerExplosion(tx, ty, 30, 80);
			},
		});
	}

	triggerExplosion(x, y, dmg, radius) {
		// Visual
		let circ = this.add.circle(x, y, radius, 0xffa500, 0.7);
		this.tweens.add({ targets: circ, alpha: 0, scale: 1.2, duration: 200, onComplete: () => circ.destroy() });
		// Damage
		this.enemies.children.each((e) => {
			if (e.active && Phaser.Math.Distance.Between(x, y, e.x, e.y) < radius) {
				this.damageEnemy(e, dmg, true);
			}
		});
	}

	initBullet(b, dmg) {
		b.setActive(true).setVisible(true).setTint(0xffff00);
		b.body.enable = true;
		b.damage = dmg;
		b.pierce = this.stats.pierce;
		b.bounces = this.stats.bounce;
		b.creationTime = this.gameTime;

		// Lifetime based on range/duration
		this.time.delayedCall(1500 * this.stats.durationMult, () => {
			if (b.active) b.destroy();
		});
	}

	// --- COLLISION LOGIC ---

	hitEnemy(bullet, enemy) {
		this.damageEnemy(enemy, bullet.damage, true);

		// Handle Pierce
		if (bullet.pierce > 0) {
			bullet.pierce--;
		} else if (bullet.bounces > 0) {
			bullet.bounces--;
			// Find new target
			let newTarget = this.getNearestEnemy(enemy.x, enemy.y);
			if (newTarget && newTarget !== enemy) {
				let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, newTarget.x, newTarget.y);
				this.physics.velocityFromRotation(angle, 300, bullet.body.velocity);
			} else {
				bullet.body.velocity.negate(); // Bounce back
			}
		} else {
			bullet.destroy();
		}
	}

	damageEnemy(enemy, baseDmg, showText) {
		// 1. Calc Damage
		let isCrit = Math.random() < this.stats.critChance + (this.stats.luck - 1) * 0.1; // Luck slightly affects crit
		let dmg = baseDmg * this.stats.damageMult;
		if (isCrit) dmg *= this.stats.critDamageMult;

		// 2. Apply
		enemy.hp -= dmg;

		// 3. Status
		if (this.stats.poison) enemy.status.poison = 3000;
		if (this.stats.burn) enemy.status.burn = 3000;
		if (this.stats.freeze && Math.random() < 0.2) enemy.status.freeze = 2000;

		// 4. Visuals
		enemy.setTint(0xff0000);
		this.time.delayedCall(100, () => enemy.clearTint());

		if (showText) this.showDamageText(enemy.x, enemy.y, Math.round(dmg), isCrit ? "#ff0000" : "#ffffff");

		// 5. Death
		if (enemy.hp <= 0 && enemy.active) {
			this.killEnemy(enemy);
		}
	}

	showDamageText(x, y, text, color) {
		let fontSize = color === "#ff0000" || color === "#00ff00" ? "20px" : "14px";

		let textObj = this.add
			.text(x, y, text.toString(), {
				fontFamily: "Segoe UI",
				fontSize: fontSize,
				color: color,
				stroke: "#000000",
				strokeThickness: 3,
			})
			.setOrigin(0.5)
			.setDepth(200);

		this.tweens.add({
			targets: textObj,
			y: y - 40,
			alpha: 0,
			duration: 800,
			ease: "Power1",
			onComplete: () => {
				textObj.destroy();
			},
		});
	}

	killEnemy(enemy) {
		// On Kill Effects
		if (this.stats.healOnKill > 0) this.healPlayer(this.stats.healOnKill);
		if (this.stats.explodeOnKill) {
			// Delay before damage
			this.time.delayedCall(75, () => {
				// Reduced radius (37.5 is 75% of 50) and reduced damage (17)
				this.triggerExplosion(enemy.x, enemy.y, 17 * this.stats.damageMult, 37.5);
			});
		}

		// Drop Loot - LUCK MECHANIC
		// Check elite
		if (enemy.isElite) {
			// Drop 2 red orbs
			for (let i = 0; i < 2; i++) {
				let gem = this.gems.create(enemy.x + i * 10, enemy.y, "space", TYPES.GEM);
				gem.setTint(0xff0000);
				gem.xpValue = 50 * (this.stats.xpMult || 1);
				gem.setScale(0.6);
			}
		} else {
			// Standard drop
			let gem = this.gems.create(enemy.x, enemy.y, "space", TYPES.GEM);
			let isLucky = Math.random() < 0.05 * this.stats.luck;

			if (isLucky) {
				gem.setTint(0xff0000); // Red Gem
				gem.xpValue = 50 * (this.stats.xpMult || 1);
				gem.setScale(0.6);
			} else {
				gem.setTint(0x4facfe); // Blue Gem
				gem.xpValue = 10 * (this.stats.xpMult || 1);
				gem.setScale(0.4);
			}
		}

		enemy.destroy();
		this.kills++;
		this.killText.innerText = `Kills: ${this.kills}`;
	}

	hitPlayer(player, enemy) {
		if (player.alpha < 1) return; // Invulnerable

		// Thorns
		if (this.stats.thorns > 0) {
			this.damageEnemy(enemy, 10 * this.stats.thorns, true);
			// Knockback enemy
			const a = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
			enemy.x += Math.cos(a) * 30;
			enemy.y += Math.sin(a) * 30;
		}

		// Take Damage
		const rawDmg = 10;
		const finalDmg = rawDmg * (1 - this.stats.damageReduction);
		this.stats.hp -= finalDmg;
		this.updateUI();

		// Flash & Invuln
		player.alpha = 0.5;
		this.time.delayedCall(500, () => (player.alpha = 1));

		if (this.stats.hp <= 0) {
			if (this.stats.revives > 0) {
				this.stats.revives--;
				this.takenUpgrades["phoenix"] = (this.takenUpgrades["phoenix"] || 1) - 1;
				this.stats.hp = this.stats.maxHp * 0.5;

				// REVIVE EXPLOSION
				this.particles.setPosition(player.x, player.y);
				this.particles.explode(300);

				// Phoenix Emoji Effect
				let phoenix = this.add.text(player.x, player.y, "🐦‍🔥", { fontSize: "40px" }).setOrigin(0.5).setDepth(200);
				this.tweens.add({
					targets: phoenix,
					scale: 3,
					alpha: 0,
					y: player.y - 100,
					duration: 1500,
					onComplete: () => phoenix.destroy(),
				});

				// Boom damage
				this.enemies.children.each((e) => {
					if (e.active && Phaser.Math.Distance.Between(player.x, player.y, e.x, e.y) < 300) {
						e.destroy();
					}
				});
				this.updateUI();
			} else {
				this.gameOver();
			}
		}
	}

	healPlayer(amount) {
		if (this.stats.hp >= this.stats.maxHp) return;

		let oldHp = this.stats.hp;
		this.stats.hp = Math.min(this.stats.hp + amount, this.stats.maxHp);

		let healed = Math.floor(this.stats.hp - oldHp);
		if (healed > 0) {
			this.showDamageText(this.player.x, this.player.y - 20, `+${healed}`, "#00ff00");
		}

		this.updateUI();
	}

	collectGem(player, gem) {
		gem.destroy();
		this.stats.xp += gem.xpValue;
		if (this.stats.xp >= this.stats.xpToNext) {
			this.stats.xp -= this.stats.xpToNext;
			this.stats.xpToNext = Math.floor(this.stats.xpToNext * 1.5);
			this.stats.level++;
			this.triggerLevelUp();
		}
		this.updateUI();
	}

	updateUI() {
		const xpPct = (this.stats.xp / this.stats.xpToNext) * 100;
		this.xpBarFill.style.width = `${xpPct}%`;
		this.lvlText.innerText = `LVL ${this.stats.level}`;

		const hpPct = Math.max(0, (this.stats.hp / this.stats.maxHp) * 100);
		this.hpBarFill.style.width = `${hpPct}%`;

		// Update Stats Panel
		this.statsDetails.innerHTML = `
            Might: ${(this.stats.damageMult * 100).toFixed(0)}%<br>
            Speed: ${(this.stats.speedMult * 100).toFixed(0)}%<br>
            Haste: ${(this.stats.fireRateMult * 100).toFixed(0)}%<br>
            Area: ${(this.stats.areaMult * 100).toFixed(0)}%<br>
            Crit: ${(this.stats.critChance * 100).toFixed(0)}%<br>
            Luck: ${((this.stats.luck - 1) * 100).toFixed(0)}%
        `;

		// Update Inventory
		this.inventoryContainer.innerHTML = "";
		for (const [id, count] of Object.entries(this.takenUpgrades)) {
			if (count <= 0) continue;
			// Find icon
			const upg = UPGRADES.find((u) => u.id === id) || { icon: "?" };
			const div = document.createElement("div");
			div.className = "inv-item";
			div.innerHTML = `${upg.icon} ${count > 1 ? `<span class="inv-count">x${count}</span>` : ""}`;
			this.inventoryContainer.appendChild(div);
		}
	}

	// --- UPGRADE SYSTEM ---

	triggerLevelUp() {
		this.isPaused = true;
		this.physics.pause();

		// Select random upgrades based on upgradeChoices stat
		let choices = [];
		let pool = [...UPGRADES].filter((u) => !(u.oneTime && (this.takenUpgrades[u.id] || 0) > 0)); // Copy

		// Use the new stat
		const numOptions = this.stats.upgradeChoices || 3;

		for (let i = 0; i < numOptions; i++) {
			if (pool.length === 0) break;
			let idx = Math.floor(Math.random() * pool.length);
			choices.push(pool[idx]);
			pool.splice(idx, 1);
		}

		this.currentOptions = choices;

		const container = document.getElementById("cards-container");
		container.innerHTML = "";

		choices.forEach((opt, index) => {
			const el = document.createElement("div");
			el.className = "card";
			// Determine type label
			let typeLabel = opt.type.split("_")[0].toUpperCase();

			el.innerHTML = `
                <div class="card-type">${typeLabel}</div>
                <div class="card-icon">${opt.icon}</div>
                <div class="card-title">${opt.name}</div>
                <div class="card-desc">${opt.desc}</div>
                <div class="card-key">[${index + 1}]</div>
            `;
			el.onclick = () => this.applyUpgrade(opt);
			container.appendChild(el);
		});

		document.getElementById("upgrade-modal").style.display = "flex";
	}

	applyUpgrade(opt) {
		// Update Inventory Count
		this.takenUpgrades[opt.id] = (this.takenUpgrades[opt.id] || 0) + 1;

		// Apply logic
		switch (opt.type) {
			case "stat":
			case "defense":
			case "economy":
				this.stats[opt.stat] = (this.stats[opt.stat] || 0) + opt.val;
				break;
			case "heal":
				this.stats.maxHp *= 1.2;
				this.stats.hp = this.stats.maxHp;
				break;
			case "weapon_mod":
				this.stats[opt.stat] += opt.val;
				break;
			case "weapon_add":
				// Check if we already have it
				let hasWep = this.weapons.find((w) => w.id === opt.weaponId);
				if (!hasWep) {
					let cd = 1000;
					if (opt.weaponId === "shotgun") cd = 1200;
					if (opt.weaponId === "laser") cd = 750; // Explicit 750ms cooldown for scanning
					if (opt.weaponId === "fist") cd = 1500;
					if (opt.weaponId === "grenade") cd = 2000;
					this.weapons.push({ id: opt.weaponId, cooldown: cd, timer: 0 });
				}
				break;
			case "proj_mod":
				this.stats[opt.stat] += opt.val;
				break;
			case "status":
				this.stats[opt.effect] = true;
				break;
			case "onkill":
				if (opt.effect === "heal") this.stats.healOnKill += 2;
				if (opt.effect === "explode") this.stats.explodeOnKill = true;
				break;
			case "helper":
				// Create visual helper
				let h = this.helpers.create(this.player.x, this.player.y, "space", TYPES.HELPER);
				h.setScale(0.3);
				h.type = opt.helperId;
				if (opt.helperId === "turret") {
					h.body.immovable = true; // Turret stays
				}
				break;
			case "aura_add":
				if (opt.auraId === "garlic") this.activeAuras.garlic = true;
				if (opt.auraId === "orbit") {
					this.activeAuras.orbit += opt.val;
					this.orbs = null; // Trigger rebuild
				}
				if (opt.auraId === "slow") this.activeAuras.slow = true;
				break;
			case "special":
				if (opt.stat) this.stats[opt.stat] += opt.val;
				break;
		}

		this.updateUI();
		document.getElementById("upgrade-modal").style.display = "none";
		this.isPaused = false;
		this.physics.resume();
	}

	gameOver() {
		this.physics.pause();
		this.isPaused = true;
		document.getElementById("game-over-modal").style.display = "flex";
		document.getElementById("final-stats").innerText = `Survived: ${this.timerText.innerText.replace("Time: ", "")} | Kills: ${this.kills}`;
	}
}

// --- 4. INIT ---
const config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	parent: "game-container",
	physics: {
		default: "arcade",
		arcade: {
			debug: false,
			gravity: { y: 0 },
		},
	},
	scene: [BootScene, GameScene],
};

const game = new Phaser.Game(config);

window.addEventListener("resize", () => {
	game.scale.resize(window.innerWidth, window.innerHeight);
});
