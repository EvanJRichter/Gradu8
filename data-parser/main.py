import parser, db

if __name__ == "__main__":
	connection = db.DatabaseConnection()
	# parser.get_semesters("ACCY", "199")
	results = parser.fetch_department()
	for course in results:
		connection.insertDB(course)
