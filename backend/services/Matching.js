require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const { spawn } = require('child_process');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Fetch profiles from Supabase
async function fetchProfiles() {
  const { data: mentors, error: mentorError } = await supabase
    .from('Mentors1')
    .select('*')
    .gt('mentee_count', 0);

  const { data: mentees, error: menteeError } = await supabase
    .from('Mentees1')
    .select('*');

  if (mentorError || menteeError) {
    console.error('Error fetching profiles:', mentorError || menteeError);
    return { mentors: [], mentees: [] };
  }

  return { mentors, mentees };
}

// Sample function to evaluate mentor-mentee compatibility using GPT
async function calculateEdgeWeight(mentorProfile, menteeProfile) {
    // console.log(mentorProfile);
    // for (const mentee of menteeProfiles) {
    //     console.log(`nig`, mentee.id);
    // }
    const prompt = `
        You are tasked with evaluating how much a mentor can boost a mentee's potential based on their profiles. 
    
        Consider the following factors:
        - Skill Match: How well the mentor’s skills align with the mentee’s learning needs.
        - Experience Level: Whether the mentor's experience complements the mentee's current stage.
        - Job Role and Interests Alignment: Whether the mentor's job description and interests align with the mentee’s career goals.
        - MBTI Compatibility: How well their personality types work together in a mentorship setting.
        - Additional Personal Qualities: Any other qualities that might affect the mentorship potential.
    
        Output a single total score from 0 to 100 representing the predicted boost the mentor will provide to hte mentee.
    
        Mentor Profile:
        ${JSON.stringify(mentorProfile)}
    
        Mentee Profile:
        ${JSON.stringify(menteeProfile)}
    
        Please respond with only ONE score, and ABSOLUTELY no additional text.
    `;
    
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
            model: 'gpt-3.5-turbo', 
            messages: [{ role: 'user', content: prompt }],
            },
            {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            }
        );
    
        // Parse the scores from the response
        const scoreText = response.data.choices[0].message.content.trim();
        // console.log(scoreText);
        const score = parseFloat(scoreText);
    
        if (isNaN(score)) {
          throw new Error('Received invalid score from GPT');
        }

        return score;

    } catch (error) {
        if (retries > 0) {
            console.warn(`Retrying (${3 - retries + 1}) due to error: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
            return calculateEdgeWeights(mentorProfile, menteeProfile, retries - 1);
        } else {
            console.error('Error calculating edge weight:', error.message);
            return 0;
        }
    }
  }


// // Sample function to evaluate mentor-mentee compatibility using GPT
// async function calculateEdgeWeights(mentorProfile, menteeProfiles) {
//     // console.log(mentorProfile);
//     // for (const mentee of menteeProfiles) {
//     //     console.log(`nig`, mentee.id);
//     // }
//     const prompt = `
//         You are tasked with evaluating how much a mentor can boost a mentee's potential based on their profiles. 
    
//         For each mentee, consider the following factors:
//         - Skill Match: How well the mentor’s skills align with the mentee’s learning needs.
//         - Experience Level: Whether the mentor's experience complements the mentee's current stage.
//         - Job Role and Interests Alignment: Whether the mentor's job description and interests align with the mentee’s career goals.
//         - MBTI Compatibility: How well their personality types work together in a mentorship setting.
//         - Additional Personal Qualities: Any other qualities that might affect the mentorship potential.
    
//         Output a row of single total scores from 0 to 100 representing the predicted boost the mentor will provide to each mentee.
    
//         Mentor Profile:
//         ${JSON.stringify(mentorProfile)}
    
//         Mentee Profiles:
//         ${JSON.stringify(menteeProfiles)}
    
//         Please respond with only ONE ROW of scores, each number with ONE comma in between, and ABSOLUTELY no additional text, and ABSOLUTELY not as a json.
//     `;
    
//     try {
//         const response = await axios.post(
//             'https://api.openai.com/v1/chat/completions',
//             {
//             model: 'gpt-3.5-turbo', 
//             messages: [{ role: 'user', content: prompt }],
//             },
//             {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//             },
//             }
//         );
    
//         // Parse the scores from the response
//         const scoreText = response.data.choices[0].message.content.trim();
//         // console.log(scoreText);
//         const scores = scoreText.split(',').map(Number); // Convert comma-separated values to an array of numbers
//         return scores;

//     } catch (error) {
//         console.error('Error calculating edge weights:', error.response ? error.response.data : error.message);
//         return menteeProfiles.map(() => null);
//     }
//   }

async function generateGraphWithAdjMatrix(mentors, mentees) {
    const adjacencyMatrix = [];
    const maxConcurrentRequests = 10; // Adjust based on your rate limits and network capacity
    console.log("wallah");
    for (const mentorProfile of mentors) {
        const row = [];
        const promises = [];

        // Process each mentor-mentee pair individually, but in batches
        for (const menteeProfile of mentees) {
            const promise = calculateEdgeWeight(mentorProfile, menteeProfile)
                .catch(error => {
                    console.error('Error calculating edge weight:', error.message);
                    return null; // Use null for failed requests
                });
            promises.push(promise);

            // If we've reached the limit of concurrent requests, process them
            if (promises.length >= maxConcurrentRequests) {
                const results = await Promise.all(promises);
                row.push(...results);
                promises.length = 0; // Clear the array for the next batch
            }
        }

        // Process any remaining promises in the last batch
        if (promises.length) {
            const results = await Promise.all(promises);
            row.push(...results);
        }

        // Replace any nulls with 0s to ensure consistent row length
        const filledRow = row.map(score => (score === null ? 0 : score));
        adjacencyMatrix.push(filledRow);
        console.log(filledRow);
    }

    return adjacencyMatrix;
}

//   async function generateGraphWithAdjMatrix(mentors, mentees) {
//     const adjacencyMatrix = [];
//     const batchSize = 5;

//     for (const mentorProfile of mentors) {
//         const rowPromises = [];

//         for (let i = 0; i < mentees.length; i += batchSize) {
//             const menteeBatch = mentees.slice(i, Math.min(mentees.length, i + batchSize));
//             // Push each batch calculation as a promise to the rowPromises array
//             rowPromises.push(calculateEdgeWeights(mentorProfile, menteeBatch).then(batchScores => {
//                 // Ensure batchScores has batchSize elements, filling with 0s if necessary
//                 while (batchScores.length < Math.min(mentees.length, i + batchSize)-i) {
//                     batchScores.push(0);
//                 }
//                 return batchScores;
//             }));
//         }

//         // Wait for all batch scores to resolve concurrently
//         const batchRows = await Promise.all(rowPromises);
//         const row = batchRows.flat(); // Flatten the array to get a single row
//         adjacencyMatrix.push(row);
//     }

//     return adjacencyMatrix;
// }
  

// Main function to fetch data and call GPT for adjacency list generation
async function matching() {
  try {
    const { mentors, mentees } = await fetchProfiles();

    if (mentors.length === 0 || mentees.length === 0) {
      console.log('No mentors or mentees available for matching.');
      return;
    }

    const numMentors = mentors.length;
    const numMentees = mentees.length;
    const adjacencyMatrix = await generateGraphWithAdjMatrix(mentors, mentees);
    const capacityVector = mentors.map(mentor => mentor.mentee_count);

    // Format the input for the C++ executable
    let input = `${numMentors} ${numMentees}\n`;

    // Append adjacency matrix rows as space-separated strings
    input += adjacencyMatrix.map(row => row.join(' ')).join('\n') + '\n';

    // Append capacity vector as a space-separated string
    input += capacityVector.join(' ') + '\n';

    // Spawn the C++ executable
    const program = spawn('C:/Users/tkt20/psa-codesprint-2024/backend/hungarian.exe');

    // Send the formatted input data to the program's stdin
    program.stdin.write(input);
    program.stdin.end(); // Close the stdin stream after sending all input data

    // Handle the program's output
    program.stdout.on('data', (data) => {
    console.log(`Output: ${data}`);
    });

    program.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
    });

    program.on('close', (code) => {
    console.log(`Process exited with code ${code}`);
    });

  } catch (error) {
    console.error('Error in adjacency matrix generation process:', error.message);
  }
}

module.exports = { matching };
