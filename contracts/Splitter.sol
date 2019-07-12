pragma solidity ^0.5.1;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Splitter {
  using SafeMath for uint256;

  ERC20 token;
  address[] beneficiaries;
  address feeCollector;
  uint256 FEE=5;

  constructor(address _tokenAddr, address[] memory _beneficiaries, address _feeCollector) public {
    token = ERC20(_tokenAddr);
    beneficiaries = _beneficiaries;
    feeCollector = _feeCollector;
  }

  function split(uint256 value) public {
    require(value >= FEE, "Not sufficient funds to cover fee");
    uint256 afterFee = value.sub(FEE);
    uint256 toTransfer = afterFee.div(beneficiaries.length);
    require(toTransfer > 0, "After taking fee there is not enough tokens to split");
    token.transferFrom(msg.sender, feeCollector, FEE);
    for(uint256 i = 0; i < beneficiaries.length; i++){
      token.transferFrom(msg.sender, beneficiaries[i], toTransfer);
    }
  }
}