const moment = require('moment')

let date = moment.utc();
let nowDate = new Date(date.format());
nowDate.setHours(nowDate.getHours() + 3);

module.exports = ({
    LESSON_1_START: nowDate.setHours(8, 0, 0, 0),
    LESSON_1_END: nowDate.setHours(9, 35, 0, 0),

    LESSON_2_START: nowDate.setHours(9, 35, 0, 0),
    LESSON_2_END: nowDate.setHours(11, 25, 0, 0),

    LESSON_3_START: nowDate.setHours(11, 25, 0, 0),
    LESSON_3_END: nowDate.setHours(13, 30, 0, 0),

    LESSON_4_START: nowDate.setHours(13, 30, 0, 0),
    LESSON_4_END: nowDate.setHours(15, 20, 0, 0),

    LESSON_5_START: nowDate.setHours(15, 20, 0, 0),
    LESSON_5_END: nowDate.setHours(17, 25, 0, 0),

    LESSON_6_START: nowDate.setHours(17, 25, 0, 0),
    LESSON_6_END: nowDate.setHours(19, 15, 0, 0),

    LESSON_7_START: nowDate.setHours(19, 15, 0, 0),
    LESSON_7_END: nowDate.setHours(21, 05, 0, 0),
})

