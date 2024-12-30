/**
 * index.js
 * 
 * This script scrapes the latest "AA Gent" articles from Sporza using Puppeteer
 * and then sends the titles and links to a specified Telegram chat using axios.
 */

require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
  try {
    /****************************************
     * 1. Puppeteer: Scrape Latest Articles
     ****************************************/
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to the Sporza search page
    await page.goto('https://sporza.be/nl/zoek/?p=1');

    // Type "AA Gent" in the search field
    await page.type(
      'input[placeholder="zoek sporten, competities, artikels, sporters, …"]',
      'AA Gent'
    );
    await page.keyboard.press('Enter');

    // Wait for the search results container to appear
    await page.waitForSelector('._grid_1al6m_26');

    // Extract the first 3 article titles and links
    const articles = await page.$$eval('._itemWrapper_15742_303', (items) =>
      items.slice(0, 3).map((item) => ({
        title: item.querySelector('._title_dzcnu_53').innerText.trim(),
        link: item.querySelector('a').href,
      }))
    );

    // Close the browser
    await browser.close();

    /****************************************
     * 2. Format the Message for Telegram
     ****************************************/
    let messageText = 'Here are the latest AA Gent articles:\n\n';
    articles.forEach((article, index) => {
      messageText += `${index + 1}. ${article.title}\n   ${article.link}\n\n`;
    });

    /****************************************
     * 3. Send Message to Telegram via Bot
     ****************************************/
    const token = process.env.TELEGRAM_BOT_TOKEN;  // Bot token from .env
    const chatId = process.env.TELEGRAM_CHAT_ID;   // Chat or group ID from .env
    const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await axios.post(telegramApiUrl, {
      chat_id: chatId,
      text: messageText,
    });

    // Check the response
    if (response.data.ok) {
      console.log('Telegram message sent successfully!');
    } else {
      console.error('Telegram API Error:', response.data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();