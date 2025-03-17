# pylint: disable=all

import requests
import random
import subprocess

# API URL and endpoints
# BASE_URL = "https://sysenggroup11-ehbrckafd4c6b9cv.uksouth-01.azurewebsites.net"
BASE_URL = "http://127.0.0.1:8000"

SIGNUP_URL = f"{BASE_URL}/api/auth/signup/"
LOGIN_URL = f"{BASE_URL}/api/auth/login/"
EVENTS_URL = f"{BASE_URL}/events/"
CMS_ARTICLES_URL = f"{BASE_URL}/articles/"
POI_URL = f"{BASE_URL}/events/"
REPORTS_URL = f"{BASE_URL}/reports/"
COMPANY_INFORMATION_URL = f"{BASE_URL}/companyinformation/"
REPORTSDISCUSSION_URL = f"{BASE_URL}/reportdiscussion/"

# Account credentials
EMAIL = "ExampleBusiness@e.com"
PASSWORD = "1ExampleBusiness*"
USERNAME = "ExampleBusiness"

# Function to sign up a new account
def signup():
    response = requests.post(SIGNUP_URL, data={
        "email": EMAIL,
        "password": PASSWORD,
        "username": USERNAME
    })
    if response.status_code == 201:
        print("Account created successfully.")
    else:
        print("Error creating account:", response.text)

# Function to log in and get the authorization token
def login():
    headers = {"Content-Type": "application/json"}  # Set content type to JSON
    data = {
        "username": USERNAME,
        "password": PASSWORD
    }
    
    response = requests.post(LOGIN_URL, json=data, headers=headers)  # Use json parameter instead of data
    
    if response.status_code == 200:
        token = response.json().get("access")
        print("Login successful. Authorization token obtained.")
        return token
    else:
        print(f"Login failed with status code {response.status_code}: {response.text} {response}")
        return None

# Function to create articles
def create_article(token, title, content, author, description):
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "title": title,
        "content": content,
        "author": author,
        "description": description
    }
    response = requests.post(CMS_ARTICLES_URL, headers=headers, data=data)
    if response.status_code == 201:
        print(f"Article '{title}' created successfully.")
    else:
        print(f"Error creating article '{title}':", response.text)

