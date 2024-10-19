# app.py
from flask import Flask, jsonify, request
import psycopg2
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import os

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
@app.route('/workouts', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_workout():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get the workout_time from query params (if provided) and the direction (next/prev)
    workout_time = request.args.get('workout_time')
    direction = request.args.get('direction', 'recent')

    if workout_time:
        if direction == 'next':
            cursor.execute('SELECT * FROM workouts WHERE workout_time > %s ORDER BY workout_time ASC LIMIT 1', (workout_time,))
        elif direction == 'prev':
            cursor.execute('SELECT * FROM workouts WHERE workout_time < %s ORDER BY workout_time DESC LIMIT 1', (workout_time,))
        else:
            cursor.execute('SELECT * FROM workouts WHERE workout_time = %s LIMIT 1', (workout_time,))
    else:
        # If no workout_time is provided, get the most recent workout
        cursor.execute('SELECT * FROM workouts ORDER BY workout_time DESC LIMIT 1')

    workout = cursor.fetchone()
    cursor.close()
    conn.close()
    
    return jsonify(workout)

# Example route to add a workout
@app.route('/workouts', methods=['POST'])
@cross_origin(supports_credentials=True)
def add_workout():
    conn = get_db_connection()
    cursor = conn.cursor()
    new_workout = request.get_json()
    cursor.execute(
        'INSERT INTO workouts (userid, workout_time) VALUES (%s, %s) RETURNING *',
        (new_workout['userid'], new_workout['workout_time'])
    )
    workout = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(workout), 201

if __name__ == '__main__':
    app.run(debug=True)
