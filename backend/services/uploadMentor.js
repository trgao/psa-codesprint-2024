const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Function to insert mentee data into Supabase.
 * @param {Object} menteeData - JSON object containing mentee details.
 * @returns {Promise<Object>} - Returns success or error message.
 */
async function uploadMentee(menteeData) {
  try {
    const { id, name, email, phone_number, skills, job_description, mbti, location } = menteeData;
    console.log(id,name);
    // Insert data into Supabase 'Mentee' table
    const { data, error } = await supabase
      .from('Mentors')
      .insert([
        {
          id: id,
          name: name,
          email: email,
          phone_number: phone_number,
          skills: skills,
          job_description: job_description,
          mbti: mbti,
          location: location,
          mentees: []  // Initializing mentor array as empty
        }
      ]);

    if (error) {
      console.error('Error inserting mentee:', error);
      return { success: false, message: `Error inserting mentee: ${error.message}` };
    }

    console.log('Mentee inserted successfully:', data);
    return { success: true, message: 'Mentee created successfully!', data };

  } catch (error) {
    console.error('Server error:', error);
    return { success: false, message: `Server error: ${error.message}` };
  }
}

module.exports = { uploadMentee };