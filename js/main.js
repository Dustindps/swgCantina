// JavaScript source code
$(document).ready(function () {

    //Animate.css jQuery extension
    $.fn.extend({
        animateCss: function (animationName, callback) {
            var animationEnd = (function (el) {
                var animations = {
                    animation: 'animationend',
                    OAnimation: 'oAnimationEnd',
                    MozAnimation: 'mozAnimationEnd',
                    WebkitAnimation: 'webkitAnimationEnd',
                };

                for (var t in animations) {
                    if (el.style[t] !== undefined) {
                        return animations[t];
                    }
                }
            })(document.createElement('div'));

            this.addClass('animated ' + animationName).one(animationEnd, function () {
                $(this).removeClass('animated ' + animationName);

                if (typeof callback === 'function') callback();
            });

            return this;
        },
    });

    var points = 20;

    var buffObj = {
        points: 20,
        attributes: {
            agi: 0,
            con: 0,
            lk: 0,
            pre: 0,
            stam: 0,
            str: 0,

        },
        combat: {
            acr: 0,
            crit: 0,
            critRed: 0,
            gb: 0,

        },
        misc: {
            xp: 0,
            hf: 0,
            pot: 0,
            res: 0,
            mov: 0,
            sc: 0,

        },
        resistances: {
            ele: 0,
            kin: 0,
            ene: 0,
        },
        trade: {
            cs: 0,
            ca: 0,
            hs: 0,

        },
        costs: {
            attributesCost: {
                agi: 1,
                con: 1,
                lk: 1,
                pre: 1,
                stam: 1,
                str: 1
            },
            attributesCap: {
                agi: 10,
                con: 10,
                lk: 10,
                pre: 10,
                stam: 10,
                str: 10
            },
            combatCost: {
                acr: 5,
                crit: 5,
                critRed: 5,
                gb: 5
            },
            combatCap: {
                acr: 5,
                crit: 5,
                critRed: 5,
                gb: 5
            },
            miscCost: {
                xp: 2,
                hf: 2,
                pot: 2,
                res: 2,
                mov: 2,
                sc: 2
            },
            miscCap: {
                xp: 10,
                hf: 10,
                pot: 10,
                res: 10,
                mov: 10,
                sc: 8
            },
            resistancesCost: {
                ele: 1,
                kin: 1,
                ene: 1
            },
            resistancesCap: {
                ele: 5,
                kin: 5,
                ene: 5
            },
            tradeCost: {
                cs: 5,
                ca: 2,
                hs: 2
            },
            tradeCap: {
                cs: 10,
                ca: 10,
                hs: 10
            }
        }
    }

    // Event Listeners
    $(".items li").on("click", function () {

        if ($(this).hasClass("selectedAdd") == true) {
            if (buffObj.points > 0) {
                var id = parseInt($("#addPanel").find(".selectedAdd").attr("id"));
                var buff = getBuffObj(buffObj, parseInt(id));

                if (buff.cost <= buffObj.points) {
                    buffObj = addCurrentById(id, buff.cost, buffObj);
                    populateBuffs(buffObj);
                }
            }

            $("#points").empty().append(buffObj.points);
            buildText(buffObj);
        } else {
            $(".items li").removeClass("selectedAdd");
            $(this).addClass("selectedAdd");
        }
    });

    // Add Remove Btns
    $("#addBtn").on("click", function () {

        if (buffObj.points > 0) {
            var id = parseInt($("#addPanel").find(".selectedAdd").attr("id"));
            var buff = getBuffObj(buffObj, parseInt(id));

            if (buff.cost <= buffObj.points) {
                buffObj = addCurrentById(id, buff.cost, buffObj);
                populateBuffs(buffObj);
            }
        }

        $("#points").empty().append(buffObj.points);
        buildText(buffObj);
    });
    $("#rmvBtn").on("click", function () {
        var id = parseInt($("#addedPanel").find(".selectedRemove").attr("id"));

    });

});

