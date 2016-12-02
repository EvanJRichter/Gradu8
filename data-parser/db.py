import json
import pymongo # pip install pymongo
from bson import json_util
from pymongo import MongoClient

SERVER = 'ds111748.mlab.com'
PORT = 11748
DBNAME = 'gradua8'
USERNAME = 'admin'
PASS = 'test'

def connectDB():
	connection = MongoClient(SERVER, PORT)
	db = connection[DBNAME]
	db.authenticate(USERNAME, PASS)
	classes = db.classes
	majors = db.majors
	minors = db.minors
	return (connection, db, classes, majors, minors)

class DatabaseConnection:

	def __init__(self):
		self.connection, self.db, self.classes, self.majors, self.minors = connectDB()

	def insert_course_DB(self, value):
		self.db.classes.insert(value)

	def insert_major_DB(self, value):
		self.db.major.insert(value)

	def insert_minor_DB(self, value):
		self.db.minor.insert(value)
