require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const { exec } = require('child_process');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Fetch profiles from Supabase
async function fetchProfiles() {
  const { data: mentors, error: mentorError } = await supabase
    .from('Mentors')
    .select('*')
    .gt('mentee_count', 0);

  const { data: mentees, error: menteeError } = await supabase
    .from('Mentees')
    .select('*')
    .eq('mentors', '{}'); // filters empty arrays;
  if (mentorError || menteeError) {
    console.error('Error fetching profiles:', mentorError || menteeError);
    return { mentors: [], mentees: [] };
  }

  return { mentors, mentees };
}

// Sample function to evaluate mentor-mentee compatibility using GPT
async function calculateEdgeWeight(mentorProfile, menteeProfile) {
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
            model: 'gpt-4o', 
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


async function generateGraphWithAdjMatrix(mentors, mentees) {
    const adjacencyMatrix = [];
    const maxConcurrentRequests = 10; // Adjust based on your rate limits and network capacity
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
    }

    return adjacencyMatrix;
}


async function matching() {
    try {
      const { mentors, mentees } = await fetchProfiles();
  
      if (mentors.length === 0 || mentees.length === 0) {
        console.log('No mentors or mentees available for matching.');
        return [];
      }
  
      const numMentors = mentors.length;
      const numMentees = mentees.length;
      const adjacencyMatrix = await generateGraphWithAdjMatrix(mentors, mentees);
      const capacityVector = mentors.map(mentor => mentor.mentee_count);
  
      // Format the input for the C++ executable
      let input = `${numMentors} ${numMentees}\n`;
      input += adjacencyMatrix.map(row => row.join(' ')).join('\n') + '\n';
      input += capacityVector.join(' ') + '\n';
  
      // Wrap the process interaction in a Promise to handle async behavior
      return new Promise((resolve, reject) => {
        const program = spawn('services/hungarian');
      
        // Error handling for stdin stream
        program.stdin.on('error', (error) => {
          console.error(`Error writing to stdin: ${error.message}`);
          reject(error);
        });
      
        // Send input data to the program's stdin after a slight delay
        setTimeout(() => {
          program.stdin.write(input);
          program.stdin.end(); // Close the stdin stream
        }, 100); // Adjust the timeout if necessary
      
        let mentorsData = [];
      
        program.stdout.on('data', (data) => {
          const lines = data.toString().replace(/\r/g, ' ').split('\n');
          lines.forEach((line, index) => {
            const menteeIndexes = line.trim().split(/\s+/);
            const mentorId = mentors[index].id;
            
            if (menteeIndexes[0] !== '') {
              menteeIndexes.forEach((menteeIndex) => {
                if (menteeIndex && mentees[menteeIndex]) {
                  mentorsData.push({ mentee_id: mentees[menteeIndex].id, mentor_id: mentorId });
                }
              });
            }
          });
        });
      
        program.stderr.on('data', (data) => {
          console.error(`Error: ${data.toString()}`);
        });
      
        program.on('close', (code) => {
          if (code !== 0) {
            reject(new Error(`Process exited with code ${code}`));
          } else {
            console.log(`Process exited with code ${code}`);
            console.log('Generated JSON:', JSON.stringify(mentorsData, null, 2));
            resolve(mentorsData);
          }
        });
      });

    } catch (error) {
      console.error('Error in adjacency matrix generation process:', error.message);
      return []; // Return an empty array if an error occurs
    }
  }

module.exports = { matching };
