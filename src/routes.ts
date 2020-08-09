import express from 'express';
import db from './database/connection';
import convertHourToMinutes from './database/utils/convertHourToMInutes';

const routes = express.Router();

interface ScheduleItem {
    week_day: number,
    from: string,
    to: string
}

routes.post('/classes', async (request, response) => {

    const {
        name,
        avatar,
        whatsapp,
        bio,
        subject,
        cost,
        schedule
    } = request.body;

    const trx = await db.transaction();

    try {

        const insertedUsersIds = await trx('users').insert({
            name,
            avatar,
            whatsapp,
            bio
        });

        const user_id = insertedUsersIds[0];

        const insertedClassesIds = await trx('classes').insert({
            subject,
            cost,
            user_id
        })

        const class_id = insertedClassesIds[0];

        const classSchedule = schedule.map((ScheduleItem: ScheduleItem) => {
            return {
                class_id,
                week_day: ScheduleItem.week_day,
                from: convertHourToMinutes(ScheduleItem.from),
                to: convertHourToMinutes(ScheduleItem.to)
            };
        })

        await trx('class_schedule').insert(classSchedule);

        await trx.commit();

    }
    catch (e) {
        await trx.rollback();
        console.log(e);
        return response.status(400).send({
            error: "Unexpected Error."
        });
    }

    return response.json({ "message": "ok" });
});




export default routes;