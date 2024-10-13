const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Function to insert mentee data into Supabase.
 * @param {Object} mentorData - JSON object containing mentee details.
 * @returns {Promise<Object>} - Returns success or error message.
 */
async function uploadMentor(mentorData) {
  try {
    const { name, email, phone_number, skills, job_description, mbti, location, mentees, mentee_count } = mentorData;
    console.log(name);
    // Insert data into Supabase 'Mentor' table
    const { data, error } = await supabase
      .from('Mentors')
      .insert([
        {
          name: name,
          email: email,
          phone_number: phone_number,
          skills: skills,
          job_description: job_description,
          mbti: mbti,
          location: location,
          mentees: mentees ? mentees : [],
          mentee_count: mentee_count
        }
      ]);

    if (error) {
      console.error('Error inserting mentor:', error);
      return { success: false, message: `Error inserting mentor: ${error.message}` };
    }

    console.log('Mentor inserted successfully:', data);
    return { success: true, message: 'Mentor created successfully!', data };

  } catch (error) {
    console.error('Server error:', error);
    return { success: false, message: `Server error: ${error.message}` };
  }
}

module.exports = { uploadMentor };