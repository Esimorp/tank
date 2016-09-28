/**
 * Created by Esimorp on 16/9/26.
 */
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {

            //There's definitely a collision happening
            hit = true;
        } else {

            //There's no collision on the y axis
            hit = false;
        }
    } else {

        //There's no collision on the x axis
        hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
};

var renderer = new PIXI.WebGLRenderer(800, 600, {backgroundColor: 0xdedede});
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
var tank1 = null;
var tank2 = null;

var bulletTexture = null;
var tank1LastShootAt = 0;
var tank2LastShootAt = 0;

PIXI.loader.add('tank1', 'tank1.png').load(function (loader, resources) {
    tank1 = new PIXI.Sprite(resources.tank1.texture);
    tank1.width = 32;
    tank1.height = 32;
    tank1.position.x = 16;
    tank1.position.y = 16;
    tank1.anchor.x = 0.5;
    tank1.anchor.y = 0.5;
    stage.addChild(tank1);
});

PIXI.loader.add('tank2', 'tank2.png').load(function (loader, resources) {
    tank2 = new PIXI.Sprite(resources.tank2.texture);
    tank2.width = 32;
    tank2.height = 32;
    tank2.position.x = 800 - 16;
    tank2.position.y = 600 - 16;
    tank2.anchor.x = 0.5;
    tank2.anchor.y = 0.5;
    stage.addChild(tank2);

});

PIXI.loader.add('bullet', 'bullet.png').load(function (loader, resources) {
    bulletTexture = resources.bullet.texture;
    update();
});

var getTank1Info = function () {
    return {rotation: tank1.rotation, position: {x: tank1.position.x, y: tank1.position.y}}
};

var getTank2Info = function () {
    return {rotation: tank2.rotation, position: {x: tank2.position.x, y: tank2.position.y}}
};

tank2Controller.getEnemyInfo = getTank1Info;
tank1Controller.getEnemyInfo = getTank2Info;

tank1Controller.getMineInfo = getTank1Info;
tank2Controller.getMineInfo = getTank2Info;

var bulletList = [];
var getBulletInfo = function () {
    var info = [];
    for (var i = 0; i < bulletList.length; i++) {
        info.push({
            position: {x: bulletList[i].position.x, y: bulletList[i].position.y},
            rotation: bulletList[i].rotation
        })
    }
    return info;
};

tank1Controller.getBulletInfo = getBulletInfo;
tank2Controller.getBulletInfo = getBulletInfo;

