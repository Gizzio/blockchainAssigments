pragma solidity ^0.5.3;

contract IterableMap{

  mapping(uint32 => MapValue) public map;
  uint32[] keys;

  struct MapValue{
    uint32 value;
    bool isSet;
  }

  function getKey(uint index) public view returns (uint32) {
    return keys[index];
  }

  function hasKey(uint32 key) public view returns (bool){
    return map[key].isSet;
  }

  function put(uint32 key, uint32 value) public {
     if (!hasKey(key)){
       keys.push(key);
       map[key].isSet = true;
    }
    map[key].value = value;
  }

  function len() public view returns (uint) {
    return keys.length;
  }

  function getValue(uint32 key) public view returns (uint32) {
    require(hasKey(key), "No such key in map");
    return map[key].value;
  }
}
