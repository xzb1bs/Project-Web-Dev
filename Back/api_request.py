import requests

url = "http://127.0.0.1:8000/task-list/"

headers = {
    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0OTg3NTYzLCJpYXQiOjE3NDQ5ODU3NjMsImp0aSI6IjE1MjkxYjdjYWY3NzQwMjBiYTE1ZjNhNzBhN2M4OTZkIiwidXNlcl9pZCI6MX0.SWfEBJOW0a0AXM5N1OlCDogqwN5Fathkgn2Gduqccmc" 
}

response = requests.get(url, headers=headers)

print("Status Code:", response.status_code)
print("Response Text:", response.text)

if response.status_code == 200:
    try:
        data = response.json()  
        print(data)
    except ValueError:
        print("Ответ не в формате JSON")
else:
    print(f"Ошибка: {response.status_code}")
