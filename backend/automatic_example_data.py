import requests
import random
from geopy.distance import geodesic
import random
import requests
import random
import requests
import subprocess  # Import the subprocess module




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

scheduled_events = [
    {
        "title": "Bird Watching in St. James's Park",
        "description": "Join our guided bird watching tour in St. James's Park. Discover the diverse bird species that call this park home. Binoculars provided. Please wear comfortable shoes.",
        "location": "St. James's Park",
        "date": "2025-03-11",
        "time": "15:00",
        "theme": "Nature",
        "latitude": 51.5033,
        "longitude": -0.1300,
        "is_featured": "True"
    },
    {
        "title": "Thames River Cleanup",
        "description": "Join us for a community-driven Thames River cleanup! Help us remove waste and protect London's iconic river while learning about local water ecosystems.",
        "location": "South Bank",
        "date": "2025-03-10",
        "time": "12:00",
        "theme": "Sustainability",
        "latitude": 51.5074, 
        "longitude": -0.1278, 
        "is_featured": "False"
    },
    {
        "title": "Community Garden Planting",
        "description": "Help us plant new flowers and vegetables in our local community garden. Learn about organic gardening and meet your neighbors! \n Please bring your own gardening gloves.",
        "location": "Regent's Park",
        "date": "2025-03-03",
        "time": "10:00",
        "theme": "Sustainability",
        "latitude": 51.5304,
        "longitude": -0.1520,
        "is_featured": "False"
    },
    {
        "title": "Local History Walk",
        "description": "Discover hidden historical gems in the City of London with our guided walking tour. Learn about the area's rich past.",
        "location": "Guildhall",
        "date": "2025-03-05",
        "time": "14:00",
        "theme": "Community",
        "latitude": 51.5147,
        "longitude": -0.0911,
        "is_featured": "False"
    },
    {
        "title": "Upcycled Art Workshop",
        "description": "Create unique art pieces using recycled materials. Learn creative techniques and reduce waste.",
        "location": "Barbican Centre",
        "date": "2025-03-07",
        "time": "18:00",
        "theme": "Sustainability",
        "latitude": 51.5205,
        "longitude": -0.0936,
        "is_featured": "False"
    },
    {
        "title": "Morning Fitness Jog",
        "description": "Start your day with an energizing morning jog through Hyde Park. All fitness levels are welcome!",
        "location": "Hyde Park",
        "date": "2025-03-11",
        "time": "07:00",
        "theme": "Community",
        "latitude": 51.5073,
        "longitude": -0.1657,
        "is_featured": "False"
    },
    {
        "title": "Local Produce Market",
        "description": "Support local farmers and businesses at our weekly produce market. Fresh fruits, vegetables, and artisanal goods.",
        "location": "Borough Market",
        "date": "2025-03-12",
        "time": "09:00",
        "theme": "Community",
        "latitude": 51.5056,
        "longitude": -0.0909,
        "is_featured": "True"
    },
    {
        "title": "Urban Wildlife Workshop",
        "description": "Learn about the wildlife that thrives in London's urban environment. Discover how to create wildlife-friendly spaces.",
        "location": "Victoria Park",
        "date": "2025-03-13",
        "time": "16:00",
        "theme": "Nature",
        "latitude": 51.5367,
        "longitude": -0.0306,
        "is_featured": "False"
    },
    {
        "title": "Riverboat Tour: Thames Discovery",
        "description": "Embark on a scenic riverboat tour along the Thames. Explore London's landmarks from a unique perspective.",
        "location": "Tower Bridge",
        "date": "2025-03-13",
        "time": "13:00",
        "theme": "Community",
        "latitude": 51.5055,
        "longitude": -0.0754,
        "is_featured": "False"
    },
    {
        "title": "Community Book Swap",
        "description": "Bring your old books and swap them for new reads at our community book swap. A great way to recycle and discover new authors.",
        "location": "Southwark Library",
        "date": "2025-03-14",
        "time": "13:00",
        "theme": "Community",
        "latitude": 51.5019,
        "longitude": -0.0984,
        "is_featured": "True"
    },
    {
        "title": "Community yoga in the park",
        "description": "Join our community yoga session in the park. Relax, stretch, and connect with nature.",
        "location": "Green Park",
        "date": "2025-03-15",
        "time": "9:00",
        "theme": "Community",
        "latitude": 51.5033,
        "longitude": -0.1419,
        "is_featured": "False"
    },
    {
        "title": "Green Living Seminar",
        "description": "Learn practical tips for sustainable living. Reduce your carbon footprint and make a positive impact on the environment.",
        "location": "City Hall",
        "date": "2025-03-15",
        "time": "11:00",
        "theme": "Sustainability",
        "latitude": 51.5045,
        "longitude": -0.0805,
        "is_featured": "False"
    },
    {
        "title": "Sunday Cycle Ride",
        "description": "Enjoy a leisurely cycle ride along the Regent's Canal. Explore London's hidden waterways and enjoy the scenery.",
        "location": "Regent's Canal",
        "date": "2025-03-16",
        "time": "10:00",
        "theme": "Community",
        "latitude": 51.5350,
        "longitude": -0.1000,
        "is_featured": "False"
    },
    {
        "title": "Art in the Park",
        "description": "Join us for an outdoor art session in Battersea Park. Bring your own materials or use ours. All skill levels welcome.",
        "location": "Battersea Park",
        "date": "2025-03-18",
        "time": "14:00",
        "theme": "Community",
        "latitude": 51.4770,
        "longitude": -0.1583,
        "is_featured": "False"
    },
    {
        "title": "Recycling Workshop",
        "description": "Learn the ins and outs of recycling in London. Understand what can and cannot be recycled and how to do it effectively.",
        "location": "Islington Ecology Centre",
        "date": "2025-03-20",
        "time": "17:00",
        "theme": "Sustainability",
        "latitude": 51.5361,
        "longitude": -0.1060,
        "is_featured": "False"
    },
    {
        "title": "Community Choir Practice",
        "description": "Join our friendly community choir for a fun singing session. All voices welcome!",
        "location": "Spitalfields Community Centre",
        "date": "2025-03-22",
        "time": "19:00",
        "theme": "Community",
        "latitude": 51.5188,
        "longitude": -0.0717,
        "is_featured": "False"
    },
    {
        "title": "Sustainable Cooking Class",
        "description": "Learn how to cook delicious and sustainable meals using locally sourced ingredients. Reduce food waste and eat healthy.",
        "location": "Hackney City Farm",
        "date": "2025-03-24",
        "time": "18:30",
        "theme": "Sustainability",
        "latitude": 51.5435,
        "longitude": -0.0536,
        "is_featured": "False"
    },
    {
        "title": "Nature Photography Walk",
        "description": "Capture the beauty of London's parks and wildlife on our guided photography walk. Learn tips and tricks for stunning nature shots.",
        "location": "Hampstead Heath",
        "date": "2025-03-26",
        "time": "15:30",
        "theme": "Nature",
        "latitude": 51.5607,
        "longitude": -0.1653,
        "is_featured": "False"
    },
    {
        "title": "Community Yoga Class",
        "description": "Relax and unwind with our community yoga class in Greenwich Park. Suitable for all levels, bring your own mat.",
        "location": "Greenwich Park",
        "date": "2025-03-28",
        "time": "08:30",
        "theme": "Community",
        "latitude": 51.4769,
        "longitude": -0.0005,
        "is_featured": "False"
    },
    {
        "title": "Zero Waste Workshop",
        "description": "Discover the principles of zero waste living and how to reduce your environmental impact. Practical tips and advice for sustainable living.",
        "location": "Walthamstow Wetlands",
        "date": "2025-03-30",
        "time": "16:00",
        "theme": "Sustainability",
        "latitude": 51.6014,
        "longitude": -0.0265,
        "is_featured": "False"
    },
    {
        "title": "Community Gardening Day",
        "description": "Join us for a day of community gardening at Kew Gardens. Help plant flowers, herbs, and vegetables in our shared garden space.",
        "location": "Kew Gardens",
        "date": "2025-04-01",
        "time": "10:00",
        "theme": "Community",
        "latitude": 51.4785,
        "longitude": -0.2956,
        "is_featured": "False"
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
        "opening_times": "Mon- Fri 09:00-17:00"
    },
    {
        "title": "Visit the London Eye",
        "description": "Experience breathtaking views of London from the London Eye. A must-visit attraction for tourists and locals alike.",
        "location": "London Eye, South Bank, London, Greater London, England",
        "poi_type": "landmarks",
        "latitude": 51.5033,
        "longitude": -0.1196,
        "is_featured": "False",
        "opening_times": "Everyday 10:00-20:30"
    },
    {
        "title": "Explore Trafalgar Square",
        "description": "Discover the history and cultural significance of Trafalgar Square. Home to Nelson's Column and the National Gallery.",
        "location": "Trafalgar Square, Westminster, London, Greater London, England",
        "poi_type": "landmarks",
        "latitude": 51.5074,
        "longitude": -0.1278,
        "is_featured": "False",
        "opening_times": "24/7"
    },
    {
        "title": "Tour Buckingham Palace",
        "description": "Experience the grandeur of Buckingham Palace, the official residence of the British monarch. Witness the Changing of the Guard ceremony.",
        "location": "Buckingham Palace, Westminster, London, Greater London, England",
        "poi_type": "landmarks",
        "latitude": 51.5014,
        "longitude": -0.1419,
        "is_featured": "False",
        "opening_times": "Wed-Sun 09:30-17:30"
    },
    {
        "title": "Visit the Tower of London",
        "description": "Explore the Tower of London, a historic castle and fortress on the banks of the River Thames. Home to the Crown Jewels and centuries of history.",
        "location": "Tower of London, Tower Hill, London, Greater London, England",
        "poi_type": "landmarks",
        "latitude": 51.5081,
        "longitude": -0.0759,
        "is_featured": "False",
        "opening_times": "Tue-Sat 09:00-17:30"
    },
    {
        "title": "Discover the British Museum",
        "description": "Immerse yourself in world history and culture at the British Museum. Home to a vast collection of artifacts from ancient civilizations.",
        "location": "British Museum, Great Russell St, Bloomsbury, London, England",
        "poi_type": "museums",
        "latitude": 51.5194,
        "longitude": -0.1270,
        "is_featured": "False",
        "opening_times": "Every day 10:00-17:30"
    },
    {
        "title": "Explore the Natural History Museum",
        "description": "Journey through the natural world at the Natural History Museum. Discover dinosaurs, gemstones, and interactive exhibits for all ages.",
        "location": "Natural History Museum, Cromwell Rd, South Kensington, London, England",
        "poi_type": "museums",
        "latitude": 51.4966,
        "longitude": -0.1764,
        "is_featured": "False",
        "opening_times": "Every day 10:00-17:50"
    },
    {
        "title": "Hyde Park: London's Green Oasis",
        "description": "Escape the city hustle and bustle in Hyde Park. Enjoy picnics, boating, and leisurely walks in one of London's largest parks.",
        "location": "Hyde Park, London, England",
        "poi_type": "parks",
        "latitude": 51.5073,
        "longitude": -0.1657,
        "is_featured": "False",
        "opening_times": ""
    },
    {
        "title": "Regent's Park: A Botanical Haven",
        "description": "Stroll through Regent's Park and admire its stunning gardens and wildlife. Visit the Queen Mary's Rose Garden and London Zoo.",
        "location": "Regent's Park, London, England",
        "poi_type": "parks",
        "latitude": 51.5304,
        "longitude": -0.1520,
        "is_featured": "False",
        "opening_times": ""
    },
    {
        "title": "Kew Gardens: A World of Plants",
        "description": "Explore the diverse plant life at Kew Gardens, a UNESCO World Heritage Site. Discover glasshouses, treetop walks, and botanical wonders.",
        "location": "Kew Gardens, Richmond, London, England",
        "poi_type": "parks",
        "latitude": 51.4785,
        "longitude": -0.2956,
        "is_featured": "False",
        "opening_times": "Every day 10:00-18:00"
    }
]





