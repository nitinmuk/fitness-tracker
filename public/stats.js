initStats();
async function initStats() {
  const data = await API.getWorkoutsInRange();
  populateChart(data);
}
function generatePalette() {
  const arr = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600",
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600"
  ];

  return arr;
}
function populateChart(data) {
  const durations = duration(data);
  const workoutDurations = workoutDuration(data);
  const pounds = calculateTotalWeight(data);
  const workoutPounds = calculateWorkoutTotalWeight(data);
  const workouts = workoutNames(data);
  const colors = generatePalette();

  const line = document.querySelector("#canvas").getContext("2d");
  const bar = document.querySelector("#canvas2").getContext("2d");
  const pie = document.querySelector("#canvas3").getContext("2d");
  const pie2 = document.querySelector("#canvas4").getContext("2d");

  // eslint-disable-next-line no-unused-vars
  const lineChart = new Chart(line, {
    type: "line",
    data: {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      datasets: [
        {
          label: "Workout Duration In Minutes",
          backgroundColor: "red",
          borderColor: "red",
          data: workoutDurations,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Workouts Done During Last 30 days"
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ]
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  const barChart = new Chart(bar, {
    type: "bar",
    data: {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      datasets: [
        {
          label: "Pounds",
          data: workoutPounds,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Pounds Lifted During Last 30 Days"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  const pieChart = new Chart(pie, {
    type: "pie",
    data: {
      labels: workouts,
      datasets: [
        {
          label: "Excercises Performed",
          backgroundColor: colors,
          data: durations
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Time(minutes) Distribution Among Exercises During Last 30 days"
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  const donutChart = new Chart(pie2, {
    type: "doughnut",
    data: {
      labels: workoutNames(data, true),
      datasets: [
        {
          label: "Excercises Performed",
          backgroundColor: colors,
          data: pounds
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Weight(lbs) Distribution Among Exercises During Last 30 days"
      }
    }
  });
}

/**
 * returns an array of total duration for each exercise send in data
 * @param {data set for exercise duration pie chart} data
 */
function duration(data) {
  const durations = [];
  const exercisesName = [];
  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const exercisesNameIndex = exercisesName.indexOf(exercise.name);
      if (exercisesNameIndex < 0) {
        durations.push(exercise.duration);
        exercisesName.push(exercise.name);
      } else {
        durations[exercisesNameIndex] += exercise.duration;
      }
    });
  });
  return durations;
}
/**
 * returns an array of 7 workout duration - one for each day of a week
 * i.e. it will sum up durations for all workouts done on a specific day of week.
 * For e.g. if data has 3 workouts for 3 different Sundays then it will sum them
 * up and return one value for Sunday workout duration *
 * @param {workout data} data
 */
function workoutDuration(data) {
  const workoutDurations = [0, 0, 0, 0, 0, 0, 0];
  data.forEach(workout => {
    const currentDay = new Date(workout.day).getDay();
    workoutDurations[currentDay] += workout.totalDuration;
  });
  return workoutDurations;
}
/**
 * returns total weight for each exercise where weight is applicable
 * @param {workout data} data
 */
function calculateTotalWeight(data) {
  const total = [];
  const exercisesName = [];
  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const exercisesNameIndex = exercisesName.indexOf(exercise.name);
      if (exercisesNameIndex < 0) {
        if (exercise.weight) {
          total.push(exercise.weight);
          exercisesName.push(exercise.name);
        }
      } else {
        total[exercisesNameIndex] += exercise.duration;
      }
    });
  });
  return total;
}

/**
 * returns an array of 7 total workout weight values - one for each day of a week
 * i.e. it will sum up weights lifted across all workouts done on a specific day of week.
 * For e.g. if data has 3 workouts for 3 different Sundays then it will sum all those
 * weights and return one value for Sunday workout duration
 * @param {workout data} data
 */
function calculateWorkoutTotalWeight(data) {
  const workoutWeights = [0, 0, 0, 0, 0, 0, 0];
  data.forEach(workout => {
    const currentDay = new Date(workout.day).getDay();
    workoutWeights[currentDay] += workout.totalWeight;
  });
  return workoutWeights;
}
/**
 * returns an array of unique exerciseNames based on provided data
 * if @param resistanceOnly is true then it returns only those exerciseNames where weight is defined
 * @param {workout data} data
 * @param {true/false flag to know whether to ignore cardio exercises} resistanceOnly
 */
function workoutNames(data, resistanceOnly) {
  const workouts = [];
  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (workouts.indexOf(exercise.name) < 0) {
        if (resistanceOnly) {
          if (exercise.weight) {
            workouts.push(exercise.name);
          }
        } else {
          workouts.push(exercise.name);
        }
      }
    });
  });
  return workouts;
}
