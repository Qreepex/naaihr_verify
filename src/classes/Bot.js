const { Client, Collection, MessageEmbed, TextChannel } = require("discord.js"),
util = require("util");

class Bot extends Client {
    constructor(options) {
        super(options);

        this.wait = util.promisify(setTimeout)

        /**
         * Time parser.
         * @param {Number} duration 
         * @returns {String}
         */

        this.parseTime = function(duration) {
            var
            weeks = Math.floor((duration / (1000 * 60 * 60 * 24 * 7)) % 51),
            days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 7),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((duration / (1000 * 60)) % 60),

            uptime = [
                (weeks === 1) ? weeks + " " + "week" : weeks + " " + "weeks",
                (days === 1) ? days + " " + "day" : days + " " + "days",
                (hours === 1) ? hours + " " + "hour" : hours + " " + "hours",
                (minutes === 1) ? minutes + " " + "minute" : minutes + " " + "minutes",
            ].filter((time) => !time.startsWith("0")).join(", ");

            return uptime;
        }

        /**
         * Date parser.
         * @param {Number} timestamp 
         * @returns {String}
         */

        this.parseDate = function(timestamp) {
            let date = new Date(timestamp)

            let day = (date.getDate().toString().length === 1) ? "0"+date.getDate().toString() : date.getDate().toString()
            let month = ((date.getMonth()+1).toString().length === 1) ? "0"+(date.getMonth()+1).toString() : (date.getMonth()+1).toString()

            let hours = (date.getHours().toString().length === 1) ? "0"+date.getHours().toString() : date.getHours().toString()
            let minutes = (date.getMinutes().toString().length === 1) ? "0"+date.getMinutes().toString() : date.getMinutes().toString()

            return (hours+":"+minutes+" "+day+"."+month+"."+date.getFullYear())
        }

        this.commands = new Collection()

        this.schemas = {
            verify: require("../schemas/verifyData.js")
        }

        this.config = require("../../config/config.js");
    };

    get verifyLog() {
        return this.channels.cache.get(this.config.logs.verify);
    };
};

module.exports = Bot