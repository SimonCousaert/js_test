# AA Gent Latest Articles Scraper

This project scrapes the latest "AA Gent" articles from [Sporza](https://sporza.be) using [Puppeteer](https://github.com/puppeteer/puppeteer). It then sends the titles and links to a specified Telegram chat via the [Telegram Bot API](https://core.telegram.org/bots/api) using [axios](https://axios-http.com/).

---

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Installation](#installation)  
3. [Usage](#usage)  
4. [Scheduling with Cron](#scheduling-with-cron)  
5. [Troubleshooting](#troubleshooting)  
6. [Project Structure](#project-structure)  
7. [License](#license)  

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)  
- npm (installed with Node.js)  
- A Telegram Bot token from [@BotFather](https://t.me/BotFather)  
- A Telegram Chat ID (private or group)  

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

```bash
npm install
```

This will install:  
- `puppeteer`  
- `dotenv`  
- `axios`  
- Any other dependencies listed in `package.json`  

### 3. Create Your `.env` File

Create a `.env` file in the root directory of the project:

```bash
cp .env.example .env
```

Then open `.env` in your editor and add:

```bash
TELEGRAM_BOT_TOKEN=<Your-Bot-Token>
TELEGRAM_CHAT_ID=<Your-Chat-ID>
```

**Important:** Do not commit this file to version control as it contains sensitive information.

---

## Usage

To run the script and scrape articles:

```bash
node index.js
```

What the script does:
	1.	Checks Previously Stored Articles
      - The script loads a local JSON file (e.g., storedArticles.json) to see which articles were fetched during the previous run.
	2.	Launches Puppeteer and Scrapes the First 3 Articles
	   - It navigates to Sporza’s search page, searches for “AA Gent,” and extracts the first 3 article titles and links.
	3.	Compares New vs. Stored Articles
	   - If any of the newly scraped articles do not match what’s in storedArticles.json, they are considered new.
	4.	Sends a Telegram Message (Only If There Are New Articles)
	   - If at least one new article is found, the script formats a Telegram message with the new titles/links and sends it via the Telegram Bot API.
	5.	Updates storedArticles.json
	   - Regardless of whether there were new articles or not, the script overwrites storedArticles.json with the latest 3 articles so subsequent runs can accurately compare old vs. new.
---

## Scheduling with Cron

You can automate this script using cron on Unix-like systems (Linux, macOS, etc.).

### 1. Verify Node.js and npm Installation

Ensure Node.js and npm are installed:

```bash
node -v
npm -v
```

### 2. Confirm the Script Runs Manually

Before scheduling, make sure your script runs without issues:

1. Navigate to your project directory:

   ```bash
   cd /path/to/your-project
   ```

2. Run the script:

   ```bash
   node index.js
   ```

3. Confirm it scrapes and sends the Telegram message successfully.

### 3. Locate Your Script’s Absolute Path

Find the absolute path to your `index.js` file. For example:

```bash
pwd
```

Suppose the output is:

```bash
/home/username/projects/puppeteer-pipeline
```

### 4. Edit Your Crontab

1. Open the crontab editor:

   ```bash
   crontab -e
   ```

2. Add a new cron job. For example, to run the script every day at 9:00 AM, add the following line:

   ```bash
   0 9 * * * cd /home/username/projects/puppeteer-pipeline && /usr/bin/node index.js >> /home/username/cron.log 2>&1
   ```

   Explanation:  
   - `0 9 * * *`: Cron schedule (minute, hour, day of month, month, day of week).  
   - `cd /home/username/projects/puppeteer-pipeline`: Navigate to your project directory.  
   - `/usr/bin/node index.js`: Run the script with Node.js. Replace `/usr/bin/node` with the output of `which node` if different.  
   - `>> /home/username/cron.log 2>&1`: Redirect both stdout and stderr to `cron.log` for logging.  

3. Save and exit the editor. In Vim, for example, press `Esc`, then type `:wq` and hit Enter.

### 5. Confirm the Cron Job is Active

List your cron jobs to ensure it’s added:

```bash
crontab -l
```

You should see your newly added line.

---

## Troubleshooting

- **Puppeteer Download Failures:** If Puppeteer fails to download Chromium, set `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` in your `.env` file or install Chromium manually.  
- **Environment Variables:** The cron environment may differ from your shell. Ensure `.env` is in the project directory and loaded correctly with `dotenv`.  
- **Invalid Chat ID or Token:** Double-check your Telegram Bot token and Chat ID. Use `@BotFather` to verify your token and methods like `getUpdates` to find your Chat ID.  
- **Permissions:** Ensure your user has permission to run cron jobs and that the script has execute/read permissions.  
- **Node.js Path Issues:** Verify the path to Node.js in your cron job. Use `which node` to find the correct path.  

---

## Project Structure

```plaintext
.
├── .gitignore
├── README.md
├── index.js
├── package.json
├── package-lock.json
└── .env.example
```

- `index.js`: The main script for scraping and sending Telegram messages.  
- `.env`: Stores sensitive information like `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` (do not commit this file).  
- `package.json` / `package-lock.json`: Manage project dependencies and versions.  
- `.gitignore`: Specifies files and directories to ignore in version control.  
- `README.md`: Project documentation.  

---

## License

MIT License.  
Feel free to use and modify this project as needed.  
