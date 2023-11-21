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
        `SELECT * FROM rating WHERE mbti = ? AND user_mbti = ? AND word = ?`,
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
        `MBTI 유형이 ${mbti}인 사람과 ${user_mbti}인 사람이 ${word}을/를 함께 할 때, 그들의 협력에서 발생할 수 있는 장점을 존댓말로 세 가지를 구체적인 예시와 함께 알려주세요. ${
          articleReferences ? articleReferences : ""
        }`, 
        `이번에는 반대로, ${mbti}와 ${user_mbti}가 ${word}을/를 함께 할 때, 그들의 협력에서 나타날 수 있는 단점을 존댓말로 세 가지를 구체적인 예시와 함께 알려주세요. ${
          articleReferences ? articleReferences : ""
        }`,
        `${mbti}와 ${user_mbti}가 ${word}을/를 함께 할 때, 그들이 특히 주의해야 하는 점을 존댓말로 세 가지를 구체적인 예시와 함께 설명해주세요. ${
          articleReferences ? articleReferences : ""
        }`,
        `${mbti}와 ${user_mbti}가 ${word}을/를 함께 할 때, 그들의 궁합도를 1점에서 100점 사이의 점수로만 나타내 주세요. 대답은 숫자만 말해줘요.${
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
    console.log(userId);
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
    const rate = mbtiResult[3];

    await connection2.query(
      "INSERT INTO compatibility (mbti, user_mbti, word, advantage, warning, precaution, user_id, rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [mbti, user_mbti, word, advantage, warning, precaution, userId, rate]
    );
  } catch (error) {
    console.error("Database insertion error:", error.message);
  }
}

module.exports = { generateResult, insertArticle };
