# CareBridge (React Native App)

This is the official repository for the CareBridge mobile app. We are building this project using **React Native** and **Expo**. This document explains how to get the project set up, how to run it on iOS, and—most importantly—how we use GitHub to work together.

If you're new to Git, GitHub, or team projects, please read the "GitHub Workflow" section carefully.

## 1. What You Need to Install First (Prerequisites)

Before you can run the project, you need a few things on your computer. Since we are developing for iOS, **you must be using a Mac.**

* **Node.js (LTS):** This runs JavaScript. [Download the "LTS" version here.](https://nodejs.org/)
* **Git:** This is the version control tool we use. [Download Git here.](https://git-scm.com/downloads)
* **Xcode:** This is Apple's official development tool. You **must** install this to run the iOS simulator. Get it from the [Mac App Store](https://apps.apple.com/us/app/xcode/id497799835).

## 2. Getting the Project Code (Installation)

Once you have the prerequisites, open your **Terminal** and follow these steps.

1.  **Clone the Repository:** This downloads a copy of the project from GitHub.
    ```bash
    git clone [Your-Project-Git-URL.git]
    ```

2.  **Go into the Project Folder:**
    ```bash
    cd CareBridge
    ```

3.  **Install Dependencies:** This downloads all the code libraries the project needs.
    ```bash
    npm install
    ```

## 3. How to Run the App (for iOS)

You can run the app in two ways: on your physical iPhone (easiest) or on a virtual Simulator (best for development).

### Option 1: On Your iPhone (Expo Go)

This is the fastest way to see the app running.

1.  **Install Expo Go on Your iPhone:** Get it from the [App Store](https://apps.apple.com/us/app/expo-go/id982107779).
2.  **Start the Project Server:** From your project's folder in your terminal, run:
    ```bash
    npx expo start
    ```
3.  **Scan the QR Code:**
    * Your terminal will show a large QR code.
    * Open your iPhone's regular Camera app and point it at the QR code. A pop-up will appear to open it in Expo Go.

The app will now load and run on your phone. When you save code changes, the app will update automatically.

### Option 2: On an iOS Simulator (macOS Only)

Running a "virtual phone" on your computer is highly recommended for development.

1.  **Install Xcode:** If you haven't already, install it from the Mac App Store.
2.  **Install Simulator Components:** Once installed, open Xcode. Go to **Xcode > Settings > Components** and install the iOS Simulator version you want to test.
3.  **Run the Simulator:**
    * Start your project (if it's not already running):
        ```bash
        npx expo start
        ```
    * In the *same terminal* where the project is running, press the `i` key.
    * This will automatically open the iOS Simulator and launch the CareBridge app.

## 4. Our GitHub Workflow (How We Work Together)

This is the most important section for working as a team. To prevent everyone from overwriting each other's work, we follow a strict process.

### The Main Rule: NEVER push your code directly to the `main` branch.

We use a "one-branch-per-person" model. You will have your own personal branch named after you (e.g., `jayden-vinson`), and you will only push your code to that branch.

---

### Your Step-by-Step Git Process

#### Step 1: Get the Latest Updates
Before you start working, *always* make sure you have the latest version of the `main` branch.

```bash
# 1. Switch back to the main branch
git checkout main

# 2. "Pull" all the new changes from GitHub
git pull origin main
```

#### Step 2: Go to Your Personal Branch

* **If it's your FIRST time:** Create your branch. You only do this once.
    ```bash
    # Use your name, lowercase, with a hyphen.
    # Example: git checkout -b jayden-vinson
    git checkout -b your-full-name
    ```

* **If you ALREADY have a branch:** Just switch to it.
    ```bash
    # Example: git checkout jayden-vinson
    git checkout your-full-name
    ```

#### Step 3: Do Your Work
Write your code, make your changes, and save your files.

#### Step 4: Save Your Work (Commit)
When you've finished a task (or at the end of the day), you need to "commit" (save) your changes to Git.

```bash
# 1. Stage all your changed files
git add .

# 2. Commit them with a *descriptive* message
# Good message: "feat: Added login button to home screen"
# Bad message: "updated files" or "stuff"
git commit -m "Your descriptive message here"
```
#### Step 5: Push Your Branch to GitHub
This uploads your saved commits from your computer to your personal branch on GitHub.

* **If it's your FIRST time pushing this branch:**
    ```bash
    # The -u flag links your local branch to the remote one
    # Example: git push -u origin jayden-vinson
    git push -u origin your-full-name
    ```

* **Every time after that:**
    ```bash
    git push
    ```

#### Step 6: Create a Pull Request (PR)
When your feature is 100% finished and ready to be added to the main project, you will create a **Pull Request (PR)**. This is how you formally "request" to "pull" your changes into the `main` branch.

1.  Go to the CareBridge repository page on GitHub.
2.  You will see a yellow box or a green button that says **"Compare & pull request"** for your branch. Click it.
3.  Give your PR a clear title (e.g., "Login Page UI") and write a short description of what you did.
4.  Click **"Create pull request"**.

Do not push directly to the main branch. It messes up the git history 
