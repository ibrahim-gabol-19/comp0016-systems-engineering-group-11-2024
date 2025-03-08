import requests
import random
from geopy.distance import geodesic

# API URL and endpoints
# BASE_URL = "https://sysenggroup11-ehbrckafd4c6b9cv.uksouth-01.azurewebsites.net"
BASE_URL = "http://127.0.0.1:8000"

SIGNUP_URL = f"{BASE_URL}/api/auth/signup/"
LOGIN_URL = f"{BASE_URL}/api/auth/login/"
EVENTS_URL = f"{BASE_URL}/events/"
CMS_ARTICLES_URL = f"{BASE_URL}/articles/"
POI_URL = f"{BASE_URL}/events/"
REPORTS_URL = f"{BASE_URL}/reports/"

# Account credentials
EMAIL = "ExampleBusiness@e.com"
PASSWORD = "1ExampleBusiness*"
USERNAME = "ExampleBusiness"

# London related data
LONDON_LOCATIONS = [
    "Big Ben, Westminster, London, Greater London, England",
    "London Eye, South Bank, London, Greater London, England",
    "Trafalgar Square, Westminster, London, Greater London, England",
    "Buckingham Palace, Westminster, London, Greater London, England",
    "Tower of London, Tower Hill, London, Greater London, England"
]

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


import datetime

# def create_event(token, title, description, location, event_time):
#     headers = {"Authorization": f"Bearer {token}"}

#     # Get today's date and the current week range (starting from Sunday)
#     today = datetime.date.today()
#     start_of_week = today - datetime.timedelta(days=today.weekday())  # Monday
#     days_of_week = [start_of_week + datetime.timedelta(days=i) for i in range(7)]  # Days in this week

#     # Randomly choose a day from the current week
#     event_date = random.choice(days_of_week)

#     data = {
#         "title": title,
#         "description": description,
#         "location": location,
#         "event_type": "scheduled",
#         "date": event_date.isoformat(),  # Format date to YYYY-MM-DD
#         "time": event_time,
#         "latitude": 51.5074,  # Approximate latitude for London
#         "longitude": -0.1278  # Approximate longitude for London
#     }

#     response = requests.post(EVENTS_URL, headers=headers, data=data)
#     if response.status_code == 201:
#         print(f"Event '{title}' created successfully on {event_date}.")
#     else:
#         print(f"Error creating event '{title}':", response.text)

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

# Function to create points of interest (POI)

# def create_poi(token, title, description, location):
#     headers = {"Authorization": f"Bearer {token}"}
    
#     # Randomly choose a poi_type
#     poi_type = random.choice(["landmarks", "museums", "parks"])
    
#     data = {
#         "title": title,
#         "description": description,
#         "location": location,
#         "poi_type": poi_type,
#         "event_type": "point_of_interest",
#         "latitude": 51.5074,  # Approximate latitude for London
#         "longitude": -0.1278  # Approximate longitude for London
#     }
    
#     response = requests.post(POI_URL, headers=headers, data=data)
#     if response.status_code == 201:
#         print(f"POI '{title}' created successfully with type '{poi_type}'.")
#     else:
#         print(f"Error creating POI '{title}':", response.text)

# Function to create reports
def create_report(token, title, description):
    headers = {"Authorization": f"Bearer {token}"}

        # Random dispersion around the original latitude and longitude (within a few hundred meters)
    def generate_random_location(lat, lon, max_dispersion_meters=10000):
        # Generate a random distance and bearing
        random_distance = random.uniform(0, max_dispersion_meters)  # Random distance in meters
        random_bearing = random.uniform(0, 360)  # Random bearing in degrees

        # Get the new location using geopy
        origin = (lat, lon)
        new_location = geodesic(kilometers=random_distance / 1000).destination(origin, random_bearing)
        return new_location.latitude, new_location.longitude

    # Generate the new random latitude and longitude within a few hundred meters
    new_latitude, new_longitude = generate_random_location(51.47796, -0.23283)
    new_latitude = round(new_latitude, 6)
    new_longitude = round(new_longitude, 6)
    data = {
        "title": title,
        "description": description,
        "author": "Example Author",
        "longitude": (None, str(new_longitude)),
        "latitude": (None, str(new_latitude)),
        "tags": "environmental"
    }
    response = requests.post(REPORTS_URL, headers=headers, data=data)
    if response.status_code == 201:
        print(f"Report '{title}' created successfully.")
    else:
        print(f"Error creating report '{title}':", response.text)
import random
import requests
import random
import requests
import datetime

# Sample London-related data
LONDON_LOCATIONS = [
    {"name": "Big Ben", "latitude": 51.5007, "longitude": -0.1246},
    {"name": "London Eye", "latitude": 51.5033, "longitude": -0.1196},
    {"name": "Buckingham Palace", "latitude": 51.5014, "longitude": -0.1419},
    {"name": "Tower of London", "latitude": 51.5081, "longitude": -0.0759},
    {"name": "British Museum", "latitude": 51.5194, "longitude": -0.1270}
]

