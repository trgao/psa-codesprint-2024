const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define the POST route to add a mentee
router.post('/add-mentee', async (req, res) => {
    const menteeData = req.body;
    console.log('Mentee Data:', menteeData);
  
    try {
      const { data, error } = await supabase
        .from('Mentees')
        .insert([{
          id: menteeData.id,
          name: menteeData.name,
          email: menteeData.email,
          phone_number: menteeData.phone_number,
          skills: menteeData.skills,
          job_description: menteeData.job_description,
          mbti: menteeData.mbti,
          location: menteeData.location,
          mentor: [] // Empty array for mentor initially
        }]);
  
      if (error) {
        throw error;
      }
  
      res.status(200).json({ message: 'Mentee added successfully!', data });
    } catch (error) {
      res.status(500).json({ message: `Error creating mentee: ${error.message}` });
    }
  });
  

module.exports = router;