function populateBuffs(obj) {

    var popArray = [];
    var ideration = 0;


    $.each(obj, function (index, value) {
        if (index != "costs" || index != "points") {

            $.each(this, function (index, value) {
                if (value > 0) {
                    popArray.push(calculateBuff(index, value));
                }
            });
        }
    });

    $("#addedBuffs").empty()

    for (var i = 0; i < popArray.length; i++) {
        console.log(popArray);
        $("#addedBuffs").append("<li id='added" + i +"'>" + popArray[i] + "</li>");
        $("#addedBuffs li").on("click", function () {
            if ($(this).hasClass("selectedRemove") == true) {
                //if (buffObj.points > 0) {
                //    console.log(buffObj);
                //    var id = parseInt($("#addPanel").find(".selectedAdd").attr("id"));
                //    var buff = getBuffObj(buffObj, parseInt(id));

                //    if (buff.cost <= buffObj.points) {
                //        buffObj = addCurrentById(id, buff.cost, buffObj);
                //        populateBuffs(buffObj);
                //    }
                //}

                $("#points").empty().append(obj.points);
            } else {
                $("#addedBuffs li").removeClass("selectedRemove");
                $(this).addClass("selectedRemove");
            }
        });
    }
};

function calculateBuff(type, amt) {
    switch (type) {
        case "agi":
            return "+" + amt * 30 + " Agility";
        case "con":
            return "+" + amt * 30 + " Constitution";
        case "lk":
            return "+" + amt * 30 + " Luck";
        case "pre":
            return "+" + amt * 30 + " Precision";
        case "stam":
            return "+" + amt * 30 + " Stamina";
        case "str":
            return "+" + amt * 30 + " Strength";
        case "acr":
            return "9% bonus in reducing call Action costs";
        case "crit":
            return "7% bonus to Critical Hit Chance";
        case "critRed":
            return "7% bonus to Critical Hit Defence";
        case "gb":
            return "7% bonus to Glancing Blow";
        case "xp":
            return amt * 1.5 + "% increased Experience gain";
        case "hf":
            return amt / 2 + "% increased resources gathered by harvesters";
        case "pot":
            return amt * 1.5 + "% strength of healing";
        case "res":
            return amt * 2 + "% decrease in the amount of damage taken by damage over time attacks";
        case "mov":
            return amt * 2.5 + "% increase in movement speed";
        case "sc":
            return amt * 3 + "% to heal for 800 when struck in combat";
        case "ele":
            return amt * 750 + " increase in Elemental defence";
        case "ene":
            return amt * 750 + " increase in Energy defence";
        case "kin":
            return amt * 750 + " increase in Kinetic defence";
        case "cs":
            return amt * .4 + "% increase in critical success chance";
        case "ca":
            return amt * 1 + " increase in all existing assembly mofifiers and crafting xp";
        case "hs":
            return amt * 2 + "% increase in resources gathered by handsampling";
        default:
    }
}

