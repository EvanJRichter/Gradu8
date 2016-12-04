from bs4 import BeautifulSoup
import requests
import urllib
import json
import math

def fetch_all_classes():
	url = "http://catalog.illinois.edu/courses-of-instruction/"
	soup = request_page(url)
	main = soup.find("div", {"id": "atozindex"})
	lists = main.find_all("li")
	links = []
	parsed = []
	# parsed += fetch_department_classes('/courses-of-instruction/ansc/')
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
		c = prepare_info(course)
		for i in c:
			parsed.append(i)
	return parsed

def prepare_info(course):
	info = course.find("a", {"class": "schedlink"}).text.split()
	description = course.find("p", {"class": "courseblockdesc"}).text
	department, number, title, credit, credit_range = get_course_info(info)
	gpa = get_gpa(department, number)
	fall, spring = get_semesters(department, number)
	courses = []
	low = credit_range[0]
	if len(credit_range)==2:
		high = credit_range[1]
	else:
		high = credit_range[0]
	while low <= high:
		course = {}
		course["department"] = department
		course["number"] = number
		if low==1:
			course["title"] = title + ' - ' + str(low) + ' credit'
		else:
			course["title"] = title + ' - ' + str(low) + ' credits'
		course["credit"] = low
		low += 1
		course["description"] = description
		course["average_gpa"] = gpa
		course["fall"] = fall
		course["spring"] = spring
		course["public"] = True
		courses.append(course)
	return courses

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
	credit_range = []
	for word in info[i+1:]:
		if is_int(word) or is_float(word):
			w = float(word)
			credit_range.append(math.floor(w))
		credit += word + " "
	credit = credit[:-2]
	return (department, number, title, credit, credit_range)

def is_float(input):
  try:
    num = float(input)
  except ValueError:
    return False
  return True

def is_int(input):
  try:
    num = int(input)
  except ValueError:
    return False
  return True

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
