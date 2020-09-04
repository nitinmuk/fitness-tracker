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
          _id: wo._id,
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
  // route to create a workout doc
  app.post("/api/workouts", async (request, response) => {
    try {
      const workout = await db.Workout.create(request.body);
      response.status(201).json(workout);
    } catch (error) {
      console.log(
        "error ocurred while creating workout. Detail error: ",
        error
      );
      response.sendStatus(500);
    }
  });
  // route to update a workout doc
  app.put("/api/workouts/:id", async (request, response) => {
    try {
      const workout = await db.Workout.findById(request.params.id);
      if (workout) {
        workout.exercises.push(request.body);
        await workout.save();
        response.json(workout);
      }
    } catch (error) {
      console.log(
        `Error ocurred while updating workout id: ${request.params.id}`,
        error
      );
      response.sendStatus(500);
    }
  });
};
