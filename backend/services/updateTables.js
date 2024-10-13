const { createClient } = require('@supabase/supabase-js');
const fs = require('fs/promises');  // To handle file reading

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateTables(pairs) {
  try {
    // Read the JSON file
    // const pairs = JSON.parse(data);  // Expected format: [{mentee_id: 1, mentor_id: 100}, ...]
    console.log(pairs);
    for (const pair of pairs) {
      const { mentee_id, mentor_id } = pair;

      // 1. Update Mentee's mentors array
      let { data: mentee, error: menteeError } = await supabase
        .from('Mentees1')
        .select('mentors')
        .eq('id', mentee_id)
        .single();

      if (menteeError) {
        console.error(`Error fetching mentee with id ${mentee_id}:`, menteeError.message);
        continue;  // Skip to next pair
      }

      const updatedMentors = mentee.mentors ? [...mentee.mentors, mentor_id] : [mentor_id];

      const { error: updateMenteeError } = await supabase
        .from('Mentees1')
        .update({ mentors: updatedMentors })
        .eq('id', mentee_id);

      if (updateMenteeError) {
        console.error(`Error updating mentee ${mentee_id}:`, updateMenteeError.message);
        continue;  // Skip to next pair
      }

      // 2. Update Mentor's mentees array and decrement mentee_count
      let { data: mentor, error: mentorError } = await supabase
        .from('Mentors1')
        .select('mentees, mentee_count')
        .eq('id', mentor_id)
        .single();

      if (mentorError) {
        console.error(`Error fetching mentor with id ${mentor_id}:`, mentorError.message);
        continue;  // Skip to next pair
      }

      const updatedMentees = mentor.mentees ? [...mentor.mentees, mentee_id] : [mentee_id];
      const updatedMenteeCount = mentor.mentee_count > 0 ? mentor.mentee_count - 1 : 0;

      const { error: updateMentorError } = await supabase
        .from('Mentors1')
        .update({ mentees: updatedMentees, mentee_count: updatedMenteeCount })
        .eq('id', mentor_id);

      if (updateMentorError) {
        console.error(`Error updating mentor ${mentor_id}:`, updateMentorError.message);
        continue;  // Skip to next pair
      }

      console.log(`Successfully updated mentee ${mentee_id} and mentor ${mentor_id}`);
    }
  } catch (error) {
    console.error('Error processing the file:', error.message);
  }
}

// Export the function using CommonJS syntax
module.exports = { updateTables };