reports_data = [
    {
        "title": "Pothole on Elm Street",
        "description": "Large pothole causing vehicle damage. "
        "Needs urgent repair.",
        "status": "open",
        "tags": "road",
        "Author": "Alice Johnson",
    },
    {
        "title": "Illegal Dumping in Park",
        "description": "Construction waste dumped in Riverside Park. "
        "Affects wildlife and park visitors. Ruined the natural beauty of the park.",
        "status": "open",
        "tags": "waste_management",
        "Author": "Bob Williams",
    },
    {
        "title": "Air Pollution Spike",
        "description": "Noticeable increase in air pollution in the city center. "
        "I can smell the fumes.",
        "status": "open",
        "tags": "pollution",
        "Author": "Charlie Brown",
    },
    {
        "title": "Blocked Drains Causing Flooding",
        "description": "Drains blocked, flooding during heavy rain.",
        "status": "open",
        "tags": "urban_development",
        "Author": "Eve Smith",
    },
    {
        "title": "Excessive Noise Pollution",
        "description": "Loud construction noise late at night. It's affecting"
        " residents' sleep.",
        "status": "open",
        "tags": "pollution",
        "Author": "Frank Miller",
    },
    {
        "title": "Tree Down Blocking Road",
        "description": "A Large tree has fallen and is blocking traffic."
        "Needs to be removed.",
        "status": "open",
        "tags": "road",
        "Author": "Grace Davis",
    },
    {
        "title": "Chemical Spill Near River",
        "description": "There is an unidentified chemical spill near the riverbank."
        " Concerns for wildlife and water quality.",
        "status": "open",
        "tags": "environmental",
        "Author": "Henry Wilson",
    },
    {
        "title": "Overfilled Public Bins",
        "description": "Public bins overflowing, creating a health hazard. "
        "Needs more frequent collection.",
        "status": "open",
        "tags": "waste_management",
        "Author": "Ivy Garcia",
    },
    {
        "title": "Contaminated Water Supply",
        "description": "The water in my residence is contaminated. "
        "Concerns for health and safety.",
        "status": "open",
        "tags": "health_safety",
        "Author": "John Perez",
    },
    {
        "title": "Abandoned Vehicle Blocking Street",
        "description": "Abandoned vehicle parked on residential street. "
        "Causing obstruction and safety concerns.",
        "status": "open",
        "tags": "urban_development",
        "Author": "Karen Young",
    },
    {
        "title": "Road Repair needed",
        "description": "Pothole on Maple Avenue needs to be fixed. "
        "It has caused many issues for drivers.",
        "status": "resolved",
        "tags": "road", 
        "Author": "Kelly Martinez",
    },
    {
        "title": "Dog waste problem in park",
        "description": "Dog waste not being picked up by owners. "
        "Health hazard for park visitors.",
        "status": "resolved",
        "tags": "waste_management",
        "Author": "Liam Thompson",
    },
    {
        "title": "Noise complaint from construction site",
        "description": "Construction noise outside permitted hours. "
        "Disturbing residents.",
        "status": "closed",
        "tags": "pollution",
        "Author": "Mia Hall",
    },
    {
        "title": "Illegal dumping in alleyway",
        "description": "Household waste dumped in alley behind shops. "
        "Unsanitary and unsightly.",
        "status": "closed",
        "tags": "waste_management",
        "Author": "Noah Lewis",
    },
        {
        "title": "Broken Streetlight",
        "description": "Streetlight on Oak Avenue is broken, "
        "creating a dark and unsafe area at night.",
        "status": "open",
        "tags": "urban_development",
        "Author": "Sophia Clark",
    },
    {
        "title": "Graffiti on Public Building",
        "description": "Vandalism with graffiti on the community center wall. "
        "Needs cleaning.",
        "status": "open",
        "tags": "urban_development",
        "Author": "Ethan Rodriguez",
    },
    {
        "title": "Leaking Pipe on Sidewalk",
        "description": "Water leaking from a pipe on the sidewalk, "
        "creating a slippery and wasteful situation.",
        "status": "open",
        "tags": "urban_development",
        "Author": "Isabella Patel",
    },
    {
        "title": "Litter in Playground",
        "description": "Excessive litter in the children's playground. "
        "Unhygienic and dangerous.",
        "status": "open",
        "tags": "waste_management",
        "Author": "Alexander Kim",
    },
    {
        "title": "Fallen Branch Blocking Path",
        "description": "Large branch fallen across the walking path in the park. "
        "Impeding access.",
        "status": "open",
        "tags": "environmental",
        "Author": "Mia Gupta",
    },
    {
        "title": "Unsafe Building Demolition",
        "description": "Demolition work being carried out without proper safety measures. "
        "Debris is falling into the street.",
        "status": "open",
        "tags": "health_safety",
        "Author": "Daniel Singh",
    },
    {
        "title": "Sewage Smell in Street",
        "description": "Strong sewage smell in the street, "
        "indicating a possible leak or blockage.",
        "status": "open",
        "tags": "pollution",
        "Author": "Charlotte Wright",
    },
    {
        "title": "Abandoned Shopping Carts",
        "description": "Several abandoned shopping carts left in the neighborhood. "
        "Creating an eyesore and obstruction.",
        "status": "open",
        "tags": "waste_management",
        "Author": "James Moore",
    },
    {
        "title": "Damaged Traffic Sign",
        "description": "Traffic sign at the intersection is damaged and difficult to read. "
        "Causing potential confusion.",
        "status": "open",
        "tags": "road",
        "Author": "Amelia Thomas",
    },
    {
        "title": "Flooded Underpass",
        "description": "Underpass flooded after heavy rain, making it impassable "
        "for pedestrians and vehicles.",
        "status": "open",
        "tags": "urban_development",
        "Author": "Benjamin Jackson",
    },
    {
        "title": "Resolved: Streetlight Repaired",
        "description": "The streetlight on Oak Avenue has been repaired and "
        "is now working.",
        "status": "resolved",
        "tags": "urban_development",
        "Author": "Oliver White",
    },
    {
        "title": "Resolved: Graffiti Removed",
        "description": "The graffiti on the community center wall has "
        "been cleaned.",
        "status": "resolved",
        "tags": "urban_development",
        "Author": "Evelyn Harris",
    },
    {
        "title": "Closed: Noise Complaint Resolved",
        "description": "The noise from the construction site has been addressed "
        "and is no longer an issue.",
        "status": "closed",
        "tags": "pollution",
        "Author": "William Martin",
    },
    {
        "title": "Closed: Illegal Dumping Cleaned",
        "description": "The illegal dumping in the alleyway has been cleared.",
        "status": "closed",
        "tags": "waste_management",
        "Author": "Abigail Thompson",
    },
    {
        "title": "Open: Dangerous Tree Branches",
        "description": "Tree branches are hanging dangerously low over the sidewalk."
        " Need immediate trimming.",
        "status": "open",
        "tags": "environmental",
        "Author": "Joseph Garcia",
    },
    {
        "title": "Open: Broken Park Bench",
        "description": "A park bench is broken and splintered. It is a safety hazard.",
        "status": "open",
        "tags": "urban_development",
        "Author": "Madison Martinez",
    },
    {
        "title": "Open: Rats in Alleyway",
        "description": "There is an infestation of rats in the alleyway"
        " behind the shops.",
        "status": "open",
        "tags": "health_safety",
        "Author": "Samuel Robinson",
    },
    {
        "title": "Open: Excessive Vehicle Idling",
        "description": "Delivery vehicles are idling for long periods,"
        " causing excessive pollution.",
        "status": "open",
        "tags": "pollution",
        "Author": "Elizabeth Lopez",
    }
]

