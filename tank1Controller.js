/**
 * Created by Esimorp on 16/9/26.
 */
var tank1Controller = {
    forward: 1,
    turn: 0,
    shoot: true,
    giveCommand: function () {
        // var enemyInfo = this.getEnemyInfo(); //{position:{x:,y}:,rotation:}
        // var bulletInfo = this.getBulletInfo();//[{position:{x:,y:},rotation:}...]
        // var mineInfo = this.getMineInfo();//{position:{x:,y:},rotation:}

        // 接近敌人
        var enemyInfo = this.getEnemyInfo();
        var mineInfo = this.getMineInfo();

        //提前量
        var enemyArc = enemyInfo.rotation * Math.PI / 360 * 2;
        if ((enemyArc > 0 && enemyArc < 180) || (enemyArc < -180 && enemyArc > -360)) {
            enemyInfo.position.x -= 100;
        } else {
            enemyInfo.position.x += 100;
        }
        if ((enemyArc > -90 && enemyArc < 90) || (enemyArc < -90 && enemyArc > -270)) {
            enemyInfo.position.y -= 30;
        } else {
            enemyInfo.position.y += 30;
        }

        var arc = Math.atan2(mineInfo.position.y - enemyInfo.position.y, mineInfo.position.x - enemyInfo.position.x);
        arc -= Math.PI / 360 * 180;
        if (arc - Math.PI / 360 * 15 < mineInfo.rotation &&
            arc + Math.PI / 360 * 15 > mineInfo.rotation) {
            this.forward = 1;
            this.turn = 0;
        } else {
            this.forward = 0;
            if (arc < 0) {
                this.turn = -1;
            } else {
                this.turn = 1;
            }
        }
    }
};