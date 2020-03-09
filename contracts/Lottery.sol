pragma solidity 0.5.0;
contract Lottery {
    address public manager;
    address payable[] public players;
    constructor() public {
        manager = msg.sender;
    }
    
    function enter() payable public {
        require(msg.value == 0.02 ether, "Enter exactly 0.02 ether");
        players.push(msg.sender);
    }
    
    function getPlayers() public view returns (address payable[] memory){
        return players;
    }
    
    function getPlayersCount() public view returns (uint){
        return players.length;
    }
    
    function generateRandom() public view returns (uint) {
        return uint(keccak256(abi.encodePacked(players, block.difficulty, block.timestamp)));
    }
    
    function pickRandomWinner() public  {
        require(msg.sender == manager, "Unauthorized Access");
        uint lucky = this.generateRandom() % this.getPlayersCount();
        players[lucky].transfer(address(this).balance);
    }
    
}
