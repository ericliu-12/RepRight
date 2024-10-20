from flask import Flask, jsonify, request
import psycopg2
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import os
from datetime import datetime
import subprocess

load_dotenv()

app = Flask(__name__)
CORS(app, support_credentials=True)

# Connect to PostgreSQL
def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="repright",
        user=os.getenv("PG_USER"),
        password=os.getenv('PG_PASSWORD'),
    )
    return conn


@app.route("/")
def helloWorld():
    return "Hello world"
# @app.route('/workouts', methods=['GET'])
# @cross_origin(supports_credentials=True)
# def get_workout():
#     conn = get_db_connection()
#     cursor = conn.cursor()

#     # Get the workout_time from query params (if provided) and the direction (next/prev)
#     workout_time = request.args.get('workout_time')
#     direction = request.args.get('direction', 'recent')

#     if workout_time:
#         try:
#             # Parse workout_time from string to datetime (round to nearest second)
#             workout_time = datetime.strptime(workout_time, '%a, %d %b %Y %H:%M:%S GMT')
#             workout_time = workout_time.replace(microsecond=0)  # Round to nearest second
#         except ValueError as e:
#             return jsonify({'error': 'Invalid date format'}), 400
#         if direction == 'next':
#             cursor.execute('SELECT * FROM workouts WHERE workout_time > %s ORDER BY workout_time ASC LIMIT 1', (workout_time,))
#         elif direction == 'prev':
#             cursor.execute('SELECT * FROM workouts WHERE workout_time < %s ORDER BY workout_time DESC LIMIT 1', (workout_time,))
#         else:
#             cursor.execute('SELECT * FROM workouts WHERE workout_time = %s LIMIT 1', (workout_time,))
#     else:
#         # If no workout_time is provided, get the most recent workout
#         cursor.execute('SELECT * FROM workouts ORDER BY workout_time DESC LIMIT 1')

#     workout = cursor.fetchone()
#     cursor.close()
#     conn.close()
    
#     return jsonify(workout)

# Example route to add a workout
# @app.route('/workouts', methods=['POST'])
# @cross_origin(supports_credentials=True)
# def add_workout():
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     new_workout = request.get_json()
#     cursor.execute(
#         'INSERT INTO workouts (userid, workout_time) VALUES (%s, %s) RETURNING *',
#         (new_workout['userid'], new_workout['workout_time'])
#     )
#     workout = cursor.fetchone()
#     conn.commit()
#     cursor.close()
#     conn.close()

#     return jsonify(workout), 201

@app.route('/workouts', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_workout():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get the workout_id from query params (if provided) and the direction (next/prev)
    workout_id = request.args.get('workout_id')
    direction = request.args.get('direction', 'recent')

    if workout_id:
        try:
            workout_id = int(workout_id)
        except ValueError:
            return jsonify({'error': 'Invalid workout ID'}), 400
        
        if direction == 'next':
            cursor.execute('SELECT * FROM workouts WHERE workout_id > %s ORDER BY workout_id ASC LIMIT 1', (workout_id,))
        elif direction == 'prev':
            cursor.execute('SELECT * FROM workouts WHERE workout_id < %s ORDER BY workout_id DESC LIMIT 1', (workout_id,))
        else:
            cursor.execute('SELECT * FROM workouts WHERE workout_id = %s LIMIT 1', (workout_id,))
        
        workout = cursor.fetchone()
        updated_workout_id = workout[0]
        # Fetch exercises for the selected workout_id
        cursor.execute('SELECT exercise_name, rep_count FROM exercise_reps INNER JOIN exercise_types ON exercise_reps.exercise_type_id = exercise_types.exercise_type_id WHERE workout_id = %s', (updated_workout_id,))
        exercises = cursor.fetchall()
    else:
        cursor.execute('SELECT * FROM workouts ORDER BY workout_id DESC LIMIT 1')
        workout = cursor.fetchone()
        workout_id = workout[0]
        cursor.execute('SELECT exercise_name, rep_count FROM exercise_reps INNER JOIN exercise_types ON exercise_reps.exercise_type_id = exercise_types.exercise_type_id WHERE workout_id = %s', (workout_id,))
        exercises = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({"workout": workout, "exercises": exercises})

@app.route('/start_workout', methods=['POST'])
def start_workout():
    try:
        conn = get_db_connection()
        # Get the current time
        workout_time = datetime.now()

        # Insert into workouts table and get workout_id
        cur = conn.cursor()
        cur.execute("INSERT INTO workouts (workout_time) VALUES (%s) RETURNING workout_id;", (workout_time,))
        workout_id = cur.fetchone()[0]
        conn.commit()

        return jsonify({"workout_id": workout_id, "workout_time": workout_time}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()

@app.route('/start_exercise', methods=['POST'])
def start_exercise():
    try:
        # Run your Python script using subprocess
        result = subprocess.run(['python3', 'classify_count.py'], capture_output=True, text=True)

        # If the script was successful, parse the output
        if result.returncode == 0:
            # Split the stdout by lines
            output_lines = result.stdout.strip().split('\n')

            # Ensure there are at least two lines in the output
            if len(output_lines) >= 2:
                # The second-to-last line is the exercise name, and the last line is the rep count
                exercise_name = output_lines[-2].strip()
                rep_count = output_lines[-1].strip()

                # Return the extracted exercise name and rep count
                return jsonify({
                    "message": "Exercise started successfully!",
                    "exercise_name": exercise_name,
                    "rep_count": rep_count,
                    "output": result.stdout
                }), 200
            else:
                return jsonify({"message": "Output format error", "output": result.stdout}), 500
        else:
            # If there was an error, return the error message
            return jsonify({"message": "Error starting exercise", "error": result.stderr}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# # Add a workout
# @app.route('/workouts', methods=['POST'])
# @cross_origin(supports_credentials=True)
# def add_workout():
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     new_workout = request.get_json()
#     cursor.execute(
#         'INSERT INTO workouts (userid, workout_time) VALUES (%s, %s) RETURNING *',
#         (new_workout['userid'], new_workout['workout_time'])
#     )
#     workout = cursor.fetchone()
#     conn.commit()
#     cursor.close()
#     conn.close()

#     return jsonify(workout), 201

@app.route('/store_exercise_reps', methods=['POST'])
def store_exercise_reps():
    data = request.json
    workout_id = data.get('workout_id')
    exercises = data.get('exercises', [])

    conn = get_db_connection()
    cursor = conn.cursor()

    # Insert each exercise into the exercise_reps table
    try:
        for exercise in exercises:
            workout_id = exercise[0]
            exercise_name = exercise[1]
            rep_count = exercise[2]

            # You may need to map exercise_name to exercise_type_id
            # Assuming you have a table 'exercise_types' for this:
            cursor.execute('SELECT exercise_type_id FROM exercise_types WHERE exercise_name = %s', (exercise_name,))
            exercise_type_id = cursor.fetchone()[0]

            # Insert into exercise_reps
            cursor.execute(
                'INSERT INTO exercise_reps (workout_id, exercise_type_id, rep_count) VALUES (%s, %s, %s)',
                (workout_id, exercise_type_id, rep_count)
            )

        conn.commit()
        return jsonify({"message": "Exercises stored successfully"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


if __name__ == '__main__':
    app.run(debug=True)
