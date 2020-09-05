const db = require("../models");
module.exports = app => {
  // route to get all workouts
  app.get("/api/workouts", async (request, response) => {
    try {
      const workouts = await db.Workout.find({});
      workouts.sort((wo1, wo2) => wo1.day - wo2.day);
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
  // route to get last 30 days workouts for stats
  app.get("/api/workouts/range", async (request, response) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);
      const workouts = await db.Workout.find({
        day: { $gte: cutoffDate }
      });
      workouts.sort((wo1, wo2) => wo1.day.getDay() - wo2.day.getDay());
      response.json(workouts);
    } catch (error) {
      console.log(
        "Error ocurred while fetching workouts for last 30 days. Detailed error:",
        error
      );
      response.sendStatus(500);
    }
  });
};
