CREATE TABLE workouts (
    workout_id SERIAL PRIMARY KEY,
    workout_time TIMESTAMP NOT NULL
);

CREATE TABLE exercise_types (
    exercise_type_id SERIAL PRIMARY KEY,
    exercise_name VARCHAR(50) NOT NULL
);

CREATE TABLE exercise_reps (
    exercise_rep_id SERIAL PRIMARY KEY,
    workout_id INT REFERENCES workouts(workout_id),
    exercise_type_id INT REFERENCES exercise_types(exercise_type_id),
    rep_count INT NOT NULL
);

INSERT INTO workouts (userid, workout_time) VALUES
(NOW() - INTERVAL '10 days'),
(NOW() - INTERVAL '9 days'),
(NOW() - INTERVAL '8 days'),
(NOW() - INTERVAL '7 days'),
(NOW() - INTERVAL '6 days'),
(NOW() - INTERVAL '5 days'),
(NOW() - INTERVAL '4 days'),
(NOW() - INTERVAL '3 days'),
(NOW() - INTERVAL '2 days'),
(NOW() - INTERVAL '1 day');