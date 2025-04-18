from flask import Flask, jsonify, request
from flask_cors import CORS  
import psycopg2
import os

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return psycopg2.connect(
        host="db",
        database="mydatabase",
        user="myuser",
        password="mypassword"
    )

# CREATE
@app.route("/api/todos", methods=["POST"])
def create_todo():
    data = request.get_json()
    text = data.get("text")
    date = data.get("date")
    is_completed = data.get("is_completed", False)

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO todos (text, date, is_completed) VALUES (%s, %s, %s) RETURNING id;",
        (text, date, is_completed)
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"id": new_id, "text": text, "date": date, "is_completed": is_completed}), 201

# READ ALL
@app.route("/api/todos", methods=["GET"])
def get_todos():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
            SELECT id, text, date, is_completed
            FROM todos
            ORDER BY 
                is_completed ASC,                 
                is_completed,                     
                date ASC NULLS LAST               
            ;
    """)
    todos = cur.fetchall()
    cur.close()
    conn.close()

    result = [
        {"id": row[0], "text": row[1], "date": row[2], "is_completed": row[3]}
        for row in todos
    ]
    return jsonify(result)

# READ SINGLE
@app.route("/api/todos/<int:todo_id>", methods=["GET"])
def get_todo(todo_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, text, date, is_completed FROM todos WHERE id = %s;", (todo_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return jsonify({"id": row[0], "text": row[1], "date": row[2], "is_completed": row[3]})
    else:
        return jsonify({"error": "Todo not found"}), 404

# UPDATE
@app.route("/api/todos/<int:todo_id>", methods=["PUT"])
def update_todo(todo_id):
    data = request.get_json()
    text = data.get("text")
    date = data.get("date")
    is_completed = data.get("is_completed")

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE todos SET text = %s, date = %s, is_completed = %s WHERE id = %s;",
        (text, date, is_completed, todo_id)
    )
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Todo updated"})

# DELETE
@app.route("/api/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM todos WHERE id = %s;", (todo_id,))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Todo deleted"})