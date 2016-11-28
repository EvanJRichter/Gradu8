import json
import pymongo # pip install pymongo
from bson import json_util
from pymongo import MongoClient

SERVER = 'ds147377.mlab.com'
PORT = 47377
DBNAME = 'gradu8'
USERNAME = 'admin'
PASS = 'test'

def connectDB():
	connection = MongoClient(SERVER, PORT)
	db = connection[DBNAME]
	db.authenticate(USERNAME, PASS)
	classes = db.classes
	return (connection, db, classes)

class DatabaseConnection:

	def __init__(self):
		self.connection, self.db, self.classes = connectDB()

	def insertDB(self, value):
		self.db.classes.insert(value)
		# print '\nNumber of posts after first insert', self.db.artwork.find().count()