function update() {
    requestAnimationFrame(update);
    tank1Controller.giveCommand();
    tank2Controller.giveCommand();

    if (tank1Controller.turn == 1) {
        if (tank1.rotation > 2 * Math.PI / 360 * 360)
            tank1.rotation -= 2 * Math.PI / 360 * 360;
        tank1.rotation += 0.05;
    }
    else if (tank1Controller.turn == -1) {
        if (tank1.rotation < -2 * Math.PI / 360 * 360)
            tank1.rotation += 2 * Math.PI / 360 * 360;
        tank1.rotation -= 0.05;
    } else if (tank1Controller.forward == 1) {
        var cy = Math.sin(tank1.rotation - 2 * Math.PI / 360 * 90);
        var cx = Math.cos(tank1.rotation - 2 * Math.PI / 360 * 90);
        if (tank1.position.y + cy < 600 - 16 && tank1.position.y + cy > 16)
            tank1.position.y += cy;
        if (tank1.position.x + cx < 800 - 16 && tank1.position.x + cx > 16)
            tank1.position.x += cx;
    } else if (tank1Controller.forward == -1) {
        var cy = Math.sin(tank1.rotation - 2 * Math.PI / 360 * 90);
        var cx = Math.cos(tank1.rotation - 2 * Math.PI / 360 * 90);
        if (tank1.position.y - cy < 600 - 16 && tank1.position.y - cy > 16)
            tank1.position.y -= cy;
        if (tank1.position.x - cx < 800 - 16 && tank1.position.x - cx > 16)
            tank1.position.x -= cx;
    }

    if (tank2Controller.turn == 1) {
        if (tank2.rotation > 2 * Math.PI / 360 * 360)
            tank2.rotation -= 2 * Math.PI / 360 * 360;
        tank2.rotation += 0.05;
    }
    else if (tank2Controller.turn == -1) {
        if (tank2.rotation < -2 * Math.PI / 360 * 360)
            tank2.rotation += 2 * Math.PI / 360 * 360;
        tank2.rotation -= 0.05;
    } else if (tank2Controller.forward == 1) {
        var cy = Math.sin(tank2.rotation - 2 * Math.PI / 360 * 90);
        var cx = Math.cos(tank2.rotation - 2 * Math.PI / 360 * 90);
        if (tank2.position.y + cy < 600 - 16 && tank2.position.y + cy > 16)
            tank2.position.y += cy;
        if (tank2.position.x + cx < 800 - 16 && tank2.position.x + cx > 16)
            tank2.position.x += cx;
    } else if (tank2Controller.forward == -1) {
        var cy = Math.sin(tank2.rotation - 2 * Math.PI / 360 * 90);
        var cx = Math.cos(tank2.rotation - 2 * Math.PI / 360 * 90);
        if (tank2.position.y - cy < 600 - 16 && tank2.position.y - cy > 16)
            tank2.position.y -= cy;
        if (tank2.position.x - cx < 800 - 16 && tank2.position.x - cx > 16)
            tank2.position.x -= cx;
    }

    var tempRemoveList = [];
    for (var i = 0; i < bulletList.length; i++) {
        if (bulletList[i].position.x < 0 || bulletList[i].position.x > 800) {
            tempRemoveList.push(bulletList[i]);
            break;
        }
        if (bulletList[i].position.y < 0 || bulletList[i].position.y > 600) {
            tempRemoveList.push(bulletList[i]);
            break;
        }
        var cy = 3 * Math.sin(bulletList[i].rotation - 2 * Math.PI / 360 * 90);
        var cx = 3 * Math.cos(bulletList[i].rotation - 2 * Math.PI / 360 * 90);
        bulletList[i].position.x += cx;
        bulletList[i].position.y += cy;

        if (hitTestRectangle(tank1, bulletList[i]) && bulletList[i].from == 2) {
            console.log('hit tank1');
            document.getElementById('info').textContent = 'Tank2 Win';
        }

        if (hitTestRectangle(tank2, bulletList[i]) && bulletList[i].from == 1) {
            console.log('hit tank2');
            document.getElementById('info').textContent = 'Tank1 Win';
        }
    }
    for (var i = 0; i < tempRemoveList.length; i++) {
        bulletList.remove(tempRemoveList[i]);
        stage.removeChild(tempRemoveList[i]);
    }
    if (tank2Controller.shoot && new Date().getTime() - tank2LastShootAt > 1000) {
        tank2LastShootAt = new Date().getTime();
        var bullet = new PIXI.Sprite(bulletTexture);
        var cy = 16 * Math.sin(tank2.rotation - 2 * Math.PI / 360 * 90);
        var cx = 16 * Math.cos(tank2.rotation - 2 * Math.PI / 360 * 90);
        bullet.from = 2;
        bullet.width = 15;
        bullet.height = 15;
        bullet.position.x = tank2.position.x + cx;
        bullet.position.y = tank2.position.y + cy;
        bullet.anchor.x = 0.5;
        bullet.anchor.y = 0.5;
        bullet.rotation = tank2.rotation;
        bulletList.push(bullet);
        stage.addChild(bullet);
    }
    if (tank1Controller.shoot && new Date().getTime() - tank1LastShootAt > 1000) {
        tank1LastShootAt = new Date().getTime();
        var bullet = new PIXI.Sprite(bulletTexture);
        bullet.from = 1;
        var cy = 16 * Math.sin(tank1.rotation - 2 * Math.PI / 360 * 90);
        var cx = 16 * Math.cos(tank1.rotation - 2 * Math.PI / 360 * 90);
        bullet.width = 15;
        bullet.height = 15;
        bullet.position.x = tank1.position.x + cx;
        bullet.position.y = tank1.position.y + cy;
        bullet.anchor.x = 0.5;
        bullet.anchor.y = 0.5;
        bullet.rotation = tank1.rotation;
        bulletList.push(bullet);
        stage.addChild(bullet);
    }

    renderer.render(stage);
}