# Function to create events with dynamic titles and descriptions
def create_event(token, title, description, location, date, time, latitude, longitude, is_featured):
    headers = {"Authorization": f"Bearer {token}"}

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

    response = requests.post(EVENTS_URL, headers=headers, data=data)
    if response.status_code == 201:
        print(f"Event '{title}' created successfully on {date}.")
    else:
        print(f"Error creating event '{title}':", response.text)

def create_poi(token, title, description, location, opening_times, poi_type, latitude, longitude, is_featured):
    headers = {"Authorization": f"Bearer {token}"}
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
    
    response = requests.post(POI_URL, headers=headers, data=data)
    if response.status_code == 201:
        print(f"POI '{title}' created successfully with type '{poi_type}'.")
    else:
        print(f"Error creating POI '{title}':", response.text)

def createComponyInformation(token):
    headers = {"Authorization": f"Bearer {token}"}
    data = {
            "name":"London City Council",
            "about":"This is London City Council.",
            "logo":None, 
            "main_color":"#8ff095",
            "font":"Arial",
            "sw_lat" : 51.341875,
            "sw_lon": -0.29222,  
            "ne_lat": 51.651675,  
            "ne_lon": 0.01758
        }
    response = requests.post(COMPANY_INFORMATION_URL, headers=headers, data=data)
    if response.status_code == 201:
        print(f"Company information created successfully.")
    else:
        print(f"Error creating company information:", response.text)



# Main execution flow
def main():
    # Flush the database before populating it
    try:
        subprocess.run(["py", "-3.11", "-m", "manage", "flush"], check=True)
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
            create_event(token, event["title"], event["description"], event["location"], event["date"], event["time"], event["latitude"], event["longitude"], event["is_featured"])
        for i in range(len(poi_events)):
            event = poi_events[i]
            create_poi(token, event["title"], event["description"], event["location"], event["opening_times"], event["poi_type"], event["latitude"], event["longitude"], event["is_featured"])
        # Create articles
        for i in range(5):
            article = articles_data[i]
            create_article(token, article['title'], article['content'], "Author", f"Description for {article['title']}")

        # Create 10 reports
        for i in range(10):
            report = reports_data[i]
            create_report(token, report['title'], report['content'])
    else:
        print("Failed to login and obtain token.")

# Run the script
if __name__ == "__main__":
    main()