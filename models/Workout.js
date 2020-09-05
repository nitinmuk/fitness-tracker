const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ExerciseSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  distance: {
    type: Number,
    required: [
      function() {
        return this.type === "cardio";
      },
      "distance is required for cardio type excercise"
    ]
  },
  sets: {
    type: Number
  },
  reps: {
    type: Number
  },
  weight: {
    type: Number
  }
});

const WorkoutSchema = new Schema(
  {
    day: {
      type: Date,
      default: new Date()
    },
    exercises: [ExerciseSchema]
  },
  opts
);

WorkoutSchema.virtual("totalDuration").get(function() {
  let totalDuration = 0;
  this.exercises.forEach(exercise => {
    totalDuration += exercise.duration;
  });
  return totalDuration;
});

WorkoutSchema.virtual("totalWeight").get(function() {
  let totalWeight = 0;
  this.exercises.forEach(exercise => {
    if (exercise.weight) {
      totalWeight += exercise.weight;
    }
  });
  return totalWeight;
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;
