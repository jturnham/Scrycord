module.exports = {
  getCardImage: function(cardJson) {
    // Single-faced cards.
    var cardName = cardJson['name'];
    var cardImgUrls = '';
    var cardImage = '';
    // Double-faced cards
    var cardFaces = cardJson['card_faces'];
    if(cardFaces != undefined) {
      var face = cardFaces[0];
      var reverse = cardFaces[1];
      cardImgUrls = face['image_uris'];
      var faceImgUrl = cardImgUrls['normal'];
      cardImgUrls = reverse['image_uris'];
      var reverseImgUrl = cardImgUrls['normal'];
      cardImage = faceImgUrl + ' ' + reverseImgUrl;
    }
    else {
      cardImgUrls = cardJson['image_uris'];
      cardImage = cardImgUrls['normal'];
    }
    return cardImage
  }
};