articles_data = [
    {"title": "Discovering London's History", "content": "Explore London's rich history, from the Roman era to the present day. Famous landmarks like the Tower of London and Buckingham Palace tell the stories of British monarchy and civilization."},
    {"title": "A Guide to London’s Iconic Landmarks", "content": "From Big Ben to the London Eye, London boasts some of the most famous landmarks in the world. These iconic sites attract millions of tourists every year, offering breathtaking views and historic significance."},
    {"title": "The Best Parks in London", "content": "London offers a variety of green spaces for relaxation and leisure. Hyde Park, Regent’s Park, and Hampstead Heath are just a few of the many parks that provide peace and tranquility amidst the hustle and bustle of the city."},
    {"title": "A Walk Through London’s Museums", "content": "London is home to some of the world’s most renowned museums. The British Museum, Natural History Museum, and Tate Modern showcase everything from ancient artifacts to contemporary art."},
    {"title": "Exploring the Thames River", "content": "The River Thames is the lifeblood of London, with bridges like Tower Bridge and London Bridge providing vital connections across the city. A boat ride along the Thames offers a unique perspective on London's history and architecture."}
]

reports_data = [
    {"title": "London’s Air Quality Crisis", "content": "London's air quality remains a significant concern, with levels of nitrogen dioxide (NO2) exceeding safe limits in many areas. The city's reliance on diesel vehicles and congestion are major contributors to air pollution."},
    {"title": "Waste Management Challenges in London", "content": "Waste management in London is becoming increasingly difficult as the population grows. Efforts to reduce waste through recycling programs and waste-to-energy technologies are underway, but challenges persist in reducing landfill use."},
    {"title": "The Pothole Problem in London", "content": "Potholes are a growing issue across London, causing damage to vehicles and posing safety risks to cyclists and pedestrians. Despite ongoing repair efforts, many roads still face significant maintenance challenges."},
    {"title": "Urban Heat Island Effect in London", "content": "London is experiencing the urban heat island effect, where built-up areas become significantly warmer than surrounding rural areas. This exacerbates the impact of heatwaves and contributes to poor air quality, creating challenges for public health and infrastructure."},
    {"title": "Flooding Risks and Drainage Issues in London", "content": "Heavy rainfall and rising sea levels pose significant flooding risks for London, especially in low-lying areas. The city's drainage infrastructure is struggling to cope with increasingly frequent and intense storms."},
    {"title": "Green Space Preservation in London", "content": "As London's population grows, preserving and expanding green spaces is becoming more challenging. Parks like Hyde Park and Hampstead Heath are vital for residents' well-being, but urban development pressures threaten these spaces."},
    {"title": "Plastic Waste Crisis in London", "content": "Plastic waste continues to be a major environmental issue in London, with millions of plastic bottles and packaging items discarded every day. The city is taking steps to reduce plastic use, including initiatives to ban single-use plastics in public spaces."},
    {"title": "The Impact of London's Public Transportation on Pollution", "content": "While London’s public transport system is among the largest in the world, it still contributes to the city's pollution. Efforts are being made to electrify buses and improve the sustainability of the city's trains and taxis."},
    {"title": "Noise Pollution in London", "content": "Noise pollution in London is reaching levels that affect residents' health and well-being. Major sources of noise include traffic, construction work, and air traffic. Authorities are working on measures to mitigate this growing problem."},
    {"title": "Sustainability of London's Food Systems", "content": "London's food systems are facing sustainability challenges, including food waste, food insecurity, and the environmental impact of food transportation. There are growing calls for local food sourcing and reducing the carbon footprint of food consumption."}
]

