const axios = require("axios");
require("dotenv").config();
const connection2 = require("../configs/db-connection.js").connection2;
const authController = require('../controllers/auth');

const apiKey = process.env.OPENAI_API_KEY;

const max_tokens = 1024;

async function generateResult(mbti, user_mbti, word) {
  try {
    // Query database for related articles
    const result = await new Promise((resolve, reject) => {
      connection2.query(
        `SELECT * FROM compatibility WHERE mbti = ? AND user_mbti = ? AND word = ?`,
        [mbti, user_mbti, word],
        function (error, results) {
          if (error) reject(error);
          else resolve(results);
        }
      );
    });

    if (!result || !Array.isArray(result) || result.length === 0) {
      console.error("No matching articles found in the database.");
    }

    const [rows, fields] = result;

    // Use the articles as references in your prompts
    const articleReferences = result
      .map((row, index) => `참고문헌${index + 1}: ${row.compatibility_id}`)
      .join(", ");

    const prompts = [
      `${mbti}와 ${user_mbti}가 함께 ${word}을/를 할 때 장점을 존댓말로 3가지씩 쉽게 알려줘. ${
        articleReferences ? articleReferences : ""
      }`,
      `${mbti}와 ${user_mbti}가 함께 ${word}을/를 할 때 단점을 존댓말로 3가지씩 쉽게 알려줘. ${
        articleReferences ? articleReferences : ""
      }`,
      `${mbti}와 ${user_mbti}가 함께 ${word}을/를 할 때 조심해야 할 점을 존댓말로 3가지씩 쉽게 알려줘. ${
        articleReferences ? articleReferences : ""
      }`,
    ];

    const mbtiResult = [];

    for (const prompt of prompts) {
      const data = {
        prompt,
        max_tokens: max_tokens,
      };

      const response = await axios.post(
        "https://api.openai.com/v1/engines/text-davinci-003/completions",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      // Extract generated tweets from API response
      const mbtiGen = response.data.choices[0].text.trim();
      mbtiResult.push(mbtiGen);
    }

    console.log(mbtiResult);
    return mbtiResult;
  } catch (error) {
    console.error("Error occurred during tweet generation:", error);
    return null;
  }
}



async function insertArticle(mbtiResult, mbti, user_mbti, word, userId) {
  try {
    // Check that tweets is not null and has at least 3 elements
    if (!mbtiResult || mbtiResult.length < 3) {
      console.error("Invalid mbtiResult array");
      return;
    }

    // const generateQuery =
    //   "SELECT MAX(compatibility_id) AS compatibility_id FROM compatibility";
    // let generateId;

    // const generateResults = await new Promise((resolve, reject) => {
    //   connection2.query(generateQuery, function (error, results) {
    //     if (error) reject(error);
    //     else resolve(results);
    //   });
    // });

    // generateId = generateResults[0].compatibiltiy_id;
    // generateId++;

    const advantage = mbtiResult[0];
    const warning = mbtiResult[1];
    const precaution = mbtiResult[2];

    await connection2.query(
      "INSERT INTO compatibility (mbti, user_mbti, word, advantage, warning, precaution, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [mbti, user_mbti, word, advantage, warning, precaution, userId]
    );
  } catch (error) {
    console.error("Database insertion error:", error.message);
  }
}

module.exports = { generateResult, insertArticle };