scheduled_events = [
    {
        "title": "Bird Watching in St. James's Park",
        "description": "Join our guided bird watching tour in St. James's Park. "
        "Discover the diverse bird species that call this park home. Binoculars provided."
        " Please wear comfortable shoes.",
        "location": "St. James's Park",
        "date": "2025-03-11",
        "time": "15:00",
        "theme": "Nature",
        "latitude": 51.5033,
        "longitude": -0.1300,
        "is_featured": "True",
        "image_path": "img/bird.png"
    },
    {
        "title": "Thames River Cleanup",
        "description": "Join us for a community-driven Thames River cleanup!"
        " Help us remove waste and protect London's iconic river while learning"
        " about local water ecosystems.",
        "location": "South Bank",
        "date": "2025-03-10",
        "time": "12:00",
        "theme": "Sustainability",
        "latitude": 51.5074, 
        "longitude": -0.1278, 
        "is_featured": "False",
        "image_path": "img/dirtyriver.png"
    },
    {
        "title": "Community Garden Planting",
        "description": "Help us plant new flowers and vegetables in our local community garden. "
        "Learn about organic gardening and meet your neighbors! Please "
        "bring your own gardening gloves.",
        "location": "Regent's Park",
        "date": "2025-03-03",
        "time": "10:00",
        "theme": "Sustainability",
        "latitude": 51.5304,
        "longitude": -0.1520,
        "is_featured": "False",
        "image_path": "img/planting.png"
    },
    {
        "title": "Local History Walk",
        "description": "Discover hidden historical gems in the City of London with "
        "our guided walking tour. Learn about the area's rich past.",
        "location": "Guildhall",
        "date": "2025-03-05",
        "time": "14:00",
        "theme": "Community",
        "latitude": 51.5147,
        "longitude": -0.0911,
        "is_featured": "False",
        "image_path": "img/historywalk.png"

    },
    {
        "title": "Upcycled Art Workshop",
        "description": "Create unique art pieces using recycled materials. "
        "Learn creative techniques and reduce waste.",
        "location": "Barbican Centre",
        "date": "2025-03-07",
        "time": "18:00",
        "theme": "Sustainability",
        "latitude": 51.5205,
        "longitude": -0.0936,
        "is_featured": "False",
        "image_path": "img/art.png"
    },
    {
        "title": "Morning Fitness Jog",
        "description": "Start your day with an energizing morning jog through "
        "Hyde Park. All fitness levels are welcome!",
        "location": "Hyde Park",
        "date": "2025-03-11",
        "time": "07:00",
        "theme": "Community",
        "latitude": 51.5073,
        "longitude": -0.1657,
        "is_featured": "False",
        "image_path": "img/jog.png"
    },
    {
        "title": "Local Produce Market",
        "description": "Support local farmers and businesses at our weekly produce market. "
        "Fresh fruits, vegetables, and artisanal goods.",
        "location": "Borough Market",
        "date": "2025-03-12",
        "time": "09:00",
        "theme": "Community",
        "latitude": 51.5056,
        "longitude": -0.0909,
        "is_featured": "True",
        "image_path": "img/market.png"
    },
    {
        "title": "Urban Wildlife Workshop",
        "description": "Learn about the wildlife that thrives in London's urban environment."
        " Discover how to create wildlife-friendly spaces.",
        "location": "Victoria Park",
        "date": "2025-03-13",
        "time": "16:00",
        "theme": "Nature",
        "latitude": 51.5367,
        "longitude": -0.0306,
        "is_featured": "False",
        "image_path": "img/wildlife.png"
    },
    {
        "title": "Riverboat Tour: Thames Discovery",
        "description": "Embark on a scenic riverboat tour along the Thames."
        " Explore London's landmarks from a unique perspective.",
        "location": "Tower Bridge",
        "date": "2025-03-13",
        "time": "13:00",
        "theme": "Community",
        "latitude": 51.5055,
        "longitude": -0.0754,
        "is_featured": "False",
        "image_path": "img/riverboat.png"
    },
    {
        "title": "Community Book Swap",
        "description": "Bring your old books and swap them for new reads at our"
        " community book swap. A great way to recycle and discover new authors.",
        "location": "Southwark Library",
        "date": "2025-03-14",
        "time": "13:00",
        "theme": "Community",
        "latitude": 51.5019,
        "longitude": -0.0984,
        "is_featured": "True",
        "image_path": "img/books.png"
    },
    {
        "title": "Community yoga in the park",
        "description": "Join our community yoga session in the park. Relax, stretch, "
        "and connect with nature.",
        "location": "Green Park",
        "date": "2025-03-15",
        "time": "9:00",
        "theme": "Community",
        "latitude": 51.5033,
        "longitude": -0.1419,
        "is_featured": "False",
        "image_path": "img/yoga.png"
    },
    {
        "title": "Green Living Seminar",
        "description": "Learn practical tips for sustainable living. Reduce your carbon"
        " footprint and make a positive impact on the environment.",
        "location": "City Hall",
        "date": "2025-03-15",
        "time": "11:00",
        "theme": "Sustainability",
        "latitude": 51.5045,
        "longitude": -0.0805,
        "is_featured": "False",
        "image_path": "img/seminar.png"
    },
    {
        "title": "Sunday Cycle Ride",
        "description": "Enjoy a leisurely cycle ride along the Regent's Canal. "
        "Explore London's hidden waterways and enjoy the scenery.",
        "location": "Regent's Canal",
        "date": "2025-03-16",
        "time": "10:00",
        "theme": "Community",
        "latitude": 51.5350,
        "longitude": -0.1000,
        "is_featured": "False",
        "image_path": "img/cycle.png"
    },
    {
        "title": "Art in the Park",
        "description": "Join us for an outdoor art session in Battersea Park. "
        "Bring your own materials or use ours. All skill levels welcome.",
        "location": "Battersea Park",
        "date": "2025-03-18",
        "time": "14:00",
        "theme": "Community",
        "latitude": 51.4770,
        "longitude": -0.1583,
        "is_featured": "False",
        "image_path": "img/artpark.png"
    },
    {
        "title": "Recycling Workshop",
        "description": "Learn the ins and outs of recycling in London. "
        "Understand what can and cannot be recycled and how to do it effectively.",
        "location": "Islington Ecology Centre",
        "date": "2025-03-20",
        "time": "17:00",
        "theme": "Sustainability",
        "latitude": 51.5361,
        "longitude": -0.1060,
        "is_featured": "False",
        "image_path": "img/recycle.png"
    },
    {
        "title": "Community Choir Practice",
        "description": "Join our friendly community choir for a fun singing session. "
        "All voices welcome!",
        "location": "Spitalfields Community Centre",
        "date": "2025-03-22",
        "time": "19:00",
        "theme": "Community",
        "latitude": 51.5188,
        "longitude": -0.0717,
        "is_featured": "False",
        "image_path": "img/choir.png"
    },
    {
        "title": "Sustainable Cooking Class",
        "description": "Learn how to cook delicious and sustainable meals using locally"
        " sourced ingredients. Reduce food waste and eat healthy.",
        "location": "Hackney City Farm",
        "date": "2025-03-24",
        "time": "18:30",
        "theme": "Sustainability",
        "latitude": 51.5435,
        "longitude": -0.0536,
        "is_featured": "False",
        "image_path": "img/cooking.png"
    },
    {
        "title": "Nature Photography Walk",
        "description": "Capture the beauty of London's parks and wildlife on our "
        "guided photography walk. Learn tips and tricks for stunning nature shots.",
        "location": "Hampstead Heath",
        "date": "2025-03-26",
        "time": "15:30",
        "theme": "Nature",
        "latitude": 51.5607,
        "longitude": -0.1653,
        "is_featured": "False",
        "image_path": "img/photography.png"
    },
    {
        "title": "Community Yoga Class",
        "description": "Relax and unwind with our community yoga class in Greenwich Park. "
        "Suitable for all levels, bring your own mat.",
        "location": "Greenwich Park",
        "date": "2025-03-28",
        "time": "08:30",
        "theme": "Community",
        "latitude": 51.4769,
        "longitude": -0.0005,
        "is_featured": "False",
        "image_path": "img/yoga.png"
    },
    {
        "title": "Zero Waste Workshop",
        "description": "Discover the principles of zero waste living and how to reduce your "
        "environmental impact. Practical tips and advice for sustainable living.",
        "location": "Walthamstow Wetlands",
        "date": "2025-03-30",
        "time": "16:00",
        "theme": "Sustainability",
        "latitude": 51.6014,
        "longitude": -0.0265,
        "is_featured": "False",
        "image_path": "img/recycle.png"
    },
    {
        "title": "Community Gardening Day",
        "description": "Join us for a day of community gardening at Kew Gardens. "
        "Help plant flowers, herbs, and vegetables in our shared garden space.",
        "location": "Kew Gardens",
        "date": "2025-04-01",
        "time": "10:00",
        "theme": "Community",
        "latitude": 51.4785,
        "longitude": -0.2956,
        "is_featured": "False",
        "image_path": "img/gardening.png"
    }
]