function subCurrentById(id, sum, obj) {
    switch (id) {

        case 0:
            if (getBuffObj.attributes.agi > 0) {
                buffObj.attributes.agi = buffObj.attributes.agi + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 1:
            if (getBuffObj.attributes.con > 0) {
                buffObj.attributes.con = buffObj.attributes.con + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 2:
            if (getBuffObj.attributes.lk > 0) {
                buffObj.attributes.lk = buffObj.attributes.lk + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 3:
            if (getBuffObj.attributes.pre > 0) {
                buffObj.attributes.pre = buffObj.attributes.pre + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 4:
            if (getBuffObj.attributes.stam > 0) {
                buffObj.attributes.stam = buffObj.attributes.stam + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 5:
            if (getBuffObj.attributes.str > 0) {
                buffObj.attributes.str = buffObj.attributes.str + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 6:
            if (getBuffObj.attributes.agi > 0) {
                buffObj.attributes.agi = buffObj.attributes.agi + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 7:
            if (getBuffObj.attributes.acr > 0) {
                buffObj.attributes.acr = buffObj.attributes.acr + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 8:
            if (getBuffObj.attributes.crit > 0) {
                buffObj.attributes.crit = buffObj.attributes.crit + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 9:
            if (getBuffObj.attributes.critRed > 0) {
                buffObj.attributes.critRed = buffObj.attributes.critRed + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 10:
            if (getBuffObj.attributes.gb > 0) {
                buffObj.attributes.gb = buffObj.attributes.gb + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 11:
            if (getBuffObj.attributes.xp > 0) {
                buffObj.attributes.xp = buffObj.attributes.xp + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 12:
            if (getBuffObj.attributes.hf > 0) {
                buffObj.attributes.hf = buffObj.attributes.hf + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 13:
            if (getBuffObj.attributes.pot > 0) {
                buffObj.attributes.pot = buffObj.attributes.pot + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 14:
            if (getBuffObj.attributes.res > 0) {
                buffObj.attributes.res = buffObj.attributes.res + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 15:
            if (getBuffObj.attributes.agi > 0) {
                buffObj.attributes.agi = buffObj.attributes.agi + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 16:
            if (getBuffObj.attributes.agi > 0) {
                buffObj.attributes.agi = buffObj.attributes.agi + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 17:
            if (getBuffObj.attributes.sc > 0) {
                buffObj.attributes.sc = buffObj.attributes.sc + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 18:
            if (getBuffObj.attributes.ele > 0) {
                buffObj.attributes.ele = buffObj.attributes.ele + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 19:
            if (getBuffObj.attributes.kin > 0) {
                buffObj.attributes.kin = buffObj.attributes.kin + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 20:
            if (getBuffObj.attributes.ene > 0) {
                buffObj.attributes.ene = buffObj.attributes.ene + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 21:
            if (getBuffObj.attributes.cs > 0) {
                buffObj.attributes.cs = buffObj.attributes.cs + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 22:
            if (getBuffObj.attributes.ca > 0) {
                buffObj.attributes.ca = buffObj.attributes.ca + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        case 23:
            if (getBuffObj.attributes.hs > 0) {
                buffObj.attributes.hs = buffObj.attributes.hs + sum;
            } else {
                console.log("Cannot go under 0.");
            }
        default:
    }
}

function addCurrentById(id, sum, obj) {

    console.log(obj);
    switch (id) {
        case 0:
            if (obj.attributes.agi < obj.costs.attributesCap.agi) {
                obj.attributes.agi = obj.attributes.agi + sum;
                obj.points = obj.points - obj.costs.attributesCost.agi;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.attributesCap.agi);
                return obj;
                break;
            }
        case 1:
            if (obj.attributes.con < obj.costs.attributesCap.con) {
                obj.attributes.con = obj.attributes.con + sum;
                obj.points = obj.points - obj.costs.attributesCost.con;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.attributesCap.con);
                return obj;
                break;
            }
        case 2:
            if (obj.attributes.lk < obj.costs.attributesCap.lk) {
                obj.attributes.lk = obj.attributes.lk + sum;
                obj.points = obj.points - obj.costs.attributesCost.lk;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.attributesCap.lk);
                return obj;
                break;
            }
        case 3:
            if (obj.attributes.pre < obj.costs.attributesCap.pre) {
                obj.attributes.pre = obj.attributes.pre + sum;
                obj.points = obj.points - obj.costs.attributesCost.pre;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.attributesCap.pre);
                return obj;
                break;
            }
        case 4:
            if (obj.attributes.stam < obj.costs.attributesCap.stam) {
                obj.attributes.stam = obj.attributes.stam + sum;
                obj.points = obj.points - obj.costs.attributesCost.stam;
                return obj;
                reak;
            } else {
                console.log("Cannot go over cap of " + obj.costs.attributesCap.stam);
                return obj;
                break;
            }
        case 5:
            if (obj.attributes.str < obj.costs.attributesCap.str) {
                obj.attributes.str = obj.attributes.str + sum;
                obj.points = obj.points - obj.costs.attributesCost.str;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.attributesCap.str);
                return obj;
                break;
            }
        case 6:
            if (obj.combat.acr < obj.costs.combatCap.acr) {
                obj.combat.acr = obj.combat.acr + sum;
                obj.points = obj.points - obj.costs.combatCost.acr;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.combatCap.acr);
                return obj;
                break;
            }
        case 7:
            if (obj.combat.crit < obj.costs.combatCap.crit) {
                obj.combat.crit = obj.combat.crit + sum;
                obj.points = obj.points - obj.costs.combatCost.crit;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.combatCap.crit);
                return obj;
                break;
            }
        case 8:
            if (obj.combat.critRed < obj.costs.combatCap.critRed) {
                obj.combat.critRed = obj.combat.critRed + sum;
                obj.points = obj.points - obj.costs.combatCost.critRed;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.combatCap.critRed);
                return obj;
                break;
            }
        case 9:
            if (obj.combat.gb < obj.costs.combatCap.gb) {
                obj.combat.gb = obj.combat.gb + sum;
                obj.points = obj.points - obj.costs.combatCost.gb;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.combatCap.gb);
                return obj;
                break;
            }
        case 10:
            if (obj.misc.xp < obj.costs.miscCap.xp) {
                obj.misc.xp = obj.misc.xp + sum;
                obj.points = obj.points - obj.costs.miscCost.xp;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.xp);
                return obj;
                break;
            }
        case 11:
            if (obj.misc.hf < obj.costs.miscCap.hf) {
                obj.misc.hf = obj.misc.hf + sum;
                obj.points = obj.points - obj.costs.miscCost.hf;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.hf);
                return obj;
                break;
            }
        case 12:
            console.log(obj);

            if (obj.misc.pot < obj.costs.miscCap.pot) {
                obj.misc.pot = obj.misc.pot + sum;
                obj.points = obj.points - obj.costs.miscCost.pot;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.pot);
                return obj;
                break;
            }
        case 13:
            if (obj.misc.res < obj.costs.miscCap.res) {
                obj.misc.res = obj.misc.res + sum;
                obj.points = obj.points - obj.costs.miscCost.res;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.res);
                return obj;
                break;
            }
        case 14:
            if (obj.misc.mov < obj.costs.miscCap.mov) {
                obj.misc.mov = obj.misc.mov + sum;
                obj.points = obj.points - obj.costs.miscCost.mov;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.agi);
                return obj;
                break;
            }
        case 15:
            if (obj.misc.sc < obj.costs.miscCap.sc) {
                obj.misc.sc = obj.misc.sc + sum;
                obj.points = obj.points - obj.costs.miscCost.sc;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.sc);
                return obj;
                break;
            }
        case 16:
            if (obj.resistances.ele < obj.costs.resistancesCap.ele) {
                obj.resistances.ele = obj.resistances.ele + sum;
                obj.points = obj.points - obj.costs.resistancesCost.ele;
                return obj; break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.resistancesCap.ele);
                return obj;
                break;
            }
        case 17:
            if (obj.resistances.kin < obj.costs.resistancesCap.kin) {
                obj.resistances.kin = obj.resistances.kin + sum;
                obj.points = obj.points - obj.costs.resistancesCost.kin;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.resistancesCap.kin);
                return obj;
                break;
            }
        case 18:
            if (obj.resistances.ene < obj.costs.resistancesCap.ene) {
                obj.resistances.ene = obj.resistances.ene + sum;
                obj.points = obj.points - obj.costs.resistancesCost.ene;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.resistancesCap.ene);
                return obj;
                break;
            }
        case 19:
            if (obj.trade.cs < obj.costs.tradeCap.cs) {
                obj.trade.cs = obj.trade.cs + sum;
                obj.points = obj.points - obj.costs.tradeCost.cs;
                return obj; break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.trade.cs);
                return obj;
                break;
            }
        case 20:
            if (obj.trade.ca < obj.costs.tradeCap.ca) {
                obj.trade.ca = obj.trade.ca + sum;
                obj.points = obj.points - obj.costs.tradeCost.ca;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.trade.ca);
                return obj;
                break;
            }
        case 21:
            if (obj.trade.hs < obj.costs.tradeCap.hs) {
                obj.trade.hs = obj.trade.hs + sum;
                obj.points = obj.points - obj.costs.tradeCost.hs;
                return obj;
                break;
            } else {
                console.log("Cannot go over cap of " + obj.costs.trade.hs);
                return obj;
                break;
            }
        default:
    }
}

function getBuffObj(obj, id) {
    switch (id) {

        case 0:
            buff = {
                buff: "agi",
                buffId: 0,
                current: obj.costs.agi,
                cap: obj.costs.attributesCap.agi,
                cost: obj.costs.attributesCost.agi
            };
            return buff;
            break;
        case 1:
            buff = {
                buff: "con",
                buffId: 1,
                current: obj.costs.con,
                cap: obj.costs.attributesCap.con,
                cost: obj.costs.attributesCost.con
            };
            return buff;
            break;
        case 2:
            buff = {
                buff: "lk",
                buffId: 2,
                current: obj.costs.lk,
                cap: obj.costs.attributesCap.lk,
                cost: obj.costs.attributesCost.lk
            };
            return buff;
            break;
        case 3:
            buff = {
                buff: "pre",
                buffId: 3,
                current: obj.costs.pre,
                cap: obj.costs.attributesCap.pre,
                cost: obj.costs.attributesCost.pre
            };
            return buff;
            break;
        case 4:
            buff = {
                buff: "stam",
                buffId: 4,
                current: obj.costs.stam,
                cap: obj.costs.attributesCap.stam,
                cost: obj.costs.attributesCost.stam
            };
            return buff;
            break;

        case 5:
            buff = {
                buff: "str",
                buffId: 5,
                current: obj.costs.str,
                cap: obj.costs.attributesCap.str,
                cost: obj.costs.attributesCost.str
            };
            return buff;
            break;
        case 6:
            buff = {
                buff: "acr",
                buffId: 6,
                current: obj.costs.acr,
                cap: obj.costs.combatCap.acr,
                cost: obj.costs.combatCost.acr
            };
            return buff;
            break;
        case 7:
            buff = {
                buff: "crit",
                buffId: 7,
                current: obj.costs.crit,
                cap: obj.costs.combatCap.crit,
                cost: obj.costs.combatCost.crit
            };
            return buff;
            break;
        case 8:
            buff = {
                buff: "critRed",
                buffId: 8,
                current: obj.costs.critRed,
                cap: obj.costs.combatCap.critRed,
                cost: obj.costs.combatCost.critRed
            };
            return buff;
            break;
        case 9:
            buff = {
                buff: "gb",
                buffId: 9,
                current: obj.costs.gb,
                cap: obj.costs.combatCap.gb,
                cost: obj.costs.combatCost.gb
            };
            return buff;
            break;
        case 10:
            buff = {
                buff: "xp",
                buffId: 10,
                current: obj.costs.hf,
                cap: obj.costs.miscCap.hf,
                cost: obj.costs.miscCost.hf
            };
            return buff;
            break;
        case 11:
            buff = {
                buff: "hf",
                buffId: 11,
                current: obj.costs.hf,
                cap: obj.costs.miscCap.hf,
                cost: obj.costs.miscCost.hf
            };
            return buff;
            break;
        case 12:
            buff = {
                buff: "pot",
                buffId: 12,
                current: obj.costs.pot,
                cap: obj.costs.miscCap.pot,
                cost: obj.costs.miscCost.pot
            };
            return buff;
            break;
        case 13:
            buff = {
                buff: "res",
                buffId: 13,
                current: obj.costs.res,
                cap: obj.costs.miscCap.res,
                cost: obj.costs.miscCost.res
            };
            return buff;
            break;
        case 14:
            buff = {
                buff: "mov",
                buffId: 14,
                current: obj.costs.mov,
                cap: obj.costs.miscCap.mov,
                cost: obj.costs.miscCost.mov
            };
            return buff;
            break;
        case 15:
            buff = {
                buff: "sc",
                buffId: 15,
                current: obj.costs.sc,
                cap: obj.costs.miscCap.sc,
                cost: obj.costs.miscCost.sc
            };
            return buff;
            break;
        case 16:
            buff = {
                buff: "ele",
                buffId: 16,
                current: obj.costs.ele,
                cap: obj.costs.resistancesCap.ele,
                cost: obj.costs.resistancesCost.ele
            };
            return buff;
            break;
        case 17:
            buff = {
                buff: "kin",
                buffId: 17,
                current: obj.costs.kin,
                cap: obj.costs.resistancesCap.kin,
                cost: obj.costs.resistancesCost.kin
            };
            return buff;
            break;
        case 18:
            buff = {
                buff: "ene",
                buffId: 18,
                current: obj.costs.ene,
                cap: obj.costs.resistancesCap.ene,
                cost: obj.costs.resistancesCost.ene
            };
            return buff;
            break;
        case 19:
            buff = {
                buff: "cs",
                buffId: 19,
                current: obj.costs.cs,
                cap: obj.costs.tradeCap.cs,
                cost: obj.costs.tradeCost.cs
            };
            return buff;
            break;
        case 20:
            buff = {
                buff: "ca",
                buffId: 20,
                current: obj.costs.ca,
                cap: obj.costs.tradeCap.ca,
                cost: obj.costs.tradeCost.ca
            };
            return buff;
            break;
        case 21:
            buff = {
                buff: "hs",
                buffId: 21,
                current: obj.costs.hs,
                cap: obj.costs.tradeCap.hs,
                cost: obj.costs.tradeCost.hs
            };
            return buff;
            break;
    }

}

function buildText(obj) {
    var tellText = "/tell $NT Hello! May I have ";
    var stringArray = [];

    $.each(obj, function (index, value) {
        if (index != "costs") {
            $.each(this, function (index, value) {

                var type = getType(index);

                if (type == "attribute" & value > 0) {
                    if (index == "lk") {
                        stringArray.push(value + "/10" + " to luck");
                    } else {
                        stringArray.push(value + "/10" + " to " + index);
                    }
                }

                if (type == "combat" & value > 0) {

                    switch (index) {
                        case "acr":
                            stringArray.push("Action Cost Reduction");
                            break;
                        case "crit":
                            stringArray.push("Crit");
                            break;
                        case "critRed":
                            stringArray.push("Critical Reduction");
                            break;
                        case "gb":
                            stringArray.push("Glancing Blow");
                            break;
                        default:
                    }
                }

                if (type == "misc" & value > 0) {
                    switch (index) {
                        case "hf":
                            stringArray.push(value / 2 + "/5 to Harvest Faire");
                            break;
                        case "mov":
                            stringArray.push(value / 2 + "/5 to Go With the Flow");
                            break;
                        case "pot":
                            stringArray.push(value / 2 + "/5 to Healing Potency");
                            break;
                        case "res":
                            stringArray.push(value / 2 + "/5 to Resilience");
                            break;
                        case "sc":
                            stringArray.push(value / 2 + "/4 to Second Chance");
                            break;
                        case "xp":
                            stringArray.push(value / 2 + "/5 to XP");
                            break;
                        default:
                    }
                }

                if (type == "resistances" & value > 0) {

                    switch (index) {
                        case "ele":
                            stringArray.push(value + "/5 to Elemental Resistance");
                            break;
                        case "kin":
                            stringArray.push(value + "/5 to Kinetic");
                            break;
                        case "ene":
                            stringArray.push(value + "/5 to Energy");
                            break;
                        default:
                    }
                }

                if (type == "trade" & value > 0) {
                    switch (index) {
                        case "cs":
                            stringArray.push(value / 5 + "/2 to Crafting Success");
                            break;
                        case "ca":
                            stringArray.push(value / 2 + "/5 to Crafter Assembly");
                            break;
                        case "hs":
                            stringArray.push(value / 2 + "/5 to Hand Sampling");
                            break;
                        default:
                    }
                }
            });
        }
    });

    for (var i = 0; i < stringArray.length; i++) {
        if (i == stringArray.length - 1) {
            if (i != 0) {
                tellText = tellText + "and " + stringArray[i] + " please?";
            } else {
                tellText = tellText + stringArray[i] + " please?";
            }
        } else {
            tellText = tellText + stringArray[i] + ", ";
        }
    }

    console.log(tellText);

    $("#copy").empty().append(tellText);
}

function getType(type) {

    switch (type) {
        case "agi":
            return "attribute";
            break;
        case "con":
            return "attribute";
            break;
        case "lk":
            return "attribute";
            break;
        case "pre":
            return "attribute";
            break;
        case "stam":
            return "attribute";
            break;
        case "str":
            return "attribute";
            break;
        case "acr":
            return "combat";
            break;
        case "crit":
            return "combat";
            break;
        case "critRed":
            return "combat";
            break;
        case "gb":
            return "combat";
            break;
        case "hf":
            return "misc";
            break;
        case "mov":
            return "misc";
            break;
        case "pot":
            return "misc";
            break;
        case "res":
            return "misc";
            break;
        case "sc":
            return "misc";
            break;
        case "xp":
            return "misc";
            break;
        case "ele":
            return "resistances";
            break;
        case "ene":
            return "resistances";
            break;
        case "kin":
            return "resistances";
            break;
        case "ca":
            return "trade";
            break;
        case "cs":
            return "trade";
            break;
        case "hs":
            return "trade";
            break;
        default:
            return "none";

    }

}