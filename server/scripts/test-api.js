const axios = require('axios');
const { formatMySQLDateTime } = require('../utils/dateHelpers');

const BASE_URL = 'http://localhost:5500';

(async () => {
  try {
    // Admin Login
    console.log('Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/admin/login`, {
      accessKey: '<ACCESS_KEY>',
      password: '<PASSWORD>'
    });
    const sessionToken = loginResponse.data.token;
    console.log('Login successful. Session Token:', sessionToken);

    console.log('Creating a new team...');
    const createTeamResponse = await axios.post(
      `${BASE_URL}/admin/teams`,
      {
        name: 'NEW TEAM'
      },
      {
        headers: { Authorization: `Bearer ${sessionToken}` }
      }
    );
    console.log('Team created:', createTeamResponse.data);

    // Get All Teams
    console.log('Fetching all teams...');
    const teamsResponse = await axios.get(`${BASE_URL}/api/teams`);
    console.log('Teams:', teamsResponse.data);

    console.log('Updating a team...');
    const updateTeamResponse = await axios.put(
      `${BASE_URL}/admin/teams/1`,
      {
        name: 'UPDATED TEAM'
      },
      {
        headers: { Authorization: `Bearer ${sessionToken}` }
      }
    );
    console.log('Team updated:', updateTeamResponse.data);

    console.log('Deleting a team...');
    const deleteTeamResponse = await axios.delete(`${BASE_URL}/admin/teams/1`, {
      headers: { Authorization: `Bearer ${sessionToken}` }
    });
    console.log('Team deleted:', deleteTeamResponse.data);

    // Get tomorrow's date in IST for result_time
    const tomorrowInIST = new Date();
    tomorrowInIST.setDate(tomorrowInIST.getDate() + 1);
    const formattedDateTime = formatMySQLDateTime(tomorrowInIST);

    console.log('Publishing a result...');
    const publishResultResponse = await axios.post(
      `${BASE_URL}/admin/results`,
      {
        team: 'NEW TEAM',
        result: '45',
        result_time: formattedDateTime
      },
      {
        headers: { Authorization: `Bearer ${sessionToken}` }
      }
    );
    console.log('Result published:', publishResultResponse.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
})();