poi_events = [
    {
        "title": "Explore Big Ben",
        "description": "Discover the history and architecture of Big Ben, one of London's most iconic landmarks.",
        "location": "Big Ben, Westminster, London, Greater London, England",
        "poi_type": "landmarks",
        "latitude": 51.5007,
        "longitude": -0.1246,
        "is_featured": "False",
        "opening_times": "Mon- Fri 09:00-17:00",
        "image_path": "img/bigben.png"
    },
    {
        "title": "Visit the London Eye",
        "description": "Experience breathtaking views of London from the London Eye. "
        "A must-visit attraction for tourists and locals alike.",
        "location": "London Eye, South Bank, London, Greater London, England",
        "poi_type": "landmarks",
        "latitude": 51.5033,
        "longitude": -0.1196,
        "is_featured": "False",
        "opening_times": "Everyday 10:00-20:30",
        "image_path": "img/londoneye.png"
    },
    {
        "title": "Explore Trafalgar Square",
        "description": "Discover the history and cultural significance of Trafalgar Square."
        " Home to Nelson's Column and the National Gallery.",
        "location": "Trafalgar Square, Westminster, London, Greater London, England",
        "poi_type": "landmarks",
        "latitude": 51.5074,
        "longitude": -0.1278,
        "is_featured": "False",
        "opening_times": "24/7",
        "image_path": "img/trafalgar.png"
    },
    {
        "title": "Tour Buckingham Palace",
        "description": "Experience the grandeur of Buckingham Palace, the official residence of "
        "the British monarch. Witness the Changing of the Guard ceremony.",
        "location": "Buckingham Palace, Westminster, London, Greater London, England",
        "poi_type": "landmarks",
        "latitude": 51.5014,
        "longitude": -0.1419,
        "is_featured": "False",
        "opening_times": "Wed-Sun 09:30-17:30",
        "image_path": "img/buckingham.png"
    },
    {
        "title": "Visit the Tower of London",
        "description": "Explore the Tower of London, a historic castle and fortress on the banks of "
        "the River Thames. Home to the Crown Jewels and centuries of history.",
        "location": "Tower of London, Tower Hill, London, Greater London, England",
        "poi_type": "landmarks",
        "latitude": 51.5081,
        "longitude": -0.0759,
        "is_featured": "False",
        "opening_times": "Tue-Sat 09:00-17:30",
        "image_path": "img/tower.png"
    },
    {
        "title": "Discover the British Museum",
        "description": "Immerse yourself in world history and culture at the British Museum. "
        "Home to a vast collection of artifacts from ancient civilizations.",
        "location": "British Museum, Great Russell St, Bloomsbury, London, England",
        "poi_type": "museums",
        "latitude": 51.5194,
        "longitude": -0.1270,
        "is_featured": "False",
        "opening_times": "Every day 10:00-17:30",
        "image_path": "img/museum.webp"
    },
    {
        "title": "Explore the Natural History Museum",
        "description": "Journey through the natural world at the Natural History Museum. "
        "Discover dinosaurs, gemstones, and interactive exhibits for all ages.",
        "location": "Natural History Museum, Cromwell Rd, South Kensington, London, England",
        "poi_type": "museums",
        "latitude": 51.4966,
        "longitude": -0.1764,
        "is_featured": "False",
        "opening_times": "Every day 10:00-17:50",
        "image_path": "img/naturalhistory.png"
    },
    {
        "title": "Hyde Park: London's Green Oasis",
        "description": "Escape the city hustle and bustle in Hyde Park. Enjoy picnics, boating,"
        " and leisurely walks in one of London's largest parks.",
        "location": "Hyde Park, London, England",
        "poi_type": "parks",
        "latitude": 51.5073,
        "longitude": -0.1657,
        "is_featured": "False",
        "opening_times": "24/7",
        "image_path": "img/hydepark.png"
    },
    {
        "title": "Regent's Park: A Botanical Haven",
        "description": "Stroll through Regent's Park and admire its stunning gardens "
        "and wildlife. Visit the Queen Mary's Rose Garden and London Zoo.",
        "location": "Regent's Park, London, England",
        "poi_type": "parks",
        "latitude": 51.5304,
        "longitude": -0.1520,
        "is_featured": "False",
        "opening_times": "24/7",
        "image_path": "img/regentspark.png"
    },
    {
        "title": "Kew Gardens: A World of Plants",
        "description": "Explore the diverse plant life at Kew Gardens, a UNESCO World Heritage Site."
        " Discover glasshouses, treetop walks, and botanical wonders.",
        "location": "Kew Gardens, Richmond, London, England",
        "poi_type": "parks",
        "latitude": 51.4785,
        "longitude": -0.2956,
        "is_featured": "False",
        "opening_times": "Every day 10:00-18:00",
        "image_path": "img/kewgardens.png"
    }
]

