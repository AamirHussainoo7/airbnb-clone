# 🏠 Airbnb Clone — Prompt History (AGENTS.md)

A chronological record of all the important prompts used to build, debug, and deploy this project.

---

## 📦 Phase 1 — Project Initialization & Build

### 1. Initial Project Request

> The project was kicked off by opening the reference site `https://airbnb-clone-umber-two.vercel.app/` in the browser and asking to build a pixel-perfect full-stack clone of it.

**Stack decided:**
- Frontend: React (Vite) + Vanilla CSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt
- Media: Cloudinary (image uploads)

```
continue
```

---

### 2. Seeding the Database

```
mongodb+srv://aamithussain786_db_user:***@cluster0.bvwlake.mongodb.net/?appName=Cluster0

this is mongo_URI. add all data it frontend looks quite empty.
```

---

### 3. Continue with Database Setup

```
continue with database
```

---

### 4. MongoDB Atlas IP Whitelist Fix

```
i have addded 0.0.0.0/0 in ip check now
```

---

### 5. Continue Building

```
continue
```

---

## 🎨 Phase 2 — UI / Frontend Fixes

### 6. Homepage Layout Fix

```
in the main homepage lot of space is left in left and right site should look like this
```

### 7. Login Modal Positioning

```
Login panel coming in the side right should come in the middle
```

### 8. Reserve Panel Visibility

```
there is UI problem with the component with reserve and Price on it, its not fully visible until we scroll down . fix it
```

### 9. Wishlist Feature (Empty Page Bug)

```
whislist not working, shows an empty page
```

```
wishlist
```

### 10. Airbnb Logo in Navbar

```
use airbnb icon for title at top
```

---

## 🐛 Phase 3 — Debugging Prompts

### 11. Sign Up Error

```
when i try to sign up it says next is not a function
```

---

## 🚀 Phase 4 — Deployment (Render + Vercel)

### 12. Deployment Instructions

```
now the project is ready I want to deploy backend on render and frontend on vercel. give intrustions
```

### 13. .gitignore & Security

```
env are exposed, make gitignore files
```

### 14. Accidentally Pushed .env to GitHub

```
i mistakly push env files to github, now i added gitignore files but how to remove them from ther
```

### 15. Production URLs Setup + README Request

```
https://airbnb-clone-6diw.onrender.com/api - this is render url, https://airbnb-clone-five-ashen.vercel.app/ - vercel url. make chaanges, write a proper readme file
```

### 16. Frontend Not Working with Render Backend

```
i have deployed backend on render but there is problem its not running working with vercel
```

### 17. Render URL Shows "Dangerous Site"

```
 there is problem with render or mongo url expose something when i go on https://airbnb-clone-6diw.onrender.com
it shows Dangerous site
Attackers on the site you tried visiting might trick you into installing software or revealing things like your passwords, phone, or credit card numbers. Chrome strongly recommends going back to safety. Learn more about this warning. finds what the problem why its not working in production but working in local machine
```

### 18. New Render Deployment Shows "Not Found"

```
i changed the mongodb url password and created a fresh deployment in render with
https://airbnb-clone-hn3o.onrender.com/api
it shows Not Found
```

### 19. Still Getting Dangerous Warning

```
it still shows dangerous msg
```

### 20. Render Config Shared for Diagnosis

```
i tested https://airbnb-clone-hn3o.onrender.com/ in incognito mode it says Cannot GET / and here are my render data -
Name: airbnb-clone
Region: Oregon (US West)
Instance Type: Free (0.1 CPU, 512 MB)
Source: https://github.com/AamirHussainoo7/airbnb-clone
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: node server.js
```

---

## 📝 Phase 5 — README & Documentation

### 21. Rewrite README for GitHub

```
rewrite the readme file for github
```

### 22. Add Screenshots to README

```
i want added some images in images folder in root use them in readme files
```

---

## 💬 Phase 6 — Project Submission Q&A

### 23. Prep for Submission Questions

```
So now i have to submit this project, it will ask some question, give short and humanise answer based on what we did.
```

### 24. Time Taken Question

```
How long did it take, and what took the most time?
```

```
give 2- 3 line answer
```

### 25. Implementation Steps Question

```
Describe the steps you followed for implementing the assignment
try to give small answer and humanise it
```

```
add few lines for Ui
```

### 26. Code Quality Question

```
How did you ensure code quality? What features did you skip, if anything
small and humasie answer
```

---

## 📋 Phase 7 — This File

### 27. Prompt History Request

```
make a agents.md or txt files, contaning all the prompts i gave you for making this project starting to end, include important prompts and important debugging prompts i asked, ignore rest
```

```
if you can give more deatils to prompt like exactly what was prompt
```

---

## 🔗 Live URLs

| Service  | URL |
|----------|-----|
| Frontend | https://airbnb-clone-five-ashen.vercel.app/ |
| GitHub   | https://github.com/AamirHussainoo7/airbnb-clone |
