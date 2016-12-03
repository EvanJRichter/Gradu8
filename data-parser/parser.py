from bs4 import BeautifulSoup
import requests
import urllib
import json

def fetch_all_classes():
	url = "http://catalog.illinois.edu/courses-of-instruction/"
	soup = request_page(url)
	main = soup.find("div", {"id": "atozindex"})
	lists = main.find_all("li")
	links = []
	parsed = []
	for li in lists:
		link = li.find("a", href=True)
		if link:
			links.append(link['href'])
			parsed += fetch_department_classes(link['href'])
	return parsed

def fetch_department_classes(url):
	url = "http://catalog.illinois.edu" + url
	soup = request_page(url)
	courses = soup.find_all("div", {"class": "courseblock"})
	parsed = []
	for course in courses:
		parsed.append(prepare_info(course))
	return parsed

def prepare_info(course):
	info = course.find("a", {"class": "schedlink"}).text.split()
	description = course.find("p", {"class": "courseblockdesc"}).text
	department, number, title, credit = get_course_info(info)
	gpa = get_gpa(department, number)
	fall, spring = get_semesters(department, number)
	course = {}
	course["department"] = department
	course["number"] = number
	course["title"] = title
	course["credit"] = credit
	course["description"] = description
	course["avg_gpa"] = gpa
	course["fall"] = fall
	course["spring"] = spring
	return course

def get_course_info(info):
	department = info[0]
	number = info[1]
	title = ""
	i = 2
	while info[i] != 'credit:':
		title += info[i] + " "
		i += 1
	title = title[:-1]
	credit = ""
	for word in info[i+1:]:
		credit += word + " "
	credit = credit[:-2]

	return (department, number, title, credit)

def get_gpa(department, number):
	course = department+number
	r = requests.get("https://easy-a.net/universities/1/courses.json")
	data = r.json()
	avg = 0
	for item in data:
		if item['text'] == course:
			id = item['id']
			r = requests.get("https://easy-a.net/universities/1/courses/" + str(id) + ".json")
			data = r.json()
			semesters = data['semesters']
			sum = 0
			if len(semesters) >= 3:
				length = 3
			else:
				length = len(semesters)
			for i in range(length):
				gpa = semesters[i]["avg_gpa"]
				sum += gpa
			avg = round(sum/length, 3)
	return avg

def get_semesters(department, number):
	url = "https://courses.illinois.edu/schedule/terms/" + department + "/" + number
	soup = request_page(url)
	sems = soup.find_all("li")[11:]
	f_count = 0
	s_count = 0
	fall = True
	spring = True
	total = 8	# (fa13, sp14, fa14, sp15, fa15, sp16, fa16, sp17)
	# print(department, number)
	if len(sems) > 6:
		for li in sems:
			a = li.find_all("a")[0]
			temp = a.text.strip()
			sem = temp.split(' ')[0]
			year = temp.split(' ')[1]
			if '-' in year:
				year = year.split('-')[1]
			if int(year) >= 2013:
				if temp != "Spring 2013" and temp != "Summer 2013":
					# print(temp)
					if sem == "Fall":
						f_count += 1
					if sem == "Spring":
						s_count += 1
		f_ratio = f_count/total
		s_ratio = s_count/total
		if f_ratio >= 0.75:
			fall = True
			spring = False
		if s_ratio >= 0.75:
			fall = False
			spring = True
		else:
			fall = True
			sring = True
	return fall, spring

def fetch_majors():
	url = "https://admissions.illinois.edu/Discover/Academics/majors_alpha"
	soup = request_page(url)
	main = soup.find("section", {"id": "major-list"})
	lists = main.find_all("li")
	majors = []
	parsed = []
	for li in lists:
		major = create_major(li)
		if major:
			majors.append(major)
	return majors

def create_major(li):
	link = li.find("a", href=True)
	if link:
		major = {}
		text = link.text
		name = text.split("-")[:-1]
		name = ('-').join(name)
		major["name"] = name.strip()
		major["college"] = text.split("-")[-1].strip()
		return major
	else:
		return None

def fetch_minors():
	url = "http://catalog.illinois.edu/undergraduate/minors/"
	soup = request_page(url)
	main = soup.find("div", {"id": "textcontainer"})
	lists = main.find_all("li")
	minors = []
	parsed = []
	for li in lists:
		link = li.find("a", href=True)
		print link
		if link:
			minor = {}
			minor["name"] = link.text
			minors.append(minor)
	return minors

def request_page(url):
	r  = requests.get(url)
	data = r.text
	soup = BeautifulSoup(data, "lxml")
	return soup