articles_data = [
    {
        "title": "Discovering London's History",
        "content": "Explore London's rich history, from its Roman origins as Londinium to its modern-day status as a"
        " global metropolis. Walk the ancient streets where historical figures like Shakespeare and Churchill once trod."
        " Delve into the Tower of London's storied past, where tales of royalty, imprisonment, and intrigue echo through"
        " the centuries. Visit the British Museum to witness artifacts from civilizations across the globe, or wander"
        " through the medieval halls of Westminster Abbey, a site of coronations and royal burials. Trace the city's "
        "evolution through the Great Fire of London, the Victorian era's industrial boom, and the resilience displayed"
        " during World War II. Discover hidden historical gems in the City of London, where remnants of Roman walls "
        "and medieval churches stand side by side with modern skyscrapers. Unearth the stories behind iconic landmarks"
        " and lesser-known historical sites, painting a vivid picture of London's enduring legacy.",
        "author": "Alice Johnson",
        "description": "A journey through time in the heart of London.",
        "image_path": "img/london.png"
    },
    {
        "title": "A Guide to London’s Iconic Landmarks",
        "content": "From Big Ben to the London Eye, London boasts some of the most famous landmarks in the world. These"
        " iconic sites attract millions of tourists every year, offering breathtaking views and historic significance."
        " Start your journey at the Houses of Parliament, where Big Ben's chimes resonate across the city, a symbol of British"
        " democracy. Cross Westminster Bridge to capture panoramic views of the London Eye, a giant Ferris wheel offering a "
        "unique perspective of the skyline. Explore Buckingham Palace, the official residence of the British monarch, and witness "
        "the Changing of the Guard ceremony. Marvel at the architectural grandeur of St. Paul's Cathedral, a masterpiece designed"
        " by Sir Christopher Wren. Walk across Tower Bridge, an engineering marvel that opens to allow ships to pass. "
        "Visit Trafalgar Square, home to Nelson's Column and the National Gallery, a hub of art and culture. Discover the historical"
        " significance of the Tower of London, a fortress, palace, and prison that has played a crucial role in British history. "
        "Each landmark tells a story, weaving together the rich tapestry of London's past and present.",
        "author": "Bob Williams",
        "description": "Explore the must-see sights of London.",
        "image_path": "img/landmarks.jpg"
    },
    {
        "title": "The Best Parks in London",
        "content": "London offers a variety of green spaces for relaxation and leisure. Hyde Park, Regent’s Park, and"
        " Hampstead Heath are just a few of the many parks that provide peace and tranquility amidst the hustle and "
        "bustle of the city. Hyde Park, one of the largest royal parks, features the Serpentine Lake, where you can rent "
        "paddleboats or enjoy a leisurely stroll. Regent’s Park, home to London Zoo and Queen Mary’s Gardens, offers a mix"
        " of formal gardens and open spaces perfect for picnics. Hampstead Heath, with its rolling hills and wooded areas,"
        " provides a wilder, more natural escape, offering stunning views of the city skyline from Parliament Hill. Explore "
        "the hidden gardens of Holland Park, with its Kyoto Garden providing a serene Japanese oasis. Discover the botanical"
        " wonders of Kew Gardens, a UNESCO World Heritage Site, or enjoy the vibrant atmosphere of Victoria Park, a favorite"
        " among East Londoners. Each park offers a unique experience, from formal gardens and boating lakes to wild meadows "
        "and ancient woodlands, ensuring there's a green space for every mood and activity.",
        "author": "Charlie Brown",
        "description": "Discover the green oasis of London.",
        "image_path": "img/park.jpg"
    },
    {
        "title": "A Walk Through London’s Museums",
        "content": "London is home to some of the world’s most renowned museums. The British Museum, "
        "Natural History Museum, and Tate Modern showcase everything from ancient artifacts to contemporary art."
        " The British Museum houses a vast collection of world art and artifacts, including the Rosetta Stone "
        "and Egyptian mummies. The Natural History Museum, with its iconic dinosaur skeletons, offers a fascinating "
        "journey through the history of life on Earth. Tate Modern, housed in a former power station, displays modern"
        " and contemporary art from around the globe. Explore the Victoria and Albert Museum (V&A), showcasing decorative"
        " arts and design from various periods and cultures. Discover the Science Museum, where interactive exhibits"
        " bring scientific principles to life. Visit the National Gallery to admire masterpieces of European painting,"
        " or explore the smaller, specialized museums like the Sir John Soane's Museum or the Museum of London, each"
        " offering a unique perspective on history, art, and culture. London's museums cater to every interest, providing"
        " endless opportunities for learning and discovery.",
        "author": "Eve Smith",
        "description": "A cultural journey through London's museums.",
        "image_path": "img/museum.webp"
    },
    {
        "title": "Exploring the Thames River",
        "content": "The River Thames is the lifeblood of London, with bridges like Tower Bridge and "
        "London Bridge providing vital connections across the city. A boat ride along the Thames offers"
        " a unique perspective on London's history and architecture. Embark on a river cruise to see "
        "iconic landmarks from a different angle, passing under historic bridges and alongside modern skyscrapers."
        " Explore the Thames Path, a long-distance trail that follows the river's course, offering scenic walks "
        "and cycling routes. Visit the historic docks and wharves, remnants of London's maritime past. Discover"
        " the hidden islands and tributaries that dot the river, each with its own unique character. Learn "
        "about the Thames's role in London's history, from its importance as a trade route to its role in "
        "wartime defense. Witness the changing tides and the diverse wildlife that call the river home. Whether"
        " you're cruising, walking, or simply admiring the view from a riverside pub, the Thames offers a glimpse"
        " into the heart of London.",
        "author": "Frank Miller",
        "description": "A voyage along the iconic Thames River.",
        "image_path": "img/river.png"
    },
    {
        "title": "The Best Coffee Shops in London",
        "content": "Discover the top coffee shops in London, from cozy cafes to trendy roasteries. "
        "Whether you're a latte lover or espresso enthusiast, London's coffee scene has something for"
        " everyone. Start your day with a perfectly brewed cup at a specialty coffee shop in Shoreditch,"
        " known for its vibrant cafe culture. Explore the historic coffee houses of Soho, where literary figures"
        " and artists once gathered. Sample artisanal roasts and pastries at a cafe in Borough Market, a foodie paradise."
        " Discover hidden gems in Notting Hill, where charming cafes line the colorful streets. Visit a roastery "
        "in East London to learn about the coffee-making process and sample freshly roasted beans. Enjoy a traditional"
        " afternoon tea with coffee and scones at a classic London cafe. From independent cafes to established chains, "
        "London's coffee scene offers a diverse range of experiences, catering to every taste and preference.",
        "author": "Grace Davis",
        "description": "A caffeine-fueled tour of London's coffee culture.",
        "image_path": "img/coffee.jpg"
    },
    {
        "title": "Hidden Gems of London",
        "content": "Uncover the hidden gems of London, from secret gardens to historic pubs. "
        "Escape the tourist crowds and discover the lesser-known treasures of the city. "
        "Explore the tranquil oasis of St. Dunstan in the East Church Garden, "
        "a former church transformed into a beautiful public space. Discover the charming "
        "alleyways and courtyards of Covent Garden, where hidden shops and cafes await. "
        "Visit the Leighton House Museum, a Victorian artist's home filled with stunning "
        "Islamic tiles and art. Explore the canals of Little Venice, where colorful narrowboats "
        "line the waterways. Discover the historic pubs of Southwark, where Shakespearean actors "
        "once performed. Visit the Kyoto Garden in Holland Park, a serene Japanese garden with a "
        "waterfall and koi pond. Explore the street art of Shoreditch, where vibrant murals and "
        "graffiti adorn the walls. From hidden gardens and historic pubs to art galleries and "
        "independent shops, London's hidden gems offer a unique and authentic experience, away "
        "from the hustle and bustle of the main tourist attractions.",
        "author": "Ivy Garcia",
        "description": "A guide to London's best-kept secrets.",
        "image_path": "img/london.png"
    }
]

