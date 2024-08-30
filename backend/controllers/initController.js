const uuid = require('uuid');
const dummyData = require('../data/dummyData');
function error(message) {
  return {status: 'error', message};
}

function success(data) {
  return {status: 'success', data};
}

exports.initGame = (req, res) => {
  const {game_uuid, player_id, player_name, currency, return_url, language} =
    req.body;
  console.log(req.body);
  // Validate required parameters
  if (!game_uuid || !player_id || !player_name || !currency) {
    return res.status(400).json(error('Missing required parameters'));
  }

  // Generate a unique session ID
  const session_id = uuid.v4();

  // Construct the game URL
  const gameUrl = `https://dummygames.com/play/${session_id}`; // Adjust this to your actual game URL

  // Use the success formatter to return the URL
  return res.json(success({url: gameUrl}));
};