events = [
    {
        "event_title": "Thames River Cleanup",
        "event_description": "Join us for a community-driven Thames River cleanup! Help us remove waste and protect London's iconic river while learning about local water ecosystems.",
        "location": "South Bank",
        "time": "09:00",
        "theme": "Sustainability"
    },
    {
        "event_title": "AI Walk: Exploring Smart City Solutions in London",
        "event_description": "Take part in a guided walk through central London and discover how AI is being used to make the city smarter and more sustainable. Visit areas implementing innovative tech like smart lighting and waste management.",
        "location": "Covent Garden",
        "time": "11:00",
        "theme": "AI"
    },
    {
        "event_title": "Green Spaces Walk: Exploring Sustainable Gardens in London",
        "event_description": "Join us for a relaxing walk through some of London’s most sustainable green spaces. From urban gardens to eco-conscious parks, learn how nature and sustainability coexist in the heart of the city.",
        "location": "Hyde Park",
        "time": "14:00",
        "theme": "Sustainability"
    },
    {
        "event_title": "Community Litter Pick at Regent’s Canal",
        "event_description": "Help us keep Regent’s Canal clean and beautiful by joining our community litter pick. Together, we can help protect London's waterways and promote a cleaner, greener city.",
        "location": "Regent's Canal",
        "time": "10:00",
        "theme": "Sustainability"
    },
    {
        "event_title": "Green London Walking Tour: Eco-Innovations and Urban Sustainability",
        "event_description": "Join a guided walking tour through London’s greenest streets, learning about the city’s sustainability projects, from green roofs to zero-waste initiatives. See how London is becoming a model for eco-friendly urban living.",
        "location": "Shoreditch",
        "time": "13:30",
        "theme": "Sustainability"
    },
    {
        "event_title": "Smart Cities Hackathon: Building the Future of London",
        "event_description": "A hands-on hackathon where tech enthusiasts can come together to solve real-world urban challenges using AI. Teams will work on projects that make London a more sustainable and tech-forward city.",
        "location": "King’s Cross",
        "time": "09:30",
        "theme": "AI"
    },
    {
        "event_title": "Urban Gardening Workshop",
        "event_description": "Learn how to create your own urban garden in this hands-on workshop. From rooftop gardens to balcony plants, discover sustainable ways to grow your own food in the heart of London.",
        "location": "Camden",
        "time": "16:00",
        "theme": "Sustainability"
    },
    {
        "event_title": "Tree Planting in the City: A Green Initiative",
        "event_description": "Be part of London’s green future by helping to plant trees in one of the city’s many open spaces. This event is a great opportunity to make a tangible impact on the environment while enjoying the outdoors.",
        "location": "Victoria Park",
        "time": "10:30",
        "theme": "Sustainability"
    }
]

company_data = {"title"}

# Function to create events with dynamic titles and descriptions
def create_event(token, title, description, location, event_time):
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get today's date and the current week range (starting from Sunday)
    today = datetime.date.today()
    start_of_week = today - datetime.timedelta(days=today.weekday())  # Monday
    days_of_week = [start_of_week + datetime.timedelta(days=i) for i in range(7)]  # Days in this week

    # Randomly choose a day from the current week
    event_date = random.choice(days_of_week)

    data = {
        "title": title,
        "description": description,
        "location": location,
        "event_type": "scheduled",
        "date": event_date.isoformat(),  # Format date to YYYY-MM-DD
        "time": event_time,
        "latitude": 51.5074,  # Approximate latitude for London
        "longitude": -0.1278  # Approximate longitude for London
    }

    response = requests.post(EVENTS_URL, headers=headers, data=data)
    if response.status_code == 201:
        print(f"Event '{title}' created successfully on {event_date}.")
    else:
        print(f"Error creating event '{title}':", response.text)

# Function to create POIs with dynamic titles and descriptions
def create_poi(token, title, description, location):
    headers = {"Authorization": f"Bearer {token}"}
    
    # Randomly choose a poi_type
    poi_type = random.choice(["landmarks", "museums", "parks"])
    
    # Randomly generate a description for the POI
    poi_descriptions = [
        f"Explore the beauty and history of {location['name']}, one of London's most iconic landmarks.",
        f"Discover the significance of {location['name']} and its role in shaping London’s culture.",
        f"Visit {location['name']} for an unforgettable experience and a deeper understanding of London's heritage."
    ]
    
    description = random.choice(poi_descriptions)

    data = {
        "title": title,
        "description": description,
        "location": location['name'],
        "poi_type": poi_type,
        "event_type": "point_of_interest",
        "latitude": location['latitude'],
        "longitude": location['longitude']
    }
    
    response = requests.post(POI_URL, headers=headers, data=data)
    if response.status_code == 201:
        print(f"POI '{title}' created successfully with type '{poi_type}'.")
    else:
        print(f"Error creating POI '{title}':", response.text)

# Main execution flow
def main():
    signup()
    token = login()
    if token:
        # Create 5 events with dynamic titles and descriptions
        for i in range(5):
            event = events[i]
            create_event(token, event["event_title"], event["event_description"], event["location"], event["time"])
        # Create 5 articles
        for i in range(5):
            article = articles_data[i]
            create_article(token, article['title'], article['content'], "Author", f"Description for {article['title']}")

        # Create 5 POIs with dynamic titles and descriptions
        for i in range(5):
            poi_title = f"Explore {LONDON_LOCATIONS[i]['name']}"
            create_poi(token, poi_title, f"Discover the fascinating history and beauty of {LONDON_LOCATIONS[i]['name']}.", LONDON_LOCATIONS[i])

        # Create 10 reports
        for i in range(10):
            report = reports_data[i]
            create_report(token, report['title'], report['content'])
    else:
        print("Failed to login and obtain token.")

# Run the script
if __name__ == "__main__":
    main()