# Function to create events with dynamic titles and descriptions
def create_event(token, title, description, location, date, time, latitude, longitude, 
                 is_featured, image_path):
    headers = {"Authorization": f"Bearer {token}"}
    with open(image_path, "rb") as img_file:
        files = {"main_image": img_file}
        data = {
            "title": title,
            "description": description,
            "location": location,
            "event_type": "scheduled",
            "date": date,  # Format date to YYYY-MM-DD
            "time": time,
            "latitude": latitude, 
            "longitude": longitude,  
            "is_featured": is_featured
        }
        response = requests.post(EVENTS_URL, headers=headers, data=data, files=files)

    if response.status_code == 201:
        print(f"Event '{title}' created successfully on {date}.")
    else:
        print(f"Error creating event '{title}':", response.text)

def create_poi(token, title, description, location, opening_times, poi_type, latitude,
                longitude, is_featured, image_path):
    headers = {"Authorization": f"Bearer {token}"}
    with open(image_path, "rb") as img_file:
        files = {"main_image": img_file}
        data = {
            "title": title,
            "description": description,
            "location": location,
            "event_type": "point_of_interest",
            "latitude": latitude, 
            "longitude": longitude,  
            "is_featured": is_featured,
            "poi_type": poi_type,
            "opening_times": opening_times
        }
        response = requests.post(POI_URL, headers=headers, data=data, files=files)
    if response.status_code == 201:
        print(f"POI '{title}' created successfully with type '{poi_type}'.")
    else:
        print(f"Error creating POI '{title}':", response.text)

def createComponyInformation(token):
    headers = {"Authorization": f"Bearer {token}"}
    with open("img/councillogo.png", "rb") as img_file:
        files = {"logo": img_file}
        data = {
                "name":"London City Council",
                "about":"This is London City Council.",
                "main_color":"#a4eaa8",
                "font":"Arial",
                "sw_lat" : 51.341875,
                "sw_lon": -0.38672,  
                "ne_lat": 51.651675,  
                "ne_lon": -0.06758
            }
        response = requests.post(COMPANY_INFORMATION_URL, headers=headers, data=data, files=files)
    if response.status_code == 201:
        print(f"Company information created successfully.")
    else:
        print(f"Error creating company information:", response.text)

# Function to create reports
def create_report(token, title, description, status, tags, author):
    headers = {"Authorization": f"Bearer {token}"}

    sw_lat = 51.341875
    sw_lon = -0.33672
    ne_lat = 51.651675
    ne_lon = -0.01758

    # Generate random latitude and longitude within the bounding box
    new_latitude = random.uniform(sw_lat, ne_lat)
    new_longitude = random.uniform(sw_lon, ne_lon)

    # Round to 6 decimal places
    new_latitude = round(new_latitude, 6)
    new_longitude = round(new_longitude, 6)

    data = {
        "title": title,
        "status": status,
        "description": description,
        "author": author,
        "longitude": (None, str(new_longitude)),
        "latitude": (None, str(new_latitude)),
        "tags": tags,
    }

    response = requests.post(REPORTS_URL, headers=headers, data=data)

    if response.status_code == 201:
        try:
            response_json = response.json()
            return response_json #return the entire report data.
        except (KeyError, ValueError):
            print(f"Error parsing JSON response for report '{title}': {response.text}")
            return None
    else:
        print(f"Error creating report '{title}':", response.text)
        return None

