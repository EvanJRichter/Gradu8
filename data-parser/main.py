import parser, db

if __name__ == "__main__":
	connection = db.DatabaseConnection()
	# results = parser.fetch_all_classes()
	# for course in results:
	# 	connection.insert_course_DB(course)

	results = parser.fetch_majors()
	for major in results:
		connection.insert_major_DB(major)

	results = parser.fetch_minors()
	for minor in results:
		connection.insert_minor_DB(minor)
