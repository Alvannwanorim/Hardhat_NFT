// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";
//error
contract DynamicSvgNft is ERC721 {
  // Variables
  uint256 private s_tokenCounter;

  string private i_lowImageURI;
  string private i_highImageURI;
  string private constant BASE64_ENCODED_IMAGE_PREFIX =
    "data:image/svg+xml/base64,";
  AggregatorV3Interface internal immutable i_priceFee;

  mapping(uint256 => int256) public s_tokenIdToHighValue;

  //Events
  event CReatedNFT(uint256 indexed tokenId, int256 highValue);

  constructor(
    string memory logSvg,
    string memory highSvg,
    address priceFeedAddress
  ) ERC721("Dynamic Svg Nft", "DSN") {
    s_tokenCounter = 0;
    i_lowImageURI = svgToImageURI(logSvg);
    i_highImageURI = svgToImageURI(highSvg);
    i_priceFee = AggregatorV3Interface(priceFeedAddress);
  }

  function svgToImageURI(
    string memory svg
  ) public pure returns (string memory) {
    string memory svgbase64Encoded = Base64.encode(
      bytes(string(abi.encodePacked(svg)))
    );
    return
      string(abi.encodePacked(BASE64_ENCODED_IMAGE_PREFIX, svgbase64Encoded));
  }

  function mintNft(int256 highValue) public {
    s_tokenIdToHighValue[s_tokenCounter] = highValue;
    s_tokenCounter += s_tokenCounter;
    _safeMint(msg.sender, s_tokenCounter);
    emit CReatedNFT(s_tokenCounter, highValue);
  }

  function _baseURI() internal pure override returns (string memory) {
    return "data:application/json;base64,";
  }

  function tokenURI(
    uint256 tokenId
  ) public view override returns (string memory) {
    // string memory imageURI = "";
    require(_exists(tokenId), "URI query for none existing token");

    (, int256 price, , , ) = i_priceFee.latestRoundData();
    string memory imageURI = i_lowImageURI;
    if (price >= s_tokenIdToHighValue[tokenId]) {
      imageURI = i_highImageURI;
    }

    return
      string(
        abi.encodePacked(
          _baseURI(),
          Base64.encode(
            bytes(
              abi.encodePacked(
                '"{"name":"',
                name(),
                '", "description":"An NFT that chnages based on the chainlink feed",',
                '"attributes":"[{"trait_type":"coolnes","value":100}], "image":"',
                imageURI,
                '"}'
              )
            )
          )
        )
      );
  }
}