# Function to update the status of a non-open report
def update_report_status(token, report_id, status):
    headers = {"Authorization": f"Bearer {token}"}
    patch_url = f"{REPORTS_URL}{report_id}/"

    # Send OPTIONS request
    options_response = requests.options(patch_url, headers=headers)
    if options_response.status_code != 200:
        return

    # Send PATCH request
    data = {"status": status}
    response = requests.patch(patch_url, headers=headers, data=data)
    if response.status_code == 200:
        print(f"Report {report_id} status updated to '{status}'.")
    else:
        print(f"Error updating report {report_id}: {response.text}")

def update_report_upvotes(token, report_id, upvotes):
    headers = {"Authorization": f"Bearer {token}"}
    patch_url = f"{REPORTS_URL}{report_id}/"

    options_response = requests.options(patch_url, headers=headers)
    if options_response.status_code != 200:
        return

    data = {"upvotes": upvotes}
    response = requests.patch(patch_url, headers=headers, data=data)
    if response.status_code == 200:
        print(f"Report {report_id} upvotes updated to '{upvotes}'.")
    else:
        print(f"Error updating report {report_id} upvotes: {response.text}")

# Function to create report discussion
def create_report_discussion(token, report_id, author, message):
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "report": report_id,
        "author": author,
        "message": message,
    }
    response = requests.post(REPORTSDISCUSSION_URL, headers=headers, data=data)
    if response.status_code == 201:
        return response.json()
    else:
        print(f"Error creating report discussion: {response.text}")
        return None
    

def generate_report_discussions(token, created_reports):
    community_members = ["John Doe", "Jane Smith", "David Lee", "Sarah Jones", "Michael Brown", 
                         "Emily Davis", "Kevin Wilson", "Jessica Rodriguez", "Christopher Green", 
                         "Ashley King", "Matthew Scott", "Stephanie Baker", "Nicholas Adams", 
                         "Heather Nelson", "Ryan Mitchell", "Angela Collins"]

    discussions = []

    for i, report in enumerate(reports_data):
        if i < len(created_reports) and created_reports[i]:
            report_id = created_reports[i]['id']
            if report['title'] == "Pothole on Elm Street":
                messages = [
                    "I drove over that pothole yesterday, it's terrible!",
                    "Has anyone reported this to the city yet?",
                    "We need to get this fixed ASAP, my tire is damaged.",
                    "I saw a car nearly swerve into oncoming traffic trying to avoid it."
                ]
            elif report['title'] == "Illegal Dumping in Park":
                messages = [
                    "This is an outrage! Who would do such a thing?",
                    "It's heartbreaking to see the park in this state.",
                    "We should organize a community cleanup day.",
                    "Has anyone seen any suspicious activity in the park recently?"
                ]
            elif report['title'] == "Air Pollution Spike":
                messages = [
                    "I've been having trouble breathing lately, this must be why.",
                    "The smell is awful, it's affecting my daily life.",
                    "Is there any way to monitor the air quality in real-time?",
                    "We need to demand action from the city to address this pollution."
                ]
            elif report['title'] == "Blocked Drains Causing Flooding":
                messages = [
                    "My basement flooded last night because of this!",
                    "The water was up to my ankles on the street.",
                    "This happens every time it rains heavily, it's unacceptable.",
                    "We need better drainage systems in this area."
                ]
            elif report['title'] == "Excessive Noise Pollution":
                messages = [
                    "I couldn't sleep at all last night because of the noise.",
                    "This has been going on for days, it's unbearable.",
                    "Are there any noise ordinances in this area?",
                    "We need to file a formal complaint."
                ]
            elif report['title'] == "Tree Down Blocking Road":
                messages = [
                    "I had to take a detour this morning because of the tree.",
                    "It's completely blocking the road, it's dangerous.",
                    "Has anyone called the emergency services yet?",
                    "We need to get this cleared as soon as possible."
                ]
            elif report['title'] == "Chemical Spill Near River":
                messages = [
                    "This is extremely concerning, the river is a vital resource.",
                    "We need to alert the environmental agency immediately.",
                    "Has anyone identified the chemical?",
                    "We need to prevent this from spreading."
                ]
            elif report['title'] == "Overfilled Public Bins":
                messages = [
                    "The bins are overflowing and it's attracting pests.",
                    "It's a health hazard, especially in this heat.",
                    "We need more frequent collections.",
                    "This is a recurring problem, it needs a permanent solution."
                ]
            elif report['title'] == "Contaminated Water Supply":
                messages = [
                    "I'm afraid to drink the water, it smells and tastes strange.",
                    "We need to get the water tested immediately.",
                    "Has anyone else experienced this?",
                    "We need to alert the health department."
                ]
            elif report['title'] == "Abandoned Vehicle Blocking Street":
                messages = [
                    "That car has been there for days, it's taking up valuable parking space.",
                    "It's also a safety concern, it's blocking the view of oncoming traffic.",
                    "We need to get it towed.",
                    "Who do we contact to report this?"
                ]
            elif report['title'] == "Road Repair needed":
                messages = [
                    "That pothole was terrible, glad it is fixed.",
                    "The road is much smoother now.",
                    "Thank you for fixing it.",
                    "Who fixed it?"
                ]
            elif report['title'] == "Dog waste problem in park":
                messages = [
                    "Much better now, thank you.",
                    "The park is much cleaner.",
                    "Hopefully people will continue to be responsible.",
                    "Glad the problem is resolved."
                ]
            elif report['title'] == "Noise complaint from construction site":
                messages = [
                    "Finally, some peace and quiet.",
                    "Glad they addressed the issue.",
                    "The construction site is much quieter now.",
                    "Thank you for resolving this."
                ]
            elif report['title'] == "Illegal dumping in alleyway":
                messages = [
                    "The alleyway is clean again.",
                    "Thank you for cleaning it up.",
                    "Hopefully this will not happen again.",
                    "The alley is much better now."
                ]
            elif report['title'] == "Broken Streetlight":
                messages = [
                    "It's so dark at night without that light.",
                    "It's dangerous to walk there now.",
                    "We need to get this fixed quickly.",
                    "Has anyone reported this to the city?"
                ]
            elif report['title'] == "Graffiti on Public Building":
                messages = [
                    "That graffiti is an eyesore.",
                    "It makes the community center look bad.",
                    "We need to get it cleaned as soon as possible.",
                    "Who would do such a thing?"
                ]
            elif report['title'] == "Leaking Pipe on Sidewalk":
                messages = [
                    "That leak is wasting so much water.",
                    "It's also making the sidewalk slippery.",
                    "We need to get it fixed immediately.",
                    "Has anyone reported this to the water company?"
                ]
            elif report['title'] == "Litter in Playground":
                messages = [
                    "The playground is a mess.",
                    "It's not safe for children to play there.",
                    "We need to clean it up.",
                    "Who is responsible for cleaning the playground?"
                ]
            elif report['title'] == "Fallen Branch Blocking Path":
                messages = [
                    "That branch is completely blocking the path.",
                    "It's dangerous to try to climb over it.",
                    "We need to get it removed.",
                    "Has anyone reported this to the park rangers?"
                ]
            elif report['title'] == "Unsafe Building Demolition":
                messages = [
                    "That demolition is very unsafe.",
                    "Debris is falling into the street.",
                    "We need to stop the demolition until it is safe.",
                    "Has anyone reported this to the building inspector?"
                ]
            elif report['title'] == "Sewage Smell in Street":
                messages = [
                    "That smell is disgusting.",
                    "It's making me sick.",
                    "We need to find the source of the smell.",
                    "Has anyone reported this to the sewer company?"
                ]
            elif report['title'] == "Abandoned Shopping Carts":
                messages = [
                    "Those shopping carts are an eyesore.",
                    "They're also taking up valuable space.",
                    "We need to get them removed.",
                    "Who is responsible for removing them?"
                ]
            elif report['title'] == "Damaged Traffic Sign":
                messages = [
                    "That sign is difficult to read.",
                    "It's dangerous to drive through that intersection now.",
                    "We need to get it replaced.",
                    "Has anyone reported this to the traffic department?"
                ]
            elif report['title'] == "Flooded Underpass":
                messages = [
                    "The underpass is completely flooded.",
                    "It's impossible to pass through now.",
                    "We need to get the water pumped out.",
                    "Has anyone reported this to the city?"
                ]
            elif report['title'] == "Resolved: Streetlight Repaired":
                messages = [
                    "The streetlight is working again.",
                    "It's much safer to walk there at night now.",
                    "Thank you for fixing it.",
                    "Glad its working."
                ]
            elif report['title'] == "Resolved: Graffiti Removed":
                messages = [
                    "The graffiti is gone.",
                    "The community center looks much better now.",
                    "Thank you for cleaning it.",
                    "Glad that is resolved."
                ]
            elif report['title'] == "Closed: Noise Complaint Resolved":
                messages = [
                    "The construction noise has stopped.",
                    "It's so much quieter now.",
                    "Thank you for addressing the issue.",
                    "Glad that is resolved."
                ]
            else:
                messages = ["General discussion message 1", "General discussion message 2"]

            for message in messages:
                author = random.choice(community_members)
                discussion = create_report_discussion(token, report_id, author, message)
                if discussion:
                    discussions.append(discussion)
    return discussions

