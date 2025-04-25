import { Table } from 'react-bootstrap';

const Scores = () => {
  const highScores = [
    { username: 'Player1', wins: 10, losses: 2 },
    { username: 'Player2', wins: 8, losses: 5 },
    { username: 'Player3', wins: 5, losses: 7 },
  ];

  return (
    <div className="content p-4">
      <h1 className="text-center mb-4">High Scores</h1>
      <Table striped bordered hover>
        <thead className="bg-dark text-white"> {/* Bootstrap */}
          <tr>
            <th>Username</th>
            <th>Wins</th>
            <th>Losses</th>
          </tr>
        </thead>
        <tbody>
          {highScores.map((player, index) => (
            <tr key={index}>
              <td>{player.username}</td>
              <td>{player.wins}</td>
              <td>{player.losses}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Scores;