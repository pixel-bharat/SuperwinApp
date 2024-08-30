// gamesController.js

const {games} = require('../data/dummyData');
const {success, error} = require('../utils/responseFormatter');

exports.getGames = (req, res) => {
  try {
    const {page = 1, perPage = 20, expand} = req.query;

    const pageNum = parseInt(page);
    const perPageNum = parseInt(perPage);

    if (isNaN(pageNum) || isNaN(perPageNum) || pageNum < 1 || perPageNum < 1) {
      return res.status(400).json(error('Invalid pagination parameters'));
    }

    const startIndex = (pageNum - 1) * perPageNum;
    const endIndex = startIndex + perPageNum;
    const paginatedGames = games.slice(startIndex, endIndex);

    let expandedGames = paginatedGames;
    if (expand) {
      const expandFields = expand.split(',');
      expandedGames = paginatedGames.map(game => {
        const expandedGame = {...game};
        expandFields.forEach(field => {
          switch (field.trim()) {
            case 'tags':
              expandedGame.tags = game.tags || [];
              break;
            case 'parameters':
              expandedGame.parameters = game.parameters || {};
              break;
            case 'images':
              expandedGame.images = game.images || [];
              break;
            case 'related_games':
              expandedGame.related_games = game.related_games || [];
              break;
          }
        });
        return expandedGame;
      });
    }

    const response = {
      items: expandedGames,
      _links: {
        self: {href: `https://example.com/games?page=${pageNum}`},
      },
      _meta: {
        totalCount: games.length,
        pageCount: Math.ceil(games.length / perPageNum),
        currentPage: pageNum,
        perPage: perPageNum,
      },
    };

    // Add next and last links if applicable
    if (endIndex < games.length) {
      response._links.next = {
        href: `https://example.com/games?page=${pageNum + 1}`,
      };
      response._links.last = {
        href: `https://example.com/games?page=${Math.ceil(
          games.length / perPageNum,
        )}`,
      };
    }

    res.json(success(response));
  } catch (err) {
    console.error('Error in getGames:', err);
    res.status(500).json(error('Internal server error'));
  }
};

// Define the initGame function
