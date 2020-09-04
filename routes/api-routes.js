const db = require("../models");
module.exports = app => {
  app.get("/api/workouts", async (request, response) => {
    try {
      let workouts = await db.Workout.find({});
      workouts.sort((wo1, wo2) => wo1.day - wo2.day);
      workouts = workouts.map(wo => {
        let durationSum = 0;
        wo.exercises.forEach(exercise => {
          durationSum += exercise.duration;
        });
        return {
          id: wo._id,
          day: wo.day,
          totalDuration: durationSum,
          exercises: wo.exercises
        };
      });
      response.json(workouts);
    } catch (error) {
      console.log(
        "Error ocurred while fetching workouts. Detailed error:",
        error
      );
      response.sendStatus(500);
    }
  });
};
