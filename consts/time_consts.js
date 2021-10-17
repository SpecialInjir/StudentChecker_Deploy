const moment = require('moment')

let date = moment.utc();
let nowDate = new Date(date.format());


function getUtcTimestamp(hours, minutes){
    nowDate.setHours(nowDate.getHours() - 3);
    let curTime = nowDate.setHours(hours, minutes, 0, 0);

    return curTime
}

module.exports = ({
    LESSON_1_START: getUtcTimestamp(8, 0),
    LESSON_1_END: getUtcTimestamp(9, 35),

    LESSON_2_START: getUtcTimestamp(9, 35),
    LESSON_2_END: getUtcTimestamp(11, 25),

    LESSON_3_START: getUtcTimestamp(11, 25),
    LESSON_3_END: getUtcTimestamp(13, 30),

    LESSON_4_START: getUtcTimestamp(13, 30),
    LESSON_4_END: getUtcTimestamp(15, 20),

    LESSON_5_START: getUtcTimestamp(15, 20),
    LESSON_5_END: getUtcTimestamp(17, 25),

    LESSON_6_START: getUtcTimestamp(17, 25),
    LESSON_6_END: getUtcTimestamp(19, 15),

    LESSON_7_START: getUtcTimestamp(19, 15),
    LESSON_7_END: getUtcTimestamp(21, 05),
})

