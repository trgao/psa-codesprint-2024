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
    if (!menteeData.hasOwnProperty('email') || !menteeData.hasOwnProperty('password')) {
      console.error('Error signing up mentee: no email or password');
      throw new Error("Error signing up mentee: no email or password");
    }

    const { name, email, password, phone_number, skills, job_description, mbti, location, mentors } = menteeData;
    console.log(name);

    // Sign up user
    const signUpResponse = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (signUpResponse.error) {
      console.error('Error signing up mentee:', signUpResponse.error);
      throw new Error(`Error signing up mentee: ${signUpResponse.error.message}`);
    }

    const { data: { user } } = await supabase.auth.getUser();

    // Insert data into Supabase 'Mentee' table
    const { data, error } = await supabase
      .from('Mentees')
      .insert([
        {
          name: name,
          email: email,
          phone_number: phone_number,
          skills: skills,
          job_description: job_description,
          mbti: mbti,
          location: location,
          mentors: mentors ? mentors : [],
          user_id: user.id
        }
      ]);

    if (error) {
      console.error('Error inserting mentee:', error);
      throw new Error(`Error inserting mentee: ${error.message}`)
    }

    console.log('Mentee inserted successfully:', data);
    return { statusCode: 200, message: 'Mentee created successfully!' };

  } catch (error) {
    console.error('Server error:', error);
    throw new Error(`Server error: ${error.message}`)
  }
}

module.exports = { uploadMentee };