import sqlite3
from flask import (
    Flask, 
    jsonify, 
    request, 
    render_template,
    redirect)
from flask_cors import CORS

#define app
app = Flask(__name__)
CORS(app)

#define database path
DATABASE_NAME = "data/db.sqlite"

#define database GET Requests
def get_db():
    conn = sqlite3.connect(DATABASE_NAME)
    return conn

# def get_by_country(country):
#     db = get_db()
#     cursor = db.cursor()
#     statement = "SELECT * FROM Life WHERE Country LIKE ?"
#     cursor.execute(statement, [country])
#     return cursor.fetchall()

def get_all():
    db = get_db()
    cursor = db.cursor()
    query = "SELECT * FROM Life"
    cursor.execute(query)
    return cursor.fetchall()

def get_2015():
    db = get_db()
    cursor = db.cursor()
    query = "SELECT * FROM Life WHERE Year = 2015"
    cursor.execute(query)
    return cursor.fetchall()    

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/home<br/>"
        f"/api/countries<br/>"
        f"/api/life_2015"
    )

@app.route("/home")
def home():
    return render_template("index.html")

# define App routes to call GET Methods
@app.route('/api/countries', methods=["GET"])
def get_all_countries():
    countries = get_all()
    return jsonify(countries)

# define app routes for 2015 data
@app.route('/api/life_2015', methods=["GET"])
def get_life_2015():
    life2015 = get_2015()
    return jsonify(life2015)


#app main
if __name__ == "__main__":
    
    app.run(debug=True)