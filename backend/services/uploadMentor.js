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
    if (!mentorData.hasOwnProperty('email') || !mentorData.hasOwnProperty('password')) {
      console.error('Error signing up mentor: no email or password');
      throw new Error('Error signing up mentor: no email or password');
    }

    const { name, email, password, phone_number, skills, job_description, mbti, location, mentees, mentee_count } = mentorData;
    console.log(name);

    // Sign up user
    const signUpResponse = await supabase.auth.signUp({
      email: email,
      password: password
    });

    console.log(signUpResponse.error)

    if (signUpResponse.error) {
      console.error('Error signing up mentor:', signUpResponse.error);
      throw new Error(`Error signing up mentor: ${signUpResponse.error.message}`);
    }

    const { data: { user } } = await supabase.auth.getUser();
    console.log(user)

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
          mentee_count: mentee_count,
          user_id: user.id
        }
      ]);

    if (error) {
      console.error('Error inserting mentor:', error);
      throw new Error(`Error inserting mentor: ${error.message}`);
    }

    console.log('Mentor inserted successfully:', data);
    return { statusCode: 200, message: 'Mentor created successfully!' };

  } catch (error) {
    console.error('Server error:', error);
    throw new Error(`Server error: ${error.message}`);
  }
}

module.exports = { uploadMentor };