# Function to create articles
def create_article(token, title, content, author, description, image_path):
    headers = {"Authorization": f"Bearer {token}"}

    with open(image_path, "rb") as img_file:
        files = {"main_image": img_file}
        data = {
            "title": title,
            "content": content,
            "author": author,
            "description": description,
        }
        response = requests.post(CMS_ARTICLES_URL, headers=headers, data=data, files=files)

    if response.status_code == 201:
        print(f"Article '{title}' created successfully.")
    else:
        print(f"Error creating article '{title}':", response.text)

# Main execution flow
def main():
    # Flush the database before populating it
    try:
        # subprocess.run(["py", "-3.11", "../manage.py", "flush"], check=True)

        print("Database flushed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error flushing database: {e}")
        return  # Stop execution if flushing fails
    signup()
    token = login()
    if token:
        createComponyInformation(token)

        # Create events
        for i in range(len(scheduled_events)):
            event = scheduled_events[i]
            create_event(token, event["title"], event["description"], event["location"], event["date"], 
                         event["time"], event["latitude"], event["longitude"], event["is_featured"], event["image_path"])
        for i in range(len(poi_events)):
            event = poi_events[i]
            create_poi(token, event["title"], event["description"], event["location"], event["opening_times"], 
                       event["poi_type"], event["latitude"], event["longitude"], event["is_featured"], event["image_path"])

        # Create articles
        for i in range(len(articles_data)):
            article = articles_data[i]
            create_article(token, article['title'], article['content'], article['author'], 
                           article['description'], article['image_path'])

        # Create reports
        created_reports = []
        for report in reports_data:
            report_data = create_report(token, report['title'], report['description'], 
                                        report['status'], report['tags'], report['Author'])
            if report_data:
                created_reports.append(report_data)
        # Generate report discussions
        generate_report_discussions(token, created_reports)
        for i, report in enumerate(reports_data):
            if i < len(created_reports) and created_reports[i]:
                if report['status'] != 'open' and created_reports[i]:
                    update_report_status(token, created_reports[i]['id'], report['status'])
                random_upvotes = random.randint(0, 50)
                update_report_upvotes(token, created_reports[i]['id'], random_upvotes)

# Run the script
if __name__ == "__main__":
    main()