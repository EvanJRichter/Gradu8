from bs4 import BeautifulSoup
import requests
import urllib

def fetch_department():
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
			parsed += fetch_classes(link['href'])
	# print parsed
	return parsed

def fetch_classes(url):
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
	course = {}
	course["department"] = department
	course["number"] = number
	course["title"] = title
	course["credit"] = credit
	course["description"] = description
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

def download_photo(img_url, filename):
	urllib.urlretrieve(img_url, "pics/" + filename)

def request_page(url):
	r  = requests.get(url)
	data = r.text
	soup = BeautifulSoup(data, "lxml")
	return soup
